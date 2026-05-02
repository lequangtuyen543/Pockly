// src/store/budgetStore.ts
import { create } from 'zustand';
import type { Budget } from '@/lib/storage';
import { budgetStorage, validateBudget } from '@/lib/storage';

interface BudgetState {
  budgets: Record<string, Budget>; // month -> budget
  isLoading: boolean;
  error: string | null;

  // Actions
  loadBudget: (month: string) => void;
  setBudget: (budget: Budget) => Promise<boolean>;
  deleteBudget: (month: string) => Promise<boolean>;
  getBudget: (month: string) => Budget | null;
  getBudgetProgress: (month: string) => { total: number; used: number; percentage: number };
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: {},
  isLoading: false,
  error: null,

  loadBudget: (month) => {
    set({ isLoading: true, error: null });
    try {
      const budget = budgetStorage.get(month);
      if (budget) {
        set(state => ({
          budgets: { ...state.budgets, [month]: budget },
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to load budget', isLoading: false });
    }
  },

  setBudget: async (budget) => {
    if (!validateBudget(budget)) {
      set({ error: 'Invalid budget data' });
      return false;
    }

    set({ isLoading: true, error: null });
    try {
      budgetStorage.set(budget);
      set(state => ({
        budgets: { ...state.budgets, [budget.month]: budget },
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: 'Failed to save budget', isLoading: false });
      return false;
    }
  },

  deleteBudget: async (month) => {
    set({ isLoading: true, error: null });
    try {
      const success = budgetStorage.delete(month);
      if (!success) {
        set({ error: 'Budget not found', isLoading: false });
        return false;
      }
      set(state => {
        const newBudgets = { ...state.budgets };
        delete newBudgets[month];
        return { budgets: newBudgets, isLoading: false };
      });
      return true;
    } catch (error) {
      set({ error: 'Failed to delete budget', isLoading: false });
      return false;
    }
  },

  getBudget: (month) => {
    return get().budgets[month] || null;
  },

  getBudgetProgress: (month) => {
    const budget = get().getBudget(month);
    if (!budget) return { total: 0, used: 0, percentage: 0 };

    // Calculate used amount from transactions (this would need transaction data)
    // For now, return placeholder
    const used = 0; // TODO: calculate from transactions
    const percentage = budget.total > 0 ? (used / budget.total) * 100 : 0;

    return { total: budget.total, used, percentage };
  },
}));