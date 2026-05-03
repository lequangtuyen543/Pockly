import { describe, it, expect } from 'vitest';
import { filterTransactions } from '@/lib/transactionFilter';
import type { Transaction } from '@/lib/storage';

describe('filterTransactions', () => {
  const now = new Date('2026-05-02T12:00:00.000Z');
  const transactions: Transaction[] = [
    {
      id: 't1',
      type: 'income',
      amount: 120000,
      category: 'salary',
      note: 'Lương tháng 5',
      date: '2026-05-02T08:00:00.000Z',
    },
    {
      id: 't2',
      type: 'expense',
      amount: 76000,
      category: 'food',
      note: 'Ăn trưa',
      date: '2026-05-01T12:00:00.000Z',
    },
    {
      id: 't3',
      type: 'expense',
      amount: 42000,
      category: 'transport',
      note: 'Taxi',
      date: '2026-04-15T18:00:00.000Z',
    },
    {
      id: 't4',
      type: 'income',
      amount: 50000,
      category: 'gift',
      note: 'Quà sinh nhật',
      date: '2026-05-02T14:00:00.000Z',
    },
  ];

  it('should filter by day', () => {
    const result = filterTransactions(transactions, {
      period: 'day',
      category: 'all',
      searchQuery: '',
      now,
    });

    expect(result.map((item) => item.id)).toEqual(['t4', 't1']);
  });

  it('should filter by week', () => {
    const result = filterTransactions(transactions, {
      period: 'week',
      category: 'all',
      searchQuery: '',
      now,
    });

    expect(result.map((item) => item.id)).toEqual(['t4', 't1', 't2']);
  });

  it('should filter by month', () => {
    const result = filterTransactions(transactions, {
      period: 'month',
      category: 'all',
      searchQuery: '',
      now,
    });

    expect(result.map((item) => item.id)).toEqual(['t4', 't1', 't2']);
  });

  it('should filter by category', () => {
    const result = filterTransactions(transactions, {
      period: 'all',
      category: 'food',
      searchQuery: '',
      now,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('t2');
  });

  it('should filter by search query amount', () => {
    const result = filterTransactions(transactions, {
      period: 'all',
      category: 'all',
      searchQuery: '120',
      now,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('t1');
  });

  it('should filter by search query note', () => {
    const result = filterTransactions(transactions, {
      period: 'all',
      category: 'all',
      searchQuery: 'taxi',
      now,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('t3');
  });
});
