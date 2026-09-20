"use clinet";

import { ScoreType } from "@/lib/types";
import styles from "./ScoreBoard.module.scss";

const ScoreBoard = ({ score, highScore }: ScoreType) => {
  return (
    <div className={styles.scoreBoardContainer}>
      <div className={styles.scoreRow}>
        <span className={styles.label}>Your Score:</span>
        <div className={styles.value}>
          <span>{score}</span>
          <span>turn</span>
        </div>
      </div>

      <div className={styles.scoreRow}>
        <span className={styles.label}>High Score:</span>
        <div className={styles.value}>
          <span>{highScore}</span>
          <span>turn</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
