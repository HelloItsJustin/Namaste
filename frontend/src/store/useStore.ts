/**
 * NAMASTE — Zustand Global State Store
 */
import { create } from 'zustand';
import { MOCK_WORKER, MOCK_UPLIFT_DATA } from '@/lib/mockData';

// ---------------------------------------------------------------------------
// Uplift type (mirrors the backend UpliftPlan shape)
// ---------------------------------------------------------------------------
export interface UpliftRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  action_steps: string[];
  impact_pts: number;
  difficulty: string;
  timeframe_days: number;
  icon: string;
  color: string;
}

export interface UpliftScheme {
  name: string;
  authority: string;
  benefit: string;
  eligible: boolean;
  reason: string;
  apply_url: string;
}

export interface PlatformRecommendation {
  name: string;
  icon: string;
  color: string;
  score_boost: number;
  reason: string;
}

export interface UpliftData {
  current_score: number;
  projected_score: number;
  projected_in_days: number;
  score_band: string;
  projected_band: string;
  summary: string;
  recommendations: UpliftRecommendation[];
  schemes: UpliftScheme[];
  platform_recommendations: PlatformRecommendation[];
}

// ---------------------------------------------------------------------------
// Worker store
// ---------------------------------------------------------------------------
interface WorkerState {
  worker: typeof MOCK_WORKER | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  activeRoute: string;
  upliftData: UpliftData | null;
  setWorker: (worker: typeof MOCK_WORKER) => void;
  setAuthenticated: (val: boolean) => void;
  setOnboarded: (val: boolean) => void;
  setActiveRoute: (route: string) => void;
  setUpliftData: (data: UpliftData) => void;
  logout: () => void;
}

export const useWorkerStore = create<WorkerState>((set) => ({
  worker: null,
  isAuthenticated: false,
  isOnboarded: false,
  activeRoute: '/dashboard',
  upliftData: MOCK_UPLIFT_DATA as UpliftData,
  setWorker: (worker) => set({ worker }),
  setAuthenticated: (val) => set({ isAuthenticated: val }),
  setOnboarded: (val) => set({ isOnboarded: val }),
  setActiveRoute: (route) => set({ activeRoute: route }),
  setUpliftData: (data) => set({ upliftData: data }),
  logout: () => set({ worker: null, isAuthenticated: false, isOnboarded: false, upliftData: null }),
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
