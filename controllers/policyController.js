const User = require('../models/User');
const Policy = require('../models/Policy');
exports.searchByUser = async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'q required' });
  let user = await User.findOne({ $or: [{ email: q },
  { firstName: new RegExp(q, 'i') }] });
  if (!user) return res.status(404).json({ error: 'user not found' });
  const policies = await Policy.find({ userId: user._id }).populate('policyCategory companyCollectionId');
  return res.json({ user, policies });
};

exports.aggregateByUser = async (req, res) => {
  const agg = await Policy.aggregate([
    { $group: { _id: '$userId', policyCount: { $sum: 1 } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $project: { _id: 0, userId: '$_id', policyCount: 1, 'user.firstName': 1, 'user.email': 1 } }
  ]);
  return res.json(agg);
};
