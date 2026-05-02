import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const HistoryPage = () => (
  <MainLayout>
    <TransactionList />
  </MainLayout>
);

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
        {/* Fallback to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
