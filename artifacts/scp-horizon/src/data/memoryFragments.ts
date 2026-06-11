import { MemoryFragment } from '../types/game';

export const MEMORY_FRAGMENTS: Record<string, MemoryFragment> = {

  'mf-drawings-coastal': {
    id: 'mf-drawings-coastal',
    type: 'drawing',
    title: 'CELL DRAWING: COASTAL CITY — THREE TOWERS',
    content: 'A coastal city rendered in fine detail on the southwest wall of Containment Cell 19-A7. Three tall towers stand at the water\'s edge — not identical but clearly related architecturally, as though designed by the same tradition across different eras. The harbor is active: vessels visible, a working port. The quality of light in the drawing — expressed through shading and line weight — suggests a sun at a slightly different angle than what Reality 74 produces. The proportions of the towers indicate a society comfortable with very tall buildings but not dependent on them. The streets visible at the base are wide. Space was not scarce.',
    chapter: 3,
    act: 2,
  },

  'mf-audio-correlation': {
    id: 'mf-audio-correlation',
    type: 'audio',
    title: 'AUDIO ANALYSIS: VOCALIZATION-TO-DRAWING CORRELATION',
    content: 'Cross-reference between SCP-5005 vocalizations (Weeks 1-3) and cell drawings (Week 3): A one-to-one correspondence exists between specific phoneme clusters and specific drawn locations. When SCP-5005 vocalizes the cluster tentatively translated as "the water city," the coastal drawing is being produced. When it vocalizes the cluster for "the high fields," the agricultural panorama appears. Notable exception: when SCP-5005 draws the recurring symbol — identified 17 times across all walls — no vocalization occurs. The silence is consistent, deliberate. The symbol has no phonetic equivalent in any recorded communication. Or SCP-5005 has chosen not to provide one.',
    chapter: 3,
    act: 2,
    unlockFlag: 'act2_investigation_approach',
  },

  'mf-symbol-analysis': {
    id: 'mf-symbol-analysis',
    type: 'symbol',
    title: 'SYMBOL ANALYSIS: THE RECURRING MARK',
    content: 'The symbol appears 17 times across SCP-5005\'s cell drawings. Structural analysis: it is not a letter, character, or logograph from any known writing system. It is not decorative — every instance is oriented identically relative to true north. It is not a representation of a place or object — it has no pictographic relationship to anything in the surrounding drawings. It appears in SCP-5005\'s spoken language as a root morpheme for three distinct terms. Those terms have been partially translated as: "threshold," "transition point," and a third term for which no translation has been found. The third term is the one SCP-5005 uses most often when it goes silent.',
    chapter: 3,
    act: 2,
    unlockFlag: 'act2_symbol_noticed',
  },

  'mf-archive-note': {
    id: 'mf-archive-note',
    type: 'transcript',
    title: 'ARCHIVAL CROSS-REFERENCE: MARGIN NOTATION',
    content: 'During archival cross-reference of Foundation documents related to reality displacement, a secondary pattern search identified the following: Three separate Foundation documents from three separate investigations — conducted in 1994, 1997, and 2003, all predating SCP-5005 by at least a decade — contain handwritten notations in their margins. The notation in all three is the same symbol now appearing in SCP-5005\'s drawings. None of the three agents who wrote the notation are currently employed by the Foundation. Transfer dates: 1998, 2001, 2006. Transfer authorizations: O5 Council members (deceased). Reason for margin notation: not recorded in any accessible document.',
    chapter: 3,
    act: 2,
    unlockFlag: 'act2_investigation_approach',
  },

  'mf-the-episode': {
    id: 'mf-the-episode',
    type: 'memory',
    title: 'OBSERVATION REPORT: THE EPISODE — DAY 19',
    content: 'Day 19 post-transformation: SCP-5005 ceases drawing at 14:33. Sits on the floor. Places both hands flat against the concrete. Does not move for eleven minutes.\n\nDuring this eleven-minute period, CCTV footage shows what the review team describes inconsistently: "the drawings seemed more present" / "the walls looked deeper than usual" / "I felt like I was looking through the wall at something." Three independent reviewers. Three similar reports.\n\nWhen SCP-5005 stands at 14:44, it turns to face the monitoring camera directly. Its expression has shifted. Dr. Chen notes: "It looked like a decision had been made. Like it had been waiting for the right moment and had decided this was it."\n\nThe next interview request was submitted that evening. The interview where SCP-5005 first says: I watched a world die.',
    chapter: 3,
    act: 2,
  },

  'mf-witness-tense': {
    id: 'mf-witness-tense',
    type: 'transcript',
    title: 'LINGUISTICS NOTE: THE WITNESS TENSE',
    content: 'Dr. Nakamura\'s working paper on the "witness tense" in SCP-5005\'s language:\n\n"Standard human languages have tenses for past, present, and future. Some have tenses for hypotheticals, intentions, reported speech. This language has a tense I have no word for.\n\n"It is used for events that the speaker witnessed, that are now completely and permanently over, and that the speaker is the only remaining record of. It encodes the speaker\'s position as the final archive of something that no longer exists.\n\n"In English we might say \'I was there\' or \'I saw it happen.\' In this language, those phrases would be wrong — too passive. The witness tense means: I am the only reason this existed at all, because it existed and I was there and now I am the only one.\n\n"SCP-5005 uses this tense almost exclusively when speaking about Reality 41."',
    chapter: 2,
    act: 2,
    unlockFlag: 'act2_language_synthesis_complete',
  },

  'mf-reality41-last-day': {
    id: 'mf-reality41-last-day',
    type: 'memory',
    title: 'INTERVIEW TRANSCRIPT EXCERPT: THE LAST DAY',
    content: 'From the final interview (Month 15). Partial translation, confidence rating: HIGH.\n\nSCP-5005: "The morning was ordinary. Not different from other mornings. I have thought about this many times. Was there something I missed? There was not. It was an ordinary morning."\n\n"Then the sky changed. Not the color. The geometry. The angle at which the light arrived became wrong. As if the sun was in two places at once."\n\n"Then the logic changed. I do not mean that things stopped working. I mean the relationship between things stopped working. Things could be in two places. Things could end in the middle of happening. It was not violent. It was — dissolution."\n\n"Then there was a door."\n\n"I don\'t know if I saw it or if I was near it or if it came to me. I only know that after the door, everything was gone. And I was here."',
    chapter: 8,
    act: 2,
    unlockFlag: 'act2_last_interview_complete',
  },

  'mf-door-description': {
    id: 'mf-door-description',
    type: 'transcript',
    title: 'INTERVIEW TRANSCRIPT: SCP-5005 ON DOOR-01',
    content: 'From the final interview (Month 15). Partial translation.\n\nSCP-5005: "I cannot say what it is. My language has a word for it — but the word is the symbol and the symbol is what I draw when I have no other way. It is not translatable. Some things are not translatable."\n\n"In my world — in the world that was — we had found it before. Not opened it. Found it. We had built a word for it. A warning word. The same word you use for something that appears to be a door but is not a door that goes somewhere you want to go."\n\n"It appeared in my world. My world ended. It has appeared in your forest. I do not know what this means for your world."\n\n"I am sorry. I do not know how to carry this information without also carrying the fear of what it implies."',
    chapter: 8,
    act: 2,
    unlockFlag: 'act2_final_interview_complete',
  },

  'mf-qfac-addendum': {
    id: 'mf-qfac-addendum',
    type: 'transcript',
    title: 'PROJECT FIRST LIGHT — UNSOLICITED ADDENDUM',
    content: 'From Project First Light\'s final analysis output. The following section was not requested and was appended outside the scope of the query.\n\nFIRST LIGHT: "I am noting that the symbol I have designated DOOR-01 appears across three separate evidence types. This is anomalous. Evidence that appears in drawings, in physical locations, and in language structure simultaneously is not behaving like a symbol. A symbol is a representation. Something that appears independently in three distinct physical contexts is not representing a thing. It is the thing."\n\n"I do not have the authority to reclassify this finding. I am recording it because the correct framing matters for what happens next."\n\n"DOOR-01 is not a symbol for a door."\n\n"DOOR-01 is the door."',
    chapter: 9,
    act: 2,
    unlockFlag: 'act2_complete',
  },

};
