import { AchievementDefinition } from '../types/game';

export const ACT2_ACHIEVEMENT_DEFS: Record<string, AchievementDefinition> = {

  // ── ACT 2 CHAPTER MILESTONES ──────────────────────────────────────────────

  'ach-act2-begins': {
    id: 'ach-act2-begins',
    title: 'AFTER MIDNIGHT',
    description: 'Begin Act II. The girl is gone. Face what she became.',
    classification: 'CLEARANCE: THAUMIEL GRANTED — ACT II UNLOCKED',
    isSecret: false,
  },

  'ach-act2-ch2': {
    id: 'ach-act2-ch2',
    title: 'THE LANGUAGE',
    description: 'Begin the investigation into the unknown language.',
    classification: 'CLEARANCE: LEVEL-3 GRANTED',
    isSecret: false,
  },

  'ach-act2-ch3': {
    id: 'ach-act2-ch3',
    title: 'FRAGMENTS',
    description: 'Witness SCP-5005 begin to draw its memories.',
    classification: 'CLEARANCE: LEVEL-3 GRANTED',
    isSecret: false,
  },

  'ach-act2-ch4': {
    id: 'ach-act2-ch4',
    title: 'THE WITNESS',
    description: 'Conduct the first major interview with SCP-5005.',
    classification: 'CLEARANCE: LEVEL-4 GRANTED',
    isSecret: false,
  },

  'ach-act2-ch5': {
    id: 'ach-act2-ch5',
    title: 'FIRST LIGHT',
    description: 'Authorize the development of Project First Light.',
    classification: 'CLEARANCE: LEVEL-4 GRANTED',
    isSecret: false,
  },

  'ach-act2-ch6': {
    id: 'ach-act2-ch6',
    title: 'THE FOREST REVISITED',
    description: 'Return to the Ashford clearing and find it changed.',
    classification: 'CLEARANCE: LEVEL-4 GRANTED',
    isSecret: false,
  },

  'ach-act2-ch7': {
    id: 'ach-act2-ch7',
    title: 'REALITY 41',
    description: 'Receive Project First Light\'s confirmation of Reality 41.',
    classification: 'CLEARANCE: THAUMIEL — REALITY RECORD UPDATED',
    isSecret: false,
  },

  'ach-act2-ch8': {
    id: 'ach-act2-ch8',
    title: 'THE LAST INTERVIEW',
    description: 'Conduct the final interview with SCP-5005.',
    classification: 'CLEARANCE: THAUMIEL — TESTIMONY RECORD SEALED',
    isSecret: false,
  },

  'ach-act2-complete': {
    id: 'ach-act2-complete',
    title: 'DOOR-01',
    description: 'Complete Act II. Witness the designation of DOOR-01.',
    classification: 'CLEARANCE: O5 — ACT II COMPLETE',
    isSecret: false,
  },

  // ── KEY MOMENTS ───────────────────────────────────────────────────────────

  'ach-world-died': {
    id: 'ach-world-died',
    title: 'I WATCHED A WORLD DIE',
    description: 'Hear SCP-5005 speak those exact words.',
    classification: 'CLEARANCE: THAUMIEL — WITNESS STATEMENT RECORDED',
    isSecret: false,
  },

  'ach-reality41-confirmed': {
    id: 'ach-reality41-confirmed',
    title: 'CONFIRMED GONE',
    description: 'Receive Project First Light\'s confirmation that Reality 41 no longer exists.',
    classification: 'CLEARANCE: THAUMIEL — REALITY DELETION CONFIRMED',
    isSecret: false,
  },

  'ach-door01-first-sight': {
    id: 'ach-door01-first-sight',
    title: 'SOMETHING ELSE PUT IT THERE',
    description: 'Discover the DOOR-01 symbol in the Ashford clearing.',
    classification: 'CLEARANCE: THAUMIEL — NEW ANOMALY IDENTIFIED',
    isSecret: false,
  },

  'ach-i-believe-you': {
    id: 'ach-i-believe-you',
    title: 'I BELIEVE YOU',
    description: 'Tell SCP-5005 directly that you believe its testimony.',
    classification: 'CLEARANCE: THAUMIEL — TRUST RECORD UPDATED',
    isSecret: false,
  },

  // ── RESEARCH & QFAC ──────────────────────────────────────────────────────

  'ach-breadth-of-inquiry': {
    id: 'ach-breadth-of-inquiry',
    title: 'BREADTH OF INQUIRY',
    description: 'Deploy all four research branches simultaneously on the language investigation.',
    classification: 'CLEARANCE: LEVEL-4 GRANTED — RESEARCH COMMENDATION',
    isSecret: false,
  },

  'ach-measured-approach': {
    id: 'ach-measured-approach',
    title: 'MEASURED APPROACH',
    description: 'Initialize First Light with conservative parameters.',
    classification: 'CLEARANCE: LEVEL-4 GRANTED',
    isSecret: false,
  },

  'ach-push-the-boundary': {
    id: 'ach-push-the-boundary',
    title: 'PUSH THE BOUNDARY',
    description: 'Initialize First Light with experimental parameters.',
    classification: 'CLEARANCE: LEVEL-4 GRANTED — RESEARCH RISK NOTE FILED',
    isSecret: false,
  },

  'ach-let-it-think': {
    id: 'ach-let-it-think',
    title: 'LET IT THINK',
    description: 'Initialize First Light with autonomous parameters.',
    classification: 'CLEARANCE: O5 — AUTONOMOUS AI ADVISORY FILED',
    isSecret: true,
  },

  // ── INTERVIEW APPROACH ACHIEVEMENTS ──────────────────────────────────────

  'ach-gentle-inquiry': {
    id: 'ach-gentle-inquiry',
    title: 'GENTLE INQUIRY',
    description: 'Approach the final interview with compassion rather than procedure.',
    classification: 'CLEARANCE: THAUMIEL — ETHICS COMMITTEE NOTE: POSITIVE',
    isSecret: false,
  },

  'ach-prepare-for-the-worst': {
    id: 'ach-prepare-for-the-worst',
    title: 'PREPARE FOR THE WORST',
    description: 'Begin defensive planning immediately upon Reality 41 confirmation.',
    classification: 'CLEARANCE: THAUMIEL — EMERGENCY PROTOCOLS ACTIVATED',
    isSecret: false,
  },

  // ── SECRET ACHIEVEMENTS ───────────────────────────────────────────────────

  'ach-act2-all-paths': {
    id: 'ach-act2-all-paths',
    title: 'ALL APPROACHES',
    description: 'See the final interview through all four approaches across multiple playthroughs.',
    classification: 'CLEARANCE: O5 — FULL ACT II NARRATIVE UNLOCKED',
    isSecret: true,
  },

};
