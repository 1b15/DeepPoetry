import express from 'express';
import router from './routes.js';
import morgan from 'morgan';

const app = express();

//logger
app.use(morgan('combined'));

app.use(router);

app.listen(3000, () =>
  console.log('app listening on port 3000!'),
);
