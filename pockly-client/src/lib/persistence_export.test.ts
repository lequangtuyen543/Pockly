// src/lib/persistence_export.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { transactionStorage } from './storage';
import { generateCSV } from './export';
import type { Transaction, Category } from './storage';

// LocalStorage Mock Setup
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
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('LocalStorage Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should save and load transactions correctly after "reload"', () => {
    const tx = {
      type: 'expense' as const,
      amount: 50000,
      category: 'Food',
      date: '2024-03-01T10:00:00.000Z',
    };

    // Save
    transactionStorage.add(tx);
    
    // Simulate reload by checking if it exists in mocked storage
    const storedData = JSON.parse(localStorage.getItem('pockly_transactions') || '[]');
    expect(storedData).toHaveLength(1);
    expect(storedData[0].amount).toBe(50000);

    // Verify getAll retrieves it
    const all = transactionStorage.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].category).toBe('Food');
  });

  it('should handle empty localStorage data', () => {
    localStorage.setItem('pockly_transactions', '');
    const all = transactionStorage.getAll();
    expect(all).toEqual([]);
  });

  it('should handle corrupted/invalid JSON in localStorage', () => {
    localStorage.setItem('pockly_transactions', '{invalid-json}');
    // The implementation uses a try-catch in getFromStorage to return default
    const all = transactionStorage.getAll();
    expect(all).toEqual([]);
  });
});

describe('CSV Export Logic', () => {
  const mockCategories: Category[] = [
    { id: 'cat1', name: 'Ăn uống', icon: '🍔', color: '#ff0000' },
    { id: 'cat2', name: 'Lương', icon: '💰', color: '#00ff00' },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'expense',
      amount: 50000,
      category: 'cat1',
      note: 'Bún bò "Huế"',
      date: '2024-03-01T12:00:00.000Z',
    },
    {
      id: '2',
      type: 'income',
      amount: 10000000,
      category: 'cat2',
      note: 'Lương tháng, thưởng',
      date: '2024-03-05T08:00:00.000Z',
    },
  ];

  it('should export all data rows plus header', () => {
    const csv = generateCSV(mockTransactions, mockCategories);
    const lines = csv.split('\n');
    expect(lines).toHaveLength(3); // Header + 2 data rows
  });

  it('should have correct columns and order', () => {
    const csv = generateCSV(mockTransactions, mockCategories);
    const header = csv.split('\n')[0];
    expect(header).toBe('Ngày,Loại,Số tiền,Danh mục,Ghi chú');
  });

  it('should handle Vietnamese characters and special CSV symbols (UTF-8)', () => {
    const csv = generateCSV(mockTransactions, mockCategories);
    const lines = csv.split('\n');
    
    // Row 1: Bún bò "Huế" -> Should be escaped with double quotes
    expect(lines[1]).toContain('"Bún bò ""Huế"""');
    
    // Row 2: Lương tháng, thưởng -> Should be escaped because of comma
    expect(lines[2]).toContain('"Lương tháng, thưởng"');
    
    // Category icon + name
    expect(lines[1]).toContain('🍔 Ăn uống');
    expect(lines[2]).toContain('💰 Lương');
  });

  it('should format numbers and dates correctly', () => {
    const csv = generateCSV(mockTransactions, mockCategories);
    const lines = csv.split('\n');
    
    expect(lines[1]).toContain('2024-03-01');
    expect(lines[1]).toContain('50000');
    expect(lines[2]).toContain('10000000');
    expect(lines[2]).toContain('Thu nhập');
  });
});
