"use client";

import { Action } from "@/lib/types";
import styles from "./PlayerAction.module.scss";
import { PaperIcon } from "../../../public/PaperIcon";
import { RockIcon } from "../../../public/RockIcon";
import { ScissorsIcon } from "../../../public/ScissorsIcon";

interface PlayerActionProps {
  selectedAction: Action | null;
  disabled: boolean;
  onAction: (action: Action) => void;
}

const actions: Action[] = ["ROCK", "PAPER", "SCISSORS"];

const PlayerAction = ({
  selectedAction,
  disabled,
  onAction,
}: PlayerActionProps) => {
  const actionIcon = (action: Action) => {
    const color =
      selectedAction === action
        ? "var(--primary-color)"
        : "var(--secondary-color)";
    switch (action) {
      case "ROCK":
        return <RockIcon color={color} />;
      case "PAPER":
        return <PaperIcon color={color} />;
      case "SCISSORS":
        return <ScissorsIcon color={color} />;
      default:
        return <PaperIcon color={color} />;
    }
  };

  return (
    <div className={styles.playerActionContainer}>
      <p>Player action:</p>
      <div className={styles.actionRow}>
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            disabled={disabled}
            className={`${styles.actionBox} ${selectedAction === action ? styles.selected : ""}`}
            onClick={() => onAction(action)}
          >
            {actionIcon(action)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerAction;
