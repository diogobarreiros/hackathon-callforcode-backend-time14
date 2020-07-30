import path from 'path';
import express from 'express';
import cors from 'cors';

import routes from './routes';
import { errors } from 'celebrate';

const cfenv = require('cfenv');
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

const appEnv = cfenv.getAppEnv();

app.listen(appEnv.port, () => {
  console.log('Server started on ' + appEnv.url);
});
