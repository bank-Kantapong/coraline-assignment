"use client";

import { useEffect } from "react";

import ScoreBoard from "@/components/scoreboard/ScoreBoard";
import BotAction from "@/components/botAction/BotAction";
import PlayerAction from "@/components/PlayerAction/PlayerAction";

import { socket } from "@/lib/socket";

import styles from "./page.module.scss";
import useScore from "@/hooks/useScore";
import useGameplay from "@/hooks/useGameplay";

export default function Home() {
  const {
    loadScore,
    score,
    highScore,
    setHighScore,
    setScore,
    error: scoreError,
  } = useScore();
  const {
    handleAction,
    botAction,
    selectedAction,
    result,
    loading,
    error: gameplayError,
  } = useGameplay({ setHighScore, setScore });

  useEffect(() => {
    loadScore();

    socket.connect();

    socket.on("highScoreUpdated", (data) => {
      setHighScore(data.highScore);
    });

    return () => {
      socket.off("highScoreUpdated");
      socket.disconnect();
    };
  }, [loadScore, setHighScore]);

  return (
    <main className={styles.container}>
      <section className={styles.section}>
        <h1>Rock Paper Scissors</h1>
        <div className={styles.gameBody}>
          <ScoreBoard score={score} highScore={highScore} />
          <div>
            <BotAction action={botAction} loading={loading} result={result} />

            <div className={styles.divider} />

            <PlayerAction
              selectedAction={selectedAction}
              disabled={!!selectedAction || loading}
              onAction={handleAction}
            />

            {loading && <p>Loading...</p>}

            {scoreError && <p className={styles.error}>{scoreError}</p>}

            {gameplayError && <p className={styles.error}>{gameplayError}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
