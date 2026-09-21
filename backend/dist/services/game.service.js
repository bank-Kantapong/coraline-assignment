"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameplay = exports.getPlayerScore = exports.isValidAction = void 0;
const database_1 = require("../db/database");
const ACTIONS = ["ROCK", "PAPER", "SCISSORS"];
const isValidAction = (action) => {
    return ACTIONS.includes(action);
};
exports.isValidAction = isValidAction;
const randomBotAction = () => {
    const index = Math.floor(Math.random() * ACTIONS.length);
    return ACTIONS[index];
};
const getAction = ({ playerAction, botAction, }) => {
    if (playerAction === botAction) {
        return "DRAW";
    }
    if ((playerAction === "ROCK" && botAction === "SCISSORS") ||
        (playerAction === "PAPER" && botAction === "ROCK") ||
        (playerAction === "SCISSORS" && botAction === "PAPER")) {
        return "WIN";
    }
    return "LOSE";
};
const getPlayerScore = (playerId) => {
    const player = database_1.db
        .prepare("SELECT score FROM players WHERE id = ?")
        .get(playerId);
    const hightScore = database_1.db
        .prepare("SELECT high_score FROM game_settings WHERE id = 1")
        .get();
    return {
        score: player?.score ?? 0,
        highScore: hightScore.high_score,
    };
};
exports.getPlayerScore = getPlayerScore;
const gameplay = ({ playerAction, playerId, }) => {
    const botAction = randomBotAction();
    const result = getAction({ playerAction, botAction });
    const currentPlayer = database_1.db
        .prepare("SELECT score FROM players WHERE id = ?")
        .get(playerId);
    const currentHighScore = database_1.db
        .prepare("SELECT high_score FROM game_settings WHERE id = 1")
        .get();
    let score = currentPlayer?.score ?? 0;
    if (result === "WIN") {
        score += 1;
    }
    if (result === "LOSE") {
        score = 0;
    }
    database_1.db.prepare("UPDATE players SET score = ? WHERE id = ?").run(score, playerId);
    let highScore = currentHighScore.high_score;
    let highScoreUpdated = false;
    if (score > highScore) {
        highScore = score;
        highScoreUpdated = true;
        database_1.db.prepare(`
    UPDATE game_settings
    SET high_score = ?
    WHERE id = 1
  `).run(highScore);
    }
    return {
        playerAction,
        botAction,
        result,
        score,
        highScore,
        highScoreUpdated,
    };
};
exports.gameplay = gameplay;
