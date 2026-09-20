import { db } from "../db/database";
import { Action, GameResult } from "../types";

const ACTIONS: Action[] = ["ROCK", "PAPER", "SCISSORS"];

export const isValidAction = (action: string): boolean => {
  return ACTIONS.includes(action as Action);
};

const randomBotAction = (): Action => {
  const index = Math.floor(Math.random() * ACTIONS.length);

  return ACTIONS[index];
};

const getAction = ({
  playerAction,
  botAction,
}: {
  playerAction: Action;
  botAction: Action;
}): GameResult => {
  if (playerAction === botAction) {
    return "DRAW";
  }

  if (
    (playerAction === "ROCK" && botAction === "SCISSORS") ||
    (playerAction === "PAPER" && botAction === "ROCK") ||
    (playerAction === "SCISSORS" && botAction === "PAPER")
  ) {
    return "WIN";
  }

  return "LOSE";
};

export const getPlayerScore = (playerId: string) => {
  const player = db
    .prepare("SELECT score FROM players WHERE id = ?")
    .get(playerId) as { score: number } | undefined;
  const hightScore = db
    .prepare("SELECT high_score FROM game_settings WHERE id = 1")
    .get() as { high_score: number };

  return {
    score: player?.score ?? 0,
    highScore: hightScore.high_score,
  };
};

export const gameplay = ({
  playerAction,
  playerId,
}: {
  playerAction: Action;
  playerId: string;
}) => {
  const botAction = randomBotAction();
  const result = getAction({ playerAction, botAction });
  const currentPlayer = db
    .prepare("SELECT score FROM players WHERE id = ?")
    .get(playerId) as { score: number } | undefined;
  const currentHighScore = db
    .prepare("SELECT high_score FROM game_settings WHERE id = 1")
    .get() as { high_score: number };

  let score = currentPlayer?.score ?? 0;

  if (result === "WIN") {
    score += 1;
  }

  if (result === "LOSE") {
    score = 0;
  }

  db.prepare("UPDATE players SET score = ? WHERE id = ?").run(score, playerId);

  let highScore = currentHighScore.high_score;
  let highScoreUpdated = false;

  if (score > highScore) {
    highScore = score;

    highScoreUpdated = true;

    db.prepare(
      `
    UPDATE game_settings
    SET high_score = ?
    WHERE id = 1
  `,
    ).run(highScore);
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
