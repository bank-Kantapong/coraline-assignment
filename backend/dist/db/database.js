"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dataDirectory = path_1.default.join(process.cwd(), 'data');
if (!fs_1.default.existsSync(dataDirectory)) {
    fs_1.default.mkdirSync(dataDirectory, {
        recursive: true,
    });
}
const isTest = process.env.NODE_ENV === 'test' ||
    process.env.VITEST === 'true';
const dbPath = isTest
    ? ':memory:'
    : path_1.default.join(dataDirectory, 'game.db');
exports.db = new better_sqlite3_1.default(dbPath);
if (!isTest) {
    exports.db.pragma('journal_mode = WAL');
}
exports.db.exec(`
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
