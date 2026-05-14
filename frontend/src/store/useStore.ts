/**
 * NAMASTE — Zustand Global State Store
 */
import { create } from 'zustand';
import { MOCK_WORKER } from '@/lib/mockData';

interface WorkerState {
  worker: typeof MOCK_WORKER | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  activeRoute: string;
  setWorker: (worker: typeof MOCK_WORKER) => void;
  setAuthenticated: (val: boolean) => void;
  setOnboarded: (val: boolean) => void;
  setActiveRoute: (route: string) => void;
  logout: () => void;
}

export const useWorkerStore = create<WorkerState>((set) => ({
  worker: null,
  isAuthenticated: false,
  isOnboarded: false,
  activeRoute: '/dashboard',
  setWorker: (worker) => set({ worker }),
  setAuthenticated: (val) => set({ isAuthenticated: val }),
  setOnboarded: (val) => set({ isOnboarded: val }),
  setActiveRoute: (route) => set({ activeRoute: route }),
  logout: () => set({ worker: null, isAuthenticated: false, isOnboarded: false }),
}));

interface UIState {
  sidebarOpen: boolean;
  theme: 'dark';
  language: string;
  notifications: Notification[];
  setSidebarOpen: (val: boolean) => void;
  setLanguage: (lang: string) => void;
  addNotification: (n: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  language: 'English',
  notifications: [],
  setSidebarOpen: (val) => set({ sidebarOpen: val }),
  setLanguage: (lang) => set({ language: lang }),
  addNotification: (n) => set((state) => ({
    notifications: [
      ...state.notifications,
      { ...n, id: Math.random().toString(36).slice(2) },
    ],
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
}));
