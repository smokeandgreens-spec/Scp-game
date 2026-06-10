import { useGameStore } from '../store/gameStore';
import { Link } from 'wouter';
import { EventLogEntry } from '../types/game';

const TYPE_STYLES: Record<EventLogEntry['type'], string> = {
  choice: 'text-primary',
  event: 'text-accent',
  discovery: 'text-foreground',
  alert: 'text-destructive',
  system: 'text-muted-foreground',
};

const TYPE_PREFIX: Record<EventLogEntry['type'], string> = {
  choice: '[DIRECTIVE]',
  event: '[EVENT]',
  discovery: '[DISCOVERY]',
  alert: '[ALERT]',
  system: '[SYSTEM]',
};

export default function EventLog() {
  const eventLog = useGameStore(s => s.eventLog);

  return (
    <div className="min-h-screen bg-background text-primary font-mono p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-1">
            <Link href="/game" className="hover:text-primary transition-colors">&lt; RETURN TO OPERATION</Link>
          </div>
          <h1 className="text-2xl font-bold tracking-widest mt-4 border-b border-border pb-4 glitch-text">
            ► EVENT LOG
          </h1>
          <div className="text-xs text-muted-foreground mt-2 tracking-widest">
            CLASSIFICATION: SECRET — O5-1 EYES ONLY
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-2 tracking-widest">
          TOTAL ENTRIES: {eventLog.length}
        </div>

        {eventLog.length === 0 && (
          <div className="border border-border p-8 text-center text-muted-foreground">
            <div className="text-lg mb-2">[ NO EVENTS RECORDED ]</div>
            <div className="text-xs">Begin a new operation to generate event entries.</div>
          </div>
        )}

        <div className="flex flex-col gap-0">
          {[...eventLog].reverse().map((entry, i) => (
            <div
              key={entry.id}
              className="border-b border-border py-4 px-2 animate-fade-in-up"
              style={{ animationDelay: i * 20 + 'ms' }}
              data-testid={'event-entry-' + entry.id}
            >
              <div className="flex gap-4 items-start">
                <div className="text-muted-foreground text-xs shrink-0 w-24">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
                <div className="flex-grow">
                  <span className={'text-xs mr-2 tracking-widest ' + (TYPE_STYLES[entry.type] || 'text-primary')}>
                    {TYPE_PREFIX[entry.type]}
                  </span>
                  <span className="text-sm text-foreground">{entry.text}</span>
                </div>
              </div>
            </div>
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
