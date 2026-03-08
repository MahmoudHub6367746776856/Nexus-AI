const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) || 5000 : 5000;
const DB_PATH = path.join(__dirname, '..', 'database.json');

app.use(cors());
app.use(express.json());

function readDatabase() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { waitlist: [] };
  }
}

function writeDatabase(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

app.post('/api/waitlist', (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  const db = readDatabase();
  db.waitlist.push({ email: email.trim(), timestamp: Date.now() });
  writeDatabase(db);
  res.status(201).json({ success: true });
});

app.get('/api/stats', (req, res) => {
  const db = readDatabase();
  const totalUsers = db.waitlist?.length ?? 0;
  res.json({ totalUsers });
});

const ADMIN_KEY = process.env.ADMIN_KEY || 'nexus-admin';

function requireAdmin(req, res, next) {
  const key = req.query.key || req.headers['x-admin-key'];
  if (key !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/api/admin/waitlist', requireAdmin, (req, res) => {
  const db = readDatabase();
  res.json({ waitlist: db.waitlist || [] });
});

app.delete('/api/admin/waitlist/:index', requireAdmin, (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (Number.isNaN(index) || index < 0) {
    return res.status(400).json({ error: 'Invalid index' });
  }
  const db = readDatabase();
  if (index >= (db.waitlist?.length ?? 0)) {
    return res.status(404).json({ error: 'Not found' });
  }
  db.waitlist.splice(index, 1);
  writeDatabase(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Nexus AI server running on http://localhost:${PORT}`);
});
