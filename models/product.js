const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageMain: { type: String, required: true, default: 'https://sboffice.s3.us-east-2.amazonaws.com/image-not-available.jpg' },
  imageSecondary: [
    { type: String }
  ],
  onSale: { type: Boolean, default: false },
  onNew: { type: Boolean, default: false },
  categories: [
    { type: String, required: true }
  ],
});

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Product', productSchema);
