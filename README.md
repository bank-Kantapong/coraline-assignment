# Coraline Assignment

A full-stack application (Rock Paper Scissors) built with Next.js, TypeScript, Node.js, Express, Socket.IO, and SQLite.

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* SCSS

### Backend

* Node.js
* Express
* TypeScript
* Socket.IO
* SQLite

### Infrastructure

* Docker
* Docker Compose



## Prerequisites

Make sure the following are installed:

* Docker
* Docker Compose

Node.js is not required to run the application when using Docker.



## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd coraline-assignment
```

### 2. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Build Docker images

```bash
docker compose build
```

### 4. Start the application

```bash
docker compose up -d
```

### 5. Open the application

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:3001
```

---

## Docker Commands

### Start

```bash
docker compose up -d
```

### Stop

```bash
docker compose down
```

### Rebuild

```bash
docker compose build
docker compose up -d
```

### View logs

```bash
docker compose logs -f
```

### View running containers

```bash
docker compose ps
```


## Database

The backend uses SQLite for data persistence.

The database is stored under:

```text
backend/data/
```

## How to Play

This is a two-player real-time game. Each player should open the game in a separate browser session.

## 1. Open Player 1

Open the game in your first browser:

http://localhost:3000

For example:
```
Chrome
```

## 2. Open Player 2

Open the same URL using another browser or an Incognito/Private window.

For example:

```
Chrome + Incognito
Chrome + Edge
Chrome + Firefox
```

Using a separate browser session ensures that each player has a separate session and player identity.

## 3. Start the Game

Once both players have joined:

```
- Start the game.
- Each player makes their move.
- The round result is displayed.
- Scores are updated based on the game results.
- The high score is saved to the backend when a new high score is achieved.
- The high score is synchronized in real time between players.
```

## Game Features

* Real-time multiplayer/game interaction using Socket.IO
* Game state management
* Score tracking
* High score persistence
* SQLite database persistence
* Error handling
* Responsive UI
* Dockerized frontend and backend