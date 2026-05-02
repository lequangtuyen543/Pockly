// src/components/dashboard/CategoryBreakdown.tsx
import React, { useMemo, useState } from 'react';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTransactionStore } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';
import { formatCurrency } from '@/lib/utils';

interface CategoryBreakdownProps {
  period: 'week' | 'month' | '3months';
  onCategoryClick?: (categoryId: string) => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ period, onCategoryClick }) => {
  const { transactions } = useTransactionStore();
  const { categories } = useCategoryStore();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const chartData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate = endOfMonth(now);

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
    }

    const periodTransactions = transactions.filter(t =>
      isWithinInterval(new Date(t.date), { start: startDate, end: endDate }) &&
      t.type === 'expense'
    );

    const categoryTotals: { [key: string]: number } = {};

    periodTransactions.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    return Object.entries(categoryTotals)
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          id: categoryId,
          name: category?.name || 'Unknown',
          icon: category?.icon || '📦',
          value: amount,
          color: category?.color || '#6b7280',
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 categories
  }, [transactions, categories, period]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium flex items-center gap-2">
            <span>{data.icon}</span>
            {data.name}
          </p>
          <p className="text-gray-600">
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const handlePieClick = (data: any) => {
    if (data && data.id) {
      setSelectedCategory(data.id);
      onCategoryClick?.(data.id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Chi tiêu theo danh mục</h3>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div>Chưa có dữ liệu chi tiêu</div>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                onClick={handlePieClick}
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={selectedCategory === entry.id ? '#000' : 'none'}
                    strokeWidth={selectedCategory === entry.id ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
              selectedCategory === item.id ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            onClick={() => handlePieClick(item)}
          >
            <span>{item.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{item.name}</div>
              <div className="text-xs text-gray-600">
                {formatCurrency(item.value)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 6 && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Và {chartData.length - 6} danh mục khác...
        </div>
      )}
    </div>
  );
};