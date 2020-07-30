import express from 'express';
import { celebrate, Joi } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import UsersController from './controllers/UsersController';
import RecyclersController from './controllers/RecyclersController';

const routes = express.Router();

const upload = multer(multerConfig);

const usersController = new UsersController();
const recyclersController = new RecyclersController();

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
        phone: Joi.string().required(),
        password: Joi.string().required(),
        latitude: Joi.number(),
        longitude: Joi.number(),
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

routes.get('/recyclers/:id', recyclersController.show);
routes.get('/recyclers', recyclersController.index);
routes.delete('/recyclers/:id', recyclersController.delete);

routes.post(
  '/recyclers',
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.string().required(),
        password: Joi.string().required(),
        document: Joi.string().required(),
        enterprise: Joi.boolean().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  recyclersController.create
);

export default routes;
