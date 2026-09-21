import { vi } from "vitest";
import Home from "./page";

import { getScore, playGame } from "@/lib/api";

import { socket } from "@/lib/socket";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/api", () => ({
  getScore: vi.fn(),
  playGame: vi.fn(),
}));

vi.mock("@/lib/socket", () => ({
  socket: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load and display score", async () => {
    vi.mocked(getScore).mockResolvedValue({
      score: 5,
      highScore: 10,
    });

    render(<Home />);

    expect(await screen.findByText("5")).toBeInTheDocument();

    expect(screen.getByText("10")).toBeInTheDocument();

    expect(getScore).toHaveBeenCalledTimes(1);
  });

  it("should connect to socket", () => {
    vi.mocked(getScore).mockResolvedValue({
      score: 0,
      highScore: 0,
    });

    render(<Home />);

    expect(socket.connect).toHaveBeenCalledTimes(1);

    expect(socket.on).toHaveBeenCalledWith(
      "highScoreUpdated",
      expect.any(Function),
    );
  });

  it("should play game when user clicks ROCK", async () => {
    const user = userEvent.setup();

    vi.mocked(getScore).mockResolvedValue({
      score: 0,
      highScore: 5,
    });

    vi.mocked(playGame).mockResolvedValue({
      playerAction: "ROCK",
      botAction: "SCISSORS",
      result: "WIN",
      score: 1,
      highScore: 5,
      highScoreUpdated: false,
    });

    const { container } = render(<Home />);

    await screen.findByText("0");

    const buttonRock = container.querySelector('button[name="ROCK"]');

    await user.click(buttonRock!);

    expect(playGame).toHaveBeenCalledWith("ROCK");

    expect(await screen.findByText("You win!")).toBeInTheDocument();

    expect(screen.getByText("Bot chose: SCISSORS")).toBeInTheDocument();
  });
});
