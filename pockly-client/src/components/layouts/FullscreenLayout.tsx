import React from 'react';

interface FullscreenLayoutProps {
  children: React.ReactNode;
}

export const FullscreenLayout: React.FC<FullscreenLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
};