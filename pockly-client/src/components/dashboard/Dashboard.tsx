// src/components/dashboard/Dashboard.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SummaryCards } from './SummaryCards';
import { SpendingChart } from './SpendingChart';
import { CategoryBreakdown } from './CategoryBreakdown';
import { MonthComparison } from './MonthComparison';
import { BudgetAlert } from '../budget/BudgetAlert';
import { BudgetProgress } from '../budget/BudgetProgress';
import { BudgetSettings } from '../budget/BudgetSettings';

type Period = 'week' | 'month' | '3months';

export const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<Period>('month');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Có thể navigate đến filter của TransactionList với category này
    console.log('Selected category:', categoryId);
  };

  return (
    <div className="space-y-6">
      {/* Header with Budget Settings */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <BudgetSettings />
      </div>

      {/* Budget Alerts */}
      <BudgetAlert />

      {/* Budget Progress */}
      <BudgetProgress />

      {/* Summary Cards */}
      <SummaryCards />

      {/* Period Toggle */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={period === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('week')}
        >
          Tuần
        </Button>
        <Button
          variant={period === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('month')}
        >
          Tháng
        </Button>
        <Button
          variant={period === '3months' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('3months')}
        >
          3 Tháng
        </Button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Chart */}
        <SpendingChart period={period} />

        {/* Category Breakdown */}
        <CategoryBreakdown
          period={period}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      {/* Month Comparison */}
      <MonthComparison />

      {/* Selected Category Info */}
      {selectedCategory && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800">
            Đã chọn danh mục: <strong>{selectedCategory}</strong>
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Tap vào biểu đồ để xem chi tiết danh mục
          </p>
        </div>
      )}
    </div>
  );
};