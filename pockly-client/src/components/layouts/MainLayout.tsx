import React from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen text-on-surface" style={{ backgroundColor: "#f5f4ed" }}>
      <Header />

      <main className="px-5 pt-4 pb-32 max-w-2xl mx-auto">
        {children}
      </main>

      <Footer />
    </div>
  );
};