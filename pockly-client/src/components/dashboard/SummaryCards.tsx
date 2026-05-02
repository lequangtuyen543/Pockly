// src/components/dashboard/SummaryCards.tsx
import React, { useMemo } from 'react';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { useTransactionStore } from '@/store/transactionStore';

export const SummaryCards: React.FC = () => {
  const { transactions } = useTransactionStore();

  const currentMonthStats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthTransactions = transactions.filter(t =>
      isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
    );

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: monthTransactions.length,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Income Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Tổng thu</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(currentMonthStats.income)}
            </p>
          </div>
          <div className="text-3xl">💰</div>
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Tổng chi</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(currentMonthStats.expense)}
            </p>
          </div>
          <div className="text-3xl">💸</div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Số dư</p>
            <p className={`text-2xl font-bold ${
              currentMonthStats.balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(currentMonthStats.balance)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {currentMonthStats.transactionCount} giao dịch
            </p>
          </div>
          <div className="text-3xl">📊</div>
        </div>
      </div>
    </div>
  );
};