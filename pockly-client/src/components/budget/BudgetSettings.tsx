// src/components/budget/BudgetSettings.tsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useBudgetStore } from '@/store/budgetStore';
import { useCategoryStore } from '@/store/categoryStore';
import { formatCurrency } from '@/lib/utils';
import type { Budget } from '@/lib/storage';

interface BudgetSettingsProps {
  month?: string; // YYYY-MM format, defaults to current month
}

export const BudgetSettings: React.FC<BudgetSettingsProps> = ({ month }) => {
  const currentMonth = month || format(new Date(), 'yyyy-MM');
  const [isOpen, setIsOpen] = useState(false);
  const [totalBudget, setTotalBudget] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, string>>({});

  const { getBudget, setBudget, loadBudget } = useBudgetStore();
  const { categories } = useCategoryStore();

  useEffect(() => {
    if (isOpen) {
      loadBudget(currentMonth);
      const existingBudget = getBudget(currentMonth);
      if (existingBudget) {
        setTotalBudget(existingBudget.total.toString());
        const categoryMap: Record<string, string> = {};
        Object.entries(existingBudget.categories).forEach(([catId, amount]) => {
          categoryMap[catId] = amount.toString();
        });
        setCategoryBudgets(categoryMap);
      } else {
        setTotalBudget('');
        setCategoryBudgets({});
      }
    }
  }, [isOpen, currentMonth, getBudget, loadBudget]);

  const handleSave = async () => {
    const total = parseFloat(totalBudget) || 0;
    const categoriesBudget: Record<string, number> = {};

    Object.entries(categoryBudgets).forEach(([catId, amountStr]) => {
      const amount = parseFloat(amountStr) || 0;
      if (amount > 0) {
        categoriesBudget[catId] = amount;
      }
    });

    const budget: Budget = {
      month: currentMonth,
      total,
      categories: categoriesBudget,
    };

    const success = await setBudget(budget);
    if (success) {
      setIsOpen(false);
    }
  };

  const updateCategoryBudget = (categoryId: string, value: string) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [categoryId]: value,
    }));
  };

  const displayCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return formatCurrency(num);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          ⚙️ Cài đặt ngân sách
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cài đặt ngân sách tháng {currentMonth}</DialogTitle>
          <DialogDescription>
            Đặt hạn mức chi tiêu để theo dõi và nhận cảnh báo kịp thời.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Total Budget */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Hạn mức tổng tháng
            </label>
            <Input
              type="number"
              placeholder="0"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              className="text-lg"
            />
            {totalBudget && (
              <p className="text-sm text-gray-600 mt-1">
                {displayCurrency(totalBudget)}
              </p>
            )}
          </div>

          {/* Category Budgets */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Hạn mức theo danh mục
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.filter(cat => !cat.hidden).map((category) => (
                <div key={category.id} className="flex items-center gap-3 p-2 border rounded">
                  <span className="text-lg">{category.icon}</span>
                  <span className="flex-1 text-sm">{category.name}</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={categoryBudgets[category.id] || ''}
                    onChange={(e) => updateCategoryBudget(category.id, e.target.value)}
                    className="w-24 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>
            Lưu ngân sách
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};