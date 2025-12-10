const scheduleMgr = require('../utils/scheduleManager');

exports.createSchedule = async (req, res) => {
  const { message, day, time } = req.body;
  if (!message || !day || !time) return res.status(400).json({ error: 'message day time required' });
  try {
    const doc = await scheduleMgr.createScheduledMessage({ message, day, time });
    return res.json({ ok: true, doc });
  } catch (e) {
    console.error('sched err', e);
    return res.status(500).json({ error: e.message });
  }
};
