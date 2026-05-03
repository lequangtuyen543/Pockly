import type { Transaction } from '@/lib/storage';

export interface StatsResult {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  breakdown: Record<string, number>;
}

export const calculateStats = (transactions: Transaction[]): StatsResult => {
  const result: StatsResult = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    breakdown: {},
  };

  if (!Array.isArray(transactions)) {
    return result;
  }

  for (const transaction of transactions) {
    const rawAmount = Number(transaction.amount);
    const amount = Number.isFinite(rawAmount) ? rawAmount : 0;

    if (transaction.type === 'income') {
      result.totalIncome += amount;
    } else if (transaction.type === 'expense') {
      result.totalExpense += amount;
    }

    if (transaction.category) {
      result.breakdown[transaction.category] = (result.breakdown[transaction.category] || 0) + amount;
    }
  }

  result.balance = result.totalIncome - result.totalExpense;

  return result;
};
