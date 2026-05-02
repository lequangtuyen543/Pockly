// src/store/transactionStore.ts
import { create } from 'zustand';
import type { Transaction } from '@/lib/storage';
import { transactionStorage, validateTransaction } from '@/lib/storage';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadTransactions: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<Transaction | null>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,
  error: null,

  loadTransactions: () => {
    set({ isLoading: true, error: null });
    try {
      const transactions = transactionStorage.getAll();
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load transactions', isLoading: false });
    }
  },

  addTransaction: async (transaction) => {
    if (!validateTransaction(transaction)) {
      set({ error: 'Invalid transaction data' });
      return null;
    }

    set({ isLoading: true, error: null });
    try {
      const newTransaction = transactionStorage.add(transaction);
      set(state => ({
        transactions: [...state.transactions, newTransaction],
        isLoading: false,
      }));
      return newTransaction;
    } catch (error) {
      set({ error: 'Failed to add transaction', isLoading: false });
      return null;
    }
  },

  updateTransaction: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = transactionStorage.update(id, updates);
      if (!updated) {
        set({ error: 'Transaction not found', isLoading: false });
        return false;
      }
      set(state => ({
        transactions: state.transactions.map(t => t.id === id ? updated : t),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: 'Failed to update transaction', isLoading: false });
      return false;
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const success = transactionStorage.delete(id);
      if (!success) {
        set({ error: 'Transaction not found', isLoading: false });
        return false;
      }
      set(state => ({
        transactions: state.transactions.filter(t => t.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: 'Failed to delete transaction', isLoading: false });
      return false;
    }
  },
}));