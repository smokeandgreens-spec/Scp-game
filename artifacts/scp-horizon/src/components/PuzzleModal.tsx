import { useState } from 'react';
import { PUZZLE_DEFS } from '../data/puzzles';
import MemoryGrid from './puzzles/MemoryGrid';
import SymbolSequence from './puzzles/SymbolSequence';

type ModalPhase = 'briefing' | 'playing';

interface PuzzleModalProps {
  puzzleId: string;
  onComplete: (succeeded: boolean) => void;
}

export default function PuzzleModal({ puzzleId, onComplete }: PuzzleModalProps) {
  const [phase, setPhase] = useState<ModalPhase>('briefing');
  const puzzleDef = PUZZLE_DEFS[puzzleId];

  if (!puzzleDef) {
    onComplete(false);
    return null;
  }

  const flavorLines = puzzleDef.flavor.split('\n');

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-xl border border-border bg-background">

        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="text-xs text-destructive tracking-widest mb-1">
            ► FOUNDATION ANALYSIS PROTOCOL — ACTIVE
          </div>
          <div className="text-lg font-bold text-foreground tracking-widest">
            {puzzleDef.title}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {'ACT I — CHAPTER ' + puzzleDef.chapter + ' — SUPPLEMENTAL ANALYSIS'}
          </div>
        </div>

        <div className="px-6 py-6">

          {/* BRIEFING PHASE */}
          {phase === 'briefing' && (
            <div>
              <div className="text-xs text-muted-foreground tracking-widest mb-4 border-b border-border pb-2">
                FIELD BRIEF
              </div>
              <div className="mb-6 space-y-2">
                {flavorLines.map((line, i) => (
                  <p key={i} className={
                    'text-sm leading-relaxed ' + (line === '' ? 'h-2' : 'text-foreground')
                  }>
                    {line}
                  </p>
                ))}
              </div>

              {puzzleDef.reward && (
                <div className="border border-border p-3 mb-6 bg-card">
                  <div className="text-xs text-muted-foreground tracking-widest mb-2">POTENTIAL REWARD</div>
                  <div className="text-xs text-primary space-y-1">
                    {puzzleDef.reward.statEffects && Object.entries(puzzleDef.reward.statEffects).map(([k, v]) => (
                      <div key={k}>{'+ ' + String(v) + ' ' + k.toUpperCase()}</div>
                    ))}
                    {puzzleDef.reward.flags && (
                      <div>+ ANALYSIS DATA RECORDED IN FLAGS</div>
                    )}
                    {puzzleDef.reward.achievementId && (
                      <div>+ ACHIEVEMENT UNLOCK POSSIBLE</div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setPhase('playing')}
                  className="flex-1 border border-primary text-primary hover:bg-primary/10 px-4 py-3 tracking-widest text-sm transition-colors"
                >
                  [ INITIATE ANALYSIS ]
                </button>
                <button
                  onClick={() => onComplete(false)}
                  className="border border-border text-muted-foreground hover:border-destructive hover:text-destructive px-4 py-3 tracking-widest text-sm transition-colors"
                >
                  [ FORFEIT ]
                </button>
              </div>
            </div>
          )}

          {/* PUZZLE PHASE */}
          {phase === 'playing' && (
            <div>
              {puzzleDef.type === 'memory-grid' && (
                <MemoryGrid
                  onComplete={onComplete}
                  timeLimitSeconds={puzzleDef.timeLimitSeconds ?? 90}
                />
              )}
              {puzzleDef.type === 'symbol-sequence' && (
                <SymbolSequence onComplete={onComplete} />
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
