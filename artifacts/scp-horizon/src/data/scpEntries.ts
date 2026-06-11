import { SCPEntry } from '../types/game';

export const SCP_ENTRIES: Record<string, SCPEntry> = {

  'scp-5005-provisional': {
    id: 'scp-5005-provisional',
    objectNumber: 'SCP-5005-Θ (PROVISIONAL)',
    classification: 'Pending',
    requiredClearance: 1,
    isRedacted: false,
    containmentProcedures: 'SCP-5005-Θ is currently contained in Cell 19-A7 at Site-19 under provisional protocols. Standard Class-4 containment measures are in effect pending full classification. No personnel are to enter the containment chamber without O5 written authorization. All interactions must be logged in real-time.\n\nSCP-5005-Θ has refused all nourishment for the duration of its containment (currently 72+ hours). This is not considered a containment concern at this time. Reason unknown.',
    description: 'SCP-5005-Θ is an entity presenting as a human female, apparent age 8-12 years. Subject was recovered from Ashford Forest clearing (see Incident Report ASHFORD-01) in a catatonic state. No biometric identification match exists in any Foundation or civilian database.\n\nSubject exhibits the following anomalous properties:\n— Medical imaging produces uniformly blank results across all modalities\n— Subject\'s eyes remain open and unfocused; pupils do not respond to light\n— Subject maintains a fixed gaze approximately 14 inches above floor level; this gaze shifts as subject is moved\n— Subject has not consumed food, water, or required sleep in observed period without physiological deterioration\n\nFull anomalous characterization is ongoing.',
    addendum: 'NOTE FROM SENIOR RESEARCHER DR. CHEN: "The blank imaging is the part that should concern everyone most. We are not seeing something we don\'t understand. We are seeing nothing where something clearly is. Those are very different problems."',
  },

  'scp-5005-classified': {
    id: 'scp-5005-classified',
    objectNumber: 'SCP-5005',
    classification: 'Thaumiel',
    requiredClearance: 5,
    isRedacted: true,
    containmentProcedures: '[DATA EXPUNGED — O5 AUTHORIZATION REQUIRED]',
    description: '[DATA EXPUNGED — O5 AUTHORIZATION REQUIRED]\n\n[FULL FILE ACCESSIBLE UPON ACT II COMMENCEMENT]',
    addendum: '[DATA EXPUNGED]',
  },

  'scp-055': {
    id: 'scp-055',
    objectNumber: 'SCP-055',
    classification: 'Keter',
    requiredClearance: 3,
    isRedacted: false,
    containmentProcedures: 'SCP-055 is contained at Site-19. Personnel assigned to SCP-055 must submit to memory baseline testing every 24 hours. No written descriptions of SCP-055\'s properties are to leave containment. Personnel are not to discuss SCP-055 with those not directly assigned to it.',
    description: 'SCP-055 is an object or entity with self-concealing properties. Specifically, it is impossible to remember or record any of SCP-055\'s properties. All attempts to do so result in the relevant information being forgotten or going unrecorded.\n\nThe only consistent thing that can be known about SCP-055 is what it is NOT: it is not round, not small, not living, not harmless. Every other property is lost upon observation.\n\n[RESEARCHER NOTE: I am including this entry in the O5 briefing materials because SCP-5005-Θ\'s blank medical imaging has certain conceptual similarities. I want the Council aware.]',
    addendum: 'Researcher note attached by O5-7: "Do not put these two items near each other."',
  },

  'scp-579': {
    id: 'scp-579',
    objectNumber: 'SCP-579',
    classification: 'Apollyon',
    requiredClearance: 5,
    isRedacted: true,
    containmentProcedures: '[DATA EXPUNGED — O5-ONLY CLEARANCE]',
    description: '[DATA EXPUNGED]\n\nThis file has been redacted from the standard O5 briefing packet at the request of O5-12.\n\nReason: "We do not look at this one. Not today."',
  },

  'scp-914': {
    id: 'scp-914',
    objectNumber: 'SCP-914',
    classification: 'Safe',
    requiredClearance: 1,
    isRedacted: false,
    containmentProcedures: 'SCP-914 is contained in Containment Chamber 914 at Site-19. Personnel may interact with SCP-914 for authorized testing purposes. All items introduced and produced must be catalogued. No biological material (including but not limited to blood, skin, hair) is to be introduced to SCP-914.',
    description: 'SCP-914 is a large clockwork mechanism occupying a 30m x 30m chamber at Site-19. The mechanism appears to be a "perpetual motion machine" and has been in continuous operation since acquisition.\n\nSCP-914 contains an input booth, an output booth, and a central clockwork mechanism connected to a dial with five settings: Rough, Coarse, 1:1, Fine, Very Fine. Objects placed in the input booth are "refined" and emerge from the output booth in a modified state corresponding to the dial setting.',
    addendum: 'CATALOGUE HIGHLIGHT (relevant to current operation): Attempt #7,431 — Subject: Child\'s drawing of a girl standing alone. Setting: Very Fine. Result: A sheet of paper containing coordinates. The coordinates correspond to Ashford Forest. This occurred three days before SCP-5005-Θ was discovered.',
  },

  'scp-049': {
    id: 'scp-049',
    objectNumber: 'SCP-049',
    classification: 'Euclid',
    requiredClearance: 2,
    isRedacted: false,
    containmentProcedures: 'SCP-049 is to be contained in a standard humanoid containment cell at Site-19. When being transported, SCP-049 must be accompanied by no fewer than three armed guards. SCP-049 is not to be allowed direct contact with any living persons outside of approved testing.',
    description: 'SCP-049 is a humanoid entity, roughly 1.9m in height, wearing the garments traditionally associated with the medical practitioners of the early 14th-17th century CE. SCP-049 is sapient and capable of communication in multiple languages.\n\nSCP-049 believes itself to be a medical practitioner and claims to be "curing" a plague it refers to only as "the Pestilence." SCP-049\'s touch is invariably lethal to humans. SCP-049 subsequently performs a surgical procedure on the corpse, creating a reanimated cadaver that is fully subservient to SCP-049.\n\nSCP-049 has expressed interest in SCP-5005-Θ. It has stated that the subject "has already been cured." It refuses to elaborate.',
  },

  'scp-001-proposal': {
    id: 'scp-001-proposal',
    objectNumber: 'SCP-001 (PROPOSAL — [CLASSIFIED])',
    classification: 'Keter',
    requiredClearance: 5,
    isRedacted: true,
    containmentProcedures: '[DATA EXPUNGED — THIS FILE DOES NOT EXIST — IF YOU ARE READING THIS YOU HAVE MADE AN ERROR]',
    description: '[DATA EXPUNGED]\n\nNote appended by O5-1: This entry was flagged for my attention by automated cross-reference protocol. Something in SCP-5005-Θ\'s behavioral profile triggered the match.\n\nI read the proposal.\n\nI have not slept since.',
  },

  'incident-ashford-01': {
    id: 'incident-ashford-01',
    objectNumber: 'INCIDENT FILE: ASHFORD-01',
    classification: 'Pending',
    requiredClearance: 1,
    isRedacted: false,
    containmentProcedures: 'N/A — This is an incident file, not a containment file.',
    description: 'On [DATE REDACTED], an anonymous civilian report was received by Foundation monitoring services describing "a child standing alone in the woods" near the Ashford Forest eastern highway. The report was one of three received within a 12-minute window from different callers with no apparent connection to each other.\n\nAll three reports ceased simultaneously at 23:47 local time. Attempts to re-contact the callers were unsuccessful. Two of the three numbers are now non-operational. The third number connects to a retired schoolteacher who states she did not call anyone that night and was asleep by 21:00.\n\nMTF X-Zeta-1 was dispatched. The rest is documented in SCP-5005-Θ containment files.',
    addendum: 'NOTE: The three-caller synchronization is statistically impossible by chance. Probability analysis puts the likelihood of three independent calls about the same subject at the same moment (within a 30-second window) at less than 0.0003%. This has been flagged for further investigation.',
  },
};
