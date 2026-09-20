import axios from "axios";
import { Action, GameResponse, ScoreType } from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

export const getScore = async (): Promise<ScoreType> => {
  const response = await api.get<ScoreType>("/api/score");

  return response.data;
};

export const playGame = async (action: Action): Promise<GameResponse> => {
  const response = await api.post<GameResponse>("/api/action", {
    action,
  });

  return response.data;
};
