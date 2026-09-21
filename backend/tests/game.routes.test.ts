import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import request from 'supertest';

import { db } from '../src/db/database';

import {
  createGameRoutes,
} from '../src/routes/game.routes';

describe('game.routes', () => {
  const io = {
    emit: vi.fn(),
  } as any;

  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  app.use(express.json());

  app.use(cookieParser());

  app.use(
    '/api',
    createGameRoutes(io)
  );

  beforeEach(() => {
    vi.clearAllMocks();

    db.prepare(
      'DELETE FROM players'
    ).run();

    db.prepare(`
      UPDATE game_settings
      SET high_score = 0
      WHERE id = 1
    `).run();

    db.prepare(`
      INSERT INTO players (
        id,
        score
      )
      VALUES (?, 0)
    `).run('player-1');
  });

  describe('GET /api/score', () => {
    it('should return 401 when player_id cookie is missing', async () => {
      const response =
        await request(app)
          .get('/api/score');

      expect(response.status)
        .toBe(401);

      expect(response.body)
        .toEqual({
          message: 'Player Id not found',
        });
    });

    it('should return player score', async () => {
      const response =
        await request(app)
          .get('/api/score')
          .set(
            'Cookie',
            'player_id=player-1'
          );

      expect(response.status)
        .toBe(200);

      expect(response.body)
        .toEqual({
          score: 0,
          highScore: 0,
        });
    });

    it('should return current score and high score', async () => {
      db.prepare(`
        UPDATE players
        SET score = 5
        WHERE id = ?
      `).run('player-1');

      db.prepare(`
        UPDATE game_settings
        SET high_score = 10
        WHERE id = 1
      `).run();

      const response =
        await request(app)
          .get('/api/score')
          .set(
            'Cookie',
            'player_id=player-1'
          );

      expect(response.status)
        .toBe(200);

      expect(response.body)
        .toEqual({
          score: 5,
          highScore: 10,
        });
    });
  });

  describe('POST /api/action', () => {
    it('should return 401 when player_id cookie is missing', async () => {
      const response =
        await request(app)
          .post('/api/action')
          .send({
            action: 'ROCK',
          });

      expect(response.status)
        .toBe(401);

      expect(response.body)
        .toEqual({
          message: 'Player Id not found',
        });
    });

    it('should return 400 when action is invalid', async () => {
      const response =
        await request(app)
          .post('/api/action')
          .set(
            'Cookie',
            'player_id=player-1'
          )
          .send({
            action: 'INVALID',
          });

      expect(response.status)
        .toBe(400);

      expect(response.body)
        .toEqual({
          message:
            'Action must be ROCK, PAPER or SCISSORS',
        });
    });

    it('should return 400 when action is missing', async () => {
      const response =
        await request(app)
          .post('/api/action')
          .set(
            'Cookie',
            'player_id=player-1'
          )
          .send({});

      expect(response.status)
        .toBe(400);

      expect(response.body)
        .toEqual({
          message:
            'Action must be ROCK, PAPER or SCISSORS',
        });
    });

    it('should play game successfully', async () => {
      vi.spyOn(Math, 'random')
        .mockReturnValue(0.67);

      const response =
        await request(app)
          .post('/api/action')
          .set(
            'Cookie',
            'player_id=player-1'
          )
          .send({
            action: 'ROCK',
          });

      expect(response.status)
        .toBe(200);

      expect(response.body)
        .toEqual({
          playerAction: 'ROCK',
          botAction: 'SCISSORS',
          result: 'WIN',
          score: 1,
          highScore: 1,
          highScoreUpdated: true,
        });
    });

    it('should emit highScoreUpdated when new high score is reached', async () => {
      vi.spyOn(Math, 'random')
        .mockReturnValue(0.67);

      await request(app)
        .post('/api/action')
        .set(
          'Cookie',
          'player_id=player-1'
        )
        .send({
          action: 'ROCK',
        });

      expect(io.emit)
        .toHaveBeenCalledWith(
          'highScoreUpdated',
          {
            highScore: 1,
          }
        );
    });

    it('should not emit highScoreUpdated when new high score is not reached', async () => {
      db.prepare(`
        UPDATE game_settings
        SET high_score = 10
        WHERE id = 1
      `).run();

      vi.spyOn(Math, 'random')
        .mockReturnValue(0.34);

      await request(app)
        .post('/api/action')
        .set(
          'Cookie',
          'player_id=player-1'
        )
        .send({
          action: 'ROCK',
        });

      expect(io.emit)
        .not.toHaveBeenCalled();
    });
  });
});