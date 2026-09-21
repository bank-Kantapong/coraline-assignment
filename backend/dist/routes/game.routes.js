"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGameRoutes = void 0;
const express_1 = require("express");
const game_service_1 = require("../services/game.service");
const router = (0, express_1.Router)();
const PLAYER_COOKIE = "player_id";
const createGameRoutes = (io) => {
    const getPlayerId = (req) => {
        return req.cookies[PLAYER_COOKIE] || req.header(PLAYER_COOKIE);
    };
    // GET score
    router.get("/score", (req, res) => {
        const playerId = getPlayerId(req);
        const score = (0, game_service_1.getPlayerScore)(playerId);
        if (!playerId) {
            return res.status(401).json({ message: "Player Id not found" });
        }
        return res.status(200).json(score);
    });
    // POST game action
    router.post("/action", (req, res) => {
        const playerId = getPlayerId(req);
        const { action } = req.body;
        if (!playerId) {
            return res.status(401).json({ message: "Player Id not found" });
        }
        if (!(0, game_service_1.isValidAction)(action)) {
            return res.status(400).json({
                message: "Action must be ROCK, PAPER or SCISSORS",
            });
        }
        const result = (0, game_service_1.gameplay)({ playerId, playerAction: action });
        if (result.highScoreUpdated) {
            io.emit("highScoreUpdated", {
                highScore: result.highScore,
            });
        }
        return res.status(200).json(result);
    });
    return router;
};
exports.createGameRoutes = createGameRoutes;
