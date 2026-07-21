// Tiny file-backed JSON store. No database server to install — good enough
// for a small brand site's contact messages and product catalogue, and easy
// to swap for a real database (Postgres/Mongo) later without touching the
// route logic much.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

function readJSON(fileName, fallback) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse ${fileName}, resetting to fallback.`, err);
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

function writeJSON(fileName, data) {
  const filePath = path.join(DATA_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { readJSON, writeJSON, DATA_DIR };
