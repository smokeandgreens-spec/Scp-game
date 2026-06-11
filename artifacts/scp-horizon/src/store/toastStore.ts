import { create } from 'zustand';

export type ToastType = 'achievement' | 'reward' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  subtitle?: string;
  duration: number;
}

interface ToastStore {
  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  pushToast: (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 7);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
  },

  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
