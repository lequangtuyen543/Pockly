import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface FooterProps {
  hideAddButton?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ hideAddButton = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/stats') return 'stats';
    if (path === '/budget') return 'budget';
    if (path === '/history') return 'history';
    return '';
  };

  const activeTab = getActiveTab();

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2"
      style={{
        backgroundColor: '#faf9f5',
        borderTop: '1px solid #e8e6dc',
        boxShadow: '0 -1px 0 0 rgba(0,0,0,0.04)',
      }}
    >
      {/* Home */}
      <Link
        to="/"
        className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-150"
        style={{ color: activeTab === 'home' ? '#c96442' : '#a8a29e' }}
      >
        <span
          className="material-symbols-outlined"
          style={
            activeTab === 'home'
              ? { fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24", color: '#c96442' }
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
        style={{ color: activeTab === 'stats' ? '#c96442' : '#a8a29e' }}
      >
        <span className="material-symbols-outlined">analytics</span>
        <span className="text-[11px] font-medium uppercase tracking-wider">Stats</span>
      </Link>

      {/* Add FAB Button */}
      {!hideAddButton ? (
        <button
          onClick={() => navigate('/add')}
          aria-label="Add transaction"
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg -translate-y-4 active:scale-90 transition-transform"
          style={{ backgroundColor: '#c96442', color: '#ffffff' }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24" }}
          >
            add
          </span>
        </button>
      ) : (
        <button
          onClick={() => navigate('/add')}
          aria-label="Add transaction"
          className="flex flex-col items-center text-[#c96442] font-bold"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-[11px] font-medium uppercase tracking-wider">
            Add
          </span>
        </button>
      )}

      {/* Budget */}
      <Link
        to="/budget"
        className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-150"
        style={{ color: activeTab === 'budget' ? '#c96442' : '#a8a29e' }}
      >
        <span className="material-symbols-outlined">account_balance_wallet</span>
        <span className="text-[11px] font-medium uppercase tracking-wider">Budget</span>
      </Link>

      {/* History */}
      <Link
        to="/history"
        className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-150"
        style={{ color: activeTab === 'history' ? '#c96442' : '#a8a29e' }}
      >
        <span className="material-symbols-outlined">list_alt</span>
        <span className="text-[11px] font-medium uppercase tracking-wider">History</span>
      </Link>
    </nav>
  );
};