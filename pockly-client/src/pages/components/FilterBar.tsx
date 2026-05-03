import React from 'react';
import { formatCurrency } from '@/lib/utils';

type FilterBarProps = {
  filterState: {
    period: string;
    category: string;
    searchQuery: string;
  };
  categories: { id: string; name: string; icon: string; hidden?: boolean }[];
  onPeriodChange: (period: any) => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
};

const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  categories,
  onPeriodChange,
  onCategoryChange,
  onSearchChange,
  totalIncome,
  totalExpense,
  transactionCount,
}) => {
  return (
    <>
      {/* Period Tabs */}
      <div className="flex gap-md mb-xl overflow-x-auto pb-2 scrollbar-hide">
        {(['day', 'week', 'month'] as const).map((p) => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`px-lg py-2 rounded-full font-label-caps text-label-caps whitespace-nowrap hover:bg-stone-100 transition-colors ${
              filterState.period === p
                ? 'bg-[#c96442] text-white'
                : 'bg-[#faf9f5] border'
            }`}
            style={filterState.period === p ? {} : { borderColor: '#e8e6dc' }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-[#faf9f5] p-4 rounded-xl mb-xl" style={{ border: '1px solid #e8e6dc' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#5f5e5a' }}>
              Category
            </label>
            <select
              value={filterState.category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full h-12 border rounded-lg px-md focus:border-[#c96442] focus:ring-0 font-body-sm text-on-surface bg-transparent"
              style={{ borderColor: '#e8e6dc' }}
            >
              <option value="all">All Categories</option>
              {categories
                .filter((cat) => !cat.hidden)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: '#5f5e5a' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Amount or note..."
              value={filterState.searchQuery}
              onChange={onSearchChange}
              className="w-full h-12 border rounded-lg px-md focus:border-[#c96442] focus:ring-0 font-body-sm text-on-surface bg-transparent"
              style={{ borderColor: '#e8e6dc' }}
            />
          </div>
        </div>
        {/* Summary */}
        <div className="flex justify-between items-center pt-4 mt-4" style={{ borderTop: '1px solid #e8e6dc' }}>
          <div className="text-sm" style={{ color: '#5f5e5a' }}>
            {transactionCount} transactions
          </div>
          <div className="flex space-x-4 text-sm">
            <span style={{ color: '#004f50' }}>+{formatCurrency(totalIncome)}</span>
            <span style={{ color: '#c96442' }}>-{formatCurrency(totalExpense)}</span>
            <span className="font-medium" style={{ color: '#231916' }}>
              = {formatCurrency(totalIncome - totalExpense)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterBar;