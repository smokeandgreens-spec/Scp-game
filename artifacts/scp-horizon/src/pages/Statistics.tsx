import { useGameStore } from '../store/gameStore';
import { Link } from 'wouter';
import { STORY_NODES } from '../data/storyNodes';

function LargeStatBar({ value, label, color = 'primary', description }: {
  value: number;
  label: string;
  color?: string;
  description: string;
}) {
  const bars = Math.floor(Math.max(0, Math.min(100, value)) / 5);
  const filled = '▓'.repeat(bars);
  const empty = '░'.repeat(20 - bars);
  const colorClass = color === 'accent' ? 'text-accent' : 'text-primary';

  return (
    <div className="mb-6 border-b border-border pb-6" data-testid={'stat-large-' + label.toLowerCase()}>
      <div className="flex justify-between items-baseline mb-2">
        <div className={'font-bold tracking-widest ' + colorClass}>{label}</div>
        <div className={'text-2xl font-bold ' + colorClass}>{value}</div>
      </div>
      <div className={'font-mono text-sm mb-2 stat-bar overflow-x-auto ' + colorClass}>
        [{filled}{empty}]
      </div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  );
}

export default function Statistics() {
  const { stats, choiceHistory, currentNodeId, eventLog } = useGameStore();
  const currentNode = STORY_NODES[currentNodeId];
  const chapterNum = currentNode?.chapter ?? 0;

  const chapterLabels = ['INTRO', 'I: THE DISCOVERY', 'II: THE EXAMINATION', 'III: THE FOREST', 'IV: THE VOICE', 'V: MIDNIGHT EVENT'];

  return (
    <div className="min-h-screen bg-background text-primary font-mono p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-1">
            <Link href="/game" className="hover:text-primary transition-colors">&lt; RETURN TO OPERATION</Link>
          </div>
          <h1 className="text-2xl font-bold tracking-widest mt-4 border-b border-border pb-4 glitch-text">
            ► STATISTICS
          </h1>
          <div className="text-xs text-muted-foreground mt-2 tracking-widest">
            PSYCHOLOGICAL ASSESSMENT — O5-1 — ACT I
          </div>
        </div>

        {/* Chapter Progress */}
        <div className="mb-8 border border-border p-4 bg-card">
          <div className="text-xs text-muted-foreground tracking-widest mb-4">OPERATION PROGRESS</div>
          <div className="flex flex-col gap-2">
            {chapterLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={'text-xs ' + (i <= chapterNum ? 'text-primary' : 'text-muted-foreground')}>
                  {i < chapterNum ? '▓' : i === chapterNum ? '►' : '░'}
                </span>
                <span className={'tracking-widest ' + (i < chapterNum ? 'text-muted-foreground line-through' : i === chapterNum ? 'text-primary font-bold' : 'text-muted-foreground opacity-50')}>
                  {i === 0 ? 'PROLOGUE' : 'CHAPTER ' + label}
                </span>
                {i === chapterNum && <span className="text-xs text-accent">← CURRENT</span>}
                {i < chapterNum && <span className="text-xs text-muted-foreground">COMPLETE</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Visible Stats */}
        <div className="mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-6 border-b border-border pb-2">
            VISIBLE PSYCHOLOGICAL METRICS
          </div>
          <LargeStatBar
            value={stats.visible.knowledge}
            label="KNOWLEDGE"
            description="Depth of understanding regarding the anomaly. High knowledge unlocks THE OBSERVER ending."
          />
          <LargeStatBar
            value={stats.visible.trust}
            label="TRUST"
            description="Degree of compassionate handling. High trust unlocks THE CARETAKER ending."
          />
          <LargeStatBar
            value={stats.visible.fear}
            label="FEAR"
            color="accent"
            description="Operational caution level. High fear unlocks THE WARDEN ending."
          />
          <LargeStatBar
            value={stats.visible.authority}
            label="AUTHORITY"
            color="accent"
            description="Strength of command decisions made during the operation."
          />
        </div>

        {/* Hidden Stats */}
        <div className="mb-8">
          <div className="text-xs text-destructive tracking-widest mb-6 border-b border-border pb-2">
            CLASSIFIED METRICS — CLEARANCE REQUIRED
          </div>
          {[
            { label: 'SCP-5005 RELATIONSHIP', key: 'scp5005Relationship' },
            { label: 'RESEARCH ACCURACY', key: 'researchAccuracy' },
            { label: 'UNKNOWN INFLUENCE', key: 'unknownInfluence' },
          ].map(stat => (
            <div key={stat.key} className="mb-4 border-b border-border pb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-muted-foreground text-sm tracking-widest">{stat.label}</div>
                <div className="text-destructive text-xs border border-destructive px-2 py-0.5">CLASSIFIED</div>
              </div>
              <div className="font-mono text-sm text-muted-foreground">
                [████████████████████] [ DATA EXPUNGED ]
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Requires Thaumiel clearance to view.
              </div>
            </div>
          ))}
        </div>

        {/* Counts */}
        <div className="border border-border p-4 bg-card mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-4">OPERATION METRICS</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-primary">{choiceHistory.length}</div>
              <div className="text-xs text-muted-foreground tracking-widest">DIRECTIVES ISSUED</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{eventLog.length}</div>
              <div className="text-xs text-muted-foreground tracking-widest">EVENTS LOGGED</div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-4">
          <Link href="/game" className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="link-back-game">
            &gt; RETURN TO OPERATION
          </Link>
        </div>
      </div>
    </div>
  );
}
