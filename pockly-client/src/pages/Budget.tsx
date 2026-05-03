import { useState, useEffect, useMemo } from "react";
import { useBudgetStore } from "@/store/budgetStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useTransactionStore } from "@/store/transactionStore";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { MainLayout } from "../components/layouts/MainLayout";

const BudgetPage = () => {
  const currentMonth = format(new Date(), "yyyy-MM");
  const [totalBudget, setTotalBudget] = useState("");
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, string>>({});

  const { getBudget, setBudget, loadBudget, getBudgetProgress } = useBudgetStore();
  const { categories, loadCategories } = useCategoryStore();
  const { transactions, loadTransactions } = useTransactionStore();

  useEffect(() => {
    loadCategories();
    loadTransactions();
    loadBudget(currentMonth);
  }, [loadCategories, loadTransactions, loadBudget, currentMonth]);

  // Pre-fill form when budget data changes
  useEffect(() => {
    const existingBudget = getBudget(currentMonth);
    if (existingBudget) {
      setTotalBudget(existingBudget.total.toString());
      const categoryMap: Record<string, string> = {};
      Object.entries(existingBudget.categories).forEach(([catId, amount]) => {
        categoryMap[catId] = amount.toString();
      });
      setCategoryBudgets(categoryMap);
    } else {
      setTotalBudget("");
      setCategoryBudgets({});
    }
  }, [currentMonth, getBudget]);

  const budgetData = useMemo(() => {
    return getBudgetProgress(currentMonth, transactions);
  }, [currentMonth, transactions, getBudgetProgress]);

  const handleSave = async () => {
    const total = parseFloat(totalBudget) || 0;
    const categoriesBudget: Record<string, number> = {};

    Object.entries(categoryBudgets).forEach(([catId, amountStr]) => {
      const amount = parseFloat(amountStr) || 0;
      if (amount > 0) {
        categoriesBudget[catId] = amount;
      }
    });

    const budget = {
      month: currentMonth,
      total,
      categories: categoriesBudget,
    };

    await setBudget(budget);
  };

  const updateCategoryBudget = (categoryId: string, value: string) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [categoryId]: value,
    }));
  };

  const displayCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    return formatCurrency(num);
  };

  const { total, used, percentage, remaining, categoryProgress } = budgetData;

  // Format month for display
  const monthDate = parseISO(`${currentMonth}-01`);
  const monthDisplay = format(monthDate, "MMMM yyyy");

  // Category cards data - map from categoryProgress
  const categoryCards = Object.entries(categoryProgress).map(([catId, prog]) => {
    const category = categories.find(c => c.id === catId);
    return {
      id: catId,
      name: category?.name || `Danh mục ${catId}`,
      icon: category?.icon || "📦",
      spent: prog.used,
      limit: prog.limit,
      percentage: prog.percentage,
      left: prog.limit - prog.used,
    };
  });

  return (
    <MainLayout>
      <div className="flex flex-col gap-10">
      {/* Main Header */}
      <div className="flex flex-col gap-xs">
        <h1 className="font-display-lg text-display-lg" style={{ color: "#c96442" }}>Budgets</h1>
        <p className="font-body-sm text-body-sm" style={{ color: "#5f5e5a" }}>Your financial plan for {monthDisplay}</p>
      </div>

      {/* Monthly Overview Card */}
      <section className="card-ivory p-6 rounded-xl ring-subtle">
        <div className="flex justify-between items-end mb-md">
          <div>
            <h2 className="font-label-caps text-label-caps uppercase" style={{ color: "#5f5e5a" }}>Total Monthly Budget</h2>
            <p className="font-display-lg text-display-lg text-on-surface">
              {formatCurrency(used)} <span className="text-body-sm font-body-sm" style={{ color: "#5f5e5a" }}>of {formatCurrency(total)}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="font-label-caps text-label-caps" style={{ color: "#c96442" }}>{percentage.toFixed(0)}% USED</span>
          </div>
        </div>
        {/* Large Progress Bar */}
        <div className="w-full h-4 rounded-full overflow-hidden mb-sm" style={{ backgroundColor: "#e2dfda" }}>
          <div
            className="h-full rounded-full"
            style={{
              backgroundColor: "#c96442",
              width: `${Math.min(percentage, 100)}%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-body-sm text-body-sm" style={{ color: "#5f5e5a" }}>Remaining to spend</span>
          <span className="font-title-sm text-title-sm" style={{ color: "#c96442" }}>{formatCurrency(remaining)}</span>
        </div>
      </section>

      {/* Category Budgets Grid */}
      <section className="flex flex-col gap-md">
        <div className="flex justify-between items-center">
          <h3 className="font-title-sm text-title-sm text-on-surface">Categories</h3>
        </div>
        <div className="grid grid-cols-1 gap-md">
          {categoryCards.map((cat) => (
            <div key={cat.id} className="card-ivory p-4 rounded-xl ring-subtle">
              <div className="flex justify-between mb-sm">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined" style={{ color: "#5f5e5a" }}>{cat.icon}</span>
                  <span className="font-body-lg font-medium">{cat.name}</span>
                </div>
                <span className="font-body-sm" style={cat.left < 0 ? { color: "#c96442" } : { color: "#5f5e5a" }}>
                  {cat.left >= 0 ? `${formatCurrency(cat.left)} còn lại` : `${formatCurrency(Math.abs(cat.left))} quá mức`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden mb-xs" style={{ backgroundColor: "#e2dfda" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: "#c96442",
                    width: `${Math.min(cat.percentage, 100)}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-label-caps" style={{ color: "#5f5e5a" }}>
                <span>{formatCurrency(cat.spent)} spent</span>
                <span>{formatCurrency(cat.limit)} limit</span>
              </div>
            </div>
          ))}
          {/* Show message if no category budgets */}
          {categoryCards.length === 0 && (
            <p className="text-body-sm" style={{ color: "#5f5e5a" }}>No category budgets set up yet.</p>
          )}
        </div>
      </section>

      {/* Budget Setup Form - Always Visible */}
      <section className="flex flex-col gap-md">
        <h3 className="font-title-sm text-title-sm text-on-surface">Cài đặt ngân sách tháng {currentMonth}</h3>
        <div className="card-ivory p-6 rounded-xl ring-subtle">
          <div className="flex flex-col gap-md">
            {/* Total Budget */}
            <div className="flex flex-col gap-xs">
              <label className="font-serif text-body-sm text-on-surface">Total Budget</label>
              <div className="relative">
                <span className="absolute left-md top-1/2 -translate-y-1/2" style={{ color: "#5f5e5a" }}>₫</span>
                <input
                  type="number"
                  placeholder="0"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  className="w-full h-12 border rounded-lg pl-8 pr-md focus:border-[#c96442] focus:ring-0 font-body-sm text-on-surface bg-transparent"
                  style={{ borderColor: "#e8e6dc" }}
                />
              </div>
              {totalBudget && (
                <p className="text-sm" style={{ color: "#5f5e5a" }}>{displayCurrency(totalBudget)}</p>
              )}
            </div>

            {/* Category Budgets */}
            <div className="flex flex-col gap-xs">
              <label className="font-serif text-body-sm text-on-surface">Category Limits</label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.filter(cat => !cat.hidden).map((category) => (
                  <div key={category.id} className="flex items-center gap-3 p-2 border rounded" style={{ borderColor: "#e8e6dc" }}>
                    <span className="text-lg">{category.icon}</span>
                    <span className="flex-1 text-sm">{category.name}</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={categoryBudgets[category.id] || ""}
                      onChange={(e) => updateCategoryBudget(category.id, e.target.value)}
                      className="w-24 text-sm border rounded px-2 py-1 focus:border-[#c96442] focus:ring-0 bg-transparent"
                      style={{ borderColor: "#e8e6dc" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              className="w-full h-12 text-white font-body-lg font-semibold rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
              style={{ backgroundColor: "#c96442" }}
            >
              Update Budget
            </button>
          </div>
        </div>
      </section>

      {/* Aesthetic Visual Element */}
      <div className="w-full h-48 rounded-xl overflow-hidden relative" style={{ border: "1px solid #e8e6dc" }}>
        <img
          className="w-full h-full object-cover grayscale opacity-40 mix-blend-multiply"
          alt="Vintage bookkeeping ledgers"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5M33ZSj15IoxqejIgzRHwbsJe9LaXRSseo2Xl3WMTf3KPL-lyA8YSokWu96-F1s0Qh_U7V6Cx9LR9fH9lptrQqoPIWYxImSoYPzTsNMUteARznozhXfOGTSEUHkQkPpfI7UamrlOK25r0SoWQ80fwcApz85PwrnfywGv7f8iGRwyIh9LE0gF8ku7lgkhrWJk8vTEyCctfSas4WeU4OSPd_nSUHW1fjfnxvPUJUGtKePemfh01P9lBlS1-ltBIoud_q7TO8pEcrvk"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f5f4ed] to-transparent"></div>
        <div className="absolute bottom-md left-md right-md">
          <p className="font-serif italic text-lg" style={{ color: "#c96442" }}>"A budget is telling your money where to go instead of wondering where it went."</p>
        </div>
      </div>
    </div>
  </MainLayout>
  );
};

export default BudgetPage;
