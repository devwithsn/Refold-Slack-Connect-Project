import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_FILE = process.env.DB_FILE || './data/sqlite.db';
const dir = path.dirname(DB_FILE);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(DB_FILE);

// Initialize tables
db.exec(`
CREATE TABLE IF NOT EXISTS tokens (
  id TEXT PRIMARY KEY,
  team_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at INTEGER
);

CREATE TABLE IF NOT EXISTS scheduled_messages (
  id TEXT PRIMARY KEY,
  team_id TEXT,
  channel TEXT,
  text TEXT,
  send_at INTEGER,
  status TEXT
);
`);

export default db;
