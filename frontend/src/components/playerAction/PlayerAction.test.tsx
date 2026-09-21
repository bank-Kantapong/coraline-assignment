import { render } from "@testing-library/react";
import { vi } from "vitest";

import userEvent from "@testing-library/user-event";

import PlayerAction from "./PlayerAction";

describe("PlayerAction", () => {
  it("should display all action buttons", () => {
    const { container } = render(
      <PlayerAction disabled={false} onAction={() => {}} />,
    );

    const buttonRock = container.querySelector('button[name="ROCK"]');
    const buttonPaper = container.querySelector('button[name="PAPER"]');
    const buttonScissors = container.querySelector('button[name="SCISSORS"]');

    expect(buttonRock?.getAttribute("name")).toBe("ROCK");
    expect(buttonPaper?.getAttribute("name")).toBe("PAPER");
    expect(buttonScissors?.getAttribute("name")).toBe("SCISSORS");
  });

  it("should call onAction when ROCK is clicked", async () => {
    const user = userEvent.setup();

    const onAction = vi.fn();

    const { container } = render(
      <PlayerAction disabled={false} onAction={onAction} />,
    );
    const buttonRock = container.querySelector('button[name="ROCK"]');
    await user.click(buttonRock!);

    expect(onAction).toHaveBeenCalledWith("ROCK");
  });

  it("should call onAction when PAPER is clicked", async () => {
    const user = userEvent.setup();

    const onAction = vi.fn();

    const { container } = render(
      <PlayerAction disabled={false} onAction={onAction} />,
    );
    const buttonPaper = container.querySelector('button[name="PAPER"]');
    await user.click(buttonPaper!);

    expect(onAction).toHaveBeenCalledWith("PAPER");
  });

  it("should disable all buttons when disabled is true", () => {
    const { container } = render(
      <PlayerAction disabled={true} onAction={() => {}} />,
    );

    const buttonRock = container.querySelector('button[name="ROCK"]');
    const buttonPaper = container.querySelector('button[name="PAPER"]');
    const buttonScissors = container.querySelector('button[name="SCISSORS"]');

    expect(buttonRock).toBeDisabled();
    expect(buttonPaper).toBeDisabled();
    expect(buttonScissors).toBeDisabled();
  });
});
