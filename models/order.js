const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  customer: {
    name: String,
    id: String
  },
  item: {
    name: String,
    id: String
  },
  quantity: Number,
  farmer: String,
  time: Date,
  total: String,
  test: Boolean
});

module.exports = mongoose.model('Order', orderSchema);
