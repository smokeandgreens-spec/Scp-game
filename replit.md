# SCP: Horizon

A dark, SCP Foundation-inspired text adventure RPG where the player is O5-1, making high-stakes decisions about a mysterious anomalous child during a six-day crisis at Site-19. Full Act I narrative with branching choices, visible/hidden stats, 3 endings, and a complete terminal UI.

## Run & Operate

- `pnpm --filter @workspace/scp-horizon run dev` — run the frontend (port 19792)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifacts/scp-horizon)
- State: Zustand (localStorage persistence only — no backend)
- Routing: Wouter
- Styling: Tailwind CSS, Share Tech Mono font (Google Fonts)
- No backend needed

## Where things live

```
artifacts/scp-horizon/src/
  types/game.ts          — All TypeScript types (GameStats, StoryNode, Choice, SaveSlot...)
  data/storyNodes.ts     — Full Act I story content (5 chapters, 3 endings, all characters, journal)
  store/gameStore.ts     — Zustand store: state + localStorage save/load
  hooks/useTypewriter.ts — Typewriter effect hook (respects text speed setting)
  pages/
    MainMenu.tsx         — Boot sequence + menu (routes: /)
    GameView.tsx         — Core gameplay with sidebar/narrative/choices (/game)
    EventLog.tsx         — Chronological event log (/log)
    Journal.tsx          — Classified document library (/journal)
    Dossier.tsx          — Character database, unlocks as encountered (/dossier)
    Statistics.tsx       — Visible + hidden stats display (/statistics)
    Saves.tsx            — 5 save slots: save/load/delete (/saves)
    Settings.tsx         — Text speed, font size, scanlines, glitch, purge (/settings)
    Endings.tsx          — Act I conclusion screen (/endings)
  App.tsx                — Route registration (wouter)
  index.css              — SCP dark terminal theme, animations, scanline overlay
```

## Architecture decisions

- **No backend** — all persistence via localStorage keys `scp-horizon-save-{1-5}` and `scp-horizon-settings`
- **Template literals in JSX**: AVOID escaped backticks (`\``) — subagent will corrupt them. Use string concatenation (`'a' + var + 'b'`) or `.join()` in JSX className attributes
- **Zustand selectors**: Never call a function that returns new references inside a selector (e.g., `useGameStore(s => s.getSaveSlots())`) — causes infinite re-render. Use `useMemo` or `useState` with lazy initializer instead
- **Story architecture**: StoryNode has `type: 'narrative' | 'choice' | 'consequence' | 'chapter-start' | 'ending'`. Consequence nodes use `autoAdvanceToNodeId`, choice nodes define `choices[]`, endings detected by stats thresholds (knowledge≥60 → Observer, trust≥60 → Caretaker, else Warden)
- **CSS theme**: All in `index.css` as HSL CSS variables. Font is Share Tech Mono imported from Google Fonts (first line of index.css, before all other imports)

## Product

SCP: Horizon — Act I: The Girl. The player is O5-1 making decisions about a catatonic anomalous child found in a forest clearing. Five chapters (Monday–Saturday), branching narrative, 5 choices in Chapter 1, cascading consequences. Three endings based on accumulated stats:
- **The Observer** (high knowledge) — you document everything
- **The Caretaker** (high trust) — you attempt communication
- **The Warden** (high fear) — you lock it all down

## User preferences

_Populate as needed._

## Gotchas

- **Google Fonts import MUST be first line of index.css** — before `@import "tailwindcss"`, or the font won't load
- **Template literals in JSX** — use `'class-a ' + variable + ' class-b'` or `['class-a', variable].join(' ')` in JSX; template literals get corrupted by AI subagents (they write escaped backticks)
- **`getSaveSlots()` pattern** — function returns new array each call; never use as Zustand selector directly
- **`useTypewriter` must not mutate refs or call side effects inside state updaters** — React 18 Concurrent Mode replays updaters; StrictMode double-invokes them. The hook uses a `setTimeout` chain (not `setInterval`) with index as plain state, and a `firedRef` guard so `onComplete` fires exactly once. Any edit to this hook must preserve those invariants.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
