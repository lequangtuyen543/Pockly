import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`pb-24 pt-8 px-margin-mobile max-w-2xl mx-auto ${className}`}>
      {children}
    </div>
  );
};