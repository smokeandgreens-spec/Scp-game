import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Link, useLocation } from 'wouter';
import { GameSettings } from '../types/game';
import { soundManager } from '../audio';

function ToggleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
  testId,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  testId: string;
}) {
  return (
    <div className="mb-6 border-b border-border pb-6" data-testid={testId}>
      <div className="text-xs text-muted-foreground tracking-widest mb-3">{label}</div>
      <div className="flex gap-2 flex-wrap">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => { soundManager.play('ui.click'); onChange(opt.value); }}
            className={
              'px-4 py-2 text-sm border transition-colors tracking-widest ' +
              (value === opt.value
                ? 'border-primary bg-card text-primary'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary')
            }
            data-testid={'setting-' + testId + '-' + opt.value}
          >
            {value === opt.value ? '[' : ' '}{opt.label}{value === opt.value ? ']' : ' '}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange,
  testId,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  testId: string;
}) {
  return (
    <div className="flex justify-between items-start gap-4 mb-4">
      <div>
        <div className="text-sm text-foreground tracking-widest mb-1">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <button
        onClick={() => { soundManager.play('ui.click'); onChange(!value); }}
        className={
          'px-4 py-2 text-sm border transition-colors tracking-widest shrink-0 ' +
          (value
            ? 'border-primary text-primary'
            : 'border-border text-muted-foreground')
        }
        data-testid={'button-toggle-' + testId}
      >
        {value ? '[ ON ]' : '[ OFF ]'}
      </button>
    </div>
  );
}

function VolumeSlider({
  label,
  value,
  onChange,
  testId,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  testId: string;
}) {
  const bars = Math.round(value / 10);
  const filled = '▓'.repeat(bars);
  const empty = '░'.repeat(10 - bars);
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-muted-foreground tracking-widest">{label}</div>
        <div className="text-xs text-primary font-mono">[{filled}{empty}] {value}</div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="terminal-slider w-full"
        data-testid={'slider-' + testId}
      />
    </div>
  );
}

