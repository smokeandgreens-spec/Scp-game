import { useEffect, useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { useLocation } from 'wouter';
import { soundManager } from '../audio';

const BOOT_SEQUENCE = [
  'INITIALIZING SECURE TERMINAL...',
  'VERIFYING BIOMETRIC CREDENTIALS...',
  'CLEARANCE CHECK: O5 COUNCIL...',
  'CLEARANCE ACCEPTED: O5-1',
  'DECRYPTING THAUMIEL-CLASS ARCHIVE...',
  'WARNING: CONTENTS ARE CLASSIFIED ABOVE TOP SECRET.',
  'UNAUTHORIZED ACCESS IS A KETER-CLASS INFRACTION.',
  '',
  'ACCESS GRANTED.',
];

const ASCII_LOGO = `
  ███████╗ ██████╗██████╗      ██╗  ██╗ ██████╗ ██████╗ ██╗███████╗ ██████╗ ███╗   ██╗
  ██╔════╝██╔════╝██╔══██╗     ██║  ██║██╔═══██╗██╔══██╗██║╚══███╔╝██╔═══██╗████╗  ██║
  ███████╗██║     ██████╔╝     ███████║██║   ██║██████╔╝██║  ███╔╝ ██║   ██║██╔██╗ ██║
  ╚════██║██║     ██╔═══╝      ██╔══██║██║   ██║██╔══██╗██║ ███╔╝  ██║   ██║██║╚██╗██║
  ███████║╚██████╗██║          ██║  ██║╚██████╔╝██║  ██║██║███████╗╚██████╔╝██║ ╚████║
  ╚══════╝ ╚═════╝╚═╝          ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝
`;

export default function MainMenu() {
  const [bootPhase, setBootPhase] = useState(0);
  const [booting, setBooting] = useState(true);
  const [, setLocation] = useLocation();
  const getSaveSlots = useGameStore(s => s.getSaveSlots);
  const saves = useMemo(() => getSaveSlots(), []);
  const hasSaves = saves.some(s => !s.isEmpty);

  useEffect(() => {
    if (bootPhase < BOOT_SEQUENCE.length) {
      const line = BOOT_SEQUENCE[bootPhase];
      if (line && !line.includes('WARNING')) {
        soundManager.play('boot.beep');
      } else if (line && line.includes('WARNING')) {
        soundManager.play('game.warning');
      }
      const t = setTimeout(() => setBootPhase(p => p + 1), bootPhase === 0 ? 200 : 350);
      return () => clearTimeout(t);
    } else {
      soundManager.play('ui.confirm');
      const t = setTimeout(() => setBooting(false), 600);
      return () => clearTimeout(t);
    }
  }, [bootPhase]);

  useEffect(() => {
    if (booting) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'n') {
        soundManager.play('ui.confirm');
        useGameStore.getState().newGame(1);
        setLocation('/game');
      }
      if (e.key.toLowerCase() === 'c' && hasSaves) {
        const latest = saves
          .filter(s => !s.isEmpty)
          .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())[0];
        if (latest) {
          soundManager.play('game.load');
          useGameStore.getState().loadGame(latest.id);
          setLocation('/game');
        }
      }
      if (e.key.toLowerCase() === 'l') { soundManager.play('ui.navigate'); setLocation('/saves'); }
      if (e.key.toLowerCase() === 's') { soundManager.play('ui.navigate'); setLocation('/settings'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [booting, hasSaves, setLocation, saves]);

  if (booting) {
    return (
      <div className="min-h-screen bg-background text-primary p-8 font-mono whitespace-pre-wrap select-none">
        <div className="text-xs text-muted-foreground mb-6 tracking-widest">
          FOUNDATION SECURE TERMINAL v9.4.2 — SITE-01
        </div>
        {BOOT_SEQUENCE.slice(0, bootPhase).map((line, i) => (
          <div
            key={i}
            className={
              'text-sm mb-1 ' +
              (line.includes('WARNING') ? 'text-accent' : '') +
              (line.includes('GRANTED') ? 'text-primary font-bold' : '') +
              (line.includes('CLEARANCE ACCEPTED') ? 'text-primary' : '')
            }
          >
            {line || ' '}
          </div>
        ))}
        <span className="animate-cursor-blink text-primary">_</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary p-6 sm:p-10 font-mono select-none flex flex-col relative overflow-hidden terminal-flicker">

      {/* Top bar */}
      <div className="flex justify-between items-center text-xs text-muted-foreground mb-10">
        <span>FOUNDATION SECURE TERMINAL v9.4.2</span>
        <span className="text-accent tracking-widest">[ THAUMIEL ARCHIVE ]</span>
      </div>

      {/* Logo */}
      <div className="mb-10 text-center">
        <pre className="text-primary glitch-text leading-tight text-xs overflow-x-auto hidden sm:block">
          {ASCII_LOGO}
        </pre>
        <div className="sm:hidden text-3xl font-bold tracking-[0.3em] text-primary mb-2">
          SCP: HORIZON
        </div>
        <div className="mt-4 text-xs text-destructive tracking-[0.4em] border border-destructive inline-block px-4 py-1">
          [ CLASSIFIED THAUMIEL ]
        </div>
        <div className="mt-2 text-xs text-muted-foreground tracking-widest">
          ACT I: THE GIRL
        </div>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2 w-full max-w-sm mx-auto">
        <button
          className="text-left text-base py-3 px-4 border border-border hover:border-primary hover:bg-card transition-colors group tracking-wider"
          onClick={() => {
            soundManager.play('ui.confirm');
            useGameStore.getState().newGame(1);
            setLocation('/game');
          }}
          data-testid="button-new-game"
        >
          <span className="text-muted-foreground group-hover:text-accent mr-3">&gt;</span>
          NEW GAME
          <span className="text-muted-foreground ml-4 text-sm">[N]</span>
        </button>

        <button
          className={'text-left text-base py-3 px-4 border transition-colors group tracking-wider ' +
            (hasSaves
              ? 'border-border hover:border-primary hover:bg-card'
              : 'border-border opacity-40 cursor-not-allowed')}
          onClick={() => {
            if (!hasSaves) return;
            const latest = saves
              .filter(s => !s.isEmpty)
              .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())[0];
            if (latest) {
              soundManager.play('game.load');
              useGameStore.getState().loadGame(latest.id);
              setLocation('/game');
            }
          }}
          onMouseEnter={() => hasSaves && soundManager.play('ui.click')}
          disabled={!hasSaves}
          data-testid="button-continue"
        >
          <span className="text-muted-foreground group-hover:text-accent mr-3">&gt;</span>
          CONTINUE
          <span className="text-muted-foreground ml-4 text-sm">[C]</span>
          {!hasSaves && <span className="text-muted-foreground ml-2 text-xs">— NO SAVES</span>}
        </button>

        <button
          className="text-left text-base py-3 px-4 border border-border hover:border-primary hover:bg-card transition-colors group tracking-wider"
          onClick={() => { soundManager.play('ui.navigate'); setLocation('/saves'); }}
          onMouseEnter={() => soundManager.play('ui.click')}
          data-testid="button-load-game"
        >
          <span className="text-muted-foreground group-hover:text-accent mr-3">&gt;</span>
          LOAD GAME
          <span className="text-muted-foreground ml-4 text-sm">[L]</span>
        </button>

        <button
          className="text-left text-base py-3 px-4 border border-border hover:border-primary hover:bg-card transition-colors group tracking-wider"
          onClick={() => { soundManager.play('ui.navigate'); setLocation('/settings'); }}
          onMouseEnter={() => soundManager.play('ui.click')}
          data-testid="button-settings"
        >
          <span className="text-muted-foreground group-hover:text-accent mr-3">&gt;</span>
          SETTINGS
          <span className="text-muted-foreground ml-4 text-sm">[S]</span>
        </button>
      </div>

      {/* Bottom */}
      <div className="mt-auto pt-10 text-xs text-muted-foreground flex justify-between">
        <span>CLEARANCE: O5-1 — COUNCIL SEAT 1</span>
        <span>SCP FOUNDATION — SECURE. CONTAIN. PROTECT.</span>
      </div>
    </div>
  );
}
