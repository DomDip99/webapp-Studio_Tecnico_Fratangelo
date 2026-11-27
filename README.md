# STLF

Bookkeeping app to manage invoices, bills and fiscal documents, with report generation.

> **Status:** work in progress. This is a learning project, built in stages (see the [roadmap](ROADMAP.md)). The client is a working prototype with mock data and a fake login; the server only exposes a health endpoint, and the database is the next step.

## Features

Implemented in the client, with mock data:

- Login with roles (admin and user), with role-based menu and routes
- Journal entries (prima nota), expenses by category, installment plans, work files (pratiche)
- Daily overview and calendar, account balances, transfers between accounts and history
- Search with filters, row selection and subtotals
- Lookup tables: clients, expense categories, operations, accounts, assignees
- Invoices with live calculation of totals
- Utilities: working date, fiscal year, database backup (placeholder)

Planned: database and REST API, real authentication, document uploads, reports and export.

## Tech stack

| Part | Current stack |
|---|---|
| Client | React (Vite), React Router, React Bootstrap, React Icons, Day.js |
| Server | Node.js, Express |
| Database | SQLite (`better-sqlite3`) — not connected yet |
| Tests | Vitest + React Testing Library (client), Jest + supertest (server) |

Planned migrations: PostgreSQL with Drizzle ORM, then Next.js. After that: Docker for production and a mobile-friendly version.

## Project structure

```
.
├── client/                React frontend (Vite)
│   └── src/
│       ├── auth/          Fake authentication (context, protected routes)
│       ├── components/    Reusable components (tables, forms, toolbar, calendar...)
│       ├── config/        Menu definition
│       ├── mocks/         Mock data
│       ├── pages/         One folder per menu section
│       ├── test/          Test helpers
│       ├── utils/         Formatting and calculation functions
│       └── AppRoutes.jsx  Routes
├── server/                Express backend
├── ROADMAP.md             Development plan
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

The client runs on `http://localhost:5173` by default and forwards `/api` requests to the server.

### Demo accounts

The login is a prototype: the users are hard-coded in the client and protect nothing. Do not use real credentials.

| User | Password | Role |
|---|---|---|
| `admin` | `admin123` | admin (sees the Invoices section) |
| `utente` | `utente123` | user |

## Environment variables

Server configuration lives in `server/.env` (not committed). Use `server/.env.example` as a template.

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the server listens on | `3001` |
| `DB_PATH` | Path of the SQLite database file | `./sqlite.db` |

## Running tests

```bash
# server
cd server
npm test

# client
cd client
npm test              # run the tests once
npm run test:watch    # re-run on every change
npm run coverage      # run the tests and show the coverage report
```

## Contributing workflow

- `main` always contains working code.
- Every change is developed in its own branch (`feature/...`, `fix/...`, `docs/...`) and merged through a Pull Request.
- One commit per topic, tests written together with the code.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the development stages and what is done so far.

## License

Released under the [MIT License](LICENSE).
