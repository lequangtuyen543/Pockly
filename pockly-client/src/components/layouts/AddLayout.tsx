import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

interface AddLayoutProps {
  children: React.ReactNode;
  title?: string;
  showClose?: boolean;
}

export const AddLayout: React.FC<AddLayoutProps> = ({
  children,
  title = "Add Transaction",
  showClose = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-on-surface" style={{ backgroundColor: "#f5f4ed" }}>
      <Header mode="form" title={title} showClose={showClose} onClose={() => navigate("/")} />

      <main className="px-5 pt-4 pb-32 max-w-2xl mx-auto">
        {children}
      </main>

      <Footer hideAddButton />
    </div>
  );
};