import database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDirectory = path.join(process.cwd(), 'database');

if(!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, {
        recursive: true
    });
}

const dbPath = path.join(dataDirectory, 'database.db');

export const db = new database(dbPath)

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    score INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS game_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    high_score INTEGER NOT NULL DEFAULT 0
  );

  INSERT OR IGNORE INTO game_settings (
    id,
    high_score
  )
  VALUES (1, 0);
`);