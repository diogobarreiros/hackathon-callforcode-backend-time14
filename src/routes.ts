import express from 'express';
import { celebrate, Joi } from 'celebrate';

import multer from 'multer';

import ItemsController from './controllers/ItemsController';

const routes = express.Router();

const itemsController = new ItemsController();

routes.get('/items', itemsController.index);


export default routes;
