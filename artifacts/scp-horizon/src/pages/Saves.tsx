import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useLocation, Link } from 'wouter';
import { SaveSlot } from '../types/game';

function SaveSlotCard({
  slot,
  onLoad,
  onSave,
  onDelete,
  isGameActive,
}: {
  slot: SaveSlot;
  onLoad: () => void;
  onSave: () => void;
  onDelete: () => void;
  isGameActive: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="border border-border bg-card p-4 hover:border-primary transition-colors animate-fade-in-up"
      data-testid={'save-slot-' + slot.id}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs text-muted-foreground tracking-widest mb-1">SAVE FILE {slot.id}</div>
          {slot.isEmpty ? (
            <div className="text-muted-foreground text-sm">[ EMPTY — UNINITIALIZED ]</div>
          ) : (
            <div className="text-foreground font-bold text-sm tracking-wider">{slot.name}</div>
          )}
        </div>
        {!slot.isEmpty && (
          <div className="text-xs text-primary border border-primary px-2 py-1">
            ACT I
          </div>
        )}
      </div>

      {!slot.isEmpty && (
        <div className="border-t border-border pt-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="text-muted-foreground">SAVED: </span>
              <span className="text-foreground">
                {new Date(slot.savedAt).toLocaleDateString()} {new Date(slot.savedAt).toLocaleTimeString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">CHOICES: </span>
              <span className="text-foreground">{slot.choiceHistory.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">KNOWLEDGE: </span>
              <span className="text-primary">{slot.stats.visible.knowledge}</span>
            </div>
            <div>
              <span className="text-muted-foreground">TRUST: </span>
              <span className="text-primary">{slot.stats.visible.trust}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {!slot.isEmpty && (
          <button
            onClick={onLoad}
            className="text-xs border border-primary text-primary px-4 py-2 hover:bg-primary hover:text-background transition-colors tracking-widest"
            data-testid={'button-load-' + slot.id}
          >
            LOAD
          </button>
        )}
        {isGameActive && (
          <button
            onClick={onSave}
            className="text-xs border border-border text-foreground px-4 py-2 hover:border-primary hover:text-primary transition-colors tracking-widest"
            data-testid={'button-save-' + slot.id}
          >
            SAVE HERE
          </button>
        )}
        {!slot.isEmpty && !confirmDelete && (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-xs border border-border text-muted-foreground px-4 py-2 hover:border-destructive hover:text-destructive transition-colors tracking-widest"
            data-testid={'button-delete-' + slot.id}
          >
            DELETE
          </button>
        )}
        {confirmDelete && (
          <div className="flex gap-2 items-center">
            <span className="text-xs text-destructive tracking-widest">CONFIRM DELETE?</span>
            <button
              onClick={() => { onDelete(); setConfirmDelete(false); }}
              className="text-xs border border-destructive text-destructive px-3 py-2 hover:bg-destructive hover:text-background transition-colors tracking-widest"
              data-testid={'button-confirm-delete-' + slot.id}
            >
              CONFIRM
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs border border-border text-muted-foreground px-3 py-2 hover:border-primary transition-colors tracking-widest"
              data-testid={'button-cancel-delete-' + slot.id}
            >
              CANCEL
            </button>
          </div>
        )}
        {slot.isEmpty && !isGameActive && (
          <div className="text-xs text-muted-foreground italic">No active game to save.</div>
        )}
      </div>
    </div>
  );
}

export default function Saves() {
  const { getSaveSlots, loadGame, saveGame, deleteSave, isGameActive } = useGameStore();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState('');
  const [slots, setSlots] = useState(() => getSaveSlots());

  const refreshSlots = () => setSlots(getSaveSlots());

  const handleLoad = (slotId: number) => {
    loadGame(slotId);
    setLocation('/game');
  };

  const handleSave = (slotId: number) => {
    saveGame(slotId);
    setMessage('GAME SAVED TO SLOT ' + slotId + '.');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDelete = (slotId: number) => {
    deleteSave(slotId);
    setMessage('SAVE FILE ' + slotId + ' DELETED.');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-primary font-mono p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-1">
            <Link href={isGameActive ? '/game' : '/'} className="hover:text-primary transition-colors">
              &lt; {isGameActive ? 'RETURN TO OPERATION' : 'RETURN TO MAIN MENU'}
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-widest mt-4 border-b border-border pb-4 glitch-text">
            ► SAVE / LOAD
          </h1>
          <div className="text-xs text-muted-foreground mt-2 tracking-widest">
            FOUNDATION ARCHIVE — SAVE MANAGEMENT — 5 SLOTS
          </div>
        </div>

        {message && (
          <div className="border border-primary bg-card p-3 mb-6 text-primary text-sm tracking-widest animate-fade-in-up">
            ► {message}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {slots.map(slot => (
            <SaveSlotCard
              key={slot.id}
              slot={slot}
              onLoad={() => handleLoad(slot.id)}
              onSave={() => handleSave(slot.id)}
              onDelete={() => handleDelete(slot.id)}
              isGameActive={isGameActive}
            />
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-4">
          <Link
            href={isGameActive ? '/game' : '/'}
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
            data-testid="link-back"
          >
            &gt; {isGameActive ? 'RETURN TO OPERATION' : 'RETURN TO MAIN MENU'}
          </Link>
        </div>
      </div>
    </div>
  );
}
