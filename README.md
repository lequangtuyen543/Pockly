# Pockly

Pockly is a lightweight, mobile-first personal finance web app focused on fast, offline-first expense and income tracking. The v1.0 MVP stores data locally in the browser (LocalStorage) and provides a compact set of tools for quick entry, budgeting, and visual summaries.

## Features

- Quick transaction entry (income/expense) with keyboard-first flows and auto-focus.
- Transaction list with grouping, search and filters (day/week/month/category).
- Dashboard with summary cards, spending bar chart, category breakdown (donut), and month comparison.
- Budget management with per-month and per-category limits and in-app alerts at thresholds (e.g., 80%, 100%).
- Category management with emoji/icon picker and safe handling of categories that have transactions (hide not delete).
- CSV export of transactions with UTF-8 encoding for Vietnamese text.
- Onboarding flow and helpful empty states for new users.
- Local-first, offline-capable: all data persisted in LocalStorage (no account required).
- Unit tests for core libraries and logic (see `src/lib/*.test.ts`).

## Tech Stack

- Frontend: React 18, Vite, TypeScript
- UI: Tailwind CSS, shadcn/ui
- Charts: Recharts
- State: Zustand
- Date utilities: date-fns
- Backend (scaffolded for future): Node.js + Express (server inactive in v1.0)

## Project Structure (high level)

- `pockly-client/` — frontend app (React + Vite)
	- `src/` — source code
		- `components/` — UI components (transaction, dashboard, budget, etc.)
		- `store/` — Zustand stores (`transactionStore.ts`, `categoryStore.ts`, `budgetStore.ts`)
		- `lib/` — utilities, LocalStorage layer, export helpers, and tests
		- `pages/` — route pages: Dashboard, History, Budget, Settings
- `pockly-server/` — backend scaffold (Express + TypeScript), prepared for future sync features
- `docs/` — design and requirements documentation
- `PROJECT_KNOWLEDGE.md` — authoritative project knowledge for agents and contributors
- `TODO.md` — development & release checklist

## Installation

Prerequisites: Node.js (16+ recommended), pnpm

From repository root:

```bash
pnpm install
```

Start frontend (development):

```bash
cd pockly-client
pnpm install
pnpm dev
```

Start backend (development, optional — backend is scaffolded and not required for v1.0):

```bash
cd pockly-server
pnpm install
pnpm dev
```

## Environment setup

- Frontend environment variables (if needed) go in `pockly-client/.env`.
- Backend environment variables (when using server) go in `pockly-server/.env`.
- v1.0 runs entirely client-side and does not require server env vars.

## Development commands

- Install dependencies (root): `pnpm install`
- Run frontend dev server: `cd pockly-client && pnpm dev`
- Run backend dev server: `cd pockly-server && pnpm dev` (optional)

## Production build

Build the frontend for production:

```bash
cd pockly-client
pnpm build
```

Backend production build (if used): build scripts live in `pockly-server/package.json`.

## Testing

Run frontend tests:

```bash
cd pockly-client
pnpm test
```

Run backend tests:

```bash
cd pockly-server
pnpm test
```

Unit tests for core logic are under `pockly-client/src/lib/*.test.ts`.

## Deployment

- Frontend: configured to deploy to Vercel (recommended for static hosting of the Vite build).
- Backend (future): prepared for deployment to Render, Railway, or similar platforms.
- v1.0 is a client-only release; deploy the `pockly-client` build output as a static site.

## Screenshots

_Placeholders — add real screenshots in `docs/screenshots/` or `public/screenshots/`._

- Dashboard: ![Dashboard](docs/screenshots/dashboard.png)
- Transaction entry: ![Transaction](docs/screenshots/transaction.png)
- Budget view: ![Budget](docs/screenshots/budget.png)

## Future improvements

- Cloud sync and optional user accounts (v1.1+)
- Bi-directional offline sync / conflict resolution
- CSV import and scheduled backups
- Multi-device sync and export/import integration
- Accessibility refinements and internationalization (i18n)

## License

This project is released under the MIT License. See `LICENSE` for details.

---

For more context and implementation details, see `PROJECT_KNOWLEDGE.md` and the `docs/` folder.
