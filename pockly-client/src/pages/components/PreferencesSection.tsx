import React from 'react';
import { useTransactionStore } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';
import { SectionCard } from '@/components/shared/SectionCard';

export const PreferencesSection: React.FC = () => {
  const { transactions } = useTransactionStore();
  const { categories } = useCategoryStore();

  return (
    <SectionCard className="mt-6">
      <h3 className="font-title-sm text-title-sm" style={{ color: '#231916' }}>Other</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium" style={{ color: '#231916' }}>App Data</p>
            <p className="text-sm" style={{ color: '#5f5e5a' }}>
              {transactions.length} transactions • {categories.filter(c => !c.hidden).length} categories
            </p>
          </div>
        </div>

        <div className="pt-4 border-t" style={{ borderColor: '#e8e6dc' }}>
          <p className="text-sm" style={{ color: '#5f5e5a' }}>
            Pockly v2.1.888 - Simple personal finance
          </p>
        </div>
      </div>
    </SectionCard>
  );
};