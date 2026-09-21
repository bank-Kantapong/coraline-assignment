import { useEffect, useRef, useState } from "react";
import { playGame } from "@/lib/api";
import { Action, GameResult } from "@/lib/types";

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

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAction = async (action: Action) => {
    if (loading) {
      return;
    }

    setSelectedAction(action);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await playGame(action);

      setBotAction(data.botAction);
      setResult(data.result);

      setScore(data.score);
      setHighScore(data.highScore);

      timeoutRef.current = setTimeout(() => {
        setBotAction(null);
        setResult(null);
        setSelectedAction(null);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
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
