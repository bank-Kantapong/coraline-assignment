import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "../src/db/database";
import {
  getPlayerScore,
  isValidAction,
  gameplay,
} from "../src/services/game.service";

describe("game.service", () => {
  beforeEach(() => {
    db.prepare("DELETE FROM players").run();

    db.prepare(
      `
      UPDATE game_settings
      SET high_score = 0
      WHERE id = 1
    `,
    ).run();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("isValidAction", () => {
    it("should return true for ROCK", () => {
      expect(isValidAction("ROCK")).toBe(true);
    });

    it("should return true for PAPER", () => {
      expect(isValidAction("PAPER")).toBe(true);
    });

    it("should return true for SCISSORS", () => {
      expect(isValidAction("SCISSORS")).toBe(true);
    });

    it("should return false for invalid action", () => {
      expect(isValidAction("INVALID")).toBe(false);
    });
  });

  describe("getPlayerScore", () => {
    it("should return score 0 for new player", () => {
      const playerId = "player-1";

      db.prepare(
        `
        INSERT INTO players (
          id,
          score
        )
        VALUES (?, 0)
      `,
      ).run(playerId);

      const result = getPlayerScore(playerId);

      expect(result.score).toBe(0);
      expect(result.highScore).toBe(0);
    });

    it("should return player score and high score", () => {
      const playerId = "player-1";

      db.prepare(
        `
        INSERT INTO players (
          id,
          score
        )
        VALUES (?, 5)
      `,
      ).run(playerId);

      db.prepare(
        `
        UPDATE game_settings
        SET high_score = 10
        WHERE id = 1
      `,
      ).run();

      const result = getPlayerScore(playerId);

      expect(result.score).toBe(5);
      expect(result.highScore).toBe(10);
    });
  });

  describe("playGame", () => {
    beforeEach(() => {
      db.prepare("DELETE FROM players").run();

      db.prepare(
        `
        UPDATE game_settings
        SET high_score = 0
        WHERE id = 1
      `,
      ).run();

      db.prepare(
        `
        INSERT INTO players (
          id,
          score
        )
        VALUES (?, 0)
      `,
      ).run("player-1");
    });

    it("should win when ROCK beats SCISSORS", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.67);

      const result = gameplay({ playerId: "player-1", playerAction: "ROCK" });

      expect(result.playerAction).toBe("ROCK");

      expect(result.botAction).toBe("SCISSORS");

      expect(result.result).toBe("WIN");

      expect(result.score).toBe(1);

      expect(result.highScore).toBe(1);

      expect(result.highScoreUpdated).toBe(true);
    });

    it("should lose when ROCK loses to PAPER", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.34);

      const result = gameplay({ playerId: "player-1", playerAction: "ROCK" });

      expect(result.playerAction).toBe("ROCK");

      expect(result.botAction).toBe("PAPER");

      expect(result.result).toBe("LOSE");

      expect(result.score).toBe(0);

      expect(result.highScoreUpdated).toBe(false);
    });

    it("should draw when player and bot choose the same action", () => {
      vi.spyOn(Math, "random").mockReturnValue(0);

      const result = gameplay({ playerId: "player-1", playerAction: "ROCK" });

      expect(result.playerAction).toBe("ROCK");

      expect(result.botAction).toBe("ROCK");

      expect(result.result).toBe("DRAW");

      expect(result.score).toBe(0);
    });

    it("should increase score after consecutive wins", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.67);

      const firstGame = gameplay({
        playerId: "player-1",
        playerAction: "ROCK",
      });

      const secondGame = gameplay({
        playerId: "player-1",
        playerAction: "ROCK",
      });

      expect(firstGame.score).toBe(1);

      expect(secondGame.score).toBe(2);
    });

    it("should reset score after losing", () => {
      vi.spyOn(Math, "random")
        .mockReturnValueOnce(0.67)
        .mockReturnValueOnce(0.67)
        .mockReturnValueOnce(0.34);

      gameplay({ playerId: "player-1", playerAction: "ROCK" });

      gameplay({ playerId: "player-1", playerAction: "ROCK" });

      const result = gameplay({ playerId: "player-1", playerAction: "ROCK" });

      expect(result.result).toBe("LOSE");

      expect(result.score).toBe(0);
    });

    it("should update high score when player gets a new high score", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.67);

      const result = gameplay({ playerId: "player-1", playerAction: "ROCK" });

      expect(result.score).toBe(1);

      expect(result.highScore).toBe(1);

      expect(result.highScoreUpdated).toBe(true);
    });

    it("should not update high score when score is lower", () => {
      db.prepare(
        `
        UPDATE game_settings
        SET high_score = 10
        WHERE id = 1
      `,
      ).run();

      vi.spyOn(Math, "random").mockReturnValue(0.67);

      const result = gameplay({ playerId: "player-1", playerAction: "ROCK" });

      expect(result.score).toBe(1);

      expect(result.highScore).toBe(10);

      expect(result.highScoreUpdated).toBe(false);
    });
  });
});
