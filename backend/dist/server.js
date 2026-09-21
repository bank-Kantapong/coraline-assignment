"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("./db/database");
const game_routes_1 = require("./routes/game.routes");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const PORT = 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// create a new player if the player_id cookie is not found
app.use((req, res, next) => {
    let playerId = req.cookies.player_id;
    if (playerId) {
        const player = database_1.db
            .prepare(`
        SELECT id
        FROM players
        WHERE id = ?
      `)
            .get(playerId);
        if (!player) {
            playerId = undefined;
        }
    }
    if (!playerId) {
        playerId = crypto_1.default.randomUUID();
        database_1.db.prepare(`
      INSERT INTO players (
        id,
        score
      )
      VALUES (?, 0)
    `).run(playerId);
        res.cookie('player_id', playerId, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 365,
        });
        req.cookies.player_id = playerId;
    }
    next();
});
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: FRONTEND_URL,
        credentials: true,
    },
});
app.use('/api', (0, game_routes_1.createGameRoutes)(io));
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
