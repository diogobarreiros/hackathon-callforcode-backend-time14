import express from 'express';
import { celebrate, Joi } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import UsersController from './controllers/UsersController';

const routes = express.Router();

const upload = multer(multerConfig);

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
        password: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  usersController.create
);

routes.patch(
  '/avatar/:id',
  upload.single('image'),
  usersController.update,
);

export default routes;
