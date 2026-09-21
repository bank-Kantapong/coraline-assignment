import axios from "axios";
import { Action, GameResponse, ScoreType } from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error (หยุดทำงานทันที ไม่ยิงซ้ำ):", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getScore = async (): Promise<ScoreType> => {
  const response = await api.get<ScoreType>("/api/score", {});

  return response.data;
};

export const playGame = async (action: Action): Promise<GameResponse> => {
  const response = await api.post<GameResponse>("/api/action", {
    action,
  });

  return response.data;
};
