"use client";

import { useEffect, useState } from "react";

import ScoreBoard from "@/components/scoreboard/ScoreBoard";
import BotAction from "@/components/botAction/BotAction";
import PlayerAction from "@/components/PlayerAction/PlayerAction";

import { getScore, playGame } from "@/lib/api";
import { socket } from "@/lib/socket";

import { Action, GameResult } from "@/lib/types";

import styles from "./page.module.scss";

export default function Home() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [botAction, setBotAction] = useState<Action | null>(null);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   loadScore();

  //   socket.connect();

  //   socket.on('highScoreUpdated', (data) => {
  //     setHighScore(data.highScore);
  //   });

  //   return () => {
  //     socket.off('highScoreUpdated');
  //     socket.disconnect();
  //   };
  // }, []);

  // async function loadScore() {
  //   try {
  //     const data = await getScore();

  //     setScore(data.score);
  //     setHighScore(data.highScore);
  //   } catch {
  //     setError('Cannot load score');
  //   }
  // }

  const handleAction = async (action: Action) => {
    setSelectedAction(action);
    // if (loading) {
    //   return;
    // }

    // setLoading(true);
    // setError('');
    // setResult(null);

    // try {
    //   const data = await playGame(action);

    //   setBotAction(data.botAction);
    //   setResult(data.result);

    //   setScore(data.score);
    //   setHighScore(data.highScore);

    //   // แสดงผล 2 วินาที
    //   setTimeout(() => {
    //     setBotAction(null);
    //     setResult(null);
    //   }, 2000);
    // } catch {
    //   setError('Cannot play game');
    // } finally {
    //   setLoading(false);
    // }
  }

  return (
    <main className={styles.container}>
      <section className={styles.section}>
        <h1>Rock Paper Scissors</h1>
        <div className={styles.gameBody}>
          <ScoreBoard score={score} highScore={highScore} />
          <div>
            <BotAction action={botAction} />

            <div className={styles.divider} />

            <PlayerAction selectedAction={selectedAction} disabled={loading} onAction={handleAction} />

            {loading && <p>Loading...</p>}

            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
