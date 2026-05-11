# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and follows Semantic Versioning.

## [v1.0.0] - 2026-05-11

### Added

- Local-first persistence using browser LocalStorage for `transactions`, `categories`, `budgets`, and `settings`.
- Fast transaction entry UI with keyboard-first flows and auto-focus.
- Transaction list with grouping, search and date/category filters.
- Dashboard views: summary cards, daily spending bar chart, category breakdown (donut), and month comparison.
- Budget management including per-month and per-category limits and in-app alerting at configured thresholds.
- Category management UI with emoji/icon picker and safe hide behavior for categories tied to transactions.
- CSV export of transactions with UTF-8 encoding support for Vietnamese text.
- Onboarding flow and improved empty states for new users.
- Unit tests for core logic modules under `src/lib/`.

### Improved

- UI/UX refinements: mobile-first layouts, clearer empty states, and streamlined transaction flow.
- Performance optimizations for rendering lists and charts to support larger data sets.
- Testing coverage and test reliability improvements for core calculation and storage helpers.

### Fixed

- Fixed multiple minor issues around LocalStorage persistence and input validation that improved data consistency.
- Addressed edge cases in chart rendering for small/empty datasets.

### Deployment

- Prepared frontend build output for static deployment (recommended: Vercel).
- Backend scaffolded (Node.js + Express) and prepared for future v1.1 cloud sync features; backend is not required for v1.0.

---

For details on implementation and architecture, see `PROJECT_KNOWLEDGE.md` and the `docs/` folder.
