---
name: SCP Horizon v2 architecture
description: The 12-system upgrade added in the second session — what was added, where it lives, and key invariants.
---

# SCP Horizon v2 Architecture

## New systems
1. **GlobalFlags** — cross-act memory (Record<string, FlagValue>). Set via `setFlags(flags)` or `setFlag(k,v)`. Read with `getFlag(k)`.
2. **StoryDecisions** — recorded via `recordsDecision` on Choice objects. Drives QFAC analysis.
3. **CharacterRelationships** — per-character trust/affinity, updated by `updatesRelationship` on Choice or `updateRelationship(id, td, ad)`.
4. **Achievements** — 18 defs in `data/achievements.ts`. Unlocked via `triggersAchievement` on Choice/StoryNode or `unlockAchievement(id)`.
5. **EndingRecords** — `recordEnding()` auto-awards ending achievements and checks for all-paths achievement.
6. **Puzzles** — triggered by `triggersPuzzle` on StoryNode. GameView checks on node change; PuzzleModal overlays full screen. Rewards applied in handlePuzzleComplete.
7. **SCPDatabase** — 8 entries in `data/scpEntries.ts`. SCP-5005-classified gated by `act1_complete` flag.
8. **SaveMigration** — `migrateSave()` in gameStore handles any version < 2 by filling in v2 defaults.

## New pages and routes
- `/achievements` — Achievements.tsx
- `/timeline` — Timeline.tsx (decisions + eventLog chronologically)
- `/scp-db` — SCPDatabase.tsx
- `/analysis` — Analysis.tsx (QFAC engine: classifies player by dominant decision impact)
- `/codex` — Codex.tsx (Dossier + relationship bars)

## Key story node changes
- `ch3-start`: `triggersPuzzle: 'puzzle-forest-symbols'` (memory-grid, 90s timer)
- `ch4-start`: `triggersPuzzle: 'puzzle-voice-sequence'` (symbol-sequence, 3 rounds)
- ch1 choices (c1-medical..c1-forest): all have `setsFlags` + `recordsDecision`
- ch2 choices (c2-aggressive, c2-standard, c2-compassion): `setsFlags` + `recordsDecision` + `triggersAchievement`

## Why
- Cross-act memory requires flags so Act II can branch on Act I choices.
- Decision recording drives the QFAC analysis classification.
- SaveVersion avoids breaking existing saves while adding new fields.
