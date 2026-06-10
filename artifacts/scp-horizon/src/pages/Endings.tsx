import { useGameStore } from '../store/gameStore';
import { Link } from 'wouter';

const ENDING_DATA = {
  observer: {
    label: 'THE OBSERVER',
    subtitle: 'High Knowledge',
    color: 'text-primary',
    borderColor: 'border-primary',
    description: 'You chose to watch. You always have. Understanding the anomaly became your primary directive, and in the years that followed, SCP-5005 waited for you to have enough information to understand what it was saying.',
    nextAct: 'ACT II: THE WITNESS',
  },
  caretaker: {
    label: 'THE CARETAKER',
    subtitle: 'High Trust',
    color: 'text-accent',
    borderColor: 'border-accent',
    description: 'You reached out. In the empty monitoring room, you offered communication before containment. A handprint appeared on the glass. Small. A child\'s hand. You will spend the next two years finding out whose hand it was.',
    nextAct: 'ACT II: THE WITNESS',
  },
  warden: {
    label: 'THE WARDEN',
    subtitle: 'High Fear',
    color: 'text-destructive',
    borderColor: 'border-destructive',
    description: 'You locked it down. Eight months of silence. Then every monitoring system in the sealed section displayed the same image simultaneously. A girl, standing in a forest clearing. Looking at the camera. Waiting.',
    nextAct: 'ACT II: THE WITNESS',
  },
};

export default function Endings() {
  const { stats, currentNodeId } = useGameStore();

  const determineEnding = () => {
    if (stats.visible.knowledge >= 60) return 'observer';
    if (stats.visible.trust >= 60) return 'caretaker';
    return 'warden';
  };

  const endingKey = currentNodeId.startsWith('ending-')
    ? currentNodeId.replace('ending-', '') as keyof typeof ENDING_DATA
    : determineEnding();

  const ending = ENDING_DATA[endingKey] || ENDING_DATA.warden;

  return (
    <div className="min-h-screen bg-background text-primary font-mono p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">

        {/* Classification */}
        <div className="text-center mb-10">
          <div className="text-xs text-destructive tracking-[0.4em] border border-destructive inline-block px-4 py-1 mb-4">
            [ END OF ACT I ]
          </div>
        </div>

        {/* Ending Card */}
        <div className={'border-2 ' + ending.borderColor + ' p-8 bg-card mb-8 text-center'}>
          <div className="text-xs text-muted-foreground tracking-widest mb-4">
            — ACT I ENDING —
          </div>
          <h1 className={'text-3xl sm:text-4xl font-bold tracking-widest mb-2 glitch-text ' + ending.color}>
            {ending.label}
          </h1>
          <div className={'text-sm tracking-widest mb-8 ' + ending.color}>
            [ {ending.subtitle} ]
          </div>
          <div className="border-t border-border pt-6">
            <p className="text-foreground text-sm leading-relaxed mb-6">
              {ending.description}
            </p>
          </div>
        </div>

        {/* Stats summary */}
        <div className="border border-border p-4 bg-card mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-4">FINAL STATISTICS</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: 'KNOWLEDGE', value: stats.visible.knowledge },
              { label: 'TRUST', value: stats.visible.trust },
              { label: 'FEAR', value: stats.visible.fear },
              { label: 'AUTHORITY', value: stats.visible.authority },
            ].map(stat => (
              <div key={stat.label}>
                <span className="text-muted-foreground text-xs tracking-widest">{stat.label}: </span>
                <span className="text-primary font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Act teaser */}
        <div className="border border-border p-6 text-center mb-8 bg-card">
          <div className="text-xs text-muted-foreground tracking-widest mb-2">COMING NEXT</div>
          <div className="text-accent tracking-widest text-lg font-bold">{ending.nextAct}</div>
          <div className="text-xs text-muted-foreground mt-2">
            The operation is not over. The girl was only the beginning.
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary transition-colors text-sm border border-border px-6 py-3 text-center tracking-widest hover:border-primary"
            data-testid="link-main-menu"
          >
            &gt; MAIN MENU
          </Link>
          <Link
            href="/statistics"
            className="text-muted-foreground hover:text-primary transition-colors text-sm border border-border px-6 py-3 text-center tracking-widest hover:border-primary"
            data-testid="link-statistics"
          >
            &gt; VIEW STATISTICS
          </Link>
        </div>
      </div>
    </div>
  );
}
