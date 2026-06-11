import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useTypewriter } from '../hooks/useTypewriter';
import { STORY_NODES } from '../data/storyNodes';
import { PUZZLE_DEFS } from '../data/puzzles';
import { Link, useLocation } from 'wouter';
import { Choice } from '../types/game';
import { soundManager } from '../audio';
import PuzzleModal from '../components/PuzzleModal';
import { useToastStore } from '../store/toastStore';

function ProgressBar({ value, label, isWarning = false }: { value: number; label: string; isWarning?: boolean }) {
  const bars = Math.floor(Math.max(0, Math.min(100, value)) / 10);
  const filled = '▓'.repeat(bars);
  const empty = '░'.repeat(10 - bars);
  const colorClass = isWarning ? 'text-accent' : 'text-primary';
  return (
    <div className="flex justify-between items-center text-xs mb-2" data-testid={'stat-bar-' + label.toLowerCase()}>
      <span className="w-20 text-muted-foreground">{label}</span>
      <span className={'font-mono stat-bar ' + colorClass}>
        [{filled}{empty}] {String(value).padStart(3, ' ')}
      </span>
    </div>
  );
}

function NarrativeParagraph({ text, onComplete, isLast }: { text: string; onComplete?: () => void; isLast: boolean }) {
  const { displayedText, isDone, skip } = useTypewriter(text, onComplete);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isDone) skip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDone, skip]);

  return (
    <p
      className="mb-5 text-foreground leading-relaxed cursor-pointer text-sm sm:text-base"
      onClick={!isDone ? skip : undefined}
      data-testid="narrative-paragraph"
    >
      {displayedText}
      {!isDone && <span className="animate-cursor-blink">_</span>}
      {isDone && isLast && <span className="animate-cursor-blink ml-1">_</span>}
    </p>
  );
}

