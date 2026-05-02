import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/stats") return "stats";
    if (path === "/budget") return "budget";
    if (path === "/history") return "history";
    return "";
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen text-on-surface" style={{ backgroundColor: "#f5f4ed" }}>
      {/* ── Top AppBar ── */}
      <header
        className="flex items-center justify-between px-5 h-16 w-full sticky top-0 z-40 border-b"
        style={{ backgroundColor: "#f5f4ed", borderColor: "#e8e6dc" }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full overflow-hidden ring-1"
            style={{ ringColor: "#e8e6dc" }}
          >
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpfgB3DmyMi0poVeYcPW6AAR1oHjZK-0XL5Zq6JjBL4t9G3TZoSNGTcHZQzz3YHShWhRAbVFPZ62alEXYoFrFtmAz0ClBtsMPmaVY1-IynSoEiYpc6E5iEM0pCKlJxbnTabvlssa6voYy4gYuYRFFylVKpdLd4-Z2l_zQy4aQlgW7CcMxLZvMSSx5k2oxcyzPKo9SUdrRsQs2KSUeb0dpKXiEmmKqf51ZOU7W_J9U73hXZe9UiBy0K7u3xpUAkvPbFwWg57WU-gP0"
            />
          </div>
          {/* Wordmark */}
          <Link to="/">
            <h1
              className="font-bold text-2xl tracking-tight"
              style={{ fontFamily: "'Newsreader', Georgia, serif", color: "#c96442" }}
            >
              Pockly
            </h1>
          </Link>
        </div>

        {/* Settings icon */}
        <Link
          to="/settings"
          aria-label="Settings"
          className="material-symbols-outlined p-2 rounded-full transition-colors hover:bg-black/5 active:opacity-70"
          style={{ color: "#c96442" }}
        >
          settings
        </Link>
      </header>

      {/* ── Page Content ── */}
      <main className="px-5 pt-4 pb-32 max-w-2xl mx-auto">
        {children}
      </main>

      {/* ── Bottom Navigation Bar ── */}
      <nav
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2"
        style={{
          backgroundColor: "#faf9f5",
          borderTop: "1px solid #e8e6dc",
          boxShadow: "0 -1px 0 0 rgba(0,0,0,0.04)",
        }}
      >
        {/* Home */}
        <Link
          to="/"
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-150"
          style={{ color: activeTab === "home" ? "#c96442" : "#a8a29e" }}
        >
          <span
            className="material-symbols-outlined"
            style={
              activeTab === "home"
                ? { fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24", color: "#c96442" }
                : {}
            }
          >
            home
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider">Home</span>
        </Link>

        {/* Stats */}
        <Link
          to="/stats"
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-150"
          style={{ color: activeTab === "stats" ? "#c96442" : "#a8a29e" }}
        >
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[11px] font-medium uppercase tracking-wider">Stats</span>
        </Link>

        {/* FAB — Add */}
        <button
          onClick={() => navigate("/add")}
          aria-label="Add transaction"
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg -translate-y-4 active:scale-90 transition-transform"
          style={{ backgroundColor: "#c96442", color: "#ffffff" }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24" }}
          >
            add
          </span>
        </button>

        {/* Budget */}
        <Link
          to="/budget"
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-150"
          style={{ color: activeTab === "budget" ? "#c96442" : "#a8a29e" }}
        >
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="text-[11px] font-medium uppercase tracking-wider">Budget</span>
        </Link>

        {/* History */}
        <Link
          to="/history"
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-150"
          style={{ color: activeTab === "history" ? "#c96442" : "#a8a29e" }}
        >
          <span className="material-symbols-outlined">list_alt</span>
          <span className="text-[11px] font-medium uppercase tracking-wider">History</span>
        </Link>
      </nav>
    </div>
  );
};
