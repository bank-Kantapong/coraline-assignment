import axios from "axios";
import { Action, GameResponse, ScoreType } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const getScore = async (): Promise<ScoreType> => {
  const { data } = await axios.get<ScoreType>(`${API_URL}/api/score`);

  if (!data) {
    throw new Error("Failed to get score");
  }

  return data;
};

export const playGame = async (action: Action): Promise<GameResponse> => {
  const { data } = await axios.post<GameResponse>(`${API_URL}/api/game/play`, {
    credentials: 'include',
    action,
  });

  if (!data) {
    throw new Error("Failed to play game");
  }

  return data;
};
