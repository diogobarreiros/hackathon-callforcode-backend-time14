import express from 'express';
import { celebrate, Joi } from 'celebrate';

import UsersController from './controllers/UsersController';

const routes = express.Router();

const usersController = new UsersController();

routes.get('/users/:id', usersController.show);
routes.get('/users', usersController.index);
routes.delete('/users/:id', usersController.delete);

routes.post(
  '/users',
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.number().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  usersController.create
);

export default routes;
