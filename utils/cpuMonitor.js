const os = require('os');
let lastMeasure = null;

function cpuAverage() {
  const cpus = os.cpus();
  let idle = 0, total = 0;
  cpus.forEach(cpu => {
    for (let t in cpu.times) total += cpu.times[t];
    idle += cpu.times.idle;
  });
  return { idle: idle / cpus.length, total: total / cpus.length };
}

exports.startCpuCheck = ({ threshold = 70, intervalMs = 5000 } = {}) => {
  lastMeasure = cpuAverage();
  setInterval(() => {
    const cur = cpuAverage();
    const idleDiff = cur.idle - lastMeasure.idle;
    const totalDiff = cur.total - lastMeasure.total;
    const usage = 100 - Math.round(100 * idleDiff / totalDiff);
    console.log('cpu usage %', usage);
    if (usage >= threshold) {
      console.error('cpu threshold reached, exiting for restart', usage);
      process.exit(1);
    }
    lastMeasure = cur;
  }, intervalMs);
};
