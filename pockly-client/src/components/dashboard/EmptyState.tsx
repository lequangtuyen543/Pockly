import React from 'react';
import { Button } from '@/components/ui/button';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-xl space-y-lg text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center ring-subtle">
        <span className="material-symbols-outlined text-primary text-4xl">history_edu</span>
      </div>
      <div className="space-y-sm">
        <h3 className="font-serif text-xl text-foreground">Chưa có giao dịch nào</h3>
        <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
          Hãy bắt đầu ghi chép các khoản chi tiêu đầu tiên để Pockly giúp bạn quản lý tài chính tốt hơn.
        </p>
      </div>
      <div className="pt-2">
        <p className="text-xs text-primary font-semibold uppercase tracking-widest animate-bounce">
          Nhấn nút + bên dưới để bắt đầu ↓
        </p>
      </div>
    </div>
  );
};
