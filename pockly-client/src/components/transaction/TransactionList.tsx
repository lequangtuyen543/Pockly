// src/components/transaction/TransactionList.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransactionItem } from './TransactionItem';
import { useTransactionStore } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';
import type { Transaction } from '@/lib/storage';

interface TransactionListProps {
  onEditTransaction?: (transaction: Transaction) => void;
}

type FilterPeriod = 'day' | 'week' | 'month' | 'all';

export const TransactionList: React.FC<TransactionListProps> = ({ onEditTransaction }) => {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { transactions, loadTransactions } = useTransactionStore();
  const { categories, loadCategories } = useCategoryStore();

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, [loadTransactions, loadCategories]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by period
    if (filterPeriod !== 'all') {
      const now = new Date();
      let start: Date, end: Date;

      switch (filterPeriod) {
        case 'day':
          start = startOfDay(now);
          end = endOfDay(now);
          break;
        case 'week':
          start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
          end = endOfWeek(now, { weekStartsOn: 1 });
          break;
        case 'month':
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        default:
          start = new Date(0);
          end = new Date();
      }

      filtered = filtered.filter(t =>
        isWithinInterval(new Date(t.date), { start, end })
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Search by amount or note
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.amount.toString().includes(query) ||
        (t.note && t.note.toLowerCase().includes(query))
      );
    }

    // Sort by date descending
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterPeriod, filterCategory, searchQuery]);

  const groupedTransactions = useMemo(() => {
    const groups: { [date: string]: Transaction[] } = {};

    filteredTransactions.forEach(transaction => {
      const date = format(new Date(transaction.date), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });

    return groups;
  }, [filteredTransactions]);

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const yesterday = format(new Date(now.getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

    if (dateString === today) {
      return 'Hôm nay';
    } else if (dateString === yesterday) {
      return 'Hôm qua';
    } else {
      return format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
    }
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Period Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Thời gian</label>
            <Select value={filterPeriod} onValueChange={(value) => value !== null && setFilterPeriod(value as FilterPeriod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="day">Hôm nay</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Danh mục</label>
            <Select value={filterCategory} onValueChange={(value) => value !== null && setFilterCategory(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.filter(cat => !cat.hidden).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-1">Tìm kiếm</label>
            <Input
              type="text"
              placeholder="Số tiền hoặc ghi chú..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            {filteredTransactions.length} giao dịch
          </div>
          <div className="flex space-x-4 text-sm">
            <span className="text-green-600">
              +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(totalIncome)}
            </span>
            <span className="text-red-600">
              -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(totalExpense)}
            </span>
            <span className="font-medium">
              = {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(totalIncome - totalExpense)}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <div>Chưa có giao dịch nào</div>
            <div className="text-sm mt-1">Thêm giao dịch đầu tiên của bạn</div>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <div key={date}>
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">
                  {formatDateHeader(date)}
                </h3>
              </div>
              {dayTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={onEditTransaction}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};