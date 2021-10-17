const productRouter = require('express').Router();
const Product = require('../models/product');
const User = require('../models/user');

productRouter.get('/', async (req, res, next) => {
  const products = await Product.find({});
  res.json(products);
});

productRouter.get('/:id', async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

productRouter.post('/', async (req, res, next) => {

  // Validation done at middleware
  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const product = new Product({
    title: req.body.title,
    imageMain: req.body.imageMain,
    categories: req.body.categories,
  });

  const addedProduct = await product.save();
  res.status(201).json(addedProduct);
});

productRouter.delete('/:id', async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(204).end();
  } else {
    await product.delete();
    res.status(204).end();
  }
});

module.exports = productRouter;
