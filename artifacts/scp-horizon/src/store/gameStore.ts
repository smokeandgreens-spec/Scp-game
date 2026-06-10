import { create } from 'zustand';
import { 
  GameStats, EventLogEntry, JournalEntry, CharacterProfile, Choice, 
  GameSettings, SaveSlot, VisibleStats, HiddenStats 
} from '../types/game';
import { STARTING_NODE_ID, INITIAL_STATS, JOURNAL_ENTRIES, CHARACTERS } from '../data/storyNodes';

interface GameStore {
  currentNodeId: string;
  stats: GameStats;
  eventLog: EventLogEntry[];
  journal: JournalEntry[];
  characters: Record<string, CharacterProfile>;
  choiceHistory: string[];
  settings: GameSettings;
  currentSaveSlot: number;
  isGameActive: boolean;

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
}

const DEFAULT_SETTINGS: GameSettings = {
  textSpeed: 'medium',
  soundEnabled: true,
  scanlineEffect: true,
  glitchEffect: true,
  fontSize: 'medium',
};

const getSavedSettings = (): GameSettings => {
  const s = localStorage.getItem('scp-horizon-settings');
  return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : DEFAULT_SETTINGS;
};

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
    });
    get().saveGame(slotId);
  },

  makeChoice: (choice) => {
    set((state) => {
      const newStats = { ...state.stats };
      if (choice.statEffects) {
        (Object.keys(choice.statEffects) as Array<keyof VisibleStats>).forEach((k) => {
          newStats.visible[k] += choice.statEffects![k] || 0;
        });
      }
      if (choice.hiddenStatEffects) {
        (Object.keys(choice.hiddenStatEffects) as Array<keyof HiddenStats>).forEach((k) => {
          newStats.hidden[k] += choice.hiddenStatEffects![k] || 0;
        });
      }

      const newLog = [...state.eventLog];
      if (choice.addsEventLog) {
        newLog.push({
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type: 'choice',
          text: choice.addsEventLog
        });
      }

      const newJournal = [...state.journal];
      if (choice.addsJournalEntry && JOURNAL_ENTRIES[choice.addsJournalEntry] && !newJournal.find(j => j.id === choice.addsJournalEntry)) {
        newJournal.push(JOURNAL_ENTRIES[choice.addsJournalEntry]);
      }

      const newCharacters = { ...state.characters };
      if (choice.unlocksCharacter && CHARACTERS[choice.unlocksCharacter]) {
        newCharacters[choice.unlocksCharacter] = CHARACTERS[choice.unlocksCharacter];
      }

      return {
        stats: newStats,
        currentNodeId: choice.nextNodeId,
        choiceHistory: [...state.choiceHistory, choice.id],
        eventLog: newLog,
        journal: newJournal,
        characters: newCharacters,
      };
    });
    get().saveGame(get().currentSaveSlot);
  },

  advanceNarrative: (nextNodeId) => {
    set({ currentNodeId: nextNodeId });
    get().saveGame(get().currentSaveSlot);
  },

  saveGame: (slotId) => {
    const state = get();
    const save: SaveSlot = {
      id: slotId,
      name: `Save ${slotId}`,
      currentNodeId: state.currentNodeId,
      stats: state.stats,
      eventLog: state.eventLog,
      journal: state.journal,
      characters: state.characters,
      choiceHistory: state.choiceHistory,
      chapterProgress: 1,
      actProgress: 1,
      playtime: 0,
      savedAt: new Date().toISOString(),
      isEmpty: false,
    };
    localStorage.setItem(`scp-horizon-save-${slotId}`, JSON.stringify(save));
  },

  loadGame: (slotId) => {
    const s = localStorage.getItem(`scp-horizon-save-${slotId}`);
    if (s) {
      const save: SaveSlot = JSON.parse(s);
      set({
        currentNodeId: save.currentNodeId,
        stats: save.stats,
        eventLog: save.eventLog,
        journal: save.journal,
        characters: save.characters,
        choiceHistory: save.choiceHistory,
        currentSaveSlot: slotId,
        isGameActive: true,
      });
    }
  },

  getSaveSlots: () => {
    const slots: SaveSlot[] = [];
    for (let i = 1; i <= 5; i++) {
      const s = localStorage.getItem(`scp-horizon-save-${i}`);
      if (s) {
        slots.push(JSON.parse(s));
      } else {
        slots.push({
          id: i,
          name: `Save ${i}`,
          currentNodeId: '',
          stats: INITIAL_STATS,
          eventLog: [],
          journal: [],
          characters: {},
          choiceHistory: [],
          chapterProgress: 0,
          actProgress: 0,
          playtime: 0,
          savedAt: '',
          isEmpty: true,
        });
      }
    }
    return slots;
  },

  deleteSave: (slotId) => {
    localStorage.removeItem(`scp-horizon-save-${slotId}`);
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
      const newStats = { ...state.stats };
      (Object.keys(effects) as Array<keyof VisibleStats>).forEach((k) => {
        newStats.visible[k] += effects[k] || 0;
      });
      if (hiddenEffects) {
        (Object.keys(hiddenEffects) as Array<keyof HiddenStats>).forEach((k) => {
          newStats.hidden[k] += hiddenEffects[k] || 0;
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
        journal: state.journal.find((j) => j.id === entryId) ? state.journal : [...state.journal, JOURNAL_ENTRIES[entryId]],
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
}));