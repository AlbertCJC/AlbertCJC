# AGENTS.md

Vite + React repo whose UI is actually authored in **Vue 3** — this is intentional, not a bug.

## Stack quirk (read first)

- Entry is React 19 (`src/main.tsx` → `src/App.tsx`), but `App.tsx` only mounts a Vue app into a host `<div>` via `mountNuxtApp` from `src/nuxt/app.ts`.
- All real UI lives in `src/nuxt/` (`components.ts`, `primitives.ts`, `tailored.ts`, `faq.ts`, `composables.ts`). "Nuxt-style" naming only — it is **not** Nuxt and has no Nuxt/npm packages.
- Components are `defineComponent` objects using **runtime `template:` strings**, imported from `vue/dist/vue.esm-bundler.js` (full build with compiler). A shim in `src/vue-shim.d.ts` makes TS accept that path. Do not switch imports to bare `vue` or add `.vue` SFCs without removing this pattern.
- Portfolio content/data lives in `src/data.ts`; shared classes via `src/utils/cn.ts` (clsx + tailwind-merge).

## Commands

- See [RUNNING.md](./RUNNING.md) for complete instructions on running the dev server, building, previewing, and troubleshooting.
- `npm run dev` — Vite dev server (may behave differently in some shells; prefer RUNNING.md guidance)
- `npm run build` — production build; `vite-plugin-singlefile` inlines everything into one HTML file in `dist/`
- `npm run preview` — serve the built `dist/`
- No lint, no tests, no typecheck script. Type-check with `npx tsc --noEmit` (strict mode, `noUnusedLocals`/`noUnusedParameters` on — unused vars fail the type check).

## Config gotchas

- Tailwind CSS **v4** via `@tailwindcss/vite` — no `tailwind.config.*`; theme tokens (`--color-ink`, `--color-bone`, `--color-accent`, fonts) are defined in `src/index.css` under `@theme`.
- Path alias `@/*` → `src/*` must stay in sync between `vite.config.ts` and `tsconfig.json`.
- Adding React components will not get used; the React tree is just the mount shell.

## Deploy

- `.github/workflows/deploy.yml`: push to `main` → `npm ci && npm run build` (Node 20) → publishes `dist/` to GitHub Pages. The build must keep working single-file; assets referenced from `public/` still get copied to `dist/`.
