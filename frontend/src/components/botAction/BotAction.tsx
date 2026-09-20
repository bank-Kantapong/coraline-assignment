"use client";

import { Action } from "@/lib/types";
import styles from "./BotAction.module.scss";

const BotAction = ({ action }: { action: Action | null }) => {
  return (
    <div className={styles.botActionContainer}>
      <p>Bot action:</p>

      <div className={styles.resultBox}>
        {action || '???'}
      </div>
    </div>
  );
};

export default BotAction;
