const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const policySchema = new Schema({
  policyNumber: { type: String, index: true },
  policyStartDate: Date,
  policyEndDate: Date,
  policyCategory: { type: Schema.Types.ObjectId, ref: 'Lob' },
  companyCollectionId: { type: Schema.Types.ObjectId, ref: 'Carrier' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
