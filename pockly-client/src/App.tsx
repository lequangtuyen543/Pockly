import React, { useEffect } from "react";
import { MainLayout } from "./components/layouts/MainLayout";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { useAppStore } from "./store/appStore";
import { useTransactionStore } from "./store/transactionStore";
import { useBudgetStore } from "./store/budgetStore";
import { useCategoryStore } from "./store/categoryStore";
import { format } from "date-fns";

function App() {
  const { isOnboardingCompleted } = useAppStore();
  const { transactions, loadTransactions } = useTransactionStore();
  const { loadBudget, getBudgetProgress } = useBudgetStore();
  const { loadCategories } = useCategoryStore();

  useEffect(() => {
    if (isOnboardingCompleted) {
      loadTransactions();
      loadCategories();
      loadBudget(format(new Date(), "yyyy-MM"));
    }
  }, [isOnboardingCompleted, loadTransactions, loadCategories, loadBudget]);

  if (!isOnboardingCompleted) {
    return <OnboardingFlow />;
  }

  const currentMonth = format(new Date(), "yyyy-MM");
  const budgetProgress = getBudgetProgress(currentMonth, transactions);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <MainLayout>
      {/* Greeting */}
      <section className="mb-xl">
        <p className="font-sans text-[12px] font-semibold tracking-[0.05em] text-muted-foreground uppercase mb-xs leading-none">
          Welcome back,
        </p>
        <h2 className="font-serif text-[28px] leading-[36px] text-foreground">
          Financial Summary
        </h2>
      </section>

      {/* Bento Grid Summary */}
      <div className="grid grid-cols-2 gap-md mb-xl">
        {/* Total Balance (Large) */}
        <div className="col-span-2 card-ivory rounded-xl p-lg ring-subtle border-l-4 border-l-primary">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-sans text-[12px] font-semibold tracking-[0.05em] text-muted-foreground uppercase">
              Current Balance
            </span>
            <span className="material-symbols-outlined text-primary">
              account_balance_wallet
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-[32px] leading-[40px] tracking-[-0.02em] text-primary">
              {formatCurrency(transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0))}
            </span>
          </div>
        </div>

        {/* Income */}
        <div className="card-ivory rounded-xl p-md ring-subtle">
          <div className="flex items-center gap-2 mb-xs">
            <span className="material-symbols-outlined text-[#004f50] text-sm">
              arrow_downward
            </span>
            <span className="font-sans text-[10px] font-semibold tracking-[0.05em] text-muted-foreground uppercase">
              Income
            </span>
          </div>
          <p className="font-serif text-[18px] leading-[24px] font-medium text-foreground">
            {formatCurrency(transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0))}
          </p>
        </div>

        {/* Expenses */}
        <div className="card-ivory rounded-xl p-md ring-subtle">
          <div className="flex items-center gap-2 mb-xs">
            <span className="material-symbols-outlined text-primary text-sm">
              arrow_upward
            </span>
            <span className="font-sans text-[10px] font-semibold tracking-[0.05em] text-muted-foreground uppercase">
              Expense
            </span>
          </div>
          <p className="font-serif text-[18px] leading-[24px] font-medium text-foreground">
            {formatCurrency(transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0))}
          </p>
        </div>
      </div>

      {/* Mini Bar Chart Section */}
      <section className="mb-xl">
        <div className="flex justify-between items-end mb-md">
          <h3 className="font-serif text-[20px] font-medium leading-[28px]">
            Weekly Activity
          </h3>
          <span className="font-sans text-[12px] font-semibold tracking-[0.05em] text-muted-foreground">
            Last 7 Days
          </span>
        </div>
        <div className="card-ivory rounded-xl p-lg ring-subtle h-40 flex items-end justify-between gap-2">
          {/* Static Chart Mockup */}
          {[40, 60, 85, 45, 70, 30, 55].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className={`w-full rounded-t-sm transition-all duration-500 ${i === 2 ? 'bg-primary' : 'bg-black/5'}`} 
                style={{ height: `${h}%` }}
              ></div>
              <span className={`font-sans text-[9px] font-semibold uppercase ${i === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-serif text-[20px] font-medium leading-[28px]">
            Recent Transactions
          </h3>
          <button className="font-sans text-[12px] font-semibold tracking-[0.05em] text-primary underline decoration-primary/30 underline-offset-4 uppercase">
            View All
          </button>
        </div>
        
        <div className="card-ivory rounded-xl overflow-hidden ring-subtle">
          {transactions.length === 0 ? (
            <div className="p-xl text-center text-muted-foreground italic">
              No transactions yet.
            </div>
          ) : (
            transactions.slice().reverse().slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-md border-b border-border last:border-0">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">
                      {tx.type === 'income' ? 'payments' : 'shopping_basket'}
                    </span>
                  </div>
                  <div>
                    <p className="font-sans text-[16px] font-medium">{tx.note || 'No note'}</p>
                    <p className="font-sans text-[14px] text-muted-foreground">{format(new Date(tx.date), 'dd/MM/yyyy')}</p>
                  </div>
                </div>
                <p className={`font-sans text-[16px] font-bold ${tx.type === 'income' ? 'text-[#004f50]' : 'text-foreground'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default App;
