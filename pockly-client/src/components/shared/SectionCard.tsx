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
    lg: 'p-6',
  }[padding];

  return (
    <div className={`card-ivory rounded-xl ring-subtle ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};