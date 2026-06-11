import { useMemo } from 'react';
import { Link } from 'wouter';
import { useGameStore } from '../store/gameStore';
import { EventLogEntry, StoryDecision, DecisionImpact } from '../types/game';
import { soundManager } from '../audio';

const IMPACT_LABELS: Record<DecisionImpact, string> = {
  compassionate: 'COMPASSIONATE',
  aggressive: 'AGGRESSIVE',
  analytical: 'ANALYTICAL',
  authoritative: 'AUTHORITATIVE',
  paranoid: 'PARANOID',
};

const IMPACT_COLORS: Record<DecisionImpact, string> = {
  compassionate: 'text-primary border-primary',
  aggressive: 'text-destructive border-destructive',
  analytical: 'text-accent border-accent',
  authoritative: 'text-foreground border-foreground',
  paranoid: 'text-accent border-accent',
};

const CHAPTER_LABELS: Record<number, string> = {
  0: 'PROLOGUE',
  1: 'CH.1 — THE DISCOVERY',
  2: 'CH.2 — THE EXAMINATION',
  3: 'CH.3 — THE FOREST',
  4: 'CH.4 — THE VOICE',
  5: 'CH.5 — MIDNIGHT EVENT',
};

type TimelineItem =
  | { kind: 'event'; data: EventLogEntry; chapter: number }
  | { kind: 'decision'; data: StoryDecision };

export default function Timeline() {
  const eventLog = useGameStore(s => s.eventLog);
  const decisions = useGameStore(s => s.decisions);

  const grouped = useMemo(() => {
    // Build combined timeline
    const items: TimelineItem[] = [
      ...eventLog.map(e => ({ kind: 'event' as const, data: e, chapter: 0 })),
      ...decisions.map(d => ({ kind: 'decision' as const, data: d })),
    ];

    // Sort by timestamp
    items.sort((a, b) => {
      const ta = a.kind === 'event' ? a.data.timestamp : a.data.timestamp;
      const tb = b.kind === 'event' ? b.data.timestamp : b.data.timestamp;
      return ta < tb ? -1 : 1;
    });

    // Group by chapter
    const byChapter: Record<number, TimelineItem[]> = {};
    items.forEach(item => {
      const ch = item.kind === 'decision' ? item.data.chapter : 0;
      if (!byChapter[ch]) byChapter[ch] = [];
      byChapter[ch].push(item);
    });

    return byChapter;
  }, [eventLog, decisions]);

  const chapters = Object.keys(grouped).map(Number).sort((a, b) => a - b);
  const totalItems = eventLog.length + decisions.length;

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
            ► OPERATION TIMELINE
          </h1>
          <div className="text-xs text-muted-foreground mt-2 tracking-widest">
            CHRONOLOGICAL DECISION LOG — ACT I — {totalItems} ENTRIES
          </div>
        </div>

        {totalItems === 0 && (
          <div className="border border-border p-8 text-center text-muted-foreground text-sm bg-card">
            [ NO EVENTS RECORDED — BEGIN OPERATION TO POPULATE TIMELINE ]
          </div>
        )}

        {chapters.map(ch => (
          <div key={ch} className="mb-8">
            <div className="text-xs text-accent tracking-widest mb-4 border-b border-border pb-2">
              {CHAPTER_LABELS[ch] ?? ('CHAPTER ' + ch)}
            </div>

            <div className="space-y-3 pl-4 border-l border-border">
              {grouped[ch].map((item, idx) => {
                if (item.kind === 'decision') {
                  const d = item.data;
                  const colorClass = IMPACT_COLORS[d.impact] ?? 'text-primary border-primary';
                  return (
                    <div key={d.id + idx} className="relative">
                      <div className="absolute -left-5 top-2 w-2 h-2 border border-accent bg-background" />
                      <div className="border border-border p-3 bg-card">
                        <div className="flex justify-between items-start gap-3 mb-1">
                          <span className="text-xs text-foreground leading-relaxed">{d.label}</span>
                          <span className={'text-xs border px-2 py-0.5 shrink-0 tracking-widest ' + colorClass}>
                            {IMPACT_LABELS[d.impact]}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(d.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const e = item.data;
                  const typeColor =
                    e.type === 'alert' ? 'text-destructive' :
                    e.type === 'discovery' ? 'text-accent' :
                    e.type === 'choice' ? 'text-primary' : 'text-muted-foreground';
                  return (
                    <div key={e.id + idx} className="relative">
                      <div className="absolute -left-4 top-2 w-1.5 h-1.5 rounded-full bg-border" />
                      <div className={'text-xs leading-relaxed ' + typeColor}>
                        <span className="text-muted-foreground mr-2">
                          {new Date(e.timestamp).toLocaleTimeString()}
                        </span>
                        {e.text}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}

        <div className="mt-8 border-t border-border pt-4">
          <Link href="/game" className="text-muted-foreground hover:text-primary transition-colors text-sm" onClick={() => soundManager.play('ui.navigate')}>
            &gt; RETURN TO OPERATION
          </Link>
        </div>
      </div>
    </div>
  );
}
