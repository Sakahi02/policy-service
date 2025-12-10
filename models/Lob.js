const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lobSchema = new Schema({
  categoryName: String
}, { timestamps: true });

module.exports = mongoose.model('Lob', lobSchema);
