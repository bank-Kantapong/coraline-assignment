import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import crypto from "crypto";
import { db } from "./db/database";
import { createGameRoutes } from "./routes/game.routes";
import { Server } from "socket.io";

const app = express();

const PORT = 3001;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

// create a new player if the player_id cookie is not present
app.use((req, res, next) => {
  if (!req.cookies.player_id) {
    const playerId = crypto.randomUUID();

    db.prepare(
      `
      INSERT INTO players (
        id,
        score
      )
      VALUES (?, 0)
    `,
    ).run(playerId);

    res.cookie("player_id", playerId, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    req.cookies.player_id = playerId;
  }

  next();
});

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

app.use(
  '/api',
  createGameRoutes(io)
);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
  });
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
