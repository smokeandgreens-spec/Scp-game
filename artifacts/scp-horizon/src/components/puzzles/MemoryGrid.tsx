import { useState, useEffect, useCallback } from 'react';
import { PUZZLE_SYMBOLS } from '../../data/puzzles';

interface Card {
  id: number;
  symbol: string;
  status: 'hidden' | 'revealed' | 'matched';
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(): Card[] {
  const pairs = [...PUZZLE_SYMBOLS, ...PUZZLE_SYMBOLS];
  return shuffleArray(pairs).map((symbol, id) => ({ id, symbol, status: 'hidden' }));
}

interface MemoryGridProps {
  onComplete: (succeeded: boolean) => void;
  timeLimitSeconds: number;
}

export default function MemoryGrid({ onComplete, timeLimitSeconds }: MemoryGridProps) {
  const [cards, setCards] = useState<Card[]>(() => createCards());
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
  const [matchedCount, setMatchedCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      onComplete(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, gameOver, onComplete]);

  // Win check
  useEffect(() => {
    if (matchedCount === PUZZLE_SYMBOLS.length && !gameOver) {
      setGameOver(true);
      onComplete(true);
    }
  }, [matchedCount, gameOver, onComplete]);

  const handleCardClick = useCallback((id: number) => {
    if (isChecking || gameOver) return;
    const card = cards[id];
    if (card.status !== 'hidden') return;
    if (revealedIds.includes(id)) return;

    const newRevealed = [...revealedIds, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, status: 'revealed' } : c));

    if (newRevealed.length === 2) {
      setIsChecking(true);
      const [first, second] = newRevealed;
      const firstCard = cards[first];
      const secondCard = cards[id];

      if (firstCard.symbol === secondCard.symbol) {
        // Match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === first || c.id === second ? { ...c, status: 'matched' } : c
          ));
          setRevealedIds([]);
          setMatchedCount(n => n + 1);
          setIsChecking(false);
        }, 400);
      } else {
        // No match — flip back
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === first || c.id === second ? { ...c, status: 'hidden' } : c
          ));
          setRevealedIds([]);
          setIsChecking(false);
        }, 900);
      }
    } else {
      setRevealedIds(newRevealed);
    }
  }, [cards, revealedIds, isChecking, gameOver]);

  const timerPercent = Math.round((timeLeft / timeLimitSeconds) * 100);
  const timerBars = Math.floor(timerPercent / 5);
  const timerColor = timeLeft > 30 ? 'text-primary' : timeLeft > 10 ? 'text-accent' : 'text-destructive';

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Timer */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="text-muted-foreground tracking-widest">TIME REMAINING</span>
          <span className={timerColor + ' font-bold'}>{timeLeft}s</span>
        </div>
        <div className={'font-mono text-xs ' + timerColor}>
          {'[' + '▓'.repeat(timerBars) + '░'.repeat(20 - timerBars) + ']'}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5 text-xs text-muted-foreground tracking-widest">
        {'PAIRS MATCHED: ' + matchedCount + ' / ' + PUZZLE_SYMBOLS.length}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.status !== 'hidden' || isChecking || gameOver}
            className={
              'h-14 w-full border font-mono text-xl transition-all duration-200 ' + (
                card.status === 'matched'
                  ? 'border-primary text-primary bg-primary/10 cursor-default'
                  : card.status === 'revealed'
                    ? 'border-accent text-accent bg-accent/10 cursor-default'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary bg-card cursor-pointer'
              )
            }
          >
            {card.status === 'hidden' ? '?' : card.symbol}
          </button>
        ))}
      </div>

      {/* Forfeit */}
      <div className="text-center">
        <button
          onClick={() => { setGameOver(true); onComplete(false); }}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors tracking-widest border border-border hover:border-destructive px-4 py-2"
        >
          [ FORFEIT ANALYSIS ]
        </button>
      </div>
    </div>
  );
}
