// src/components/dashboard/SpendingChart.tsx
import React, { useMemo } from 'react';
import { format, startOfDay, endOfDay, eachDayOfInterval, subDays, isWithinInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTransactionStore } from '@/store/transactionStore';
import { formatCurrency } from '@/lib/utils';

interface SpendingChartProps {
  period: 'week' | 'month' | '3months';
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ period }) => {
  const { transactions } = useTransactionStore();

  const chartData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate = endOfDay(now);

    switch (period) {
      case 'week':
        startDate = startOfDay(subDays(now, 6));
        break;
      case 'month':
        startDate = startOfDay(subDays(now, 29));
        break;
      case '3months':
        startDate = startOfDay(subDays(now, 89));
        break;
    }

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);

      const dayTransactions = transactions.filter(t =>
        isWithinInterval(new Date(t.date), { start: dayStart, end: dayEnd })
      );

      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: format(day, 'dd/MM'),
        fullDate: format(day, 'yyyy-MM-dd'),
        income,
        expense,
        net: income - expense,
      };
    });
  }, [transactions, period]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name === 'income' ? 'Thu: ' : 'Chi: '}
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
      <h3 className="text-lg font-semibold mb-4">Chi tiêu theo ngày</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
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