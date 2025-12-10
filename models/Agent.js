const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
  agentName: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);
