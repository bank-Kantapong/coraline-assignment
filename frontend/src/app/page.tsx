"use client";

import { useEffect, useState } from "react";

import ScoreBoard from "@/components/scoreboard/ScoreBoard";
import BotAction from "@/components/botAction/BotAction";
import PlayerAction from "@/components/PlayerAction/PlayerAction";

import { playGame } from "@/lib/api";
import { socket } from "@/lib/socket";

import { Action, GameResult } from "@/lib/types";

import styles from "./page.module.scss";
import useScore from "@/hooks/useScore";
import useGameplay from "@/hooks/ีuseGameplay";

export default function Home() {
  const { loadScore, score, highScore, setHighScore, setScore } = useScore();
  const { handleAction, botAction, selectedAction, result, loading, error } =
    useGameplay({ setHighScore, setScore });

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
            <BotAction action={botAction} />

            <div className={styles.divider} />

            <PlayerAction
              selectedAction={selectedAction}
              disabled={loading}
              onAction={handleAction}
            />

            {loading && <p>Loading...</p>}

            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      </section>

      {(loading || result) && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            {loading ? (
              <>
                <div className={styles.spinner} />

                <h2>Playing...</h2>

                <p>Bot is choosing...</p>
              </>
            ) : (
              <>
                <div
                  className={`${styles.resultIcon} ${
                    styles[result!.toLowerCase()]
                  }`}
                >
                  {result === "WIN" && "✓"}
                  {result === "LOSE" && "✕"}
                  {result === "DRAW" && "="}
                </div>

                <h2>{result}</h2>

                <p>Bot chose {botAction}</p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
