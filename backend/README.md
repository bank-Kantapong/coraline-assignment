# Backend

The backend service for the Coraline Assignment.

## Tech Stack

* Node.js
* Express
* TypeScript
* Socket.IO
* SQLite

## Development

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3001
```

## Build

Create the production build:

```bash
npm run build
```

The compiled files are generated in:

```text
dist/
```

The production server can be started with:

```bash
npm start
```

The production entry point is:

```text
dist/server.js
```

## Database

The backend uses SQLite.

Database files are stored in:

```text
data/
```

The main database file is:

```text
data/game.db
```

SQLite may also generate:

```text
data/game.db-shm
data/game.db-wal
```

These are runtime files and should not be committed to Git.

## API

The backend provides the APIs required by the game application, including game-related operations and score persistence.

The frontend communicates with the backend through HTTP requests and Socket.IO.

## Socket.IO

Socket.IO is used for real-time communication between the frontend and backend.

Default Socket.IO endpoint:

```text
http://localhost:3001
```

## Docker

The backend includes a production Dockerfile.

From the project root:

```bash
docker compose build backend
docker compose up -d backend
```

The backend will be available at:

```text
http://localhost:3001
```