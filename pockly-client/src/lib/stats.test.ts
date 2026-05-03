import { describe, it, expect } from 'vitest';
import { calculateStats } from '@/lib/stats';
import type { Transaction } from '@/lib/storage';

describe('calculateStats', () => {
  it('should return zeroed stats for empty transactions array', () => {
    const result = calculateStats([]);

    expect(result.totalIncome).toBe(0);
    expect(result.totalExpense).toBe(0);
    expect(result.balance).toBe(0);
    expect(result.breakdown).toEqual({});
  });

  it('should calculate stats for income-only transactions', () => {
    const transactions: Transaction[] = [
      { id: '1', type: 'income', amount: 100000, category: 'salary', date: '2026-05-01' },
      { id: '2', type: 'income', amount: 50000, category: 'gift', date: '2026-05-02' },
    ];

    const result = calculateStats(transactions);

    expect(result.totalIncome).toBe(150000);
    expect(result.totalExpense).toBe(0);
    expect(result.balance).toBe(150000);
    expect(result.breakdown).toEqual({ salary: 100000, gift: 50000 });
  });

  it('should calculate stats for expense-only transactions', () => {
    const transactions: Transaction[] = [
      { id: '1', type: 'expense', amount: 30000, category: 'food', date: '2026-05-01' },
      { id: '2', type: 'expense', amount: 20000, category: 'transport', date: '2026-05-02' },
    ];

    const result = calculateStats(transactions);

    expect(result.totalIncome).toBe(0);
    expect(result.totalExpense).toBe(50000);
    expect(result.balance).toBe(-50000);
    expect(result.breakdown).toEqual({ food: 30000, transport: 20000 });
  });

  it('should calculate stats for mixed income and expense transactions', () => {
    const transactions: Transaction[] = [
      { id: '1', type: 'income', amount: 200000, category: 'salary', date: '2026-05-01' },
      { id: '2', type: 'expense', amount: 50000, category: 'food', date: '2026-05-02' },
      { id: '3', type: 'expense', amount: 30000, category: 'transport', date: '2026-05-03' },
    ];

    const result = calculateStats(transactions);

    expect(result.totalIncome).toBe(200000);
    expect(result.totalExpense).toBe(80000);
    expect(result.balance).toBe(120000);
    expect(result.breakdown).toEqual({ salary: 200000, food: 50000, transport: 30000 });
  });

  it('should group multiple transactions in the same category', () => {
    const transactions: Transaction[] = [
      { id: '1', type: 'expense', amount: 30000, category: 'food', date: '2026-05-01' },
      { id: '2', type: 'expense', amount: 25000, category: 'food', date: '2026-05-02' },
      { id: '3', type: 'expense', amount: 40000, category: 'food', date: '2026-05-03' },
      { id: '4', type: 'income', amount: 150000, category: 'salary', date: '2026-05-01' },
      { id: '5', type: 'income', amount: 50000, category: 'salary', date: '2026-05-02' },
    ];

    const result = calculateStats(transactions);

    expect(result.totalExpense).toBe(95000);
    expect(result.totalIncome).toBe(200000);
    expect(result.balance).toBe(105000);
    expect(result.breakdown).toEqual({ food: 95000, salary: 200000 });
  });

  it('should handle transactions with zero amounts', () => {
    const transactions: Transaction[] = [
      { id: '1', type: 'income', amount: 0, category: 'salary', date: '2026-05-01' },
      { id: '2', type: 'expense', amount: 0, category: 'food', date: '2026-05-02' },
    ];

    const result = calculateStats(transactions);

    expect(result.totalIncome).toBe(0);
    expect(result.totalExpense).toBe(0);
    expect(result.balance).toBe(0);
    expect(result.breakdown).toEqual({ salary: 0, food: 0 });
  });

  it('should ignore invalid or non-numeric amounts', () => {
    const transactions = [
      { id: '1', type: 'income', amount: 100000, category: 'salary', date: '2026-05-01' },
      { id: '2', type: 'income', amount: NaN, category: 'gift', date: '2026-05-02' },
      { id: '3', type: 'expense', amount: Infinity, category: 'food', date: '2026-05-03' },
      { id: '4', type: 'expense', amount: -50000, category: 'shopping', date: '2026-05-04' },
    ] as Transaction[];

    const result = calculateStats(transactions);

    expect(result.totalIncome).toBe(100000);
    expect(result.totalExpense).toBe(-50000);
    expect(result.balance).toBe(150000);
    expect(result.breakdown.salary).toBe(100000);
    expect(result.breakdown.gift).toBe(0);
    expect(result.breakdown.food).toBe(0);
    expect(result.breakdown.shopping).toBe(-50000);
  });

  it('should handle transactions without category', () => {
    const transactions = [
      { id: '1', type: 'income', amount: 100000, category: '', date: '2026-05-01' },
      { id: '2', type: 'expense', amount: 50000, category: 'food', date: '2026-05-02' },
    ] as Transaction[];

    const result = calculateStats(transactions);

    expect(result.totalIncome).toBe(100000);
    expect(result.totalExpense).toBe(50000);
    expect(result.breakdown).toEqual({ food: 50000 });
  });

  it('should handle a large dataset of transactions', () => {
    const transactions: Transaction[] = [];
    let expectedIncome = 0;
    let expectedExpense = 0;

    for (let i = 0; i < 1000; i++) {
      if (i % 3 === 0) {
        const amount = 100000 + i;
        transactions.push({ id: `inc-${i}`, type: 'income', amount, category: 'salary', date: '2026-05-01' });
        expectedIncome += amount;
      } else {
        const amount = 50000 + i;
        transactions.push({ id: `exp-${i}`, type: 'expense', amount, category: 'food', date: '2026-05-01' });
        expectedExpense += amount;
      }
    }

    const result = calculateStats(transactions);

    expect(result.totalIncome).toBe(expectedIncome);
    expect(result.totalExpense).toBe(expectedExpense);
    expect(result.balance).toBe(expectedIncome - expectedExpense);
    expect(result.breakdown.salary).toBe(expectedIncome);
    expect(result.breakdown.food).toBe(expectedExpense);
  });

  it('should return zeroed stats when input is not an array', () => {
    const result1 = calculateStats(null as unknown as Transaction[]);
    expect(result1).toEqual({ totalIncome: 0, totalExpense: 0, balance: 0, breakdown: {} });

    const result2 = calculateStats(undefined as unknown as Transaction[]);
    expect(result2).toEqual({ totalIncome: 0, totalExpense: 0, balance: 0, breakdown: {} });
  });

  it('should verify balance always equals income minus expense', () => {
    const transactions: Transaction[] = [
      { id: '1', type: 'income', amount: 300000, category: 'salary', date: '2026-05-01' },
      { id: '2', type: 'expense', amount: 120000, category: 'food', date: '2026-05-02' },
      { id: '3', type: 'income', amount: 80000, category: 'gift', date: '2026-05-03' },
      { id: '4', type: 'expense', amount: 45000, category: 'transport', date: '2026-05-04' },
      { id: '5', type: 'expense', amount: 35000, category: 'entertainment', date: '2026-05-05' },
    ];

    const result = calculateStats(transactions);

    expect(result.balance).toBe(result.totalIncome - result.totalExpense);
    expect(result.totalIncome).toBe(380000);
    expect(result.totalExpense).toBe(200000);
    expect(result.balance).toBe(180000);
  });
});
