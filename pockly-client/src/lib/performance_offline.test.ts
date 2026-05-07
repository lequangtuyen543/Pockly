// src/lib/performance_offline.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateStats } from './stats';
import { filterTransactions } from './transactionFilter';
import { transactionStorage } from './storage';
import type { Transaction } from './storage';

// Setup Mock for LocalStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Helper to generate large dataset
const generateLargeData = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  const categories = ['Food', 'Transport', 'Salary', 'Rent', 'Shopping'];
  
  for (let i = 0; i < count; i++) {
    transactions.push({
      id: `id-${i}`,
      type: i % 5 === 0 ? 'income' : 'expense',
      amount: Math.floor(Math.random() * 1000000),
      category: categories[i % categories.length],
      date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      note: `Note for transaction ${i}`,
    });
  }
  return transactions;
};

describe('Performance: Large Dataset Handling', () => {
  const DATA_SIZE = 5000; // Testing with 5000+ transactions
  const largeData = generateLargeData(DATA_SIZE);

  it(`should calculate statistics for ${DATA_SIZE} transactions in under 50ms`, () => {
    const start = performance.now();
    const stats = calculateStats(largeData);
    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(50);
    expect(stats.totalIncome).toBeGreaterThan(0);
    expect(stats.totalExpense).toBeGreaterThan(0);
  });

  it(`should filter ${DATA_SIZE} transactions by category in under 20ms`, () => {
    const start = performance.now();
    const filtered = filterTransactions(largeData, {
      period: 'all',
      category: 'Food',
      searchQuery: '',
    });
    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(20);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(t => t.category === 'Food')).toBe(true);
  });

  it(`should perform complex search on ${DATA_SIZE} transactions in under 30ms`, () => {
    const start = performance.now();
    const filtered = filterTransactions(largeData, {
      period: 'month',
      category: 'all',
      searchQuery: 'Note for transaction 499',
      now: new Date(),
    });
    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(30);
  });
});

describe('Offline Mode Reliability', () => {
  beforeEach(() => {
    localStorage.clear();
    // Simulate network disconnect
    vi.stubGlobal('navigator', { onLine: false });
  });

  it('should allow adding transactions while offline', () => {
    expect(navigator.onLine).toBe(false);
    
    const tx = {
      type: 'expense' as const,
      amount: 10000,
      category: 'Food',
      date: new Date().toISOString(),
    };

    const added = transactionStorage.add(tx);
    expect(added).toBeDefined();
    
    const all = transactionStorage.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].amount).toBe(10000);
  });

  it('should retain data persistence even if navigator says offline', () => {
    localStorage.setItem('pockly_transactions', JSON.stringify([{
      id: 'offline-1',
      type: 'income',
      amount: 50000,
      category: 'Salary',
      date: new Date().toISOString(),
    }]));

    const all = transactionStorage.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe('offline-1');
  });

  it('should correctly calculate stats using local data without network', () => {
    const localData = generateLargeData(10);
    const stats = calculateStats(localData);
    
    expect(stats.balance).toBeDefined();
    expect(stats.totalIncome).toBeDefined();
  });
});
