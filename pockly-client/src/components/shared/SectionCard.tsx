import React from 'react';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export const SectionCard: React.FC<SectionCardProps> = ({ children, className = '', padding = 'lg' }) => {
  const paddingClass = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-lg',
  }[padding];

  return (
    <div className={`bg-[#faf9f5] border border-[#e8e6dc] rounded-xl ring-1 ring-black/5 ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};