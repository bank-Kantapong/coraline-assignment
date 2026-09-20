import { Request, Response, Router } from "express";
import {
  gameplay,
  getPlayerScore,
  isValidAction,
} from "../services/game.services";
import { Server } from "socket.io";

const router = Router();

const PLAYER_COOKIE = "player_id";

export const createGameRoutes = (io: Server) => {
  const getPlayerId = (req: Request) => {
    return req.cookies[PLAYER_COOKIE] || req.header(PLAYER_COOKIE);
  };

  // GET score
  router.get("/score", (req: Request, res: Response) => {
    const playerId = getPlayerId(req);
    const score = getPlayerScore(playerId);

    if (!playerId) {
      return res.status(401).json({ message: "Player Id not found" });
    }

    return res.status(200).json(score);
  });

  // POST game action
  router.post("/action", (req: Request, res: Response) => {
    const playerId = getPlayerId(req);
    const { action } = req.body;

    if (!playerId) {
      return res.status(401).json({ message: "Player Id not found" });
    }

    if (!isValidAction(action)) {
      return res.status(400).json({
        message: "Action must be ROCK, PAPER or SCISSORS",
      });
    }

    const result = gameplay({ playerId, playerAction: action });

    if (result.highScoreUpdated) {
      io.emit("highScoreUpdated", {
        highScore: result.highScore,
      });
    }

    return res.status(200).json(result);
  });

  return router;
};
