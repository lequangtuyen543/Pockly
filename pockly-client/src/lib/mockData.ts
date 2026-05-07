// src/lib/mockData.ts
import type { Transaction } from './storage';

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    type: 'income',
    amount: 5000000,
    category: 'Salary',
    note: 'Monthly salary',
    date: '2024-03-01T08:00:00.000Z',
  },
  {
    id: 't2',
    type: 'expense',
    amount: 150000,
    category: 'Food',
    note: 'Lunch with team',
    date: '2024-03-02T12:30:00.000Z',
  },
  {
    id: 't3',
    type: 'expense',
    amount: 50000,
    category: 'Transport',
    note: 'Taxi to office',
    date: '2024-03-02T13:00:00.000Z',
  },
  {
    id: 't4',
    type: 'income',
    amount: 200000,
    category: 'Bonus',
    note: 'Project bonus',
    date: '2024-03-05T10:00:00.000Z',
  },
  {
    id: 't5',
    type: 'expense',
    amount: 300000,
    category: 'Food',
    note: 'Weekly groceries',
    date: '2024-03-07T18:00:00.000Z',
  },
];

export const incomeOnlyTransactions: Transaction[] = [
  {
    id: 'i1',
    type: 'income',
    amount: 1000000,
    category: 'Salary',
    date: '2024-03-01T00:00:00.000Z',
  },
  {
    id: 'i2',
    type: 'income',
    amount: 50000,
    category: 'Gift',
    date: '2024-03-02T00:00:00.000Z',
  },
];

export const expenseOnlyTransactions: Transaction[] = [
  {
    id: 'e1',
    type: 'expense',
    amount: 20000,
    category: 'Food',
    date: '2024-03-01T00:00:00.000Z',
  },
  {
    id: 'e2',
    type: 'expense',
    amount: 15000,
    category: 'Transport',
    date: '2024-03-02T00:00:00.000Z',
  },
];
