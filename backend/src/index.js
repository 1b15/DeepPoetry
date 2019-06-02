import express from 'express';
var routes = require('./routes.js');
var morgan = require('morgan')

const app = express();

//logger
app.use(morgan('combined'))

app.use(routes);

app.listen(3000, () =>
  console.log('app listening on port 3000!'),
);
