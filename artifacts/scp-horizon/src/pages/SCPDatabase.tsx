import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { useGameStore } from '../store/gameStore';
import { SCP_ENTRIES } from '../data/scpEntries';
import { SCPEntry } from '../types/game';
import { soundManager } from '../audio';

const CLASS_COLORS: Record<string, string> = {
  Safe: 'text-primary border-primary',
  Euclid: 'text-accent border-accent',
  Keter: 'text-destructive border-destructive',
  Thaumiel: 'text-foreground border-foreground',
  Apollyon: 'text-destructive border-destructive',
  Neutralized: 'text-muted-foreground border-muted-foreground',
  Pending: 'text-accent border-accent',
};

function SCPCard({ entry }: { entry: SCPEntry }) {
  const [expanded, setExpanded] = useState(false);
  const classColor = CLASS_COLORS[entry.classification] ?? 'text-primary border-primary';

  if (entry.isRedacted) {
    return (
      <div className="border border-border p-4 bg-card mb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-xs text-muted-foreground tracking-widest mb-1">OBJECT NUMBER</div>
            <div className="font-bold text-foreground text-sm tracking-widest">{entry.objectNumber}</div>
          </div>
          <div className={'text-xs border px-2 py-1 tracking-widest ' + classColor}>
            {entry.classification.toUpperCase()}
          </div>
        </div>
        <div className="border-t border-border mt-3 pt-3">
          <div className="text-xs text-muted-foreground mb-2 tracking-widest">CONTAINMENT PROCEDURES</div>
          <div className="font-mono text-xs text-muted-foreground">[████████████████████████████] [ EXPUNGED ]</div>
        </div>
        <div className="mt-3">
          <div className="text-xs text-muted-foreground mb-2 tracking-widest">DESCRIPTION</div>
          <div className="font-mono text-xs text-muted-foreground">[████████████████████████████] [ EXPUNGED ]</div>
        </div>
        <div className="mt-3 text-xs text-destructive tracking-widest border border-destructive/30 p-2">
          ACCESS RESTRICTED — CLEARANCE INSUFFICIENT OR FILE SEALED BY O5 ORDER
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card mb-4 hover:border-primary/50 transition-colors">
      <button
        className="w-full text-left p-4"
        onClick={() => { setExpanded(e => !e); soundManager.play('ui.click'); }}
      >
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground tracking-widest mb-1">OBJECT NUMBER</div>
            <div className="font-bold text-foreground text-sm tracking-widest">{entry.objectNumber}</div>
          </div>
          <div className="flex items-start gap-3 shrink-0">
            <div className={'text-xs border px-2 py-1 tracking-widest ' + classColor}>
              {entry.classification.toUpperCase()}
            </div>
            <span className="text-muted-foreground text-xs mt-1">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-4">
          <div className="mb-4">
            <div className="text-xs text-destructive tracking-widest mb-2">
              ╔═ SPECIAL CONTAINMENT PROCEDURES ═══════════════╗
            </div>
            <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
              {entry.containmentProcedures}
            </p>
          </div>

          <div className="mb-4">
            <div className="text-xs text-destructive tracking-widest mb-2">
              ╔═ DESCRIPTION ══════════════════════════════════╗
            </div>
            <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
              {entry.description}
            </p>
          </div>

          {entry.addendum && (
            <div className="border-t border-border pt-4">
              <div className="text-xs text-muted-foreground tracking-widest mb-2">ADDENDUM</div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {entry.addendum}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SCPDatabase() {
  const flags = useGameStore(s => s.flags);
  const [filter, setFilter] = useState<string>('ALL');

  const entries = useMemo(() => {
    const all = Object.values(SCP_ENTRIES);
    // SCP-5005-classified only shown if act1 is complete (any ending seen) or a flag is set
    return all.filter(e => {
      if (e.id === 'scp-5005-classified') return !!flags['act1_complete'];
      return true;
    });
  }, [flags]);

  const classifications = useMemo(() => {
    const seen = new Set<string>();
    entries.forEach(e => seen.add(e.classification));
    return ['ALL', ...Array.from(seen)];
  }, [entries]);

  const filtered = filter === 'ALL' ? entries : entries.filter(e => e.classification === filter);

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
            ► SCP DATABASE
          </h1>
          <div className="text-xs text-muted-foreground mt-2 tracking-widest">
            FOUNDATION SECURE CONTAINMENT FILES — {entries.length} ENTRIES ACCESSIBLE
          </div>
        </div>

        {/* Classification filter */}
        <div className="mb-6">
          <div className="text-xs text-muted-foreground tracking-widest mb-2">FILTER BY CLASSIFICATION</div>
          <div className="flex flex-wrap gap-2">
            {classifications.map(cls => (
              <button
                key={cls}
                onClick={() => { setFilter(cls); soundManager.play('ui.click'); }}
                className={
                  'text-xs px-3 py-1 border tracking-widest transition-colors ' + (
                    filter === cls
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                  )
                }
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Entries */}
        <div>
          {filtered.map(entry => (
            <SCPCard key={entry.id} entry={entry} />
          ))}
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
