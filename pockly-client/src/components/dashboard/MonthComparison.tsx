// src/components/dashboard/MonthComparison.tsx
import React, { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTransactionStore } from '@/store/transactionStore';

export const MonthComparison: React.FC = () => {
  const { transactions } = useTransactionStore();

  const comparisonData = useMemo(() => {
    const now = new Date();
    const currentMonth = {
      start: startOfMonth(now),
      end: endOfMonth(now),
    };

    const lastMonth = {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    };

    const getMonthStats = (monthRange: { start: Date; end: Date }) => {
      const monthTransactions = transactions.filter(t =>
        isWithinInterval(new Date(t.date), monthRange)
      );

      return {
        income: monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0),
        expense: monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0),
      };
    };

    const current = getMonthStats(currentMonth);
    const last = getMonthStats(lastMonth);

    return [
      {
        month: format(lastMonth.start, 'MMM yyyy'),
        income: last.income,
        expense: last.expense,
        net: last.income - last.expense,
      },
      {
        month: format(currentMonth.start, 'MMM yyyy'),
        income: current.income,
        expense: current.expense,
        net: current.income - current.expense,
      },
    ];
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name === 'income' ? 'Thu nhập: ' : 'Chi tiêu: '}
              {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">So sánh tháng</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              fontSize={12}
            />
            <YAxis
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" fill="#22c55e" name="income" />
            <Bar dataKey="expense" fill="#ef4444" name="expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};