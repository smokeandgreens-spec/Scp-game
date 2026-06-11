// ─── VISIBLE / HIDDEN STATS ──────────────────────────────────────────────────

export interface VisibleStats {
  knowledge: number;   // 0-100
  trust: number;       // 0-100
  fear: number;        // 0-100
  authority: number;   // 0-100
}

export interface HiddenStats {
  scp5005Relationship: number;  // 0-100
  researchAccuracy: number;     // 0-100
  unknownInfluence: number;     // 0-100
}

export interface GameStats {
  visible: VisibleStats;
  hidden: HiddenStats;
}

// ─── GLOBAL FLAGS (cross-act memory) ─────────────────────────────────────────

export type FlagValue = boolean | string | number;
export type GlobalFlags = Record<string, FlagValue>;

// ─── STORY DECISIONS (recorded for cross-act reference) ──────────────────────

export type DecisionImpact =
  | 'compassionate'
  | 'aggressive'
  | 'analytical'
  | 'authoritative'
  | 'paranoid';

export interface StoryDecision {
  id: string;         // e.g. 'act1-initial-placement'
  choiceId: string;   // e.g. 'c1-medical'
  label: string;      // Human-readable: "Chose medical placement"
  impact: DecisionImpact;
  chapter: number;
  act: number;
  timestamp: string;  // ISO date
}

// ─── CHARACTER RELATIONSHIPS ──────────────────────────────────────────────────

export interface CharacterRelationship {
  characterId: string;
  trust: number;       // 0-100
  affinity: number;    // 0-100
  interactions: number;
  lastInteraction?: string; // ISO date
}

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  classification: string; // Foundation-themed flavour
  isSecret: boolean;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string; // ISO date
}

// ─── ENDING RECORDS ───────────────────────────────────────────────────────────

export type EndingId = 'observer' | 'caretaker' | 'warden';

export interface EndingRecord {
  endingId: EndingId;
  unlockedAt: string; // ISO date
  finalStats: GameStats;
}

// ─── PUZZLES ──────────────────────────────────────────────────────────────────

export type PuzzleType = 'memory-grid' | 'symbol-sequence';

export interface PuzzleReward {
  flags?: GlobalFlags;
  statEffects?: Partial<VisibleStats>;
  achievementId?: string;
  journalEntryId?: string;
}

export interface PuzzleDefinition {
  id: string;
  type: PuzzleType;
  title: string;
  flavor: string;   // In-world flavour text shown before puzzle starts
  chapter: number;
  act: number;
  timeLimitSeconds?: number;
  reward?: PuzzleReward;
}

export interface PuzzleCompletion {
  puzzleId: string;
  completedAt: string; // ISO date
  succeeded: boolean;
  attempts: number;
}

// ─── SCP DATABASE ─────────────────────────────────────────────────────────────

export type SCPClassification =
  | 'Safe'
  | 'Euclid'
  | 'Keter'
  | 'Thaumiel'
  | 'Apollyon'
  | 'Neutralized'
  | 'Pending';

export interface SCPEntry {
  id: string;
  objectNumber: string;
  classification: SCPClassification;
  containmentProcedures: string;
  description: string;
  addendum?: string;
  requiredClearance: number; // 1-5; player always has O5 (5)
  isRedacted: boolean;
}

// ─── EVENT LOG ────────────────────────────────────────────────────────────────

export interface EventLogEntry {
  id: string;
  timestamp: string;
  type: 'choice' | 'event' | 'discovery' | 'alert' | 'system';
  text: string;
  chapter?: string;
}

// ─── JOURNAL ──────────────────────────────────────────────────────────────────

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  chapter: string;
  isRedacted?: boolean;
}

// ─── CHARACTER PROFILE ────────────────────────────────────────────────────────

export interface CharacterProfile {
  id: string;
  name: string;
  designation: string;
  clearanceLevel: number;
  status: 'active' | 'kia' | 'missing' | 'amnesticized' | 'anomalous';
  description: string;
  notes: string[];
  isRedacted?: boolean;
}

// ─── STORY NODES ──────────────────────────────────────────────────────────────

export type StoryNodeType =
  | 'narrative'
  | 'choice'
  | 'consequence'
  | 'chapter-start'
  | 'ending';

export interface Choice {
  id: string;
  text: string;
  consequence: string;
  nextNodeId: string;
  statEffects?: Partial<Record<keyof VisibleStats, number>>;
  hiddenStatEffects?: Partial<Record<keyof HiddenStats, number>>;
  requiresKnowledge?: number;
  requiresTrust?: number;
  requiresFear?: number;
  requiresAuthority?: number;
  unlocksCharacter?: string;
  addsJournalEntry?: string;
  addsEventLog?: string;
  // New v2 fields
  setsFlags?: GlobalFlags;
  recordsDecision?: {
    id: string;
    label: string;
    impact: DecisionImpact;
  };
  triggersAchievement?: string;
  updatesRelationship?: {
    characterId: string;
    trustDelta: number;
    affinityDelta: number;
  };
}

export interface StoryNode {
  id: string;
  type: StoryNodeType;
  act: number;
  chapter: number;
  chapterTitle?: string;
  title?: string;
  text: string | string[];  // string[] = paragraphs typed out sequentially
  choices?: Choice[];
  autoAdvanceToNodeId?: string;
  nextNodeId?: string;
  addsJournalEntry?: string;
  metadata?: {
    date?: string;
    time?: string;
    location?: string;
    classification?: string;
  };
  endingType?: 'observer' | 'caretaker' | 'warden';
  endingCondition?: (stats: GameStats) => boolean;
  // New v2 fields
  setsFlags?: GlobalFlags;
  triggersPuzzle?: string;
  triggersAchievement?: string;
}

// ─── SAVE SLOT ────────────────────────────────────────────────────────────────

export const SAVE_VERSION = 2;

export interface SaveSlot {
  // V1 core fields
  id: number;
  name: string;
  currentNodeId: string;
  stats: GameStats;
  eventLog: EventLogEntry[];
  journal: JournalEntry[];
  characters: Record<string, CharacterProfile>;
  choiceHistory: string[];
  chapterProgress: number;
  actProgress: number;
  playtime: number;
  savedAt: string;
  isEmpty: boolean;
  // V2 fields
  version: number;
  flags: GlobalFlags;
  decisions: StoryDecision[];
  relationships: Record<string, CharacterRelationship>;
  achievements: UnlockedAchievement[];
  endingsSeen: EndingRecord[];
  completedPuzzles: PuzzleCompletion[];
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

export type GameScreen =
  | 'main-menu' | 'game' | 'load' | 'save' | 'settings'
  | 'statistics' | 'event-log' | 'journal' | 'characters' | 'endings';

export interface GameSettings {
  textSpeed: 'slow' | 'medium' | 'fast' | 'instant';
  soundEnabled: boolean;
  sfxEnabled: boolean;
  sfxVolume: number;
  musicEnabled: boolean;
  musicVolume: number;
  scanlineEffect: boolean;
  glitchEffect: boolean;
  fontSize: 'small' | 'medium' | 'large';
}
