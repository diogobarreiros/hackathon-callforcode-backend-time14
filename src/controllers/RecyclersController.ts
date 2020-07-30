import { Request, Response } from 'express';
import knex from '../database/connection';

import bcrypt from 'bcryptjs';

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

class RecyclersController {
  async index(request: Request, response: Response) {
    const { types } = request.query;

    const parsedTypes = String(types)
      .split(',')
      .map((type) => Number(type.trim()));

    const recyclers = await knex('recyclers')
      .join('recycler_types', 'recyclers.id', '=', 'recycler_types.recycler_id')
      .whereIn('recycler_types.type_id', parsedTypes)
      .distinct()
      .select('recyclers.*');

    const serializedRecyclers = recyclers.map((recycler) => {
      return {
        id: recycler.id,
        name: recycler.name,
        email: recycler.email,
        phone: recycler.phone,
        document: recycler.document,
        enterprise: recycler.enterprise,
        latitude: recycler.latitude,
        longitude: recycler.longitude,
      };
    });

    return response.json(serializedRecyclers);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const recycler = await knex('recyclers').where('id', id).first();

    if (!recycler) {
      return response.status(400).json({ message: 'Recycler not found.' });
    }

    const serializedRecycler = {
      id: recycler.id,
      name: recycler.name,
      email: recycler.email,
      phone: recycler.phone,
      document: recycler.document,
      enterprise: recycler.enterprise,
      latitude: recycler.latitude,
      longitude: recycler.longitude,
    };

    const types = await knex('types')
      .join('recycler_types', 'types.id', '=', 'recycler_types.type_id')
      .where('recycler_types.recycler_id', id)
      .select('types.title');

    return response.json({ recycler: serializedRecycler, types });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const recycler = await knex('recyclers').where('id', id).first();

    if (!recycler) {
      return response.status(400).json({ message: 'Recycler not found.' });
    }

    const trx = await knex.transaction();
    await trx('recyclers').delete(recycler);
    await trx.commit();

    return response.json({ message: 'Recycler deleted' });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      phone,
      document,
      enterprise,
      password,
      latitude,
      longitude,
      types,
    } = request.body;

    const trx = await knex.transaction();

    const passwordHash = await bcrypt.hash(password, 8);

    const recycler = {
      name,
      email,
      phone,
      document,
      enterprise,
      latitude,
      longitude,
      password: passwordHash,
    };

    const insertedIds = await trx('recyclers').insert(recycler);

    const recycler_id = insertedIds[0];

    const recyclerTypes = types
      .split(',')
      .map((type: string) => Number(type.trim()))
      .map((type_id: number) => {
        return {
          type_id,
          recycler_id,
        };
      });

    await trx('recycler_types').insert(recyclerTypes);

    await trx.commit();

    return response.json({
      id: recycler_id,
      name,
      email,
      phone,
      document,
      enterprise,
      latitude,
      longitude,
    });
  }
}

export default RecyclersController;
