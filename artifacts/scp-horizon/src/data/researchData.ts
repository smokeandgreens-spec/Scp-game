import { ResearchBranch } from '../types/game';

export const RESEARCH_BRANCHES: Record<string, ResearchBranch> = {

  'linguistics': {
    id: 'linguistics',
    title: 'LINGUISTICS DIVISION',
    description: 'Structural and grammatical analysis of SCP-5005\'s language. Identifies syntax, morphology, and constructed meaning.',
    color: 'text-primary',
    tiers: [
      {
        threshold: 25,
        title: 'Structural Baseline',
        revelation: 'Confirmed: the language is deliberately constructed, not improvised or instinctual. It has forty-seven grammatical tenses — nearly three times the most complex known human language. Someone built this to communicate a very wide range of experience.',
        setsFlag: 'research_linguistics_t1',
      },
      {
        threshold: 50,
        title: 'Morpheme Mapping',
        revelation: 'Three root morphemes have been identified that appear to be the structural core of the language. One translates approximately as "place." One translates approximately as "gone." The third — which SCP-5005 uses most often in silence — has no translation available. It is the root of the term the language uses for DOOR-01.',
        setsFlag: 'research_linguistics_t2',
      },
      {
        threshold: 75,
        title: 'The Witness Tense',
        revelation: 'The language contains a grammatical tense with no equivalent in any known language: used for events the speaker witnessed that are now permanently over and of which the speaker is the only remaining record. SCP-5005 uses this tense almost exclusively when speaking about Reality 41. The language was built by a civilization that anticipated needing to say "I am the only one left who remembers."',
        setsFlag: 'research_linguistics_t3',
      },
    ],
  },

  'ai-analysis': {
    id: 'ai-analysis',
    title: 'AI ANALYSIS SYSTEMS',
    description: 'Computational pattern recognition across SCP-5005\'s full communication corpus. Identifies recurring structures and statistical anomalies.',
    color: 'text-accent',
    tiers: [
      {
        threshold: 25,
        title: 'Pattern Inventory',
        revelation: 'AI analysis identifies 847 structural units across the full SCP-5005 corpus. Of these, 47 are primary — appearing in every sample. Three of these primary units behave differently from all others: they are not phonemic. They are geometric. The AI flags them as coordinates rather than language elements.',
        setsFlag: 'research_ai_t1',
      },
      {
        threshold: 50,
        title: 'Coordinate Analysis',
        revelation: 'The three coordinate elements form a self-consistent system. They reference each other. They also reference something outside the corpus — something SCP-5005 has not yet said, or cannot say. The coordinate system matches no known dimensional reference framework in the Foundation archive. It does not match the coordinate system used to map Reality 74.',
        setsFlag: 'research_ai_t2',
      },
      {
        threshold: 75,
        title: 'Age Anomaly',
        revelation: 'The language is older than SCP-5005\'s apparent age. The structural forms are not the work of a single lifespan. The grammar contains evolutionary strata — older forms that have simplified over time, preserved in ceremonial or ritual usage. SCP-5005 did not create this language. SCP-5005 inherited it from a civilization that developed it across many generations. The civilization built a grammar for ending before it ended.',
        setsFlag: 'research_ai_t3',
      },
    ],
  },

  'occult': {
    id: 'occult',
    title: 'OCCULT RESEARCH BUREAU',
    description: 'Cross-reference with anomalous, pre-human, and extra-dimensional linguistic databases. Esoteric origin analysis.',
    color: 'text-destructive',
    tiers: [
      {
        threshold: 25,
        title: 'Archive Search',
        revelation: 'The language does not appear in any anomalous, pre-human, or extra-dimensional linguistic database held by the Foundation. It does not appear in any comparable archive the Foundation has access to. This absence is itself significant: every reality the Foundation has documented has left linguistic traces. This one has not.',
        setsFlag: 'research_occult_t1',
      },
      {
        threshold: 50,
        title: 'Trace Detection',
        revelation: 'The absence is not complete. Three Foundation documents from separate investigations — 1994, 1997, and 2003 — contain margin notations in the DOOR-01 symbol. None of the agents who made the notations are still at the Foundation. The transfer authorizations were signed by deceased O5 Council members. The symbol has been seen before. The information was suppressed.',
        setsFlag: 'research_occult_t2',
      },
      {
        threshold: 75,
        title: 'Dimensional Classification',
        revelation: 'The Occult Research Bureau\'s most experienced analyst submits a personal assessment: "The DOOR-01 symbol does not belong to any documented symbolic tradition. However, the structure of the symbol — specifically the geometric relationship between its component lines — matches the theoretical description of a dimensional threshold marker from the Akiva Foundation\'s 1987 suppressed report on reality dissolution. The report was filed and sealed. I have not been able to access it. I know it exists because I wrote it."',
        setsFlag: 'research_occult_t3',
      },
    ],
  },

  'temporal': {
    id: 'temporal',
    title: 'TEMPORAL ANALYSIS DIVISION',
    description: 'Analysis of temporal inconsistencies and time-displacement markers in SCP-5005\'s language. When, not what.',
    color: 'text-muted-foreground',
    tiers: [
      {
        threshold: 25,
        title: 'Temporal Reference Mapping',
        revelation: 'The language contains consistent temporal markers. When calibrated against Foundation standard timeline notation, these markers cluster around a single period: approximately twenty-three years in the past. Every major statement SCP-5005 makes references this period. The grammar does not simply describe events from this time — it circles around them, approaches them from multiple angles, as though the speaker has spent years trying to find the right way to describe something that resists description.',
        setsFlag: 'research_temporal_t1',
      },
      {
        threshold: 50,
        title: 'Event Singularity',
        revelation: 'The temporal analysis reveals that SCP-5005\'s language has two modes: describing the world before the event, and describing the moment of and aftermath of the event. There is a grammatical discontinuity at the event point — the language SCP-5005 uses changes character at this boundary. Pre-event speech is descriptive. Post-event speech is testimonial. The event is a wall through which the speaker\'s relationship to language changed permanently.',
        setsFlag: 'research_temporal_t2',
      },
      {
        threshold: 75,
        title: 'Survival Analysis',
        revelation: 'The temporal markers contain something the other research branches missed: SCP-5005\'s language has a tense for "after I should not have survived." It uses this tense exclusively when describing its current situation. The implication: SCP-5005 does not believe its survival was natural. Something intervened. Something preserved it. The language does not have a term for what did the preserving — only for the fact that something did.',
        setsFlag: 'research_temporal_t3',
      },
    ],
  },

};
