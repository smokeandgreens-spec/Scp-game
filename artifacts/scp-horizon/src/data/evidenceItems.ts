import { EvidenceItem } from '../types/game';

export const EVIDENCE_ITEMS: Record<string, EvidenceItem> = {

  'ev-first-assessment': {
    id: 'ev-first-assessment',
    title: 'INITIAL PSYCHOLOGICAL ASSESSMENT — SCP-5005',
    content: 'Dr. Chen\'s initial assessment following the transformation event. Subject demonstrates purposeful behavior: examination of its own form, attention to observers, and what appears to be deliberate communication attempts. No aggressive behavior observed. Cognitive complexity assessment: high. Anomalous status: confirmed — the subject is aware of its own nature in a way that suggests prior experience with anomalous phenomena.',
    type: 'data',
    chapter: 1,
    act: 2,
    unlockFlag: 'act2_initial_approach',
  },

  'ev-medical-baseline': {
    id: 'ev-medical-baseline',
    title: 'MEDICAL EXAMINATION — POST-TRANSFORMATION BASELINE',
    content: 'Dr. Osei\'s emergency medical baseline for SCP-5005. Vital signs: present, stable, incompatible with known biological systems. Temperature: 37.0°C (exact). Neural activity: highly complex, structured in an unrecognized pattern. Cooperated with all examination procedures. Dr. Osei\'s note: "The subject allowed examination as though it had been examined before. Not resigned — compliant. There is a difference."',
    type: 'physical',
    chapter: 1,
    act: 2,
    unlockFlag: 'act2_initial_approach',
  },

  'ev-first-vocalization': {
    id: 'ev-first-vocalization',
    title: 'AUDIO LOG: FIRST POST-TRANSFORMATION VOCALIZATION',
    content: 'Sunday 04:00. SCP-5005 produces its first structured vocalization post-transformation. Duration: 47 seconds. Preliminary analysis: grammatically complete. Partial translation (confidence: LOW): Four words cleanly rendered — CHILD, WAS, BEFORE, SOMETHING. Order uncertain. Three words: untranslatable. Seven: uncertain. The statement was not repeated.',
    type: 'data',
    chapter: 1,
    act: 2,
  },

  'ev-language-analysis': {
    id: 'ev-language-analysis',
    title: 'LANGUAGE INVESTIGATION — PRELIMINARY REPORT',
    content: 'Dr. Nakamura\'s preliminary analysis of SCP-5005\'s language. Confirmed: deliberately constructed, not natural or improvised. Grammar: 47 tenses identified. Origin: no match in any Foundation archive. Key finding: the language encodes a concept Dr. Nakamura designates "the witness tense" — a grammatical form for describing events of which the speaker is the only remaining record. No equivalent exists in any documented language.',
    type: 'data',
    chapter: 2,
    act: 2,
    unlockFlag: 'act2_language_investigation_started',
  },

  'ev-language-synthesis': {
    id: 'ev-language-synthesis',
    title: 'LANGUAGE RESEARCH — SYNTHESIS REPORT',
    content: 'Consolidated findings from the SCP-5005 language investigation. The language is not from Reality 74. The language was built by a civilization with direct experience of "things ending." The language does not appear in any known archive. The language contains coordinate elements that reference something outside SCP-5005\'s recorded communications — something it has not said, or cannot say. Conclusion: SCP-5005 is not an anomaly. SCP-5005 is a survivor who arrived speaking the language of their vanished world.',
    type: 'data',
    chapter: 2,
    act: 2,
    unlockFlag: 'act2_language_synthesis_complete',
  },

  'ev-cell-drawings': {
    id: 'ev-cell-drawings',
    title: 'OBSERVATION REPORT: CELL DRAWINGS — FULL CATALOG',
    content: 'Full catalog of SCP-5005\'s cell drawings. 47 distinct images on three walls. All representational. Subjects include: coastal urban area (3 towers), mountain range, agricultural area, large public building interior, partially rendered human figure, and 17 instances of a recurring symbol. Dr. Chen: "The drawings are consistent with a single world. SCP-5005 is drawing its home." Dr. Vasquez: "Or what it wants us to think is its home." Notation: the symbol never has a corresponding vocalization. SCP-5005 goes silent every time it draws it.',
    type: 'anomalous',
    chapter: 3,
    act: 2,
    unlockFlag: 'act2_drawings_discovered',
  },

  'ev-recurring-symbol': {
    id: 'ev-recurring-symbol',
    title: 'SYMBOL ANALYSIS REPORT: PRIMARY RECURRING MARK',
    content: 'Analysis of the symbol appearing 17 times in SCP-5005\'s drawings. Not a letter, character, or pictograph from any known system. Consistently oriented relative to true north. Appears in SCP-5005\'s language as root morpheme for three terms. Those terms partially translate as: "threshold," "transition point," and one untranslatable term. The untranslatable term is the one SCP-5005 uses when it goes silent. The AI analysis note: "This symbol is pointing at something. Consistently and with great specificity. We don\'t know what it\'s pointing at."',
    type: 'anomalous',
    chapter: 3,
    act: 2,
    unlockFlag: 'act2_symbol_noticed',
  },

  'ev-the-episode': {
    id: 'ev-the-episode',
    title: 'INCIDENT REPORT: THE EPISODE — DAY 19',
    content: 'Day 19 post-transformation. SCP-5005 stops drawing, sits on floor, places both hands flat against concrete. Duration: 11 minutes. During this period, three independent monitors report that the cell drawings appeared "more present" — as though the depicted places were temporarily more real. CCTV footage is inconclusive: footage is consistent with the room but reviewers report experiencing the room differently during review. When SCP-5005 stands, it faces the monitoring camera directly. Dr. Chen\'s observation: "Something changed. A decision was made."',
    type: 'anomalous',
    chapter: 3,
    act: 2,
    unlockFlag: 'act2_episode_witnessed',
  },

  'ev-witness-statement': {
    id: 'ev-witness-statement',
    title: 'INTERVIEW TRANSCRIPT — KEY STATEMENT',
    content: 'Month 2 interview. Translation confidence: HIGH (after 30 days of calibration). SCP-5005 statement: "I watched a world die. Not this world. A different one. One that was. I was there when it ended. I am the only one who was there when it ended who is still here to say so. I have been trying to find a way to tell someone. For a very long time."',
    type: 'testimony',
    chapter: 4,
    act: 2,
    unlockFlag: 'act2_world_died_heard',
  },

  'ev-reality41-name': {
    id: 'ev-reality41-name',
    title: 'INTERVIEW TRANSCRIPT — REALITY 41 DESIGNATION',
    content: 'Month 2 interview. SCP-5005 produces a proper noun — a name for its world of origin. Translation software renders it as: REALITY 41. SCP-5005\'s response when shown the rendering: "That is not quite right. But it is close enough. Close enough to find it. Or to find what happened to it." First instance of this designation in any Foundation document.',
    type: 'testimony',
    chapter: 4,
    act: 2,
    unlockFlag: 'act2_reality41_named',
  },

  'ev-first-light-report': {
    id: 'ev-first-light-report',
    title: 'PROJECT FIRST LIGHT — INITIALIZATION REPORT',
    content: 'Project First Light initialized per authorized parameters. Primary objective: anomalous language analysis, SCP-5005 corpus. Secondary objective: develop framework for general anomalous analysis — precursor to QFAC. First Light initialization complete. Initial corpus ingestion: full SCP-5005 recordings (47 hours, 23 minutes). Preliminary processing: underway. First Light note: "I will begin with what is known. What is unknown will follow from what is known."',
    type: 'data',
    chapter: 5,
    act: 2,
    unlockFlag: 'act2_first_light_active',
  },

  'ev-clearing-expansion': {
    id: 'ev-clearing-expansion',
    title: 'FIELD REPORT: CLEARING EXPANSION',
    content: 'Ashford clearing measures 17 meters larger in every direction than original survey. Trees at new boundary have been in current positions for minimum 60 years per dendrochronology. Space has not grown — it appeared. Spatial measurement instruments produce three simultaneous incompatible readings for clearing diameter. Soil at center has never supported plant life — confirmed "in the history of the soil." Assessment: the clearing is expanding. Rate unknown. The expansion obeys different physical rules than the surrounding forest.',
    type: 'anomalous',
    chapter: 6,
    act: 2,
    unlockFlag: 'act2_forest_revisited',
  },

  'ev-missing-history': {
    id: 'ev-missing-history',
    title: 'HISTORICAL AUDIT: MISSING SURVEY RECORDS',
    content: 'Local land registry documents reference a neighboring survey of the Ashford region that does not exist in any accessible archive. The missing survey would have covered exactly the clearing area. The original surveyor died in 1992 under circumstances cross-referenced against a sealed anomalous containment event. The cross-reference is sealed at O5 authority. The Foundation has known about this location longer than SCP-5005 has been in it. Something was here before.',
    type: 'classified',
    chapter: 6,
    act: 2,
    unlockFlag: 'act2_forest_revisited',
  },

  'ev-spatial-readings': {
    id: 'ev-spatial-readings',
    title: 'SPATIAL ANALYSIS: CLEARING INTERIOR MEASUREMENTS',
    content: 'The interior of the Ashford clearing is approximately 4% larger than its exterior boundary implies. The interior is getting larger at a faster rate than the boundary. The center of the clearing is measurably getting further from the edge over time. This is not possible under standard physical laws. Assessment: the clearing contains an expanding spatial anomaly originating from a fixed central point. The expansion rate is slow but consistent.',
    type: 'anomalous',
    chapter: 6,
    act: 2,
    unlockFlag: 'act2_forest_priority',
  },

  'ev-missing-surveys': {
    id: 'ev-missing-surveys',
    title: 'HISTORICAL AUDIT: SUPPRESSED DOCUMENTATION TRAIL',
    content: 'Missing survey was filed in 1987, removed in 1989, removal record removed in 1991. The suppression pattern indicates active concealment by Foundation personnel. Three agents wrote the DOOR-01 symbol in document margins between 1994-2003 and were subsequently transferred out of the Foundation under separate, unrelated circumstances. Commander Reyes, when told the symbol has appeared in the clearing, stated: "I recognized it the first time. I didn\'t report it because I didn\'t know how. What do you call something that looks like a way out?"',
    type: 'classified',
    chapter: 6,
    act: 2,
    unlockFlag: 'act2_forest_priority',
  },

  'ev-door01-symbol': {
    id: 'ev-door01-symbol',
    title: 'FIELD REPORT: DOOR-01 SYMBOL — ASHFORD CLEARING',
    content: 'A symbol discovered at the center of the Ashford clearing on Day 4 of the second investigation. Cameras failed before full documentation was possible. Partial photograph: symbol matches primary recurring mark in SCP-5005 cell drawings exactly. Symbol was not present in any previous survey — baseline photographs do not exist due to camera failures at both visits. Symbol was not created by SCP-5005. SCP-5005 has been in containment for 7 months. Dr. Okonkwo\'s personal note: "I don\'t think this is where SCP-5005 came from. I think this is where something is trying to go."',
    type: 'anomalous',
    chapter: 6,
    act: 2,
    unlockFlag: 'act2_door01_found',
  },

  'ev-reality41-confirmed': {
    id: 'ev-reality41-confirmed',
    title: 'PROJECT FIRST LIGHT: REALITY 41 CONFIRMATION',
    content: 'First Light analysis of full evidence corpus. Finding: Reality 41 was a parallel reality to Reality 74, sharing most physical constants, containing an advanced human civilization. Reality 41 is not displaced, hidden, collapsed, or in any recoverable state. Reality 41 ceased to exist approximately 23 years ago. The cessation was instantaneous. It was, per SCP-5005 testimony, an event. The event has not been characterized beyond this description. SCP-5005 was present at the event. SCP-5005 survived. No other survivors have been identified. The existence of Reality 41 can now only be confirmed through SCP-5005\'s testimony and the physical evidence in the Ashford clearing.',
    type: 'classified',
    chapter: 7,
    act: 2,
    unlockFlag: 'act2_reality41_confirmed',
  },

  'ev-door01-designation': {
    id: 'ev-door01-designation',
    title: 'PROJECT FIRST LIGHT: DOOR-01 DESIGNATION NOTE',
    content: 'Unsolicited addendum from Project First Light following final analysis. "Recurring symbol identified across three independent evidence types: SCP-5005 cell drawings (47 instances), Ashford clearing ground markings (1 instance), SCP-5005 language structure (root morpheme for 3 key terms). A symbol appearing independently in drawings, physical locations, and language structure is not behaving like a symbol. It is the thing. Designation: DOOR-01. This symbol was not created by SCP-5005. Something else put it there." Personnel note: 17 readers. No follow-up investigation requested by any of them. The correct question has not yet been asked aloud.',
    type: 'classified',
    chapter: 9,
    act: 2,
    unlockFlag: 'act2_complete',
  },

};
