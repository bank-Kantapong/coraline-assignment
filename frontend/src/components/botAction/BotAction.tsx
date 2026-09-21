"use client";

import { Action } from "@/lib/types";
import styles from "./BotAction.module.scss";
import { RockIcon } from "../../../public/RockIcon";
import { PaperIcon } from "../../../public/PaperIcon";
import { ScissorsIcon } from "../../../public/ScissorsIcon";

interface BotActionProps {
  action?: Action | null;
  loading?: boolean;
  result?: string | null;
}

const BotAction = ({ action, loading = false, result }: BotActionProps) => {
  const actionIcon = (action: Action) => {
    switch (action) {
      case "ROCK":
        return <RockIcon size={60} />;
      case "PAPER":
        return <PaperIcon size={60} />;
      case "SCISSORS":
        return <ScissorsIcon size={60} />;
      default:
        return "???";
    }
  };

  return (
    <div className={styles.botActionContainer}>
      <p>Bot action:</p>
      <div className={styles.resultBox}>
        {action ? (
          <div>
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
                  {actionIcon(action)}
                </div>
                <h2>
                  {result === "DRAW"
                    ? "Draw!"
                    : result === "WIN"
                      ? "You win!"
                      : "You lose!"}
                </h2>
                <p>Bot chose: {action}</p>
              </>
            )}
          </div>
        ) : (
          "???"
        )}
      </div>
    </div>
  );
};

export default BotAction;
