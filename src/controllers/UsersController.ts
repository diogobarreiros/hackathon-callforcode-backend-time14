import { Request, Response } from 'express';
import knex from '../database/connection';

class UsersController {
  async index(request: Request, response: Response) {
    const users = await knex('users').select('*');

    const serializedUsers = users.map((user) => {
      return {
        name: user.name,
        email: user.email,
        phone: user.phone,
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

    return response.json(user);
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
