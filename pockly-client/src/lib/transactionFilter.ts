import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import type { Transaction } from '@/lib/storage';

export type FilterPeriod = 'day' | 'week' | 'month' | 'all';

export interface TransactionFilterOptions {
  period: FilterPeriod;
  category: string;
  searchQuery: string;
  now?: Date;
}

export const filterTransactions = (
  transactions: Transaction[],
  options: TransactionFilterOptions,
): Transaction[] => {
  const { period, category, searchQuery, now = new Date() } = options;
  let filtered = [...transactions];

  if (period !== 'all') {
    let start: Date;
    let end: Date;

    switch (period) {
      case 'day':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      default:
        start = new Date(0);
        end = now;
    }

    filtered = filtered.filter((transaction) =>
      isWithinInterval(new Date(transaction.date), { start, end }),
    );
  }

  if (category !== 'all') {
    filtered = filtered.filter((transaction) => transaction.category === category);
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((transaction) =>
      transaction.amount.toString().includes(query) ||
      (transaction.note && transaction.note.toLowerCase().includes(query)),
    );
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
