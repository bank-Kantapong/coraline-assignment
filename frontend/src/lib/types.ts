export type Action = 'ROCK' | 'PAPER' | 'SCISSORS';

export type GameResult = 'WIN' | 'LOSE' | 'DRAW';

export interface ScoreType {
  score: number;
  highScore: number;
}

export interface GameResponse {
  playerAction: Action;
  botAction: Action;
  result: GameResult;
  score: number;
  highScore: number;
}

export interface HighScoreUpdatedEvent {
  highScore: number;
}