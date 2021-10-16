const mongoose = require('mongoose');

const productSchema = new mongoose.Schmea({
  title: { type: String, required: true },
  imageMain: { type: String, required: true },
  imageSecondary: [
    { type: String }
  ],
  onSale: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
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
