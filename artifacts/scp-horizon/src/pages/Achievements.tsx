import { useMemo } from 'react';
import { Link } from 'wouter';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENT_DEFS } from '../data/achievements';
import { soundManager } from '../audio';

export default function Achievements() {
  const achievements = useGameStore(s => s.achievements);
  const unlockedIds = useMemo(() => new Set(achievements.map(a => a.id)), [achievements]);
  const unlockedMap = useMemo(() => {
    const m: Record<string, string> = {};
    achievements.forEach(a => { m[a.id] = a.unlockedAt; });
    return m;
  }, [achievements]);

  const allDefs = Object.values(ACHIEVEMENT_DEFS);
  const visibleDefs = allDefs.filter(d => !d.isSecret || unlockedIds.has(d.id));
  const secretCount = allDefs.filter(d => d.isSecret && !unlockedIds.has(d.id)).length;

  const unlockedCount = allDefs.filter(d => unlockedIds.has(d.id)).length;

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
            ► ACHIEVEMENT REGISTRY
          </h1>
          <div className="text-xs text-muted-foreground mt-2 tracking-widest">
            FOUNDATION ADMINISTRATIVE COMMENDATIONS — O5-1 PERSONNEL FILE
          </div>
        </div>

        {/* Summary */}
        <div className="border border-border p-4 bg-card mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-3">CLEARANCE SUMMARY</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{unlockedCount}</div>
              <div className="text-xs text-muted-foreground tracking-widest">UNLOCKED</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">{allDefs.length - unlockedCount}</div>
              <div className="text-xs text-muted-foreground tracking-widest">LOCKED</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{secretCount}</div>
              <div className="text-xs text-muted-foreground tracking-widest">REDACTED</div>
            </div>
          </div>
        </div>

        {/* Achievement list */}
        <div className="space-y-3 mb-8">
          {visibleDefs.map(def => {
            const isUnlocked = unlockedIds.has(def.id);
            const unlockedAt = unlockedMap[def.id];
            return (
              <div
                key={def.id}
                className={'border p-4 transition-colors ' + (
                  isUnlocked ? 'border-primary bg-primary/5' : 'border-border bg-card opacity-60'
                )}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={'text-lg ' + (isUnlocked ? 'text-primary' : 'text-muted-foreground')}>
                        {isUnlocked ? '▓' : '░'}
                      </span>
                      <span className={'font-bold tracking-widest text-sm ' + (isUnlocked ? 'text-foreground' : 'text-muted-foreground')}>
                        {def.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-7 leading-relaxed">
                      {def.description}
                    </p>
                    <div className={'text-xs ml-7 mt-2 ' + (isUnlocked ? 'text-primary/60' : 'text-muted-foreground/40')}>
                      {def.classification}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {isUnlocked ? (
                      <div className="text-xs text-primary border border-primary px-2 py-1 tracking-widest">
                        UNLOCKED
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground border border-border px-2 py-1 tracking-widest">
                        LOCKED
                      </div>
                    )}
                    {isUnlocked && unlockedAt && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Secret placeholder */}
          {secretCount > 0 && (
            <div className="border border-border p-4 bg-card opacity-40">
              <div className="flex items-center gap-3">
                <span className="text-lg text-muted-foreground">░</span>
                <div>
                  <div className="font-bold tracking-widest text-sm text-muted-foreground">
                    [ {secretCount} CLASSIFIED RECORD{secretCount > 1 ? 'S' : ''} ]
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Existence of additional records is not confirmed or denied.
                  </div>
                </div>
              </div>
            </div>
          )}
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
