import { useMemo } from 'react';
import { Link } from 'wouter';
import { useGameStore } from '../store/gameStore';
import { DecisionImpact, StoryDecision } from '../types/game';
import { soundManager } from '../audio';

interface QFACProfile {
  typeCode: string;
  typeName: string;
  dominantImpact: DecisionImpact | 'undetermined';
  counts: Record<DecisionImpact, number>;
  total: number;
  riskLevel: string;
  assessmentText: string;
  recommendationText: string;
}

const TYPE_DATA: Record<DecisionImpact | 'undetermined', {
  code: string; name: string; risk: string; assessment: string; recommendation: string;
}> = {
  compassionate: {
    code: 'TYPE-2',
    name: 'HUMANITARIAN ADMINISTRATOR',
    risk: 'MODERATE',
    assessment: 'Subject demonstrates consistent prioritization of subject welfare over operational data acquisition. Decision pattern suggests strong empathic response pathways that may be influencing strategic judgment. This is not inherently a liability, but the Ethics Committee notes that empathic responses to anomalous entities have historically correlated with elevated Class-4 exposure risk.',
    recommendation: 'Subject is recommended for continued operation under standard monitoring protocols. Ethics Committee to review at chapter conclusion. O5 Command notes that the Caretaker ending pathway is statistically most accessible from this profile.',
  },
  aggressive: {
    code: 'TYPE-1',
    name: 'CONTAINMENT ARCHITECT',
    risk: 'ELEVATED',
    assessment: 'Subject demonstrates consistent prioritization of data acquisition and containment efficiency over subject welfare considerations. Decision pattern is operationally coherent and has produced measurable knowledge gains. Ethics Committee has filed a standard advisory note. The subject is not in violation of any protocols — aggressive testing is within O5 purview.',
    recommendation: 'Subject is performing within normal operational parameters. The Observer ending pathway is accessible, though stat distribution suggests Warden as the most probable outcome at current trajectory. Ethics Committee monitoring continues.',
  },
  analytical: {
    code: 'TYPE-3',
    name: 'ANALYTICAL OBSERVER',
    risk: 'LOW',
    assessment: 'Subject demonstrates consistent prioritization of information gathering before action. Decision pattern shows high epistemic caution — the subject prefers to understand before committing. Knowledge metrics are elevated as a result. This profile correlates strongly with Observer ending outcomes in historical simulations.',
    recommendation: 'Subject is recommended for continued operation without modification. Observer ending pathway has the highest statistical probability at current trajectory. Knowledge stat elevation may unlock additional narrative branches in subsequent acts.',
  },
  authoritative: {
    code: 'TYPE-4',
    name: 'EXECUTIVE DIRECTOR',
    risk: 'LOW',
    assessment: 'Subject demonstrates consistent use of institutional authority as a primary decision-making tool. Commands are issued, teams are deployed, chains of command are respected. This is the administratively expected profile for an O5 Council member and raises no flags. The subject operates through systems rather than around them.',
    recommendation: 'Standard operational profile. Authority metric elevation may provide access to otherwise-locked narrative pathways in subsequent acts. No modifications recommended.',
  },
  paranoid: {
    code: 'TYPE-5',
    name: 'THREAT RESPONSE SPECIALIST',
    risk: 'HIGH',
    assessment: 'Subject demonstrates consistent prioritization of threat identification and escalation above all other considerations. Fear metrics are elevated. While threat awareness is a critical O5 competency, the subject\'s pattern suggests the possibility that perceived threat level may be influencing decisions in a feedback loop. This is flagged for review, not action.',
    recommendation: 'Ethics Committee requests a baseline psychological assessment at chapter conclusion. The Warden ending pathway is the most statistically probable from this profile. Subject is reminded that excessive fear responses in an O5 member can propagate downward through the command structure.',
  },
  undetermined: {
    code: 'TYPE-0',
    name: 'UNDEFINED PATTERN',
    risk: 'INSUFFICIENT DATA',
    assessment: 'Insufficient decision data to generate a meaningful administrative profile. The system requires at minimum three recorded decisions before a reliable classification can be produced. Subject is advised to continue operational activity.',
    recommendation: 'Return to this analysis after completing additional chapters.',
  },
};

