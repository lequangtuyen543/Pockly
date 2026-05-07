// src/lib/core_logic.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { transactionStorage } from './storage';
import { filterTransactions } from './transactionFilter';
import { calculateStats } from './stats';
import { 
  mockTransactions, 
  incomeOnlyTransactions, 
  expenseOnlyTransactions 
} from './mockData';

// Mocking LocalStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Mocking crypto.randomUUID
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = {};
}
// @ts-ignore
globalThis.crypto.randomUUID = vi.fn(() => 'test-uuid-' + Math.random());

describe('Core Logic: Transaction CRUD', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should create a new transaction', () => {
    const newTx = {
      type: 'expense' as const,
      amount: 50000,
      category: 'Food',
      date: '2024-03-01T10:00:00.000Z',
      note: 'Lunch',
    };

    const result = transactionStorage.add(newTx);

    expect(result).toMatchObject(newTx);
    expect(result.id).toBeDefined();
    expect(transactionStorage.getAll()).toHaveLength(1);
  });

  it('should update an existing transaction', () => {
    const tx = transactionStorage.add({
      type: 'income' as const,
      amount: 100000,
      category: 'Salary',
      date: '2024-03-01T10:00:00.000Z',
    });

    const updated = transactionStorage.update(tx.id, { amount: 120000 });

    expect(updated?.amount).toBe(120000);
    expect(transactionStorage.getAll()[0].amount).toBe(120000);
  });

  it('should delete a transaction', () => {
    const tx = transactionStorage.add({
      type: 'expense' as const,
      amount: 30000,
      category: 'Transport',
      date: '2024-03-01T10:00:00.000Z',
    });

    const success = transactionStorage.delete(tx.id);

    expect(success).toBe(true);
    expect(transactionStorage.getAll()).toHaveLength(0);
  });

  it('should return null when updating non-existent transaction', () => {
    const result = transactionStorage.update('non-existent', { amount: 100 });
    expect(result).toBeNull();
  });
});

describe('Core Logic: Transaction Filtering', () => {
  it('should filter by category', () => {
    const filtered = filterTransactions(mockTransactions, {
      period: 'all',
      category: 'Food',
      searchQuery: '',
    });

    expect(filtered).toHaveLength(2);
    expect(filtered.every(t => t.category === 'Food')).toBe(true);
  });

  it('should filter by search query (note)', () => {
    const filtered = filterTransactions(mockTransactions, {
      period: 'all',
      category: 'all',
      searchQuery: 'groceries',
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].note).toContain('groceries');
  });

  it('should filter by search query (amount)', () => {
    const filtered = filterTransactions(mockTransactions, {
      period: 'all',
      category: 'all',
      searchQuery: '5000000',
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].amount).toBe(5000000);
  });

  it('should return all transactions when filter is "all"', () => {
    const filtered = filterTransactions(mockTransactions, {
      period: 'all',
      category: 'all',
      searchQuery: '',
    });

    expect(filtered).toHaveLength(mockTransactions.length);
  });
});

describe('Core Logic: Statistics Calculation', () => {
  it('should handle empty transactions', () => {
    const stats = calculateStats([]);
    expect(stats).toEqual({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      breakdown: {},
    });
  });

  it('should calculate stats for only income', () => {
    const stats = calculateStats(incomeOnlyTransactions);
    expect(stats.totalIncome).toBe(1050000);
    expect(stats.totalExpense).toBe(0);
    expect(stats.balance).toBe(1050000);
  });

  it('should calculate stats for only expense', () => {
    const stats = calculateStats(expenseOnlyTransactions);
    expect(stats.totalIncome).toBe(0);
    expect(stats.totalExpense).toBe(35000);
    expect(stats.balance).toBe(-35000);
  });

  it('should calculate stats for mixed data', () => {
    const stats = calculateStats(mockTransactions);
    // Salary(5M) + Bonus(200K) = 5.2M
    expect(stats.totalIncome).toBe(5200000);
    // Food(150K) + Transport(50K) + Food(300K) = 500K
    expect(stats.totalExpense).toBe(500000);
    expect(stats.balance).toBe(4700000);
  });

  it('should provide correct category breakdown', () => {
    const stats = calculateStats(mockTransactions);
    expect(stats.breakdown).toEqual({
      Salary: 5000000,
      Food: 450000, // 150K + 300K
      Transport: 50000,
      Bonus: 200000,
    });
  });
});
