import { playGame } from "@/lib/api";
import { Action, GameResult } from "@/lib/types";
import { useState } from "react";

interface UseGameplayProps {
  setHighScore: (highScore: number) => void;
  setScore: (score: number) => void;
}

const useGameplay = ({ setHighScore, setScore }: UseGameplayProps) => {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [botAction, setBotAction] = useState<Action | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAction = async (action: Action) => {
    setSelectedAction(action);
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await playGame(action);

      setBotAction(data.botAction);
      setResult(data.result);

      setScore(data.score);
      setHighScore(data.highScore);

      setTimeout(() => {
        setBotAction(null);
        setResult(null);
        setSelectedAction(null);
      }, 2000);
    } catch {
      setError("Cannot play game");
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedAction,
    botAction,
    result,
    loading,
    error,
    handleAction,
  };
};

export default useGameplay;
