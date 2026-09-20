"use client";

import { Action } from "@/lib/types";
import styles from "./BotAction.module.scss";
import { RockIcon } from "../../../public/RockIcon";
import { PaperIcon } from "../../../public/PaperIcon";
import { ScissorsIcon } from "../../../public/ScissorsIcon";

const BotAction = ({ action }: { action: Action | null }) => {

    const actionIcon = (action: Action) => {
      switch (action) {
        case "ROCK":
          return <RockIcon size={60} />;
        case "PAPER":
          return <PaperIcon size={60} />;
        case "SCISSORS":
          return <ScissorsIcon size={60} />;
        default:
          return '???';
      }
    };

  return (
    <div className={styles.botActionContainer}>
      <p>Bot action:</p>

      <div className={styles.resultBox}>
        {action ? actionIcon(action) : "???"}
      </div>
    </div>
  );
};

export default BotAction;
