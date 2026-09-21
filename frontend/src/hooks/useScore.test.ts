import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import useScore from "./useScore";

import { getScore } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  getScore: vi.fn(),
}));

describe("useScore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have initial state", () => {
    const { result } = renderHook(() => useScore());

    expect(result.current.score).toBe(0);
    expect(result.current.highScore).toBe(0);
    expect(result.current.error).toBe("");
  });

  it("should load score successfully", async () => {
    vi.mocked(getScore).mockResolvedValue({
      score: 5,
      highScore: 10,
    });

    const { result } = renderHook(() => useScore());

    await act(async () => {
      await result.current.loadScore();
    });

    expect(getScore).toHaveBeenCalledTimes(1);
    expect(result.current.score).toBe(5);
    expect(result.current.highScore).toBe(10);
    expect(result.current.error).toBe("");
  });

  it("should handle API error", async () => {
    vi.mocked(getScore).mockRejectedValue(new Error("Cannot load score"));

    const { result } = renderHook(() => useScore());

    await act(async () => {
      await result.current.loadScore();
    });

    expect(result.current.error).toBe("Cannot load score");
    expect(result.current.score).toBe(0);
    expect(result.current.highScore).toBe(0);
  });

  it("should handle unknown error", async () => {
    vi.mocked(getScore).mockRejectedValue("Something went wrong");

    const { result } = renderHook(() => useScore());

    await act(async () => {
      await result.current.loadScore();
    });

    expect(result.current.error).toBe("An unknown error occurred");
  });

  it("should clear previous error before loading score", async () => {
    vi.mocked(getScore)
      .mockRejectedValueOnce(new Error("Cannot load score"))
      .mockResolvedValueOnce({
        score: 3,
        highScore: 8,
      });

    const { result } = renderHook(() => useScore());

    // First request -> error
    await act(async () => {
      await result.current.loadScore();
    });

    expect(result.current.error).toBe("Cannot load score");

    // Second request -> success
    await act(async () => {
      await result.current.loadScore();
    });

    expect(result.current.error).toBe("");
    expect(result.current.score).toBe(3);
    expect(result.current.highScore).toBe(8);
  });

  it("should allow score to be updated", () => {
    const { result } = renderHook(() => useScore());

    act(() => {
      result.current.setScore(10);
    });

    expect(result.current.score).toBe(10);
  });

  it("should allow high score to be updated", () => {
    const { result } = renderHook(() => useScore());

    act(() => {
      result.current.setHighScore(20);
    });

    expect(result.current.highScore).toBe(20);
  });
});
