# Repository Guidelines

## Project Structure & Module Organization
- Root splits into `backend/` (Django + DRF) and `tapmenu/` (React + Vite + Tailwind); planning docs sit in `docs/`.
- Backend apps live under `backend/` (`users/`, `restaurants/`, `catalogs/`, `orders/`, `payment/`, `reports/`, `settings/`), with shared config in `backend/core/` and a starter env file in `backend/.env.example`.
- Frontend entry is `tapmenu/src/main.jsx` feeding `src/App.jsx` for routing; features sit in `src/pages/...`, shared UI in `src/components/`, helpers in `src/lib/` (e.g., `cn`), API calls in `src/services/`, and design tokens in `src/index.css`.
- Public/static assets stay in `tapmenu/public` and `tapmenu/src/assets`; production output is `tapmenu/dist`.

## Build, Test, and Development Commands
- Backend setup: `cd backend && uv sync` to create `.venv` from `uv.lock`; start with `uv run python manage.py migrate` then `uv run python manage.py runserver` (defaults to SQLite, flips to Postgres when `DB_*` env vars are set).
- Backend tests: `uv run python manage.py test` (Django test runner).
- Frontend setup: `cd tapmenu && bun install`; `bun dev` for HMR dev server, `bun run build` for production bundle, `bun run preview` to serve the build, `bun run lint` for ESLint (flat config with React hooks/refresh).

## Coding Style & Naming Conventions
- Python: 4-space indent, single quotes, snake_case for functions/helpers, PascalCase for models/forms; keep new URL routes near their app and central config in `core/settings.py`.
- JavaScript/React: 2-space indent, named exports with PascalCase components; align route paths in `src/App.jsx` with folder names; favor Tailwind utilities and the `cn` helper for conditional class names.
- Configuration: copy `backend/.env.example` to `.env`, never commit secrets, and document any new keys or migrations in PRs.

## Testing Guidelines
- Django test modules exist as placeholders—add unit/integration tests alongside each app and run via `uv run python manage.py test`.
- Frontend has no runner yet; if you add Vitest + React Testing Library, name specs `*.test.jsx` near the component. Until then, rely on `bun run lint` and manual smoke tests for dashboard and customer flows in `bun dev`.

## Commit & Pull Request Guidelines
- Follow current history: conventional-style subjects (`feat: ...`, `fix: ...`, `chore: ...`) in present tense.
- Before a PR, ensure `bun run lint`, `bun run build`, and `uv run python manage.py test` pass; include a short summary, linked issue, setup steps (env vars, migrations), and screenshots or clips for UI changes.
- After running tasks, tick off the PR checklist (tests, build, screenshots, migrations, new env keys) so reviewers see what’s covered.
- Keep PRs focused on one feature or fix, and call out any schema or settings changes for reviewers.
