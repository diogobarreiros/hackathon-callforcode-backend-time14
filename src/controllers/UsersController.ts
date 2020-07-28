import { Request, Response } from 'express';
import knex from '../database/connection';

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

class UsersController {
  async index(request: Request, response: Response) {
    const users = await knex('users').select('*');

    const serializedUsers = users.map((user) => {
      return {
        ...user,
        image_url: `${appEnv.url}/uploads/${user.image}`,
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
      ...user,
      image_url: `${appEnv.url}/uploads/${user.image}`,
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
    } = request.body;

    const trx = await knex.transaction();

    const user = {
      name,
      email,
      phone,
      image: request.file.filename,
    };

    const insertedIds = await trx('users').insert(user);

    const user_id = insertedIds[0];

    await trx.commit();

    return response.json({
      id: user_id,
      ...user,
    });
  }
}

export default UsersController;
