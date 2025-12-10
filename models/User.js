const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  dob: Date,
  address: String,
  phoneNumber: String,
  state: String,
  zipCode: String,
  email: { type: String, index: true },
  gender: String,
  userType: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
