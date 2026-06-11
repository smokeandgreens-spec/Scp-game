import { create } from 'zustand';
import {
  GameStats, EventLogEntry, JournalEntry, CharacterProfile, Choice,
  GameSettings, SaveSlot, VisibleStats, HiddenStats,
  GlobalFlags, FlagValue, StoryDecision, CharacterRelationship,
  UnlockedAchievement, EndingRecord, PuzzleCompletion, SAVE_VERSION,
} from '../types/game';
import { STARTING_NODE_ID, INITIAL_STATS, JOURNAL_ENTRIES, CHARACTERS, STORY_NODES } from '../data/storyNodes';

interface GameStore {
  // ── Core game state ────────────────────────────────────────────────────────
  currentNodeId: string;
  stats: GameStats;
  eventLog: EventLogEntry[];
  journal: JournalEntry[];
  characters: Record<string, CharacterProfile>;
  choiceHistory: string[];
  settings: GameSettings;
  currentSaveSlot: number;
  isGameActive: boolean;

  // ── V2 systems ─────────────────────────────────────────────────────────────
  flags: GlobalFlags;
  decisions: StoryDecision[];
  relationships: Record<string, CharacterRelationship>;
  achievements: UnlockedAchievement[];
  endingsSeen: EndingRecord[];
  completedPuzzles: PuzzleCompletion[];

  // ── Core actions ───────────────────────────────────────────────────────────
  newGame: (slotId: number) => void;
  makeChoice: (choice: Choice) => void;
  advanceNarrative: (nextNodeId: string) => void;
  saveGame: (slotId: number) => void;
  loadGame: (slotId: number) => void;
  getSaveSlots: () => SaveSlot[];
  deleteSave: (slotId: number) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  applyStatEffects: (effects: Partial<VisibleStats>, hiddenEffects?: Partial<HiddenStats>) => void;
  addEventLog: (entry: Omit<EventLogEntry, 'id' | 'timestamp'>) => void;
  addJournalEntry: (entryId: string) => void;
  unlockCharacter: (id: string) => void;

  // ── V2 actions ─────────────────────────────────────────────────────────────
  setFlag: (key: string, value: FlagValue) => void;
  setFlags: (flags: GlobalFlags) => void;
  getFlag: (key: string) => FlagValue | undefined;
  unlockAchievement: (id: string) => void;
  recordEnding: (record: EndingRecord) => void;
  completePuzzle: (puzzleId: string, succeeded: boolean) => void;
  isPuzzleCompleted: (puzzleId: string) => boolean;
  updateRelationship: (characterId: string, trustDelta: number, affinityDelta: number) => void;
}

// ── Save migration ─────────────────────────────────────────────────────────────

function migrateSave(raw: unknown): SaveSlot {
  const base = raw as Partial<SaveSlot>;
  return {
    id: base.id ?? 1,
    name: base.name ?? 'Save',
    currentNodeId: base.currentNodeId ?? STARTING_NODE_ID,
    stats: base.stats ?? INITIAL_STATS,
    eventLog: base.eventLog ?? [],
    journal: base.journal ?? [],
    characters: base.characters ?? {},
    choiceHistory: base.choiceHistory ?? [],
    chapterProgress: base.chapterProgress ?? 0,
    actProgress: base.actProgress ?? 0,
    playtime: base.playtime ?? 0,
    savedAt: base.savedAt ?? '',
    isEmpty: base.isEmpty ?? false,
    // V2 fields (default to empty if migrating from v1)
    version: SAVE_VERSION,
    flags: base.flags ?? {},
    decisions: base.decisions ?? [],
    relationships: base.relationships ?? {},
    achievements: base.achievements ?? [],
    endingsSeen: base.endingsSeen ?? [],
    completedPuzzles: base.completedPuzzles ?? [],
  };
}

// ── Constants ──────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: GameSettings = {
  textSpeed: 'medium',
  soundEnabled: true,
  sfxEnabled: true,
  sfxVolume: 70,
  musicEnabled: true,
  musicVolume: 40,
  scanlineEffect: true,
  glitchEffect: true,
  fontSize: 'medium',
};

const EMPTY_V2_STATE = {
  flags: {} as GlobalFlags,
  decisions: [] as StoryDecision[],
  relationships: {} as Record<string, CharacterRelationship>,
  achievements: [] as UnlockedAchievement[],
  endingsSeen: [] as EndingRecord[],
  completedPuzzles: [] as PuzzleCompletion[],
};

