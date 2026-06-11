import { useMemo } from 'react';
import { Link } from 'wouter';
import { useGameStore } from '../store/gameStore';
import { CharacterProfile, CharacterRelationship } from '../types/game';
import { CHARACTERS } from '../data/storyNodes';
import { soundManager } from '../audio';

const STATUS_COLORS: Record<CharacterProfile['status'], string> = {
  active: 'text-primary border-primary',
  kia: 'text-destructive border-destructive',
  missing: 'text-accent border-accent',
  amnesticized: 'text-muted-foreground border-muted-foreground',
  anomalous: 'text-accent border-accent',
};

const STATUS_LABELS: Record<CharacterProfile['status'], string> = {
  active: 'ACTIVE', kia: 'KIA', missing: 'MIA', amnesticized: 'AMNESTICIZED', anomalous: 'ANOMALOUS',
};

function RelBar({ label, value, color = 'primary' }: { label: string; value: number; color?: string }) {
  const bars = Math.floor(value / 10);
  const colorClass = color === 'destructive' ? 'text-destructive' : color === 'accent' ? 'text-accent' : 'text-primary';
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground tracking-widest">{label}</span>
        <span className={colorClass + ' font-bold'}>{value}</span>
      </div>
      <div className={'font-mono text-xs stat-bar ' + colorClass}>
        {'[' + '▓'.repeat(bars) + '░'.repeat(10 - bars) + ']'}
      </div>
    </div>
  );
}

function CharacterCodexCard({
  character, unlocked, relationship,
}: {
  character: CharacterProfile;
  unlocked: boolean;
  relationship?: CharacterRelationship;
}) {
  if (!unlocked) {
    return (
      <div className="border border-border p-4 bg-card">
        <div className="text-xs text-muted-foreground tracking-widest mb-1">CLEARANCE INSUFFICIENT</div>
        <div className="text-foreground font-bold text-sm">[ CLASSIFIED ]</div>
        <div className="text-xs text-muted-foreground mt-1">File locked pending field encounter.</div>
      </div>
    );
  }

  const isRedacted = character.isRedacted;
  const statusColor = STATUS_COLORS[character.status] || 'text-primary border-primary';

  return (
    <div className="border border-border p-4 bg-card hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs text-muted-foreground tracking-widest mb-1">
            CLEARANCE LVL {character.clearanceLevel}
          </div>
          <div className="text-foreground font-bold text-base">
            {isRedacted ? <span className="redacted px-1">{character.name}</span> : character.name}
          </div>
        </div>
        <div className={'text-xs border px-2 py-1 tracking-widest ' + statusColor}>
          {STATUS_LABELS[character.status]}
        </div>
      </div>

      <div className="text-xs text-muted-foreground mb-1 tracking-widest">{character.designation}</div>

      {!isRedacted && (
        <div className="border-t border-border mt-3 pt-3">
          <p className="text-sm text-foreground leading-relaxed">{character.description}</p>
        </div>
      )}

      {isRedacted && (
        <div className="border-t border-border mt-3 pt-3">
          <div className="text-xs text-muted-foreground">[ DESCRIPTION REDACTED — THAUMIEL CLASSIFICATION ]</div>
        </div>
      )}

      {character.notes.length > 0 && !isRedacted && (
        <div className="border-t border-border mt-3 pt-3">
          <div className="text-xs text-muted-foreground tracking-widest mb-2">FIELD NOTES:</div>
          {character.notes.map((note, i) => (
            <div key={i} className="text-xs text-muted-foreground mb-1">— {note}</div>
          ))}
        </div>
      )}

      {/* Relationship metrics (v2) */}
      {relationship && !isRedacted && (
        <div className="border-t border-border mt-3 pt-3">
          <div className="text-xs text-muted-foreground tracking-widest mb-3">
            RELATIONSHIP METRICS — {relationship.interactions} INTERACTION{relationship.interactions !== 1 ? 'S' : ''}
          </div>
          <RelBar label="TRUST" value={relationship.trust} color="primary" />
          <RelBar label="AFFINITY" value={relationship.affinity} color="accent" />
        </div>
      )}
    </div>
  );
}

export default function Codex() {
  const unlockedCharacters = useGameStore(s => s.characters);
  const relationships = useGameStore(s => s.relationships);
  const allCharacterIds = useMemo(() => Object.keys(CHARACTERS), []);
  const unlockedCount = Object.keys(unlockedCharacters).length;

  return (
    <div className="min-h-screen bg-background text-primary font-mono p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-1">
            <Link href="/game" className="hover:text-primary transition-colors" onClick={() => soundManager.play('ui.navigate')}>
              &lt; RETURN TO OPERATION
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-widest mt-4 border-b border-border pb-4 glitch-text">
            ► PERSONNEL CODEX
          </h1>
          <div className="text-xs text-muted-foreground mt-2 tracking-widest">
            PERSONNEL FILES + RELATIONSHIP METRICS — SITE-19 — ACT I ROSTER
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-6 border border-border p-3 bg-card">
          <div className="mb-1">FILES UNLOCKED: {unlockedCount} / {allCharacterIds.length}</div>
          <div className="text-muted-foreground/60">
            Relationship metrics are populated by direct interactions and choice consequences. Values reflect the current state of each relationship based on your decisions.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {allCharacterIds.map(id => (
            <CharacterCodexCard
              key={id}
              character={CHARACTERS[id]}
              unlocked={!!unlockedCharacters[id]}
              relationship={relationships[id]}
            />
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="mb-2">
            Characters are unlocked as they are encountered. Relationship metrics update based on your decisions and their consequences.
          </div>
          <Link href="/game" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => soundManager.play('ui.navigate')}>
            &gt; RETURN TO OPERATION
          </Link>
        </div>
      </div>
    </div>
  );
}
