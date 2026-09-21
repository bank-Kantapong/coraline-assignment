import { getScore } from "@/lib/api";
import { useCallback, useState } from "react";

const useScore = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [error, setError] = useState("");

  const loadScore = useCallback(async () => {
    setError("");

    try {
      const data = await getScore();

      setScore(data.score);
      setHighScore(data.highScore);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
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