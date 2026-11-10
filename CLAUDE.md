# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow rules

- Always create a new branch before making any change (never commit directly to `main`).
- For feature changes, write the tests first (test-first), then implement until they pass.

## Commands

- `npm run dev` — Vite dev server (`--host`)
- `npm run build` — `tsc -b && vite build` (type-check is part of the build; CI runs this before tests)
- `npm test` — Vitest single run; `npm run test:watch` for watch mode
- Single test file: `npx vitest run src/hooks/useTodos.test.ts`; single test: add `-t "adds todos"`
- `npm run coverage` — v8 coverage (text + html)

There is no linter configured.

## Architecture

React 19 + TypeScript + Tailwind v4 (via `@tailwindcss/vite`) single-page todo app. No backend; UI strings are in Japanese.

- `src/App.tsx` is the only place wiring state together: it owns the `filter` state, derives the visible list/remaining count, and passes `useTodos` actions down to presentational components in `src/components/`.
- `src/hooks/useTodos.ts` holds all todo state and mutations (add/toggle/remove/setDue/edit/move/clearDone) and persists to localStorage on every change via `src/lib/storage.ts`. Validation lives in the hook (e.g. `edit` ignores empty text, `setDue` ignores invalid dates).
- `src/lib/storage.ts` `loadTodos` normalizes/validates stored data (tolerates legacy formats, missing ids, bad due dates) and swallows storage errors; `src/lib/date.ts` provides date helpers (`'YYYY-MM-DD'` strings, `''` = no due date).
- `useToday` refreshes "today" on tab `visibilitychange` so overdue styling updates after midnight; `useDarkMode` toggles the `dark` class on `<html>` and persists to localStorage key `theme`.
- Drag-and-drop reordering uses `@dnd-kit` in `TodoList`; it is only enabled when the filter is `all` (`sortable` prop), since `move` reorders the full list.

## Testing

Tests are colocated (`*.test.ts(x)`). Vitest runs in jsdom with `globals: true` (no imports needed for `describe`/`it`/`vi`). `src/test/setup.ts` registers jest-dom, cleans up the DOM, clears localStorage and the `dark` class after each test, and polyfills `matchMedia`.
