import { render, screen } from "@testing-library/react";

import BotAction from "./BotAction";

describe("BotAction", () => {
  // player choose PAPER, bot choose ROCK, player win
  it("should display bot action and result WIN and display bot action", () => {
    render(<BotAction action="ROCK" result="WIN" />);

    expect(screen.getByText("You win!")).toBeInTheDocument();
    expect(screen.getByText("Bot chose: ROCK")).toBeInTheDocument();
  });

  // player choose ROCK, bot choose PAPER, player lose
  it("should display bot action and result LOSE", () => {
    render(<BotAction action="ROCK" result="LOSE" />);

    expect(screen.getByText("You lose!")).toBeInTheDocument();
    expect(screen.getByText("Bot chose: ROCK")).toBeInTheDocument();
  });

  // player choose ROCK, bot choose ROCK, draw
  it("should display bot action and result DRAW", () => {
    render(<BotAction action="ROCK" result="DRAW" />);

    expect(screen.getByText("Draw!")).toBeInTheDocument();
    expect(screen.getByText("Bot chose: ROCK")).toBeInTheDocument();
  });

  it("should display unknown action", () => {
    render(<BotAction action={null} />);

    expect(screen.getByText("???")).toBeInTheDocument();
  });

  it("should display loading when api is loading", () => {
    render(<BotAction action="PAPER" loading={true} />);

    expect(screen.getByText("Playing...")).toBeInTheDocument();
    expect(screen.getByText("Bot is choosing...")).toBeInTheDocument();
  });
});
