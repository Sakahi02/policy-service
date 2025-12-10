/*
 simple schedule manager.
 stores scheduled messages in mongodb collection ScheduledMessage
 and uses node-schedule to run them.
*/
const schedule = require('node-schedule');
const mongoose = require('mongoose');

const ScheduledMessageSchema = new mongoose.Schema({
  message: String,
  day: String,
  time: String,
  executed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const ScheduledMessage = mongoose.models.ScheduledMessage || mongoose.model('ScheduledMessage', ScheduledMessageSchema);

const activeJobs = new Map();

function _makeDate(day, time) {
  // expects day 'YYYY-MM-DD' and time 'HH:mm'
  const [y,m,d] = day.split('-').map(Number);
  const [hh,mm] = time.split(':').map(Number);
  return new Date(y, m-1, d, hh, mm, 0);
}

async function loadAndScheduleAll() {
  const docs = await ScheduledMessage.find({ executed: false });
  docs.forEach(d => scheduleMessage(d));
  return docs.length;
}

function scheduleMessage(doc) {
  const when = _makeDate(doc.day, doc.time);
  if (when < new Date()) return;
  const job = schedule.scheduleJob(when, async () => {
    try {
      console.log('Executing scheduled message', doc.message);
      doc.executed = true;
      await doc.save();
      // TODO: also insert to sentMessages collection
    } catch (e) { console.error('sched exec err', e) }
  });
  activeJobs.set(String(doc._id), job);
  return job;
}

async function createScheduledMessage({ message, day, time }) {
  const doc = await ScheduledMessage.create({ message, day, time });
  scheduleMessage(doc);
  return doc;
}

module.exports = { loadAndScheduleAll, scheduleMessage, createScheduledMessage };
