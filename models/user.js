const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  user_id: String,
  name: String,
  email: String,
  languages: [String],
  manager: Boolean,
  customer: Boolean,
  farmers: [String],
  test: Boolean,
  passwordhash: String,
  salt: String
});

var model = mongoose.model('User', userSchema);
model.generateFarmers = (quantity) => {
  for (var q = 0; q < quantity; q++) {
    var testname = 'test_farmer_' + Math.floor(Math.random() * 1000);
    var x = new model({
      test: true,
      customer: false,
      manager: false,
      name: testname,
      user_id: testname
    });
    x.save();
  }
};

module.exports = model;
