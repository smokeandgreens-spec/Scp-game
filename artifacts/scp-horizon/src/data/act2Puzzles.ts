import { PuzzleDefinition } from '../types/game';

export const ACT2_PUZZLE_DEFS: Record<string, PuzzleDefinition> = {

  'puzzle-act2-fragments': {
    id: 'puzzle-act2-fragments',
    type: 'memory-grid',
    title: 'FRAGMENT CROSS-REFERENCE ANALYSIS',
    flavor: 'SCP-5005 has produced 47 distinct images on its cell walls. Your analysis team has isolated eight recurring visual elements that appear across multiple drawings — architectural motifs, geographic features, symbolic shapes.\n\nThese elements appear in pairs: each motif has a corresponding form in a different drawing. Cross-referencing the pairs will allow the AI to begin building a geographic model of Reality 41.\n\nMatch each visual element with its paired counterpart. You have 90 seconds.\n\nForfeiting this analysis will delay geographic reconstruction by an estimated four months.',
    chapter: 3,
    act: 2,
    timeLimitSeconds: 90,
    reward: {
      flags: { act2_fragment_pairs_mapped: true },
      statEffects: { knowledge: 10 },
      achievementId: 'ach-act2-ch3',
      journalEntryId: 'j-cell-drawings',
    },
  },

  'puzzle-act2-reality': {
    id: 'puzzle-act2-reality',
    type: 'symbol-sequence',
    title: 'REALITY 41 CONFIRMATION SEQUENCE',
    flavor: 'Project First Light has identified a structural pattern in SCP-5005\'s language that encodes the coordinates of its origin reality. The pattern repeats in the same form across every major SCP-5005 communication — a kind of signature.\n\nVerify the pattern. Three trials. Confirming it will allow First Light to formally lock the Reality 41 designation.\n\nThis is not a test of speed. This is a test of attention.\n\nForfeiting will delay Reality 41 confirmation.',
    chapter: 7,
    act: 2,
    reward: {
      flags: { act2_reality41_pattern_confirmed: true },
      statEffects: { knowledge: 12 },
      achievementId: 'ach-reality41-confirmed',
    },
  },

};
