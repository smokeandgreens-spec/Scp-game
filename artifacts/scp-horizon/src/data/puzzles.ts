import { PuzzleDefinition } from '../types/game';

export const PUZZLE_DEFS: Record<string, PuzzleDefinition> = {

  'puzzle-forest-symbols': {
    id: 'puzzle-forest-symbols',
    type: 'memory-grid',
    title: 'SYMBOL MATRIX ANALYSIS',
    flavor: 'Fourteen symbols were carved into the trees of Ashford clearing. The linguist says they look "unfinished." Your cryptanalysis team has isolated eight recurring glyphs. They need to be cross-referenced and paired before the pattern can be assessed.\n\nMatch each glyph with its mirror counterpart. You have 90 seconds.\n\nSkipping this analysis will forfeit the pattern data.',
    chapter: 3,
    act: 1,
    timeLimitSeconds: 90,
    reward: {
      flags: { act1_symbols_decoded: true },
      statEffects: { knowledge: 8 },
      achievementId: 'ach-symbol-reader',
    },
  },

  'puzzle-voice-sequence': {
    id: 'puzzle-voice-sequence',
    type: 'symbol-sequence',
    title: 'VOCALIZATION PATTERN ANALYSIS',
    flavor: 'SCP-5005\'s 4-minute, 7-second vocalization has been broken into repeating phonemic clusters. The memetics team has identified a structural sequence that recurs throughout the audio — the same pattern, in the same order, seventeen times.\n\nIdentify the sequence. Three trials of increasing length. Failure resets the current trial only.\n\nSkipping this analysis will forfeit the memetic pattern data.',
    chapter: 4,
    act: 1,
    reward: {
      flags: { act1_voice_pattern_analyzed: true },
      statEffects: { knowledge: 10 },
      achievementId: 'ach-pattern-analyst',
    },
  },

};

// The glyphs used across puzzles — Foundation-themed unicode symbols
export const PUZZLE_SYMBOLS = ['△', '▽', '○', '□', '◇', '✦', '⬡', '⬟'];
export const SEQUENCE_SYMBOLS = ['△', '▽', '○', '□', '◇', '✦'];
