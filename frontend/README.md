# Frontend

The frontend application for the Coraline Assignment.

## Tech Stack

* Next.js
* React
* TypeScript
* SCSS

## Development

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Environment Variables

The frontend uses the following environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

See the root `.env.example` for the default configuration used by Docker Compose.

## Production Build

To create a production build locally:

```bash
npm run build
```

To run the production build:

```bash
npm start
```

## Docker

The frontend includes a `Dockerfile` for production deployment.

From the project root:

```bash
docker compose build frontend
docker compose up -d frontend
```

The frontend will be available at:

```text
http://localhost:3000
```