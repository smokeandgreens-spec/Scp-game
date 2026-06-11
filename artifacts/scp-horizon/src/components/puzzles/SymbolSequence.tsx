import { useState, useEffect, useCallback } from 'react';
import { SEQUENCE_SYMBOLS } from '../../data/puzzles';

type Phase = 'intro' | 'showing' | 'input' | 'round-correct' | 'round-wrong' | 'complete' | 'forfeited';

const ROUND_LENGTHS = [3, 4, 5];

function generateSequence(length: number): string[] {
  const seq: string[] = [];
  for (let i = 0; i < length; i++) {
    seq.push(SEQUENCE_SYMBOLS[Math.floor(Math.random() * SEQUENCE_SYMBOLS.length)]);
  }
  return seq;
}

interface SymbolSequenceProps {
  onComplete: (succeeded: boolean) => void;
}

export default function SymbolSequence({ onComplete }: SymbolSequenceProps) {
  const [round, setRound] = useState(0); // 0-indexed
  const [phase, setPhase] = useState<Phase>('intro');
  const [sequence, setSequence] = useState<string[]>([]);
  const [showIndex, setShowIndex] = useState(-1); // which symbol is lit up
  const [playerInput, setPlayerInput] = useState<string[]>([]);

  // Start a round
  const startRound = useCallback((roundIndex: number) => {
    const seq = generateSequence(ROUND_LENGTHS[roundIndex]);
    setSequence(seq);
    setPlayerInput([]);
    setShowIndex(-1);
    setPhase('showing');
  }, []);

  // Sequence display: light up symbols one by one
  useEffect(() => {
    if (phase !== 'showing') return;
    if (showIndex >= sequence.length) {
      // Finished showing sequence — enter input phase
      const t = setTimeout(() => {
        setShowIndex(-1);
        setPhase('input');
      }, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShowIndex(i => i + 1), showIndex === -1 ? 600 : 800);
    return () => clearTimeout(t);
  }, [phase, showIndex, sequence.length]);

  // Player clicks a symbol during input phase
  const handleSymbolClick = useCallback((symbol: string) => {
    if (phase !== 'input') return;
    const newInput = [...playerInput, symbol];
    setPlayerInput(newInput);

    if (newInput.length === sequence.length) {
      // Check answer
      const correct = newInput.every((s, i) => s === sequence[i]);
      if (correct) {
        setPhase('round-correct');
        setTimeout(() => {
          const nextRound = round + 1;
          if (nextRound >= ROUND_LENGTHS.length) {
            setPhase('complete');
            onComplete(true);
          } else {
            setRound(nextRound);
            startRound(nextRound);
          }
        }, 1000);
      } else {
        setPhase('round-wrong');
        setTimeout(() => {
          setPlayerInput([]);
          setShowIndex(-1);
          setPhase('showing');
        }, 1200);
      }
    }
  }, [phase, playerInput, sequence, round, onComplete, startRound]);

  const roundLabel = 'TRIAL ' + (round + 1) + ' OF ' + ROUND_LENGTHS.length;
  const seqLength = ROUND_LENGTHS[round] ?? 0;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Round indicator */}
      {phase !== 'intro' && phase !== 'complete' && phase !== 'forfeited' && (
        <div className="mb-4">
          <div className="text-xs text-muted-foreground tracking-widest mb-1">{roundLabel}</div>
          <div className="text-xs text-muted-foreground">
            {'SEQUENCE LENGTH: ' + seqLength + ' SYMBOLS'}
          </div>
        </div>
      )}

      {/* INTRO */}
      {phase === 'intro' && (
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-6 leading-relaxed">
            A sequence of symbols will flash on screen. Memorize the order. Then reproduce it by clicking the symbols below.
          </div>
          <div className="text-xs text-muted-foreground mb-6 border border-border p-3 text-left">
            <div>TRIAL 1 — {ROUND_LENGTHS[0]} SYMBOLS</div>
            <div>TRIAL 2 — {ROUND_LENGTHS[1]} SYMBOLS</div>
            <div>TRIAL 3 — {ROUND_LENGTHS[2]} SYMBOLS</div>
          </div>
          <button
            onClick={() => startRound(0)}
            className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 tracking-widest text-sm transition-colors"
          >
            [ BEGIN TRIAL ]
          </button>
        </div>
      )}

      {/* SHOWING PHASE — display the sequence */}
      {phase === 'showing' && (
        <div>
          <div className="text-xs text-accent tracking-widest mb-6 text-center animate-pulse">
            — MEMORIZE SEQUENCE —
          </div>
          <div className="flex justify-center gap-4 mb-8 min-h-16 items-center">
            {sequence.map((sym, i) => (
              <div
                key={i}
                className={
                  'text-3xl w-12 h-12 flex items-center justify-center border transition-all duration-200 ' + (
                    i === showIndex
                      ? 'border-accent text-accent bg-accent/20 scale-110'
                      : i < showIndex
                        ? 'border-border text-muted-foreground/30'
                        : 'border-border text-muted-foreground/20'
                  )
                }
              >
                {i <= showIndex ? sym : '·'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INPUT PHASE — player enters the sequence */}
      {(phase === 'input' || phase === 'round-correct' || phase === 'round-wrong') && (
        <div>
          <div className={'text-xs tracking-widest mb-4 text-center ' + (
            phase === 'round-correct' ? 'text-primary' :
            phase === 'round-wrong' ? 'text-destructive animate-pulse' :
            'text-muted-foreground'
          )}>
            {phase === 'round-correct' ? '— PATTERN CONFIRMED —' :
             phase === 'round-wrong' ? '— INCORRECT — REPLAYING —' :
             '— INPUT SEQUENCE —'}
          </div>

          {/* Player's current input */}
          <div className="flex justify-center gap-3 mb-6 min-h-12 items-center">
            {Array.from({ length: seqLength }).map((_, i) => (
              <div
                key={i}
                className={
                  'text-2xl w-10 h-10 flex items-center justify-center border ' + (
                    i < playerInput.length ? 'border-accent text-accent' : 'border-border text-muted-foreground/20'
                  )
                }
              >
                {i < playerInput.length ? playerInput[i] : '·'}
              </div>
            ))}
          </div>

          {/* Symbol palette */}
          <div className="flex justify-center gap-3 flex-wrap mb-6">
            {SEQUENCE_SYMBOLS.map(sym => (
              <button
                key={sym}
                onClick={() => handleSymbolClick(sym)}
                disabled={phase !== 'input'}
                className={
                  'text-2xl w-12 h-12 border transition-all ' + (
                    phase !== 'input'
                      ? 'border-border text-muted-foreground/30 cursor-default'
                      : 'border-border text-muted-foreground hover:border-primary hover:text-primary cursor-pointer'
                  )
                }
              >
                {sym}
              </button>
            ))}
          </div>

          {/* Clear input */}
          {phase === 'input' && playerInput.length > 0 && (
            <div className="text-center">
              <button
                onClick={() => setPlayerInput([])}
                className="text-xs text-muted-foreground hover:text-accent transition-colors tracking-widest"
              >
                [ CLEAR INPUT ]
              </button>
            </div>
          )}
        </div>
      )}

      {/* Forfeit */}
      {(phase === 'input' || phase === 'showing') && (
        <div className="text-center mt-6">
          <button
            onClick={() => { setPhase('forfeited'); onComplete(false); }}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors tracking-widest border border-border hover:border-destructive px-4 py-2"
          >
            [ FORFEIT ANALYSIS ]
          </button>
        </div>
      )}
    </div>
  );
}