export default function GameView() {
  const {
    currentNodeId, stats, advanceNarrative, makeChoice, eventLog,
    completePuzzle, isPuzzleCompleted, setFlags, unlockAchievement,
    applyStatEffects, addJournalEntry, saveGame, currentSaveSlot,
  } = useGameStore();
  const [, setLocation] = useLocation();
  const node = STORY_NODES[currentNodeId];
  const textArray = Array.isArray(node?.text) ? node.text : [node?.text || ''];

  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [choicesVisible, setChoicesVisible] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null);

  // Reset paragraph state and check for puzzle trigger on node change
  useEffect(() => {
    setCurrentParagraphIndex(0);
    setChoicesVisible(false);
    setShowContinue(false);
    if (node?.type === 'chapter-start') {
      soundManager.play('game.chapter-start');
    }
    // Trigger puzzle if node has one and it hasn't been done yet
    if (node?.triggersPuzzle && !isPuzzleCompleted(node.triggersPuzzle)) {
      setActivePuzzleId(node.triggersPuzzle);
    }
  }, [currentNodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle puzzle completion: apply rewards then clear overlay
  const { pushToast } = useToastStore();

  const handlePuzzleComplete = useCallback((succeeded: boolean) => {
    if (!activePuzzleId) return;
    completePuzzle(activePuzzleId, succeeded);
    if (succeeded) {
      const puzzleDef = PUZZLE_DEFS[activePuzzleId];
      if (puzzleDef?.reward) {
        const { statEffects, flags, achievementId, journalEntryId } = puzzleDef.reward;
        if (statEffects) {
          applyStatEffects(statEffects);
          Object.entries(statEffects).forEach(([k, v]) => {
            if (v && v > 0) {
              pushToast({ type: 'reward', title: '+' + v + ' ' + k.toUpperCase(), subtitle: 'ANALYSIS REWARD APPLIED', duration: 3200 });
            }
          });
        }
        if (flags) setFlags(flags);
        if (achievementId) unlockAchievement(achievementId);
        if (journalEntryId) addJournalEntry(journalEntryId);
      }
    } else {
      pushToast({ type: 'info', title: 'ANALYSIS FORFEITED', subtitle: 'No reward data will be recorded.', duration: 2800 });
    }
    setActivePuzzleId(null);
    saveGame(currentSaveSlot);
  }, [activePuzzleId, completePuzzle, applyStatEffects, setFlags, unlockAchievement, addJournalEntry, saveGame, currentSaveSlot, pushToast]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePuzzleId) return; // Block keyboard nav while puzzle is open
      if (!choicesVisible && showContinue && (e.key === 'Enter' || e.key === ' ')) {
        handleContinue();
      }
      if (choicesVisible && node?.choices) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= node.choices.length) {
          soundManager.play('game.choice-select');
          handleChoice(node.choices[num - 1]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!node) {
    return (
      <div className="min-h-screen bg-background text-destructive p-8 font-mono flex items-center justify-center">
        <div>
          <p>ERROR: NODE NOT FOUND [{currentNodeId}]</p>
          <Link href="/" className="text-primary mt-4 block">&gt; RETURN TO MAIN MENU</Link>
        </div>
      </div>
    );
  }

  const handleParagraphComplete = () => {
    if (currentParagraphIndex < textArray.length - 1) {
      setTimeout(() => setCurrentParagraphIndex(p => p + 1), 150);
    } else {
      if (node.type === 'choice') {
        setChoicesVisible(true);
        soundManager.play('game.choices-appear');
      } else {
        setShowContinue(true);
      }
    }
  };

  const handleContinue = () => {
    soundManager.play('game.continue');
    if (node.autoAdvanceToNodeId) {
      advanceNarrative(node.autoAdvanceToNodeId);
    } else if (node.nextNodeId) {
      advanceNarrative(node.nextNodeId);
    } else if (node.type === 'ending') {
      soundManager.play('game.ending');
      setLocation('/endings');
    }
  };

  const handleChoice = (choice: Choice) => {
    soundManager.play('game.choice-select');
    makeChoice(choice);
  };

  return (
    <div className="min-h-screen bg-background text-primary font-mono flex flex-col md:flex-row terminal-flicker">

      {/* Puzzle overlay — rendered on top of everything */}
      {activePuzzleId && (
        <PuzzleModal puzzleId={activePuzzleId} onComplete={handlePuzzleComplete} />
      )}

      {/* LEFT SIDEBAR */}
      <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-border p-4 bg-card shrink-0 flex flex-col">
        <div className="mb-6">
          <div className="text-xs text-muted-foreground mb-1 tracking-widest">DESIGNATION</div>
          <div className="font-bold text-foreground text-sm">O5-1</div>
          <div className="text-xs text-muted-foreground">{'ACT I — CH.' + node.chapter}</div>
        </div>

        <div className="mb-6">
          <div className="text-xs text-muted-foreground mb-3 border-b border-border pb-1 tracking-widest">PSYCH PROFILE</div>
          <ProgressBar value={stats.visible.knowledge} label="KNOWLEDGE" />
          <ProgressBar value={stats.visible.trust} label="TRUST" />
          <ProgressBar value={stats.visible.fear} label="FEAR" isWarning />
          <ProgressBar value={stats.visible.authority} label="AUTHORITY" isWarning />
        </div>

        <div className="mt-auto">
          <div className="text-xs text-muted-foreground mb-3 border-b border-border pb-1 tracking-widest">SYSTEM LINKS</div>
          <div className="flex flex-col gap-1 text-xs">
            <Link href="/timeline" className="text-muted-foreground hover:text-primary transition-colors py-1"
              onClick={() => soundManager.play('ui.navigate')}>&gt; TIMELINE</Link>
            <Link href="/journal" className="text-muted-foreground hover:text-primary transition-colors py-1" data-testid="link-journal"
              onClick={() => soundManager.play('ui.navigate')}>&gt; JOURNAL</Link>
            <Link href="/codex" className="text-muted-foreground hover:text-primary transition-colors py-1"
              onClick={() => soundManager.play('ui.navigate')}>&gt; CODEX</Link>
            <Link href="/scp-db" className="text-muted-foreground hover:text-primary transition-colors py-1"
              onClick={() => soundManager.play('ui.navigate')}>&gt; SCP DATABASE</Link>
            <Link href="/analysis" className="text-muted-foreground hover:text-primary transition-colors py-1"
              onClick={() => soundManager.play('ui.navigate')}>&gt; QFAC ANALYSIS</Link>
            <Link href="/achievements" className="text-muted-foreground hover:text-primary transition-colors py-1"
              onClick={() => soundManager.play('ui.navigate')}>&gt; ACHIEVEMENTS</Link>
            <Link href="/statistics" className="text-muted-foreground hover:text-primary transition-colors py-1" data-testid="link-statistics"
              onClick={() => soundManager.play('ui.navigate')}>&gt; STATISTICS</Link>
            <Link href="/saves" className="text-muted-foreground hover:text-primary transition-colors py-1" data-testid="link-saves"
              onClick={() => soundManager.play('ui.navigate')}>&gt; SAVE GAME</Link>
            <Link href="/" className="text-muted-foreground hover:text-destructive transition-colors py-1 mt-2" data-testid="link-main-menu"
              onClick={() => soundManager.play('ui.back')}>&gt; MAIN MENU</Link>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow p-4 sm:p-8 max-w-3xl w-full mx-auto relative overflow-y-auto">

        {node.metadata && (
          <div className="classification-header text-xs mb-8 animate-fade-in-up">
            <div className="text-muted-foreground mb-1">╔═══════════════════════════════════════════╗</div>
            <div className="grid grid-cols-[130px_1fr] gap-y-1 px-2">
              <span className="text-muted-foreground">CLASSIFICATION:</span>
              <span className="text-destructive font-bold tracking-widest">{node.metadata.classification || 'UNKNOWN'}</span>
              {node.metadata.date && <>
                <span className="text-muted-foreground">DATE:</span>
                <span className="text-foreground">{node.metadata.date}{node.metadata.time ? ' — ' + node.metadata.time : ''}</span>
              </>}
              {node.metadata.location && <>
                <span className="text-muted-foreground">LOCATION:</span>
                <span className="text-foreground text-xs">{node.metadata.location}</span>
              </>}
            </div>
            <div className="text-muted-foreground mt-1">╚═══════════════════════════════════════════╝</div>
          </div>
        )}

        {(node.type === 'chapter-start' || node.type === 'ending') && node.chapterTitle && (
          <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-10 border-b border-border pb-4 mt-4 glitch-text tracking-widest" data-testid="chapter-title">
            {node.chapterTitle || node.title}
          </h2>
        )}

        {node.type === 'choice' && node.title && (
          <h3 className="text-base sm:text-lg font-bold text-accent mb-6 tracking-widest border-b border-border pb-2" data-testid="choice-title">
            ► {node.title}
          </h3>
        )}

        <div className="mb-10">
          {textArray.slice(0, currentParagraphIndex + 1).map((txt, idx) => (
            <NarrativeParagraph
              key={currentNodeId + '-' + idx}
              text={txt}
              onComplete={idx === currentParagraphIndex ? handleParagraphComplete : undefined}
              isLast={idx === currentParagraphIndex && !showContinue && !choicesVisible}
            />
          ))}
        </div>

        <div className="mt-6 mb-16">
          {showContinue && (
            <button
              onClick={handleContinue}
              className="text-foreground hover:text-primary hover:bg-card px-6 py-3 border border-border transition-colors animate-fade-in-up tracking-widest text-sm"
              data-testid="button-continue"
            >
              [ CONTINUE ► ]
            </button>
          )}

          {choicesVisible && node.choices && (
            <div className="flex flex-col gap-3 animate-fade-in-up">
              <div className="text-xs text-muted-foreground mb-2 tracking-widest">
                {'— SELECT DIRECTIVE — KEYBOARD: [1]-[' + node.choices.length + '] —'}
              </div>
              {node.choices.map((choice, idx) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  onMouseEnter={() => soundManager.play('ui.click')}
                  className="text-left p-4 border border-border hover:bg-card hover:border-primary transition-colors group flex gap-4 items-start"
                  data-testid={'button-choice-' + (idx + 1)}
                >
                  <span className="text-muted-foreground group-hover:text-accent shrink-0 text-sm">[{idx + 1}]</span>
                  <span className="text-foreground text-sm leading-relaxed">{choice.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR (Desktop only) */}
      <div className="hidden xl:block w-64 border-l border-border p-4 bg-card shrink-0 overflow-y-auto">
        <div className="text-xs text-muted-foreground mb-4 border-b border-border pb-1 tracking-widest">RECENT EVENTS</div>
        <div className="flex flex-col gap-3">
          {eventLog.length === 0 && (
            <div className="text-xs text-muted-foreground italic">[ NO EVENTS RECORDED ]</div>
          )}
          {eventLog.slice(-6).reverse().map(log => (
            <div key={log.id} className="text-xs border-b border-border pb-3 last:border-0">
              <div className="text-muted-foreground mb-1 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</div>
              <div className="text-primary leading-relaxed">{log.text}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
