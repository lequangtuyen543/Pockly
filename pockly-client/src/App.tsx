import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "./store/appStore";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import Dashboard from "./pages/Dashboard";
import { MainLayout } from "./components/layouts/MainLayout";
import { CategoryManager } from "./components/category/CategoryManager";
import { Settings } from "./components/settings/Settings";
import { TransactionForm } from "./components/transaction/TransactionForm";
import { TransactionList } from "./components/transaction/TransactionList";
import { BudgetSettings } from "./components/budget/BudgetSettings";

const StatsPage = () => (
  <MainLayout>
    <div className="space-y-6">
      <h2 className="text-headline-md">Thống kê</h2>
      <p className="text-secondary italic">Tính năng biểu đồ chi tiết đang được phát triển...</p>
    </div>
  </MainLayout>
);

const HistoryPage = () => {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <TransactionList onEditTransaction={(t) => navigate(`/edit/${t.id}`)} />
    </MainLayout>
  );
};

const BudgetPage = () => (
  <MainLayout>
    <BudgetSettings />
  </MainLayout>
);

const CategoriesPage = () => (
  <MainLayout>
    <CategoryManager />
  </MainLayout>
);

const SettingsPage = () => (
  <MainLayout>
    <Settings />
  </MainLayout>
);

const AddPage = () => (
  <MainLayout>
    <div className="space-y-6">
      <h2 className="text-headline-md">Thêm giao dịch</h2>
      <TransactionForm onSuccess={() => window.location.href = "/"} />
    </div>
  </MainLayout>
);

const EditPage = () => {
  const { id } = useParams();
  const { transactions } = useTransactionStore();
  const transaction = transactions.find(t => t.id === id);

  if (!transaction) {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h2 className="text-headline-md">Sửa giao dịch</h2>
        <TransactionForm 
          initialData={transaction} 
          onSuccess={() => window.location.href = "/history"} 
        />
      </div>
    </MainLayout>
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
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
        {/* Fallback to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
