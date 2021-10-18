const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

userRouter.get('/', async (req, res, next) => {
  const users = await User.find({});
  res.json(users);
});

module.exports = userRouter;
