import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Link } from 'wouter';
import { JournalEntry } from '../types/game';

function JournalCard({ entry, isOpen, onClick }: { entry: JournalEntry; isOpen: boolean; onClick: () => void }) {
  return (
    <div
      className="border border-border hover:border-primary transition-colors cursor-pointer animate-fade-in-up"
      data-testid={'journal-entry-' + entry.id}
    >
      <button
        className="w-full text-left p-4 flex justify-between items-start gap-4"
        onClick={onClick}
        data-testid={'button-journal-' + entry.id}
      >
        <div>
          <div className="text-xs text-destructive tracking-widest mb-1">[ CLASSIFIED ]</div>
          <div className="text-foreground font-bold text-sm tracking-wider">{entry.title}</div>
          <div className="text-xs text-muted-foreground mt-1">{entry.chapter} — {entry.date}</div>
        </div>
        <div className="text-muted-foreground text-sm shrink-0">{isOpen ? '▼' : '▶'}</div>
      </button>

      {isOpen && (
        <div className="border-t border-border p-4 bg-card">
          <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-mono">
            {entry.content}
          </pre>
          {entry.isRedacted && (
            <div className="mt-4 p-2 bg-foreground text-foreground text-xs select-none">
              ████████████████████████████████████████████████████████████████
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Journal() {
  const journal = useGameStore(s => s.journal);
  const [openEntry, setOpenEntry] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-primary font-mono p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-1">
            <Link href="/game" className="hover:text-primary transition-colors">&lt; RETURN TO OPERATION</Link>
          </div>
          <h1 className="text-2xl font-bold tracking-widest mt-4 border-b border-border pb-4 glitch-text">
            ► STORY JOURNAL
          </h1>
          <div className="text-xs text-muted-foreground mt-2 tracking-widest">
            INCIDENT REPORTS — FIELD DOCUMENTS — ANALYSIS LOGS
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-4 tracking-widest">
          DOCUMENTS ON FILE: {journal.length}
        </div>

        {journal.length === 0 && (
          <div className="border border-border p-8 text-center text-muted-foreground">
            <div className="text-lg mb-2">[ NO DOCUMENTS ON FILE ]</div>
            <div className="text-xs">Documents are added as the operation progresses.</div>
            <div className="text-xs mt-1">Make choices to unlock incident reports.</div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {journal.map((entry: JournalEntry) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              isOpen={openEntry === entry.id}
              onClick={() => setOpenEntry(openEntry === entry.id ? null : entry.id)}
            />
          ))}
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
