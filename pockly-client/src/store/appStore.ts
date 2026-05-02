// src/store/appStore.ts
import { create } from 'zustand';
import { onboardingStorage } from '@/lib/storage';

interface AppState {
  isOnboardingCompleted: boolean;
  completeOnboarding: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnboardingCompleted: onboardingStorage.getIsCompleted(),
  completeOnboarding: () => {
    onboardingStorage.setCompleted(true);
    set({ isOnboardingCompleted: true });
  },
}));
