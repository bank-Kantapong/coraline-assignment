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


## Game Features

* Real-time multiplayer/game interaction using Socket.IO
* Game state management
* Score tracking
* High score persistence
* SQLite database persistence
* Error handling
* Responsive UI
* Dockerized frontend and backend