export default function Settings() {
  const { settings, updateSettings, isGameActive } = useGameStore();
  const [, setLocation] = useLocation();
  const [confirmPurge, setConfirmPurge] = useState(false);
  const [purged, setPurged] = useState(false);

  const handlePurge = () => {
    soundManager.play('game.warning');
    for (let i = 1; i <= 5; i++) {
      localStorage.removeItem('scp-horizon-save-' + i);
    }
    setPurged(true);
    setConfirmPurge(false);
  };

  return (
    <div className="min-h-screen bg-background text-primary font-mono p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <div className="text-xs text-muted-foreground tracking-widest mb-1">
            <Link href={isGameActive ? '/game' : '/'} className="hover:text-primary transition-colors"
              onClick={() => soundManager.play('ui.back')}>
              &lt; {isGameActive ? 'RETURN TO OPERATION' : 'RETURN TO MAIN MENU'}
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-widest mt-4 border-b border-border pb-4 glitch-text">
            ► SETTINGS
          </h1>
          <div className="text-xs text-muted-foreground mt-2 tracking-widest">
            TERMINAL CONFIGURATION — PERSISTENCE: LOCAL
          </div>
        </div>

        <ToggleGroup
          label="TEXT SPEED"
          value={settings.textSpeed}
          options={[
            { value: 'slow', label: 'SLOW' },
            { value: 'medium', label: 'MEDIUM' },
            { value: 'fast', label: 'FAST' },
            { value: 'instant', label: 'INSTANT' },
          ] as { value: GameSettings['textSpeed']; label: string }[]}
          onChange={v => updateSettings({ textSpeed: v })}
          testId="text-speed"
        />

        <ToggleGroup
          label="FONT SIZE"
          value={settings.fontSize}
          options={[
            { value: 'small', label: 'SMALL' },
            { value: 'medium', label: 'MEDIUM' },
            { value: 'large', label: 'LARGE' },
          ] as { value: GameSettings['fontSize']; label: string }[]}
          onChange={v => updateSettings({ fontSize: v })}
          testId="font-size"
        />

        {/* Audio Section */}
        <div className="mb-6 border-b border-border pb-6">
          <div className="text-xs text-muted-foreground tracking-widest mb-4">AUDIO</div>

          <Toggle
            label="SOUND EFFECTS"
            description="UI clicks, choice confirmations, chapter events."
            value={settings.sfxEnabled}
            onChange={v => updateSettings({ sfxEnabled: v, soundEnabled: v })}
            testId="sfx"
          />
          <VolumeSlider
            label="SFX VOLUME"
            value={settings.sfxVolume}
            onChange={v => updateSettings({ sfxVolume: v })}
            testId="sfx-volume"
          />

          <div className="mt-5">
            <Toggle
              label="AMBIENT MUSIC"
              description="Procedural drone atmosphere. Low-frequency. Unsettling."
              value={settings.musicEnabled}
              onChange={v => updateSettings({ musicEnabled: v })}
              testId="music"
            />
            <VolumeSlider
              label="MUSIC VOLUME"
              value={settings.musicVolume}
              onChange={v => updateSettings({ musicVolume: v })}
              testId="music-volume"
            />
          </div>
        </div>

        <Toggle
          label="SCANLINE EFFECT"
          description="Renders a CRT scanline overlay over the terminal. Atmospheric but may cause eye strain."
          value={settings.scanlineEffect}
          onChange={v => updateSettings({ scanlineEffect: v })}
          testId="scanlines"
        />
        <div className="border-b border-border mb-6 pb-2" />

        <Toggle
          label="GLITCH EFFECT"
          description="Enables periodic visual glitch animations on chapter titles and headers."
          value={settings.glitchEffect}
          onChange={v => updateSettings({ glitchEffect: v })}
          testId="glitch"
        />
        <div className="border-b border-border mb-6 pb-2" />

        {/* Danger Zone */}
        <div className="mt-8 border border-destructive p-4">
          <div className="text-destructive text-xs tracking-widest mb-4">
            ══ DANGER ZONE — IRREVERSIBLE OPERATIONS ══
          </div>

          {!confirmPurge && !purged && (
            <div>
              <div className="text-xs text-muted-foreground mb-3">
                PURGE ALL SAVES: Permanently deletes all five save files. Operation cannot be reversed.
              </div>
              <button
                onClick={() => { soundManager.play('game.warning'); setConfirmPurge(true); }}
                className="border border-destructive text-destructive px-4 py-2 text-xs hover:bg-destructive hover:text-background transition-colors tracking-widest"
                data-testid="button-purge-saves"
              >
                [ INITIATE PURGE ]
              </button>
            </div>
          )}

          {confirmPurge && (
            <div className="animate-fade-in-up">
              <div className="text-destructive text-sm mb-4 tracking-widest">
                WARNING: ALL SAVE DATA WILL BE PERMANENTLY DESTROYED.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePurge}
                  className="border border-destructive bg-destructive text-background px-4 py-2 text-xs transition-colors tracking-widest"
                  data-testid="button-confirm-purge"
                >
                  [ CONFIRM PURGE ]
                </button>
                <button
                  onClick={() => { soundManager.play('ui.back'); setConfirmPurge(false); }}
                  className="border border-border text-muted-foreground px-4 py-2 text-xs hover:border-primary transition-colors tracking-widest"
                  data-testid="button-cancel-purge"
                >
                  [ ABORT ]
                </button>
              </div>
            </div>
          )}

          {purged && (
            <div className="text-destructive text-sm tracking-widest animate-fade-in-up">
              ► ALL SAVE FILES PURGED. OPERATION CANNOT BE UNDONE.
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-border pt-4">
          <button
            onClick={() => { soundManager.play('ui.back'); setLocation(isGameActive ? '/game' : '/'); }}
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
            data-testid="button-back"
          >
            &gt; {isGameActive ? 'RETURN TO OPERATION' : 'RETURN TO MAIN MENU'}
          </button>
        </div>
      </div>
    </div>
  );
}
