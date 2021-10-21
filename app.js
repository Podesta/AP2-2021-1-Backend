const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const productRouter = require('./controllers/products');
const userRouter = require('./controllers/user');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const app = express();

logger.info('connecting to', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to mongoDB');
  })
  .catch(error => {
    logger.error('error connecting to mongoDB', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(morgan('tiny', {
  skip: () => process.env.NODE_ENV === 'test' }));

app.use(middleware.tokenExtractor);

app.use('/api/products', middleware.userExtractor, productRouter);
app.use('/api/users', userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
