# STLF

Bookkeeping app to manage invoices, bills and fiscal documents, with report generation.

> **Status:** work in progress. This is a learning project: it is built in stages, and the stack will change along the way (see the [roadmap](ROADMAP.md)).

## Features (planned)

- Upload and organize invoices, bills, installments and other fiscal documents
- Track payments and due dates
- Generate reports by period, category and payment status
- User accounts with private data per user

## Tech stack

| Part | Current stack |
|---|---|
| Client | React (Vite) |
| Server | Node.js, Express |
| Database | SQLite (`better-sqlite3`) |
| Tests | Jest + supertest (server), Vitest + React Testing Library (client) |

Planned migrations: PostgreSQL with Drizzle ORM, then Next.js.

## Project structure

```
.
├── client/        React frontend (Vite)
├── server/        Express backend and database access
├── ROADMAP.md     Development plan
└── README.md
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [Git](https://git-scm.com/)

### Installation

```bash
git clone <repository-url>
cd <repository-folder>
```

### Run the server

```bash
cd server
npm install
cp .env.example .env     # on PowerShell: Copy-Item .env.example .env
npm run dev
```

The server listens on `http://localhost:3001` by default. Check that it works at `http://localhost:3001/api/health`.

### Run the client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173` by default.

## Environment variables

Server configuration lives in `server/.env` (not committed). Use `server/.env.example` as a template.

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the server listens on | `3001` |
| `DB_PATH` | Path of the SQLite database file | `./sqlite.db` |

## Running tests

```bash
cd server
npm test
```

## Contributing workflow

- `main` always contains working code.
- Every change is developed in its own branch (`feature/...`, `fix/...`, `docs/...`) and merged through a Pull Request.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the development stages and what is done so far.

## License

Released under the [MIT License](LICENSE).
