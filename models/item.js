const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  thing: String,
  img: String,
  isService: Boolean,
  farmer: {
    uid: String,
    name: String
  },
  admin: String,
  quantity: Number,
  sold: Number,
  cost: String,
  test: Boolean
});

module.exports = mongoose.model('Item', itemSchema);
