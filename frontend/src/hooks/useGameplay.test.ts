import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import useGameplay from "./useGameplay";

import { playGame } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  playGame: vi.fn(),
}));

describe("useGameplay", () => {
  const setScore = vi.fn();
  const setHighScore = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("should start with initial state", () => {
    const { result } = renderHook(() =>
      useGameplay({
        setScore,
        setHighScore,
      }),
    );

    expect(result.current.selectedAction).toBeNull();
    expect(result.current.botAction).toBeNull();
    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
  });

  it("should play game successfully", async () => {
    vi.mocked(playGame).mockResolvedValue({
      playerAction: "ROCK",
      botAction: "SCISSORS",
      result: "WIN",
      score: 1,
      highScore: 5,
      highScoreUpdated: false,
    });

    const { result } = renderHook(() =>
      useGameplay({
        setScore,
        setHighScore,
      }),
    );

    await act(async () => {
      await result.current.handleAction("ROCK");
    });

    expect(playGame).toHaveBeenCalledWith("ROCK");
    expect(result.current.selectedAction).toBe("ROCK");
    expect(result.current.botAction).toBe("SCISSORS");
    expect(result.current.result).toBe("WIN");
    expect(result.current.loading).toBe(false);
    expect(setScore).toHaveBeenCalledWith(1);
    expect(setHighScore).toHaveBeenCalledWith(5);
  });
});
