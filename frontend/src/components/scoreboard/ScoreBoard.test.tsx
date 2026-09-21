import {
  render,
  screen,
} from '@testing-library/react';

import ScoreBoard from './ScoreBoard';

describe('ScoreBoard', () => {
  it('should display current score', () => {
    render(
      <ScoreBoard
        score={5}
        highScore={10}
      />
    );

    expect(
      screen.getByText('5')
    ).toBeInTheDocument();
  });

  it('should display high score', () => {
    render(
      <ScoreBoard
        score={5}
        highScore={10}
      />
    );

    expect(
      screen.getByText('10')
    ).toBeInTheDocument();
  });
});