function computeProfile(decisions: StoryDecision[]): QFACProfile {
  const counts: Record<DecisionImpact, number> = {
    compassionate: 0, aggressive: 0, analytical: 0, authoritative: 0, paranoid: 0,
  };
  decisions.forEach(d => { counts[d.impact]++; });
  const total = decisions.length;

  if (total < 3) {
    const td = TYPE_DATA.undetermined;
    return { typeCode: td.code, typeName: td.name, dominantImpact: 'undetermined', counts, total, riskLevel: td.risk, assessmentText: td.assessment, recommendationText: td.recommendation };
  }

  // Find dominant — if tie, pick first alphabetically (deterministic)
  const sorted = (Object.entries(counts) as [DecisionImpact, number][]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const dominant = sorted[0][0];
  const secondCount = sorted[1]?.[1] ?? 0;

  // True tie — no dominant
  if (sorted[0][1] === secondCount && sorted[0][1] > 0) {
    const td = TYPE_DATA.undetermined;
    return { typeCode: td.code, typeName: td.name, dominantImpact: 'undetermined', counts, total, riskLevel: td.risk, assessmentText: td.assessment, recommendationText: td.recommendation };
  }

  const td = TYPE_DATA[dominant];
  return { typeCode: td.code, typeName: td.name, dominantImpact: dominant, counts, total, riskLevel: td.risk, assessmentText: td.assessment, recommendationText: td.recommendation };
}

const IMPACT_COLORS: Record<DecisionImpact, string> = {
  compassionate: 'text-primary', aggressive: 'text-destructive',
  analytical: 'text-accent', authoritative: 'text-foreground', paranoid: 'text-accent',
};

const IMPACT_LABELS: Record<DecisionImpact, string> = {
  compassionate: 'COMPASSIONATE', aggressive: 'AGGRESSIVE',
  analytical: 'ANALYTICAL', authoritative: 'AUTHORITATIVE', paranoid: 'PARANOID',
};

export default function Analysis() {
  const decisions = useGameStore(s => s.decisions);
  const stats = useGameStore(s => s.stats);
  const profile = useMemo(() => computeProfile(decisions), [decisions]);
  const riskColor = profile.riskLevel === 'LOW' ? 'text-primary' : profile.riskLevel === 'MODERATE' ? 'text-accent' : profile.riskLevel === 'HIGH' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <div className="min-h-screen bg-background text-primary font-mono p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-1">
            <Link href="/game" className="hover:text-primary transition-colors" onClick={() => soundManager.play('ui.navigate')}>
              &lt; RETURN TO OPERATION
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-widest mt-4 border-b border-border pb-4 glitch-text">
            ► QFAC ANALYSIS ENGINE
          </h1>
          <div className="text-xs text-muted-foreground mt-2 tracking-widest">
            QUALITATIVE FOUNDATION ADMINISTRATIVE CLASSIFICATION — O5-1 BEHAVIORAL ASSESSMENT
          </div>
        </div>

        {/* Classification box */}
        <div className="border-2 border-foreground p-6 bg-card mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-1">ADMINISTRATIVE CLASSIFICATION</div>
          <div className="text-3xl font-bold text-foreground tracking-widest mb-1">
            {profile.typeCode}
          </div>
          <div className="text-lg text-foreground tracking-widest mb-4">
            {profile.typeName}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground tracking-widest">RISK ASSESSMENT:</span>
            <span className={'text-xs font-bold tracking-widest border px-2 py-0.5 ' + riskColor + ' border-current'}>
              {profile.riskLevel}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-3">
            {'Based on ' + profile.total + ' recorded decision' + (profile.total !== 1 ? 's' : '')}
          </div>
        </div>

        {/* Decision impact breakdown */}
        <div className="mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-4 border-b border-border pb-2">
            DECISION PATTERN ANALYSIS
          </div>
          {(Object.entries(profile.counts) as [DecisionImpact, number][]).map(([impact, count]) => {
            const pct = profile.total > 0 ? Math.round((count / profile.total) * 100) : 0;
            const bars = Math.floor(pct / 5);
            const colorClass = IMPACT_COLORS[impact];
            const isDominant = impact === profile.dominantImpact;
            return (
              <div key={impact} className={'mb-4 ' + (isDominant ? 'opacity-100' : 'opacity-60')}>
                <div className="flex justify-between items-center mb-1">
                  <span className={'text-xs tracking-widest ' + colorClass}>
                    {IMPACT_LABELS[impact]}{isDominant ? ' ◄ DOMINANT' : ''}
                  </span>
                  <span className={'text-xs ' + colorClass}>{pct}%  ({count})</span>
                </div>
                <div className={'font-mono text-xs stat-bar ' + colorClass}>
                  {'[' + '▓'.repeat(bars) + '░'.repeat(20 - bars) + ']'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Visible stat summary */}
        <div className="mb-8 border border-border p-4 bg-card">
          <div className="text-xs text-muted-foreground tracking-widest mb-3">CURRENT STAT MATRIX</div>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(stats.visible) as [string, number][]).map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground tracking-widest">{k.toUpperCase()}</span>
                  <span className="text-primary font-bold">{v}</span>
                </div>
                <div className="font-mono text-xs text-primary stat-bar">
                  {'[' + '▓'.repeat(Math.floor(v / 10)) + '░'.repeat(10 - Math.floor(v / 10)) + ']'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment text */}
        <div className="mb-8">
          <div className="text-xs text-destructive tracking-widest mb-3 border-b border-border pb-2">
            ╔═ BEHAVIORAL ASSESSMENT ═══════════════════════╗
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-4">
            {profile.assessmentText}
          </p>
        </div>

        {/* Notable decisions */}
        {decisions.length > 0 && (
          <div className="mb-8">
            <div className="text-xs text-muted-foreground tracking-widest mb-4 border-b border-border pb-2">
              NOTABLE DECISIONS ({decisions.length} RECORDED)
            </div>
            <div className="space-y-2">
              {decisions.slice(-5).reverse().map((d, i) => (
                <div key={d.id + i} className="text-xs border-b border-border pb-2 last:border-0">
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-foreground leading-relaxed">{d.label}</span>
                    <span className={'shrink-0 ' + IMPACT_COLORS[d.impact]}>{IMPACT_LABELS[d.impact]}</span>
                  </div>
                  <div className="text-muted-foreground mt-0.5">CH.{d.chapter} — {new Date(d.timestamp).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div className="mb-8 border border-border p-4 bg-card">
          <div className="text-xs text-muted-foreground tracking-widest mb-3">O5 RECOMMENDATION</div>
          <p className="text-xs text-muted-foreground leading-relaxed">{profile.recommendationText}</p>
        </div>

        <div className="mt-8 border-t border-border pt-4">
          <Link href="/game" className="text-muted-foreground hover:text-primary transition-colors text-sm" onClick={() => soundManager.play('ui.navigate')}>
            &gt; RETURN TO OPERATION
          </Link>
        </div>
      </div>
    </div>
  );
}
