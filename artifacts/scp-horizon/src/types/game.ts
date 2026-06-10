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

export interface EventLogEntry {
  id: string;
  timestamp: string;
  type: 'choice' | 'event' | 'discovery' | 'alert' | 'system';
  text: string;
  chapter?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  chapter: string;
  isRedacted?: boolean;
}

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

export type StoryNodeType = 'narrative' | 'choice' | 'consequence' | 'chapter-start' | 'ending';

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
  autoAdvanceToNodeId?: string; // for consequence nodes
  nextNodeId?: string;
  addsJournalEntry?: string; // automatically added when node is reached
  metadata?: {
    date?: string;
    time?: string;
    location?: string;
    classification?: string;
  };
  endingType?: 'observer' | 'caretaker' | 'warden';
  endingCondition?: (stats: GameStats) => boolean;
}

export interface SaveSlot {
  id: number;  // 1-5
  name: string;
  currentNodeId: string;
  stats: GameStats;
  eventLog: EventLogEntry[];
  journal: JournalEntry[];
  characters: Record<string, CharacterProfile>;
  choiceHistory: string[]; // choice IDs made
  chapterProgress: number;
  actProgress: number;
  playtime: number; // seconds
  savedAt: string; // ISO date
  isEmpty: boolean;
}

export type GameScreen = 'main-menu' | 'game' | 'load' | 'save' | 'settings' | 'statistics' | 'event-log' | 'journal' | 'characters' | 'endings';

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