require('dotenv').config();
const fs = require('fs');
const path = require('path');
// SQLite is built into Node.js 22.13+ (no extra install needed)
const { DatabaseSync } = require('node:sqlite');

const dbFile = path.resolve(__dirname, process.env.DB_PATH || './products.db');
const db = new DatabaseSync(dbFile);

// Create table + seed sample data the first time the app runs
const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
const [createPart, seedPart] = sql.split('-- SEED_DATA_BELOW');
db.exec(createPart);
const { n } = db.prepare('SELECT COUNT(*) AS n FROM products').get();
if (n === 0 && seedPart) {
  db.exec(seedPart);
  console.log('Seeded sample products.');
}

module.exports = db;
