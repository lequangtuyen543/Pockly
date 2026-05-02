// src/components/budget/BudgetProgress.tsx
import React, { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { useBudgetStore } from '@/store/budgetStore';
import { useTransactionStore } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';

interface BudgetProgressProps {
  month?: string; // YYYY-MM format, defaults to current month
  showDetails?: boolean;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  month,
  showDetails = true
}) => {
  const currentMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM
  const { getBudgetProgress } = useBudgetStore();
  const { transactions } = useTransactionStore();
  const { categories } = useCategoryStore();

  const budgetData = useMemo(() => {
    return getBudgetProgress(currentMonth, transactions);
  }, [currentMonth, transactions, getBudgetProgress]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (budgetData.total === 0) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-center">
          Chưa thiết lập ngân sách cho tháng này
        </p>
      </div>
    );
  }

  const { total, used, percentage, remaining, categoryProgress } = budgetData;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Ngân sách tháng {currentMonth}</h3>
        <span className={`text-sm font-medium px-2 py-1 rounded ${
          percentage >= 100 ? 'bg-red-100 text-red-800' :
          percentage >= 80 ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="space-y-2">
        <Progress
          value={Math.min(percentage, 100)}
          className="h-3"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>Đã chi: {formatCurrency(used)}</span>
          <span>Còn lại: {formatCurrency(remaining)}</span>
        </div>
        <div className="text-sm text-gray-600">
          Hạn mức: {formatCurrency(total)}
        </div>
      </div>

      {showDetails && Object.keys(categoryProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Theo danh mục:</h4>
          {Object.entries(categoryProgress).map(([categoryId, progress]) => {
            const category = categories.find(c => c.id === categoryId);

            return (
              <div key={categoryId} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{category?.icon} {category?.name || `Danh mục ${categoryId}`}</span>
                  <span className={
                    progress.percentage >= 100 ? 'text-red-600' :
                    progress.percentage >= 80 ? 'text-yellow-600' :
                    'text-green-600'
                  }>
                    {progress.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={Math.min(progress.percentage, 100)}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatCurrency(progress.used)}</span>
                  <span>/ {formatCurrency(progress.limit)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};;