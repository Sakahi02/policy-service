const workerpool = require('workerpool');
const path = require('path');
const fs = require('fs');
const pool = workerpool.pool(path.join(__dirname, '../workers/workerUpload.js'));

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'no file' });
    const filePath = req.file.path;
    const origName = req.file.originalname || req.file.filename;
    const result = await pool.exec('processFile', [filePath, origName]);
    return res.json({ ok: true, summary: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
