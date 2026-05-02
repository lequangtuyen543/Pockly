import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen font-sans text-foreground bg-background">
      {/* Top AppBar */}
      <header className="bg-background flex items-center justify-between px-5 h-16 w-full sticky top-0 border-b border-border z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted overflow-hidden ring-1 ring-border">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpfgB3DmyMi0poVeYcPW6AAR1oHjZK-0XL5Zq6JjBL4t9G3TZoSNGTcHZQzz3YHShWhRAbVFPZ62alEXYoFrFtmAz0ClBtsMPmaVY1-IynSoEiYpc6E5iEM0pCKlJxbnTabvlssa6voYy4gYuYRFFylVKpdLd4-Z2l_zQy4aQlgW7CcMxLZvMSSx5k2oxcyzPKo9SUdrRsQs2KSUeb0dpKXiEmmKqf51ZOU7W_J9U73hXZe9UiBy0K7u3xpUAkvPbFwWg57WU-gP0"
            />
          </div>
          <h1 className="font-serif font-bold text-2xl text-primary tracking-tight">
            Pockly
          </h1>
        </div>
        <button className="material-symbols-outlined text-primary hover:bg-black/5 transition-colors p-2 rounded-full active:opacity-80 active:scale-95 transition-transform">
          settings
        </button>
      </header>

      {/* Main Content */}
      <main className="px-margin-mobile pt-md pb-32 max-w-2xl mx-auto">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-2 bg-card border-t border-border ring-1 ring-black/5">
        <a
          href="#"
          className="flex flex-col items-center text-primary font-bold active:scale-90 transition-transform duration-150"
        >
          <span className="material-symbols-outlined-filled">home</span>
          <span className="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">
            Home
          </span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors active:scale-90 transition-transform duration-150"
        >
          <span className="material-symbols-outlined">analytics</span>
          <span className="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">
            Stats
          </span>
        </a>
        <button className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center -translate-y-4 shadow-lg active:scale-90 transition-transform">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 600" }}
          >
            add
          </span>
        </button>
        <a
          href="#"
          className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors active:scale-90 transition-transform duration-150"
        >
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">
            Budget
          </span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors active:scale-90 transition-transform duration-150"
        >
          <span className="material-symbols-outlined">list_alt</span>
          <span className="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">
            History
          </span>
        </a>
      </nav>
    </div>
  );
};
