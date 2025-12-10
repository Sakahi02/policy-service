const workerpool = require('workerpool');
const fs = require('fs');
const csvParse = require('csv-parse/lib/sync');
const xlsx = require('xlsx');
const mongoose = require('mongoose');

// models ***
let Agent, User, Account, Lob, Carrier, Policy;

const MONGO = process.env.MONGO_URI
async function ensureConn() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO);
  Agent = require('../models/Agent');
  User = require('../models/User');
  Account = require('../models/Account');
  Lob = require('../models/Lob');
  Carrier = require('../models/Carrier');
  Policy = require('../models/Policy');
}

function parseCsv(content) {
  return csvParse(content, { columns: true, skip_empty_lines: true });
}

function parseXlsx(filePath) {
  const wb = xlsx.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const json = xlsx.utils.sheet_to_json(sheet, { defval: null });
  return json;
}

async function processFile(filePath, originalName) {
  await ensureConn();
  let rows = [];
  const ext = (originalName || filePath).split('.').pop().toLowerCase();
  if (ext === 'csv') {
    const raw = fs.readFileSync(filePath, 'utf8');
    rows = parseCsv(raw);
  } else {
    rows = parseXlsx(filePath);
  }

  let inserted = 0;
  for (const r of rows) {
    const email = r.email || r.Email || r.userEmail;
    const firstName = r.firstName || r.first_name || r.name;
    // upsert user
    let userDoc = null;
    if (email) {
      userDoc = await User.findOneAndUpdate({ email }, { email, firstName }, { upsert: true, new: true });
    } else {
      userDoc = await User.create({ firstName, email: email || undefined });
    }

    if (r.agent || r.agentName) {
      await Agent.findOneAndUpdate({ agentName: r.agent || r.agentName }, { agentName: r.agent || r.agentName }, { upsert: true });
    }

    if (r.accountName) {
      await Account.findOneAndUpdate({ accountName: r.accountName, userId: userDoc._id }, { accountName: r.accountName, userId: userDoc._id }, { upsert: true });
    }

    let lobDoc = null;
    if (r.category_name) lobDoc = await Lob.findOneAndUpdate({ categoryName: r.category_name }, { categoryName: r.category_name }, { upsert: true, new: true });

    let carrierDoc = null;
    if (r.company_name) carrierDoc = await Carrier.findOneAndUpdate({ companyName: r.company_name }, { companyName: r.company_name }, { upsert: true, new: true });

    if (r.policy_number || r.policyNumber) {
      const policyPayload = {
        policyNumber: r.policy_number || r.policyNumber,
        policyStartDate: r.policy_start_date ? new Date(r.policy_start_date) : (r.startDate ? new Date(r.startDate) : null),
        policyEndDate: r.policy_end_date ? new Date(r.policy_end_date) : (r.endDate ? new Date(r.endDate) : null),
        policyCategory: lobDoc ? lobDoc._id : undefined,
        companyCollectionId: carrierDoc ? carrierDoc._id : undefined,
        userId: userDoc ? userDoc._id : undefined
      };
      await Policy.findOneAndUpdate({ policyNumber: policyPayload.policyNumber }, policyPayload, { upsert: true, setDefaultsOnInsert: true });
    }

    inserted++;
  }

  try { 
    fs.unlinkSync(filePath);
   } catch(e){console.log(e);}

  return { rows: rows.length, inserted };
}

workerpool.worker({ processFile });
