import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  mode?: 'main' | 'form';
  title?: string;
  showClose?: boolean;
  onClose?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode = 'main',
  title = '',
  showClose = false,
  onClose,
}) => {
  const navigate = useNavigate();

  if (mode === 'form') {
    return (
      <header
        className="flex items-center justify-between px-5 h-16 w-full sticky top-0 z-50 border-b"
        style={{ backgroundColor: '#f5f4ed', borderColor: '#e8e6dc' }}
      >
        <div className="flex items-center gap-3">
          {showClose && (
            <button
              onClick={onClose || (() => navigate('/'))}
              aria-label="Close"
              className="material-symbols-outlined p-2 rounded-full transition-colors hover:bg-black/5 active:opacity-70"
              style={{ color: '#c96442' }}
            >
              close
            </button>
          )}
          <h1
            className="font-bold text-2xl tracking-tight"
            style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#c96442' }}
          >
            {title}
          </h1>
        </div>
        <div
          className="w-10 h-10 rounded-full border overflow-hidden"
          style={{ borderColor: '#e8e6dc' }}
        >
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9kY9rJYUa6DyKIwK6o5fjSSriOOSxEtKy2n7GEFJkItVLGufhsmUDfX8GZrDloHbOIcU2D_AInoVEOqqDSfxAXC0shqdKx8WGPF54X9sDb5170gTm8T61b9QoI42xlveDkD0HjYDUitguBQyPv6rPKd3KCwLUaXc2apTXEWaGS0iX-4axTpMym_VOo9CmRzyllGORHAF83hOCpMQYZdGtmAkVxKuYLzJmRVw5N-oJVYDdHS0p4ZzhDJuJ69TAWlr7w_9xBU2f1Ec"
          />
        </div>
      </header>
    );
  }

  return (
    <header
      className="flex items-center justify-between px-5 h-16 w-full sticky top-0 z-40 border-b"
      style={{ backgroundColor: '#f5f4ed', borderColor: '#e8e6dc' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#e8e6dc]"
        >
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpfgB3DmyMi0poVeYcPW6AAR1oHjZK-0XL5Zq6JjBL4t9G3TZoSNGTcHZQzz3YHShWhRAbVFPZ62alEXYoFrFtmAz0ClBtsMPmaVY1-IynSoEiYpc6E5iEM0pCKlJxbnTabvlssa6voYy4gYuYRFFylVKpdLd4-Z2l_zQy4aQlgW7CcMxLZvMSSx5k2oxcyzPKo9SUdrRsQs2KSUeb0dpKXiEmmKqf51ZOU7W_J9U73hXZe9UiBy0K7u3xpUAkvPbFwWg57WU-gP0"
          />
        </div>
        <Link to="/">
          <h1
            className="font-bold text-2xl tracking-tight"
            style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#c96442' }}
          >
            Pockly
          </h1>
        </Link>
      </div>

      <Link
        to="/settings"
        aria-label="Settings"
        className="material-symbols-outlined p-2 rounded-full transition-colors hover:bg-black/5 active:opacity-70"
        style={{ color: '#c96442' }}
      >
        settings
      </Link>
    </header>
  );
};