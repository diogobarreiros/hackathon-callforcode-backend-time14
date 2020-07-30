import { Request, Response } from 'express';
import knex from '../database/connection';

class TypesController {
  async index(request: Request, response: Response) {
    const types = await knex('types').select('*');

    const serializedTypes = types.map((type) => {
      return {
        id: type.id,
        title: type.title,
      };
    });

    return response.json(serializedTypes);
  }
}

export default TypesController;
