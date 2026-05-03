import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { formatCurrency } from "./lib/utils";
import { useAppStore } from "./store/appStore";
import { useTransactionStore } from "./store/transactionStore";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import Dashboard from "./pages/Dashboard";
import { MainLayout } from "./components/layouts/MainLayout";
import { AddLayout } from "./components/layouts/AddLayout";
import { CategoryManager } from "./components/category/CategoryManager";
import SettingsPage from "./pages/Settings";
import { TransactionForm } from "./components/transaction/TransactionForm";
import HistoryPage from "./pages/History";
import BudgetPage from "./pages/Budget";

const StatsPage = () => (
  <MainLayout>
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <section>
        <h1 className="font-headline-md text-headline-md text-on-surface">Analytics</h1>
        <p className="font-body-sm text-body-sm text-secondary mt-1">Monthly spending overview for October</p>
      </section>

      {/* Summary Cards Bento Grid */}
      <section className="grid grid-cols-2 gap-md">
        <div className="card-ivory p-6 rounded-xl ring-subtle">
          <span className="font-label-caps text-label-caps text-secondary">TOTAL SPENT</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-headline-md text-headline-md text-primary">{formatCurrency(4280000)}</span>
          </div>
        </div>
        <div className="card-ivory p-6 rounded-xl ring-subtle">
          <span className="font-label-caps text-label-caps text-secondary">SAVINGS RATE</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-headline-md text-headline-md text-on-surface">24%</span>
            <span className="material-symbols-outlined text-[#c96442] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
          </div>
        </div>
      </section>

      {/* Elegant Donut Chart Section */}
      <section className="flex flex-col items-center justify-center py-4">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="donut-gradient w-full h-full rounded-full ring-1 ring-black/5"></div>
          <div className="absolute inset-8 bg-[#f5f4ed] rounded-full flex flex-col items-center justify-center text-center shadow-inner">
            <span className="font-label-caps text-label-caps text-secondary">OCTOBER</span>
            <span className="font-title-sm text-title-sm text-on-surface">Expenses</span>
          </div>
        </div>
        {/* Legend */}
        <div className="mt-lg flex gap-md flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#c96442]"></div>
            <span className="font-body-sm text-body-sm text-secondary">Housing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#d97a5a]"></div>
            <span className="font-body-sm text-body-sm text-secondary">Lifestyle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#e8e6dc]"></div>
            <span className="font-body-sm text-body-sm text-secondary">Food</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#5f5e5a]"></div>
            <span className="font-body-sm text-body-sm text-secondary">Other</span>
          </div>
        </div>
      </section>

      {/* Category Breakdown List */}
      <section className="card-ivory rounded-xl ring-subtle overflow-hidden mb-8">
        <div className="p-md border-b border-[#e8e6dc]">
          <h2 className="font-title-sm text-title-sm text-on-surface">Category Breakdown</h2>
        </div>
        <div className="divide-y divide-[#e8e6dc]">
          {/* Housing & Rent */}
          <div className="p-md flex items-center justify-between">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-lg bg-[#fdeae4] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c96442]">home</span>
              </div>
              <div>
                <p className="font-body-lg text-body-lg text-on-surface">Housing & Rent</p>
                <p className="font-body-sm text-body-sm text-secondary">45% of total budget</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-body-lg text-body-lg text-on-surface font-semibold">{formatCurrency(1926000)}</p>
              <div className="w-24 h-1.5 bg-[#e8e6dc] rounded-full mt-1 overflow-hidden">
                <div className="bg-[#c96442] h-full" style={{ width: "45%" }}></div>
              </div>
            </div>
          </div>
          {/* Lifestyle */}
          <div className="p-md flex items-center justify-between">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-lg bg-[#fdeae4] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c96442]">shopping_bag</span>
              </div>
              <div>
                <p className="font-body-lg text-body-lg text-on-surface">Lifestyle</p>
                <p className="font-body-sm text-body-sm text-secondary">25% of total budget</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-body-lg text-body-lg text-on-surface font-semibold">{formatCurrency(1070000)}</p>
              <div className="w-24 h-1.5 bg-[#e8e6dc] rounded-full mt-1 overflow-hidden">
                <div className="bg-[#d97a5a] h-full" style={{ width: "25%" }}></div>
              </div>
            </div>
          </div>
          {/* Food & Dining */}
          <div className="p-md flex items-center justify-between">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-lg bg-[#fdeae4] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c96442]">restaurant</span>
              </div>
              <div>
                <p className="font-body-lg text-body-lg text-on-surface">Food & Dining</p>
                <p className="font-body-sm text-body-sm text-secondary">15% of total budget</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-body-lg text-body-lg text-on-surface font-semibold">{formatCurrency(642000)}</p>
              <div className="w-24 h-1.5 bg-[#e8e6dc] rounded-full mt-1 overflow-hidden">
                <div className="bg-[#e8e6dc] h-full" style={{ width: "15%" }}></div>
              </div>
            </div>
          </div>
          {/* Transport */}
          <div className="p-md flex items-center justify-between">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-lg bg-[#fdeae4] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c96442]">commute</span>
              </div>
              <div>
                <p className="font-body-lg text-body-lg text-on-surface">Transport</p>
                <p className="font-body-sm text-body-sm text-secondary">15% of total budget</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-body-lg text-body-lg text-on-surface font-semibold">{formatCurrency(642000)}</p>
              <div className="w-24 h-1.5 bg-[#e8e6dc] rounded-full mt-1 overflow-hidden">
                <div className="bg-[#5f5e5a] h-full" style={{ width: "15%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
);


const CategoriesPage = () => (
  <MainLayout>
    <CategoryManager />
  </MainLayout>
);


const AddPage = () => (
  <AddLayout title="Add Transaction" showClose={true}>
    <TransactionForm onSuccess={() => window.location.href = "/"} />
  </AddLayout>
);

const EditPage = () => {
  const { id } = useParams();
  const { transactions } = useTransactionStore();
  const transaction = transactions.find(t => t.id === id);

  if (!transaction) {
    return <Navigate to="/" replace />;
  }

  return (
    <AddLayout title="Edit Transaction" showClose={true}>
      <TransactionForm
        initialData={transaction}
        onSuccess={() => window.location.href = "/history"}
      />
    </AddLayout>
  );
};

function App() {
  const { isOnboardingCompleted } = useAppStore();

  if (!isOnboardingCompleted) {
    return <OnboardingFlow />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/history" element={<MainLayout><HistoryPage /></MainLayout>} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
        {/* Fallback to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
