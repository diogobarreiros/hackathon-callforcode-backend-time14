import { Request, Response } from 'express';
import knex from '../database/connection';

import bcrypt from 'bcryptjs';

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

class RecyclersController {
  async index(request: Request, response: Response) {
    const recyclers = await knex('recyclers').select('*');

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

    return response.json(serializedRecycler);
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
