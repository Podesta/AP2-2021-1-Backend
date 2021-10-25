const productRouter = require('express').Router();
const Product = require('../models/product');
const uploadImages = require('../services/imagesUpload').uploadImages;
const imagesSplit = require('../services/imagesHandler');

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
    imageSecondary: req.body.imageSecondary,
    categories: req.body.categories,
    onSale: req.body.onSale,
    onNew: req.body.onNew,
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

// move into the post route. had issues while testing with postman, so separate for now
productRouter.put('/:id/upload', uploadImages, async (req, res, next) => {
  const id = req.params.id;
  const product = {};

  if(!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  if (req.files) {
    const urlImgs = imagesSplit(req.files);
    product.imageMain = urlImgs[0][0];
    product.imageSecondary = urlImgs[1];
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
  if (!updatedProduct) {
    res.status(409).json({ error: 'id not found' });
  } else {
    res.json(updatedProduct);
  }
});

module.exports = productRouter;
