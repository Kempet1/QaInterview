const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = path.join(__dirname, '..', 'data', 'app.db');

let db;

function getDb() {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new DatabaseSync(DB_PATH);
    db.exec('PRAGMA journal_mode = WAL');
  }
  return db;
}

function initDb() {
  const d = getDb();

  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'staff'
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      owner_id INTEGER,
      image_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Keep existing local databases compatible after adding product images.
  try {
    d.exec('ALTER TABLE products ADD COLUMN image_url TEXT');
  } catch (error) {
    if (!String(error.message).includes('duplicate column name')) throw error;
  }

  return d;
}

module.exports = { getDb, initDb, DB_PATH };
