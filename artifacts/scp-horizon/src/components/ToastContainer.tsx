import { useEffect, useState, useCallback } from 'react';
import { useToastStore, ToastMessage } from '../store/toastStore';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENT_DEFS } from '../data/achievements';

// ─── Icons / prefixes per toast type ─────────────────────────────────────────

const TOAST_PREFIX: Record<string, string> = {
  achievement: '▓ ACHIEVEMENT UNLOCKED',
  reward: '►',
  info: '—',
  warning: '! ADVISORY',
};

const TOAST_BORDER: Record<string, string> = {
  achievement: 'border-primary text-primary',
  reward: 'border-accent text-accent',
  info: 'border-border text-muted-foreground',
  warning: 'border-destructive text-destructive',
};

// ─── Individual toast item ────────────────────────────────────────────────────

function ToastItem({ toast }: { toast: ToastMessage }) {
  const { dismissToast } = useToastStore();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => dismissToast(toast.id), 350);
  }, [toast.id, dismissToast]);

  useEffect(() => {
    // Stagger entry so multiple toasts don't flicker simultaneously
    const t1 = setTimeout(() => setVisible(true), 50);
    // Begin fade-out before removing
    const t2 = setTimeout(() => setExiting(true), toast.duration - 350);
    // Remove from store
    const t3 = setTimeout(() => dismissToast(toast.id), toast.duration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [toast.id, toast.duration, dismissToast]);

  const borderColor = TOAST_BORDER[toast.type] ?? TOAST_BORDER.info;
  const opacity = visible && !exiting ? 1 : 0;
  const translateY = visible && !exiting ? '0px' : '10px';

  return (
    <div
      className={'font-mono border bg-background p-4 w-72 max-w-full shadow-lg ' + borderColor}
      style={{ opacity, transform: 'translateY(' + translateY + ')', transition: 'opacity 0.35s ease, transform 0.35s ease' }}
      role="status"
      aria-live="polite"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Prefix label */}
          <div className="text-xs tracking-widest mb-1 opacity-70 uppercase">
            {TOAST_PREFIX[toast.type] ?? '—'}
          </div>
          {/* Title */}
          <div className="text-sm font-bold tracking-wide leading-tight break-words">
            {toast.title}
          </div>
          {/* Subtitle */}
          {toast.subtitle && (
            <div className="text-xs mt-1 opacity-60 tracking-wide leading-relaxed break-words">
              {toast.subtitle}
            </div>
          )}
        </div>
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="shrink-0 text-xs opacity-40 hover:opacity-100 transition-opacity leading-none mt-0.5 px-1"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-px bg-current opacity-20 overflow-hidden">
        <div
          className="h-full bg-current opacity-100"
          style={{
            width: '100%',
            transformOrigin: 'left',
            animation: 'toast-shrink ' + (toast.duration / 1000) + 's linear forwards',
          }}
        />
      </div>
    </div>
  );
}

// ─── Achievement subscriber bridge ────────────────────────────────────────────

function AchievementBridge() {
  const { pushToast } = useToastStore();

  useEffect(() => {
    // Snapshot current achievements so we only toast NEW ones after mount
    let prevIds = new Set(useGameStore.getState().achievements.map((a) => a.id));

    const unsub = useGameStore.subscribe((state) => {
      state.achievements.forEach((a) => {
        if (!prevIds.has(a.id)) {
          const def = ACHIEVEMENT_DEFS[a.id];
          pushToast({
            type: 'achievement',
            title: def ? def.title : a.id,
            subtitle: def ? def.classification : undefined,
            duration: 5500,
          });
        }
      });
      prevIds = new Set(state.achievements.map((a) => a.id));
    });

    return unsub;
  }, [pushToast]);

  return null;
}

// ─── Container ────────────────────────────────────────────────────────────────

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <>
      <AchievementBridge />
      {/* Toast stack — fixed bottom-right (desktop), bottom-center (mobile) */}
      <div
        className="fixed bottom-4 right-4 sm:right-6 z-[100] flex flex-col gap-3 items-end pointer-events-none"
        style={{ maxWidth: '20rem' }}
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full">
            <ToastItem toast={t} />
          </div>
        ))}
      </div>
    </>
  );
}
