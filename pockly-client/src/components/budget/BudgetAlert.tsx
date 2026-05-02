// src/components/budget/BudgetAlert.tsx
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useBudgetStore } from '@/store/budgetStore';
import { useTransactionStore } from '@/store/transactionStore';

export const BudgetAlert: React.FC = () => {
  const [alerts, setAlerts] = useState<Array<{
    type: 'warning' | 'danger';
    message: string;
    category?: string;
  }>>([]);

  const { getBudgetProgress } = useBudgetStore();
  const { transactions } = useTransactionStore();

  useEffect(() => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    const progress = getBudgetProgress(currentMonth, transactions);

    const newAlerts: Array<{
      type: 'warning' | 'danger';
      message: string;
      category?: string;
    }> = [];

    // Check total budget
    if (progress.percentage >= 100) {
      newAlerts.push({
        type: 'danger',
        message: `Bạn đã vượt quá ngân sách tháng này! Đã chi ${progress.percentage.toFixed(1)}% hạn mức.`,
      });
    } else if (progress.percentage >= 80) {
      newAlerts.push({
        type: 'warning',
        message: `Cảnh báo: Bạn đã chi ${progress.percentage.toFixed(1)}% ngân sách tháng này.`,
      });
    }

    // Check category budgets
    Object.entries(progress.categoryProgress).forEach(([categoryId, catProgress]) => {
      if (catProgress.percentage >= 100) {
        newAlerts.push({
          type: 'danger',
          message: `Vượt quá ngân sách danh mục! Đã chi ${catProgress.percentage.toFixed(1)}% hạn mức.`,
          category: categoryId,
        });
      } else if (catProgress.percentage >= 80) {
        newAlerts.push({
          type: 'warning',
          message: `Cảnh báo danh mục: Đã chi ${catProgress.percentage.toFixed(1)}% hạn mức.`,
          category: categoryId,
        });
      }
    });

    setAlerts(newAlerts);
  }, [transactions, getBudgetProgress]);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border ${
            alert.type === 'danger'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {alert.type === 'danger' ? '⚠️' : '🔔'}
              </span>
              <p className="text-sm font-medium">{alert.message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAlerts(prev => prev.filter((_, i) => i !== index));
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};