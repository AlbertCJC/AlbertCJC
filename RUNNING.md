# Running AlbertCJC Portfolio Locally

## Quick Start
The AlbertCJC project is a Vite + React shell that mounts Vue 3 components (src/nuxt/*.ts). 

### Prerequisites
- Node.js v22+ (currently v22.19.0)
- npm v10+ 
- Run commands from `C:\Users\jac23\Desktop\Portfolio\AlbertCJC\`

## Run Dev Server (Recommended)

1. Kill any existing node/vite processes:
```powershell
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
```

2. Start the dev server (use vite directly in this env to avoid npm script issues):
```powershell
cd C:\Users\jac23\Desktop\Portfolio\AlbertCJC
.\node_modules\.bin\vite.cmd --host 0.0.0.0 --port 5173 --strictPort
```
Or background it:
```powershell
Start-Process -FilePath ".\node_modules\.bin\vite.cmd" -ArgumentList "--host","0.0.0.0","--port","5173","--strictPort" -WorkingDirectory "C:\Users\jac23\Desktop\Portfolio\AlbertCJC" -WindowStyle Hidden
```

3. Verify it's running:
```powershell
Invoke-WebRequest -Uri "http://localhost:5173/" -UseBasicParsing | Select-Object -Property StatusCode
# Should return 200
```

Dev server: http://localhost:5173/

## Type Check
```powershell
cd C:\Users\jac23\Desktop\Portfolio\AlbertCJC
npx tsc --noEmit
```
Must exit with code 0. NoUnusedLocals/NoUnusedParameters are strict.

## Build & Preview
```powershell
cd C:\Users\jac23\Desktop\Portfolio\AlbertCJC
.\node_modules\.bin\vite.cmd build
.\node_modules\.bin\vite.cmd preview --host 0.0.0.0 --port 4173
```
Build outputs to `dist/` as a single-file HTML (vite-plugin-singlefile). Do not commit `dist/`.

## Important Notes
- This is NOT Nuxt despite `src/nuxt/` naming. Components use runtime template strings with `vue/dist/vue.esm-bundler.js`. Don't convert to .vue SFCs.
- React is only the mount shell (`src/main.tsx` → `src/App.tsx` → mounts Vue via `src/nuxt/app.ts`).
- Tailwind v4 via @tailwindcss/vite; no tailwind.config.*. Theme in `src/index.css`.
- Path alias `@/*` must stay in sync between `vite.config.ts` and `tsconfig.json`.
- Mobile work rail fix: `src/index.css` has `.rail-view { scroll-snap-type: none; }` and `src/nuxt/components.ts` uses `w-[70vw]` cards. See AGENTS.md for details.
- Zod: Not a direct dep in AlbertCJC; jiti pulls zod@^4.4.3 in node_modules. package.json in AlbertCJC has no zod.
- Never commit `node_modules/`; add `.gitignore` if missing (`node_modules/`, `dist/`).

## Kill Stuck Processes
If ports are blocked or something hangs:
```powershell
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Get-Process node -ErrorAction SilentlyContinue | Format-Table Id,ProcessName
```
