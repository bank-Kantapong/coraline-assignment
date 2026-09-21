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

    if (!socket.connected) {
      socket.connect();
    }

    const handleHighScoreUpdate = (data: { highScore: number }) => {
      setHighScore(data.highScore);
    };

    socket.on("highScoreUpdated", handleHighScoreUpdate);

    return () => {
      socket.off("highScoreUpdated", handleHighScoreUpdate);
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

            {scoreError && (
              <div className={styles.errorWrapper}>
                <p className={styles.error}>{scoreError}</p>
              </div>
            )}

            {gameplayError && (
              <div className={styles.errorWrapper}>
                <p className={styles.error}>{gameplayError}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
