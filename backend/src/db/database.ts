import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDirectory = path.join(
  process.cwd(),
  'data'
);

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, {
    recursive: true,
  });
}

const isTest =
  process.env.NODE_ENV === 'test' ||
  process.env.VITEST === 'true';

const dbPath = isTest
  ? ':memory:'
  : path.join(
      dataDirectory,
      'game.db'
    );

export const db = new Database(dbPath);

if (!isTest) {
  db.pragma('journal_mode = WAL');
}

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