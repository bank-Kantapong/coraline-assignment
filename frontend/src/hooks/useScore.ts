import { getScore } from "@/lib/api";
import { useCallback, useState } from "react";

const useScore = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [error, setError] = useState("");

  const loadScore = useCallback(async () => {
    try {
      const data = await getScore();
      setScore(data.score);
      setHighScore(data.highScore);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  }, []);

  return {
    loadScore,
    score,
    highScore,
    error,
    setHighScore,
    setScore,
  };
};

export default useScore;
