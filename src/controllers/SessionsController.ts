import { Request, Response } from 'express';
import knex from '../database/connection';

import bcrypt from 'bcryptjs';

import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

class SessionsController {
  async create(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await knex('users').where('email', email).first();

    if (!user) {
      return response.status(400).json({ message: 'Incorrect email.' });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return response.status(400).json({ message: 'Incorrect email/password combination.' });
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id.toString(),
      expiresIn,
    });

    return response.json({ user, token });
  }
}

export default SessionsController;
