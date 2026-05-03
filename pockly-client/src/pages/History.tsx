import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactionStore } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";
import { filterTransactions } from "@/lib/transactionFilter";
import type { FilterPeriod, TransactionFilterOptions } from "@/lib/transactionFilter";
import type { Transaction } from "@/lib/storage";
import { format } from "date-fns";

import TransactionTable from './components/TransactionTable';
import FilterBar from './components/FilterBar';

const HistoryPage = () => {
  const [filterState, setFilterState] = useState<TransactionFilterOptions>({
    period: "all",
    category: "all",
    searchQuery: "",
  });

  const { transactions, loadTransactions, deleteTransaction } = useTransactionStore();
  const { categories, loadCategories } = useCategoryStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, [loadTransactions, loadCategories]);

  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, filterState);
  }, [transactions, filterState]);

  const groupedTransactions = useMemo(() => {
    const groups: { [date: string]: Transaction[] } = {};
    filteredTransactions.forEach(transaction => {
      const date = format(new Date(transaction.date), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });
    const sortedGroups: { [date: string]: Transaction[] } = {};
    Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .forEach(date => {
        sortedGroups[date] = groups[date];
      });
    return sortedGroups;
  }, [filteredTransactions]);

  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const handlePeriodChange = (period: FilterPeriod) => {
    setFilterState(prev => ({ ...prev, period }));
  };

  const handleCategoryChange = (category: string) => {
    setFilterState(prev => ({ ...prev, category }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleEdit = (transaction: Transaction) => {
    navigate(`/edit/${transaction.id}`);
  };

  const handleDelete = async (transaction: Transaction) => {
    if (window.confirm("Bạn có chắc muốn xóa giao dịch này?")) {
      await deleteTransaction(transaction.id);
    }
  };

  const getCategoryIcon = (categoryId: string): string => {
    const iconMap: Record<string, string> = {
      food: "restaurant",
      dining: "restaurant",
      transport: "directions_car",
      shopping: "shopping_bag",
      entertainment: "movie",
      bills: "bolt",
      utilities: "bolt",
      health: "favorite",
      income: "work",
      salary: "attach_money",
      freelance: "computer",
      other: "category",
    };
    return iconMap[categoryId.toLowerCase()] || "receipt";
  };

  const getCategoryName = (categoryId: string): string => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : "Unknown";
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="mb-xl">
        <h1 className="font-headline-md text-headline-md" style={{ color: "#c96442" }}>History</h1>
        <p className="font-body-sm text-body-sm" style={{ color: "#5f5e5a" }}>Review your financial timeline and habits.</p>
      </div>

      <FilterBar
        filterState={filterState}
        categories={categories}
        onPeriodChange={handlePeriodChange}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        transactionCount={filteredTransactions.length}
      />

      <TransactionTable
        groupedTransactions={groupedTransactions}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        getCategoryIcon={getCategoryIcon}
        getCategoryName={getCategoryName}
      />

      {/* Insight Card */}
      <div className="mt-xl grid grid-cols-12 gap-gutter">
        <div className="col-span-12 card-ivory rounded-xl p-6 ring-subtle relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-headline-md text-title-sm" style={{ color: "#c96442" }}>Weekly Summary</h3>
            <p className="font-body-sm text-body-sm max-w-[70%]" style={{ color: "#5f5e5a" }}>
              Your spending in "Dining Out" is 12% lower than last week. Great progress!
            </p>
          </div>
          <span
            className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-stone-100 opacity-50 pointer-events-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            analytics
          </span>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;