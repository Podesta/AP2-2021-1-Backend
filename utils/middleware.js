const logger = require('./logger');
const jwt = require('jsonwebtoken');

const unknownEndpoint = (req, res) => {
  res.status(204).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: 'validation error' });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' });
  } else if (error.name === 'MulterError') {
    return res.status(401).json({ error: 'unexpected multer field' });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  if (req.headers.authorization) {
    req.token = req.headers.authorization.substring(7);
  }
  next();
};

const userExtractor = (req, res, next) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (decodedToken.id) {
      req.user = decodedToken.id;
    }
  }
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
};
