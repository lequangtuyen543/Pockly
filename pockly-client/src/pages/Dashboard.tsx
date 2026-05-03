import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import { EmptyState } from "../components/dashboard/EmptyState";
import { useTransactionStore } from "../store/transactionStore";
import { useBudgetStore } from "../store/budgetStore";
import { useCategoryStore } from "../store/categoryStore";
import { format, differenceInDays } from "date-fns";
import { formatCurrency } from "../lib/utils";
import { exportStorage } from "../lib/storage";

/* ─── Icon map for transaction categories ─── */
const CATEGORY_ICON: Record<string, string> = {
  income: "payments",
  food: "coffee",
  housing: "home",
  groceries: "shopping_basket",
  transport: "train",
  entertainment: "sports_esports",
  health: "favorite",
  default: "receipt_long",
};

function getCategoryIcon(tx: { type: string; category?: string }): string {
  if (tx.type === "income") return CATEGORY_ICON.income;
  return CATEGORY_ICON[tx.category ?? ""] ?? CATEGORY_ICON.default;
}

/* ─── Weekly bar-chart data ─── */
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MOCK_HEIGHTS = [40, 60, 85, 45, 70, 30, 55]; // today highlighted at index 2 (Wed)

const Dashboard = () => {
  const { transactions, loadTransactions } = useTransactionStore();
  const { loadBudget } = useBudgetStore();
  const { loadCategories } = useCategoryStore();
  const [showExportReminder, setShowExportReminder] = React.useState(false);

  useEffect(() => {
    loadTransactions();
    loadCategories();
    loadBudget(format(new Date(), "yyyy-MM"));

    const lastExport = exportStorage.getLastDate();
    if (lastExport) {
      const days = differenceInDays(new Date(), new Date(lastExport));
      if (days >= 30) setShowExportReminder(true);
    } else {
      exportStorage.setLastDate(new Date().toISOString());
    }
  }, [loadTransactions, loadCategories, loadBudget]);

  /* ── Aggregates ── */
  const balance = transactions.reduce(
    (acc, t) => acc + (t.type === "income" ? t.amount : -t.amount),
    0,
  );
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const recent = transactions.slice().reverse().slice(0, 5);

  return (
    <MainLayout>
      <div className="flex flex-col gap-10">
      {/* ── Export Reminder Banner ── */}
      {showExportReminder && (
        <div
          className="p-5 rounded-2xl flex items-start justify-between relative overflow-hidden"
          style={{ backgroundColor: "rgba(201,100,66,0.06)", border: "1px solid rgba(201,100,66,0.15)" }}
        >
          {/* Subtle background decoration */}
          <div 
            className="absolute -right-4 -top-4 opacity-5 pointer-events-none"
            style={{ fontSize: "80px" }}
          >
            <span className="material-symbols-outlined">sim_card_download</span>
          </div>

          <div className="flex gap-4 items-start relative z-10">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(201,100,66,0.1)" }}
            >
              <span className="material-symbols-outlined" style={{ color: "#c96442", fontSize: "20px" }}>
                sim_card_download
              </span>
            </div>
            <div>
              <p className="text-body-lg font-bold mb-0.5" style={{ color: "#231916" }}>
                Thời gian sao lưu định kỳ
              </p>
              <p className="text-body-sm mb-3" style={{ color: "#5f5e5a" }}>
                Đã hơn 30 ngày kể từ lần xuất dữ liệu cuối cùng. Hãy xuất CSV để bảo vệ dữ liệu của bạn.
              </p>
              <Link
                to="/settings"
                className="text-label-caps inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: "#c96442" }}
              >
                Đi đến cài đặt
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
              </Link>
            </div>
          </div>
          <button
            onClick={() => setShowExportReminder(false)}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
            title="Đóng"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#5f5e5a" }}>
              close
            </span>
          </button>
        </div>
      )}

      {/* ── Section: Greeting ── */}
      <section>
        <p className="text-label-caps mb-1" style={{ color: "#5f5e5a" }}>
          Welcome back,
        </p>
        <h2 className="text-headline-md" style={{ color: "#231916" }}>
          Financial Summary
        </h2>
      </section>

      {/* ── Section: Bento Summary Grid ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Balance card — full width */}
        <div
          className="col-span-2 card-ivory rounded-xl p-6 ring-subtle"
          style={{ borderLeft: "4px solid #c96442" }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-caps" style={{ color: "#5f5e5a" }}>
              Current Balance
            </span>
            <span className="material-symbols-outlined" style={{ color: "#c96442" }}>
              account_balance_wallet
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-display-lg" style={{ color: "#c96442" }}>
              {formatCurrency(balance)}
            </span>
          </div>
        </div>

        {/* Income card */}
        <div className="card-ivory rounded-xl p-4 ring-subtle">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px", color: "#004f50" }}
            >
              arrow_downward
            </span>
            <span className="text-label-caps" style={{ fontSize: "10px", color: "#5f5e5a" }}>
              Income
            </span>
          </div>
          <p className="text-title-sm" style={{ color: "#231916" }}>
            {formatCurrency(totalIncome)}
          </p>
        </div>

        {/* Expense card */}
        <div className="card-ivory rounded-xl p-4 ring-subtle">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px", color: "#c96442" }}
            >
              arrow_upward
            </span>
            <span className="text-label-caps" style={{ fontSize: "10px", color: "#5f5e5a" }}>
              Expense
            </span>
          </div>
          <p className="text-title-sm" style={{ color: "#231916" }}>
            {formatCurrency(totalExpense)}
          </p>
        </div>
      </div>

      {/* ── Section: Weekly Activity Bar Chart ── */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-title-sm" style={{ color: "#231916" }}>
            Weekly Activity
          </h3>
          <span className="text-label-caps" style={{ color: "#5f5e5a" }}>
            Last 7 Days
          </span>
        </div>

        <div
          className="card-ivory rounded-xl p-6 ring-subtle flex items-end justify-between gap-2"
          style={{ height: "160px" }}
        >
          {MOCK_HEIGHTS.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-sm transition-all duration-500"
                style={{
                  height: `${h}%`,
                  backgroundColor: i === 2 ? "#c96442" : "#e2dfda",
                }}
              />
              <span
                className="text-label-caps"
                style={{
                  fontSize: "9px",
                  color: i === 2 ? "#c96442" : "#5f5e5a",
                  fontWeight: i === 2 ? 700 : 600,
                }}
              >
                {DAYS[i]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Recent Transactions ── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-title-sm" style={{ color: "#231916" }}>
            Recent Transactions
          </h3>
          <Link
            to="/history"
            className="text-label-caps underline underline-offset-4"
            style={{ color: "#c96442", textDecorationColor: "rgba(201,100,66,0.3)" }}
          >
            View All
          </Link>
        </div>

        <div className="card-ivory rounded-xl overflow-hidden ring-subtle">
          {transactions.length === 0 ? (
            <EmptyState />
          ) : (
            recent.map((tx, i, arr) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4"
                style={
                  i !== arr.length - 1
                    ? { borderBottom: "1px solid #e8e6dc" }
                    : undefined
                }
              >
                {/* Left: icon + meta */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#fdeae4" }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#c96442" }}
                    >
                      {getCategoryIcon(tx)}
                    </span>
                  </div>
                  <div>
                    <p className="text-body-lg font-medium" style={{ color: "#231916" }}>
                      {tx.note || tx.category || "No note"}
                    </p>
                    <p className="text-body-sm" style={{ color: "#5f5e5a" }}>
                      {format(new Date(tx.date), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>

                {/* Right: amount */}
                <p
                  className="text-body-lg"
                  style={{
                    color: tx.type === "income" ? "#004f50" : "#231916",
                    fontWeight: tx.type === "income" ? 700 : 400,
                  }}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
