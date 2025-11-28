# Repository Guidelines

## Project Structure & Module Organization
- `src/main.jsx` bootstraps React (StrictMode) and pulls in global styles; `src/App.jsx` centralizes routing for dashboard, auth, and customer flows.
- Pages live under `src/pages/` (`dashboard/`, `authentications/`, `customer/`, marketing pages); shared UI sits in `src/components/` (Navbar, DashboardLayout, Table, Modal, Footer), with helpers in `src/lib/utils.js`.
- Design tokens and Tailwind layer customizations are declared in `src/index.css`; static assets in `src/assets/`; public files in `public/`; production output in `dist/`.
- Co-locate new features with their domain folder and reuse layout/table components to keep dashboards consistent.

## Build, Test, and Development Commands
- Install dependencies with `bun install` (bun.lock is committed). If you must switch to npm/pnpm, align lockfiles and document it.
- `bun dev` — run Vite dev server with HMR.
- `bun run build` — create production bundle in `dist/`.
- `bun run preview` — serve the built app locally for smoke checks.
- `bun run lint` — ESLint (flat config) with React hooks/refresh plugins; fails on unused vars unless they start with uppercase.

## Coding Style & Naming Conventions
- React components use PascalCase filenames and named exports (`export function DashboardOverview()`); keep default exports limited to app entry points.
- Indent with 2 spaces, prefer single quotes, and include trailing commas in multiline literals/props. Keep JSX readable by extracting helpers when inline logic grows.
- Styling leans on Tailwind utility classes; use the `cn` helper from `src/lib/utils.js` when composing conditional class sets.
- Primary brand color lives in Tailwind tokens as `--color-primary: #1B4332` (lighter accent `#2D6A4F`); reserve it for key actions, links, and active navigation states.
- Keep routes declared in `src/App.jsx` and align URL segments with folder names to reduce drift.

## Testing Guidelines
- No automated test runner is wired yet; when adding tests, prefer Vitest + React Testing Library with specs named `*.test.jsx` near the module or under `src/__tests__/`.
- Before opening a PR, at minimum run `bun run lint` and manually exercise key flows in `bun dev` (dashboard navigation, auth forms, order paths, and table actions).

## Commit & Pull Request Guidelines
- Match existing git history: conventional prefix plus concise summary (e.g., `feat: add cashier filters`, `refactor: extract modal`).
- PRs should include a short purpose/changes list, linked issue/ticket, steps to verify, and screenshots or clips for UI updates (dashboard and customer views). Keep scope tight—one feature/fix per PR—and ensure lint/build pass before requesting review.
