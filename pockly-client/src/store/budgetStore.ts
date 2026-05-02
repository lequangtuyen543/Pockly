// src/store/budgetStore.ts
import { create } from 'zustand';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
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
  getBudgetProgress: (month: string, transactions: any[]) => {
    total: number;
    used: number;
    percentage: number;
    remaining: number;
    categoryProgress: Record<string, { used: number; limit: number; percentage: number }>;
  };
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

  getBudgetProgress: (month, transactions) => {
    const budget = get().getBudget(month);
    if (!budget) {
      return {
        total: 0,
        used: 0,
        percentage: 0,
        remaining: 0,
        categoryProgress: {},
      };
    }

    const monthStart = startOfMonth(new Date(month + '-01'));
    const monthEnd = endOfMonth(new Date(month + '-01'));

    const monthTransactions = transactions.filter((t: any) =>
      isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd }) &&
      t.type === 'expense'
    );

    const totalUsed = monthTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
    const percentage = budget.total > 0 ? (totalUsed / budget.total) * 100 : 0;
    const remaining = Math.max(0, budget.total - totalUsed);

    // Calculate category progress
    const categoryProgress: Record<string, { used: number; limit: number; percentage: number }> = {};
    Object.entries(budget.categories).forEach(([categoryId, limit]) => {
      const categoryTransactions = monthTransactions.filter((t: any) => t.category === categoryId);
      const used = categoryTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
      const catPercentage = limit > 0 ? (used / limit) * 100 : 0;
      categoryProgress[categoryId] = { used, limit, percentage: catPercentage };
    });

    return {
      total: budget.total,
      used: totalUsed,
      percentage,
      remaining,
      categoryProgress,
    };
  },
}));