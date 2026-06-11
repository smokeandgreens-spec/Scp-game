import { AchievementDefinition } from '../types/game';

export const ACHIEVEMENT_DEFS: Record<string, AchievementDefinition> = {

  // ── FIRST CHOICES ──────────────────────────────────────────────────────────

  'ach-first-directive': {
    id: 'ach-first-directive',
    title: 'FIRST DIRECTIVE',
    description: 'Issue your first command as O5-1.',
    classification: 'CLEARANCE: LEVEL-1 GRANTED',
    isSecret: false,
  },

  'ach-pragmatist': {
    id: 'ach-pragmatist',
    title: 'THE PRAGMATIST',
    description: 'Prioritize research and containment from the first moment.',
    classification: 'CLEARANCE: LEVEL-2 GRANTED',
    isSecret: false,
  },

  'ach-protector': {
    id: 'ach-protector',
    title: 'THE PROTECTOR',
    description: 'Place welfare above protocol on initial contact.',
    classification: 'CLEARANCE: LEVEL-2 GRANTED',
    isSecret: false,
  },

  'ach-investigator': {
    id: 'ach-investigator',
    title: 'THE INVESTIGATOR',
    description: 'Trust the evidence before making any assumptions.',
    classification: 'CLEARANCE: LEVEL-2 GRANTED',
    isSecret: false,
  },

  'ach-commander': {
    id: 'ach-commander',
    title: 'THE COMMANDER',
    description: 'Demand direct answers from those who were there.',
    classification: 'CLEARANCE: LEVEL-2 GRANTED',
    isSecret: false,
  },

  'ach-scout': {
    id: 'ach-scout',
    title: 'THE SCOUT',
    description: 'See the place where it began before acting.',
    classification: 'CLEARANCE: LEVEL-2 GRANTED',
    isSecret: false,
  },

  // ── TESTING CHOICES ───────────────────────────────────────────────────────

  'ach-cold-science': {
    id: 'ach-cold-science',
    title: 'COLD SCIENCE',
    description: 'Authorize aggressive testing protocols on a possibly-conscious subject.',
    classification: 'CLEARANCE: LEVEL-3 GRANTED — ETHICS COMMITTEE NOTE FILED',
    isSecret: false,
  },

  'ach-quiet-mercy': {
    id: 'ach-quiet-mercy',
    title: 'QUIET MERCY',
    description: 'Choose compassionate observation when data was within reach.',
    classification: 'CLEARANCE: LEVEL-3 GRANTED',
    isSecret: false,
  },

  'ach-by-the-book': {
    id: 'ach-by-the-book',
    title: 'BY THE BOOK',
    description: 'Follow standard protocol when the pressure to deviate is real.',
    classification: 'CLEARANCE: LEVEL-3 GRANTED',
    isSecret: false,
  },

  // ── CHAPTER PROGRESS ─────────────────────────────────────────────────────

  'ach-the-forest': {
    id: 'ach-the-forest',
    title: 'THE FOREST',
    description: 'Read the forensic summary of the Ashford clearing.',
    classification: 'CLEARANCE: LEVEL-2 GRANTED',
    isSecret: false,
  },

  'ach-the-voice': {
    id: 'ach-the-voice',
    title: 'THE VOICE',
    description: 'Witness the Friday 03:00 vocalization event.',
    classification: 'CLEARANCE: LEVEL-3 GRANTED',
    isSecret: false,
  },

  'ach-zero-hour': {
    id: 'ach-zero-hour',
    title: 'ZERO HOUR',
    description: 'Be present at the Saturday midnight event.',
    classification: 'CLEARANCE: LEVEL-4 GRANTED',
    isSecret: false,
  },

  // ── ENDINGS ───────────────────────────────────────────────────────────────

  'ach-ending-observer': {
    id: 'ach-ending-observer',
    title: 'THE OBSERVER',
    description: 'Document everything. Trust nothing.',
    classification: 'CLEARANCE: THAUMIEL — ENDING UNLOCKED',
    isSecret: false,
  },

  'ach-ending-caretaker': {
    id: 'ach-ending-caretaker',
    title: 'THE CARETAKER',
    description: 'Attempt communication at the cost of certainty.',
    classification: 'CLEARANCE: THAUMIEL — ENDING UNLOCKED',
    isSecret: false,
  },

  'ach-ending-warden': {
    id: 'ach-ending-warden',
    title: 'THE WARDEN',
    description: 'Lock it all down. The world must not know.',
    classification: 'CLEARANCE: THAUMIEL — ENDING UNLOCKED',
    isSecret: false,
  },

  'ach-all-paths': {
    id: 'ach-all-paths',
    title: 'ALL PATHS KNOWN',
    description: 'Witness all three endings across multiple playthroughs.',
    classification: 'CLEARANCE: O5 — FULL NARRATIVE UNLOCKED',
    isSecret: true,
  },

  // ── PUZZLES ───────────────────────────────────────────────────────────────

  'ach-symbol-reader': {
    id: 'ach-symbol-reader',
    title: 'SYMBOL READER',
    description: 'Decode the Ashford clearing symbol matrix without error.',
    classification: 'CLEARANCE: LEVEL-3 GRANTED — LINGUISTICS COMMENDATION',
    isSecret: false,
  },

  'ach-pattern-analyst': {
    id: 'ach-pattern-analyst',
    title: 'PATTERN ANALYST',
    description: 'Identify the structural pattern in SCP-5005\'s vocalization.',
    classification: 'CLEARANCE: LEVEL-4 GRANTED — MEMETICS ADVISORY',
    isSecret: false,
  },
};
