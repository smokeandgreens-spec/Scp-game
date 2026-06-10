import { useGameStore } from '../store/gameStore';
import { Link } from 'wouter';
import { CharacterProfile } from '../types/game';
import { CHARACTERS } from '../data/storyNodes';

const STATUS_COLORS: Record<CharacterProfile['status'], string> = {
  active: 'text-primary border-primary',
  kia: 'text-destructive border-destructive',
  missing: 'text-accent border-accent',
  amnesticized: 'text-muted-foreground border-muted-foreground',
  anomalous: 'text-accent border-accent',
};

const STATUS_LABELS: Record<CharacterProfile['status'], string> = {
  active: 'ACTIVE',
  kia: 'KIA',
  missing: 'MIA',
  amnesticized: 'AMNESTICIZED',
  anomalous: 'ANOMALOUS',
};

function CharacterCard({ character, unlocked }: { character: CharacterProfile; unlocked: boolean }) {
  if (!unlocked) {
    return (
      <div className="border border-border p-4 bg-card" data-testid={'character-card-locked-' + character.id}>
        <div className="text-xs text-muted-foreground tracking-widest mb-1">CLEARANCE INSUFFICIENT</div>
        <div className="text-foreground font-bold text-sm">[ CLASSIFIED ]</div>
        <div className="text-xs text-muted-foreground mt-1">Data locked pending field encounter.</div>
      </div>
    );
  }

  const isRedacted = character.isRedacted;

  return (
    <div className="border border-border p-4 bg-card hover:border-primary transition-colors" data-testid={'character-card-' + character.id}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs text-muted-foreground tracking-widest mb-1">
            CLEARANCE LVL {character.clearanceLevel}
          </div>
          <div className="text-foreground font-bold text-base">
            {isRedacted ? <span className="redacted px-1">{character.name}</span> : character.name}
          </div>
        </div>
        <div className={'text-xs border px-2 py-1 tracking-widest ' + (STATUS_COLORS[character.status] || 'text-primary border-primary')}>
          {STATUS_LABELS[character.status]}
        </div>
      </div>

      <div className="text-xs text-muted-foreground mb-1 tracking-widest">{character.designation}</div>

      <div className="border-t border-border mt-3 pt-3">
        {isRedacted ? (
          <div className="text-xs text-muted-foreground">
            [ DESCRIPTION REDACTED — THAUMIEL CLASSIFICATION ]
          </div>
        ) : (
          <p className="text-sm text-foreground leading-relaxed">{character.description}</p>
        )}
      </div>

      {character.notes.length > 0 && !isRedacted && (
        <div className="border-t border-border mt-3 pt-3">
          <div className="text-xs text-muted-foreground tracking-widest mb-2">FIELD NOTES:</div>
          {character.notes.map((note, i) => (
            <div key={i} className="text-xs text-muted-foreground mb-1">— {note}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dossier() {
  const unlockedCharacters = useGameStore(s => s.characters);
  const allCharacterIds = Object.keys(CHARACTERS);

  return (
    <div className="min-h-screen bg-background text-primary font-mono p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-1">
            <Link href="/game" className="hover:text-primary transition-colors">&lt; RETURN TO OPERATION</Link>
          </div>
          <h1 className="text-2xl font-bold tracking-widest mt-4 border-b border-border pb-4 glitch-text">
            ► PERSONNEL DOSSIER
          </h1>
          <div className="text-xs text-muted-foreground mt-2 tracking-widest">
            PERSONNEL FILES — SITE-19 — ACT I ROSTER
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-4 tracking-widest">
          FILES UNLOCKED: {Object.keys(unlockedCharacters).length} / {allCharacterIds.length}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allCharacterIds.map(id => (
            <CharacterCard
              key={id}
              character={CHARACTERS[id]}
              unlocked={!!unlockedCharacters[id]}
            />
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="mb-2">Characters are unlocked as they are encountered during the operation.</div>
          <Link href="/game" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-game">
            &gt; RETURN TO OPERATION
          </Link>
        </div>
      </div>
    </div>
  );
}
