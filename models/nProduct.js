const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  brand: String,
  image: [
    {
      _type: String,
      _key: String,
      asset: {
        _ref: String,
        _type: String,
      },
    },
  ],
  price: Number,
  _createdAt: String,
  details: mongoose.Schema.Types.Mixed,
  _rev: String,
  discount: Number,
  category: [String],
  isOffer: Boolean,
  _type: String,
  _updatedAt: Date,
  registerDate: Date,
  name: String,
  starRating: Number,
  slug: {
    _type: String,
    current: String,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
