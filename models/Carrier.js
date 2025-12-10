const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const carrierSchema = new Schema({
  companyName: String
}, { timestamps: true });

module.exports = require('mongoose').model('Carrier', carrierSchema);
