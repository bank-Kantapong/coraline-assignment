export type Action = "ROCK" | "PAPER" | "SCISSORS";

export type GameResult = "WIN" | "LOSE" | "DRAW";

export interface PlayGameResult {
  playerAction: Action;
  botAction: Action;
  result: GameResult;
  score: number;
  highScore: number;
  highScoreUpdated: boolean;
}
