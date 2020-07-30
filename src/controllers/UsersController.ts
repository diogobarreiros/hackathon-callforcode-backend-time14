import { Request, Response } from 'express';
import knex from '../database/connection';

import bcrypt from 'bcryptjs';

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

class UsersController {
  async index(request: Request, response: Response) {
    const users = await knex('users').select('*');

    const serializedUsers = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        latitude: user.latitude,
        longitude: user.longitude,
        image_url: user.image ? `${appEnv.url}/uploads/${user.image}` :
          'Image not found.',
      };
    });

    return response.json(serializedUsers);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const user = await knex('users').where('id', id).first();

    if (!user) {
      return response.status(400).json({ message: 'User not found.' });
    }

    const serializedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      latitude: user.latitude,
      longitude: user.longitude,
      image_url: user.image ? `${appEnv.url}/uploads/${user.image}` :
          'Image not found.',
    };

    return response.json(serializedUser);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const user = await knex('users').where('id', id).first();

    if (!user) {
      return response.status(400).json({ message: 'User not found.' });
    }

    const trx = await knex.transaction();
    await trx('users').delete(user);
    await trx.commit();

    return response.json({ message: 'User deleted' });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      phone,
      password,
      latitude,
      longitude,
    } = request.body;

    const trx = await knex.transaction();

    const passwordHash = await bcrypt.hash(password, 8);

    const user = {
      name,
      email,
      phone,
      latitude,
      longitude,
      password: passwordHash,
    };

    const insertedIds = await trx('users').insert(user);

    const user_id = insertedIds[0];

    await trx.commit();

    return response.json({
      id: user_id,
      name,
      email,
      phone,
      latitude,
      longitude,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;

    const user = await knex('users').where('id', id).first();

    if (!user) {
      return response.status(400).json({ message: 'User not found.' });
    }

    user.image = request.file.filename;

    const trx = await knex.transaction();
    await trx('users').update(user);
    await trx.commit();

    const serializedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      latitude: user.latitude,
      longitude: user.longitude,
      image_url: `${appEnv.url}/uploads/${user.image}`,
    };

    return response.json(serializedUser);
  }
}

export default UsersController;
