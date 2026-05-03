import React from "react";
import { Link, useNavigate } from "react-router-dom";

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
      {/* Custom Header matching reference */}
      <header
        className="flex items-center justify-between px-5 h-16 w-full sticky top-0 z-50 border-b"
        style={{ backgroundColor: "#f5f4ed", borderColor: "#e8e6dc" }}
      >
        <div className="flex items-center gap-3">
          {showClose && (
            <button
              onClick={() => navigate("/")}
              aria-label="Close"
              className="material-symbols-outlined text-stone-500 hover:bg-stone-100 p-2 rounded-full transition-colors"
            >
              close
            </button>
          )}
          <h1
            className="font-serif text-2xl font-medium tracking-tight"
            style={{ fontFamily: "'Newsreader', Georgia, serif", color: "#c96442" }}
          >
            {title}
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full border overflow-hidden" style={{ borderColor: "#e8e6dc" }}>
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9kY9rJYUa6DyKIwK6o5fjSSriOOSxEtKy2n7GEFJkItVLGufhsmUDfX8GZrDloHbOIcU2D_AInoVEOqqDSfxAXC0shqdKx8WGPF54X9sDb5170gTm8T61b9QoI42xlveDkD0HjYDUitguBQyPv6rPKd3KCwLUaXc2apTXEWaGS0iX-4axTpMym_VOo9CmRzyllGORHAF83hOCpMQYZdGtmAkVxKuYLzJmRVw5N-oJVYDdHS0p4ZzhDJuJ69TAWlr7w_9xBU2f1Ec"
          />
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-xl mx-auto px-5 mt-6">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2"
        style={{
          backgroundColor: "#faf9f5",
          borderTop: "1px solid #e8e6dc",
          boxShadow: "0 -1px 0 0 rgba(0,0,0,0.04)",
        }}
      >
        <Link
          to="/"
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-150"
          style={{ color: "#a8a29e" }}
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[11px] font-medium uppercase tracking-wider">Home</span>
        </Link>

        <Link
          to="/stats"
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-150"
          style={{ color: "#a8a29e" }}
        >
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[11px] font-medium uppercase tracking-wider">Stats</span>
        </Link>

        <button
          onClick={() => navigate("/add")}
          aria-label="Add transaction"
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-150"
          style={{ color: "#c96442" }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}
          >
            add_circle
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider">Add</span>
        </button>

        <Link
          to="/budget"
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-150"
          style={{ color: "#a8a29e" }}
        >
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="text-[11px] font-medium uppercase tracking-wider">Budget</span>
        </Link>

        <Link
          to="/history"
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-150"
          style={{ color: "#a8a29e" }}
        >
          <span className="material-symbols-outlined">list_alt</span>
          <span className="text-[11px] font-medium uppercase tracking-wider">History</span>
        </Link>
      </nav>
    </div>
  );
};
