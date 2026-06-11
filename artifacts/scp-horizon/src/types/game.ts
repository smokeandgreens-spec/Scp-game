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
  id: string;
  choiceId: string;
  label: string;
  impact: DecisionImpact;
  chapter: number;
  act: number;
  timestamp: string;
}

// ─── CHARACTER RELATIONSHIPS ──────────────────────────────────────────────────

export interface CharacterRelationship {
  characterId: string;
  trust: number;
  affinity: number;
  interactions: number;
  lastInteraction?: string;
}

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  classification: string;
  isSecret: boolean;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

// ─── ENDING RECORDS ───────────────────────────────────────────────────────────

export type EndingId = 'observer' | 'caretaker' | 'warden' | 'door-discovered';

export interface EndingRecord {
  endingId: EndingId;
  unlockedAt: string;
  finalStats: GameStats;
}

// ─── PUZZLES ──────────────────────────────────────────────────────────────────

export type PuzzleType = 'memory-grid' | 'symbol-sequence' | 'evidence-sort';

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
  flavor: string;
  chapter: number;
  act: number;
  timeLimitSeconds?: number;
  reward?: PuzzleReward;
}

export interface PuzzleCompletion {
  puzzleId: string;
  completedAt: string;
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
  requiredClearance: number;
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

export type InterviewApproach = 'compassion' | 'skepticism' | 'pressure' | 'curiosity' | 'standard';

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
  unlocksMemoryFragment?: string;
  unlocksEvidence?: string;
  addsInterviewRecord?: {
    subjectId: string;
    approach: InterviewApproach;
    keyExchanges: string[];
  };
}

export interface StoryNode {
  id: string;
  type: StoryNodeType;
  act: number;
  chapter: number;
  chapterTitle?: string;
  title?: string;
  text: string | string[];
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
  endingType?: EndingId;
  endingCondition?: (stats: GameStats) => boolean;
  setsFlags?: GlobalFlags;
  triggersPuzzle?: string;
  triggersAchievement?: string;
  unlocksMemoryFragment?: string;
  unlocksEvidence?: string;
}

// ─── SAVE SLOT ────────────────────────────────────────────────────────────────

export const SAVE_VERSION = 3;

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
  // V3 fields (Act 2 systems)
  memoryFragmentsUnlocked: string[];
  reconstructionAttempts: MemoryReconstructionAttempt[];
  researchAllocations: Partial<Record<ResearchBranchId, number>>;
  researchAuthorized: boolean;
  qfacDevelopment: QFACDevelopment;
  theories: PlayerTheory[];
  evidenceUnlocked: string[];
  interviewRecords: InterviewRecord[];
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

// ─── MEMORY RECONSTRUCTION (Act 2) ───────────────────────────────────────────

export type MemoryFragmentType = 'audio' | 'symbol' | 'drawing' | 'memory' | 'transcript';

export interface MemoryFragment {
  id: string;
  type: MemoryFragmentType;
  title: string;
  content: string;
  chapter: number;
  act: number;
  unlockFlag?: string;
}

export interface MemoryReconstructionAttempt {
  id: string;
  conclusion: string;
  conclusionType: 'accurate' | 'partial' | 'inaccurate';
  fragmentsExamined: string[];
  completedAt: string;
}

// ─── RESEARCH SYSTEM (Act 2) ─────────────────────────────────────────────────

export type ResearchBranchId = 'linguistics' | 'ai-analysis' | 'occult' | 'temporal';

export interface ResearchTier {
  threshold: number;
  title: string;
  revelation: string;
  setsFlag?: string;
}

export interface ResearchBranch {
  id: ResearchBranchId;
  title: string;
  description: string;
  color: string;
  tiers: ResearchTier[];
}

// ─── QFAC DEVELOPMENT (Act 2) ────────────────────────────────────────────────

export type QFACPhilosophy = 'conservative' | 'experimental' | 'autonomous';

export interface QFACDevelopment {
  philosophy?: QFACPhilosophy;
  stage: number;
  unlockedCapabilities: string[];
}

// ─── EVIDENCE & THEORIES (Act 2) ─────────────────────────────────────────────

export type EvidenceType = 'physical' | 'data' | 'testimony' | 'anomalous' | 'classified';
export type TheoryStatus = 'active' | 'confirmed' | 'disproved' | 'superseded';

export interface EvidenceItem {
  id: string;
  title: string;
  content: string;
  type: EvidenceType;
  chapter: number;
  act: number;
  unlockFlag?: string;
}

export interface PlayerTheory {
  id: string;
  title: string;
  description: string;
  status: TheoryStatus;
  evidenceIds: string[];
  createdAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

// ─── INTERVIEW RECORDS (Act 2) ───────────────────────────────────────────────

export interface InterviewRecord {
  id: string;
  subjectId: string;
  chapter: number;
  act: number;
  approach: InterviewApproach;
  keyExchanges: string[];
  conductedAt: string;
}