const getSavedSettings = (): GameSettings => {
  const s = localStorage.getItem('scp-horizon-settings');
  return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : DEFAULT_SETTINGS;
};

// ── Store ──────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>((set, get) => ({
  currentNodeId: STARTING_NODE_ID,
  stats: INITIAL_STATS,
  eventLog: [],
  journal: [],
  characters: {},
  choiceHistory: [],
  settings: getSavedSettings(),
  currentSaveSlot: 1,
  isGameActive: false,
  ...EMPTY_V2_STATE,

  // ─────────────────────────────────────────────────────── Core actions ──────

  newGame: (slotId) => {
    set({
      currentNodeId: STARTING_NODE_ID,
      stats: INITIAL_STATS,
      eventLog: [],
      journal: [],
      characters: {},
      choiceHistory: [],
      currentSaveSlot: slotId,
      isGameActive: true,
      ...EMPTY_V2_STATE,
    });
    get().saveGame(slotId);
  },

  makeChoice: (choice) => {
    set((state) => {
      // Stat effects
      const newStats = { ...state.stats, visible: { ...state.stats.visible }, hidden: { ...state.stats.hidden } };
      if (choice.statEffects) {
        (Object.keys(choice.statEffects) as Array<keyof VisibleStats>).forEach((k) => {
          newStats.visible[k] = Math.max(0, Math.min(100, newStats.visible[k] + (choice.statEffects![k] || 0)));
        });
      }
      if (choice.hiddenStatEffects) {
        (Object.keys(choice.hiddenStatEffects) as Array<keyof HiddenStats>).forEach((k) => {
          newStats.hidden[k] = Math.max(0, Math.min(100, newStats.hidden[k] + (choice.hiddenStatEffects![k] || 0)));
        });
      }

      // Event log
      const newLog = [...state.eventLog];
      if (choice.addsEventLog) {
        newLog.push({ id: Date.now().toString(), timestamp: new Date().toISOString(), type: 'choice', text: choice.addsEventLog });
      }

      // Journal
      const newJournal = [...state.journal];
      if (choice.addsJournalEntry && JOURNAL_ENTRIES[choice.addsJournalEntry] && !newJournal.find(j => j.id === choice.addsJournalEntry)) {
        newJournal.push(JOURNAL_ENTRIES[choice.addsJournalEntry]);
      }

      // Characters
      const newCharacters = { ...state.characters };
      if (choice.unlocksCharacter && CHARACTERS[choice.unlocksCharacter]) {
        newCharacters[choice.unlocksCharacter] = CHARACTERS[choice.unlocksCharacter];
      }

      // FLAGS (v2)
      const newFlags = choice.setsFlags ? { ...state.flags, ...choice.setsFlags } : state.flags;

      // DECISIONS (v2)
      const newDecisions = [...state.decisions];
      if (choice.recordsDecision) {
        const currentNode = STORY_NODES[state.currentNodeId];
        newDecisions.push({
          ...choice.recordsDecision,
          choiceId: choice.id,
          chapter: currentNode?.chapter ?? 0,
          act: currentNode?.act ?? 1,
          timestamp: new Date().toISOString(),
        });
      }

      // RELATIONSHIPS (v2)
      const newRelationships = { ...state.relationships };
      if (choice.updatesRelationship) {
        const { characterId, trustDelta, affinityDelta } = choice.updatesRelationship;
        const existing = newRelationships[characterId] ?? { characterId, trust: 50, affinity: 50, interactions: 0 };
        newRelationships[characterId] = {
          ...existing,
          trust: Math.max(0, Math.min(100, existing.trust + trustDelta)),
          affinity: Math.max(0, Math.min(100, existing.affinity + affinityDelta)),
          interactions: existing.interactions + 1,
          lastInteraction: new Date().toISOString(),
        };
      }

      // ACHIEVEMENTS (v2)
      const newAchievements = [...state.achievements];
      if (choice.triggersAchievement && !newAchievements.find(a => a.id === choice.triggersAchievement)) {
        newAchievements.push({ id: choice.triggersAchievement, unlockedAt: new Date().toISOString() });
      }
      // First-directive meta-achievement
      if (state.choiceHistory.length === 0 && !newAchievements.find(a => a.id === 'ach-first-directive')) {
        newAchievements.push({ id: 'ach-first-directive', unlockedAt: new Date().toISOString() });
      }

      return {
        stats: newStats,
        currentNodeId: choice.nextNodeId,
        choiceHistory: [...state.choiceHistory, choice.id],
        eventLog: newLog,
        journal: newJournal,
        characters: newCharacters,
        flags: newFlags,
        decisions: newDecisions,
        relationships: newRelationships,
        achievements: newAchievements,
      };
    });
    get().saveGame(get().currentSaveSlot);
  },

  advanceNarrative: (nextNodeId) => {
    const nextNode = STORY_NODES[nextNodeId];
    set((state) => {
      const updates: Partial<typeof state> = { currentNodeId: nextNodeId };

      // Apply node-level flags
      if (nextNode?.setsFlags) {
        updates.flags = { ...state.flags, ...nextNode.setsFlags };
      }

      // Apply node-level journal entry
      if (nextNode?.addsJournalEntry && JOURNAL_ENTRIES[nextNode.addsJournalEntry] && !state.journal.find(j => j.id === nextNode.addsJournalEntry)) {
        updates.journal = [...state.journal, JOURNAL_ENTRIES[nextNode.addsJournalEntry]];
      }

      // Apply node-level achievement
      const newAchievements = [...state.achievements];
      let achievementsChanged = false;
      if (nextNode?.triggersAchievement && !newAchievements.find(a => a.id === nextNode.triggersAchievement)) {
        newAchievements.push({ id: nextNode.triggersAchievement!, unlockedAt: new Date().toISOString() });
        achievementsChanged = true;
      }
      // Chapter progress achievements
      const chapterAchievements: Record<number, string> = {
        3: 'ach-the-forest',
        4: 'ach-the-voice',
        5: 'ach-zero-hour',
      };
      const chapter = nextNode?.chapter;
      if (chapter && chapterAchievements[chapter] && !newAchievements.find(a => a.id === chapterAchievements[chapter])) {
        newAchievements.push({ id: chapterAchievements[chapter], unlockedAt: new Date().toISOString() });
        achievementsChanged = true;
      }
      if (achievementsChanged) updates.achievements = newAchievements;

      return updates;
    });
    get().saveGame(get().currentSaveSlot);
  },

  saveGame: (slotId) => {
    const state = get();
    const currentNode = STORY_NODES[state.currentNodeId];
    const save: SaveSlot = {
      id: slotId,
      name: 'Save ' + slotId,
      currentNodeId: state.currentNodeId,
      stats: state.stats,
      eventLog: state.eventLog,
      journal: state.journal,
      characters: state.characters,
      choiceHistory: state.choiceHistory,
      chapterProgress: currentNode?.chapter ?? 0,
      actProgress: currentNode?.act ?? 1,
      playtime: 0,
      savedAt: new Date().toISOString(),
      isEmpty: false,
      version: SAVE_VERSION,
      flags: state.flags,
      decisions: state.decisions,
      relationships: state.relationships,
      achievements: state.achievements,
      endingsSeen: state.endingsSeen,
      completedPuzzles: state.completedPuzzles,
    };
    localStorage.setItem('scp-horizon-save-' + slotId, JSON.stringify(save));
  },

  loadGame: (slotId) => {
    const s = localStorage.getItem('scp-horizon-save-' + slotId);
    if (s) {
      const save = migrateSave(JSON.parse(s));
      set({
        currentNodeId: save.currentNodeId,
        stats: save.stats,
        eventLog: save.eventLog,
        journal: save.journal,
        characters: save.characters,
        choiceHistory: save.choiceHistory,
        currentSaveSlot: slotId,
        isGameActive: true,
        flags: save.flags,
        decisions: save.decisions,
        relationships: save.relationships,
        achievements: save.achievements,
        endingsSeen: save.endingsSeen,
        completedPuzzles: save.completedPuzzles,
      });
    }
  },

  getSaveSlots: () => {
    const slots: SaveSlot[] = [];
    for (let i = 1; i <= 5; i++) {
      const s = localStorage.getItem('scp-horizon-save-' + i);
      if (s) {
        slots.push(migrateSave(JSON.parse(s)));
      } else {
        slots.push({
          id: i, name: 'Save ' + i, currentNodeId: '', stats: INITIAL_STATS,
          eventLog: [], journal: [], characters: {}, choiceHistory: [],
          chapterProgress: 0, actProgress: 0, playtime: 0, savedAt: '', isEmpty: true,
          version: SAVE_VERSION, ...EMPTY_V2_STATE,
        });
      }
    }
    return slots;
  },

  deleteSave: (slotId) => {
    localStorage.removeItem('scp-horizon-save-' + slotId);
  },

  updateSettings: (newSettings) => {
    set((state) => {
      const settings = { ...state.settings, ...newSettings };
      localStorage.setItem('scp-horizon-settings', JSON.stringify(settings));
      return { settings };
    });
  },

  applyStatEffects: (effects, hiddenEffects) => {
    set((state) => {
      const newStats = { ...state.stats, visible: { ...state.stats.visible }, hidden: { ...state.stats.hidden } };
      (Object.keys(effects) as Array<keyof VisibleStats>).forEach((k) => {
        newStats.visible[k] = Math.max(0, Math.min(100, newStats.visible[k] + (effects[k] || 0)));
      });
      if (hiddenEffects) {
        (Object.keys(hiddenEffects) as Array<keyof HiddenStats>).forEach((k) => {
          newStats.hidden[k] = Math.max(0, Math.min(100, newStats.hidden[k] + (hiddenEffects[k] || 0)));
        });
      }
      return { stats: newStats };
    });
  },

  addEventLog: (entry) => {
    set((state) => ({
      eventLog: [...state.eventLog, { ...entry, id: Date.now().toString(), timestamp: new Date().toISOString() }],
    }));
  },

  addJournalEntry: (entryId) => {
    if (JOURNAL_ENTRIES[entryId]) {
      set((state) => ({
        journal: state.journal.find(j => j.id === entryId) ? state.journal : [...state.journal, JOURNAL_ENTRIES[entryId]],
      }));
    }
  },

  unlockCharacter: (id) => {
    if (CHARACTERS[id]) {
      set((state) => ({
        characters: { ...state.characters, [id]: CHARACTERS[id] },
      }));
    }
  },

  // ─────────────────────────────────────────────────────────── V2 actions ────

  setFlag: (key, value) => {
    set((state) => ({ flags: { ...state.flags, [key]: value } }));
  },

  setFlags: (flags) => {
    set((state) => ({ flags: { ...state.flags, ...flags } }));
  },

  getFlag: (key) => {
    return get().flags[key];
  },

  unlockAchievement: (id) => {
    set((state) => {
      if (state.achievements.find(a => a.id === id)) return {};
      return { achievements: [...state.achievements, { id, unlockedAt: new Date().toISOString() }] };
    });
  },

  recordEnding: (record) => {
    set((state) => {
      if (state.endingsSeen.find(e => e.endingId === record.endingId)) return {};
      const newEndings = [...state.endingsSeen, record];
      const endingAchMap: Record<string, string> = {
        observer: 'ach-ending-observer',
        caretaker: 'ach-ending-caretaker',
        warden: 'ach-ending-warden',
      };
      const newAchievements = [...state.achievements];
      const achId = endingAchMap[record.endingId];
      if (achId && !newAchievements.find(a => a.id === achId)) {
        newAchievements.push({ id: achId, unlockedAt: new Date().toISOString() });
      }
      if (newEndings.length >= 3 && !newAchievements.find(a => a.id === 'ach-all-paths')) {
        newAchievements.push({ id: 'ach-all-paths', unlockedAt: new Date().toISOString() });
      }
      return { endingsSeen: newEndings, achievements: newAchievements };
    });
  },

  completePuzzle: (puzzleId, succeeded) => {
    set((state) => {
      const existing = state.completedPuzzles.find(p => p.puzzleId === puzzleId);
      if (existing) {
        return {
          completedPuzzles: state.completedPuzzles.map(p =>
            p.puzzleId === puzzleId
              ? { ...p, attempts: p.attempts + 1, succeeded: p.succeeded || succeeded }
              : p
          ),
        };
      }
      return {
        completedPuzzles: [...state.completedPuzzles, {
          puzzleId,
          completedAt: new Date().toISOString(),
          succeeded,
          attempts: 1,
        }],
      };
    });
  },

  isPuzzleCompleted: (puzzleId) => {
    return get().completedPuzzles.some(p => p.puzzleId === puzzleId);
  },

  updateRelationship: (characterId, trustDelta, affinityDelta) => {
    set((state) => {
      const existing = state.relationships[characterId] ?? { characterId, trust: 50, affinity: 50, interactions: 0 };
      return {
        relationships: {
          ...state.relationships,
          [characterId]: {
            ...existing,
            trust: Math.max(0, Math.min(100, existing.trust + trustDelta)),
            affinity: Math.max(0, Math.min(100, existing.affinity + affinityDelta)),
            interactions: existing.interactions + 1,
            lastInteraction: new Date().toISOString(),
          },
        },
      };
    });
  },
}));
