require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const uploadRoutes = require('./routes/uploadRoutes');
const policyRoutes = require('./routes/policyRoutes');
const scheduleRoutes = require('./routes/schedulerRoutes');

const cpuUtil = require('./utils/cpuMonitor');
const scheduleManager = require('./utils/scheduleManager');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGO_URI;

mongoose.connect(MONGO).then(async () => {
  console.log('connected to mongo');
  // load scheduled jobs (if any)
  try { await scheduleManager.loadAndScheduleAll(); } catch(e){ console.log('schedule load err', e) }

  // start cpu monitor
  cpuUtil.startCpuCheck({ threshold: Number(process.env.CPU_THRESHOLD) || 70 });

  app.listen(PORT, () => console.log('server up on', PORT));
}).catch(err => {
  console.error('mongo connect err', err);
  process.exit(1);
});

app.get('/', (req, res) => res.send('policy service ok'));

app.use('/api/upload', uploadRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/schedule', scheduleRoutes);

// quick health check
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date() });
});
