// src/components/transaction/TransactionItem.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTransactionStore } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';
import type { Transaction } from '@/lib/storage';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onEdit }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);

  const { deleteTransaction } = useTransactionStore();
  const { categories } = useCategoryStore();

  const category = categories.find(c => c.id === transaction.category);

  const handleLongPressStart = () => {
    const timer = window.setTimeout(() => {
      setShowMenu(true);
    }, 500); // 500ms long press
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      window.clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleDelete = async () => {
    const success = await deleteTransaction(transaction.id);
    if (success) {
      setShowDeleteDialog(false);
      setShowMenu(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return `Hôm nay ${format(date, 'HH:mm')}`;
    } else if (diffInDays === 1) {
      return `Hôm qua ${format(date, 'HH:mm')}`;
    } else if (diffInDays < 7) {
      return format(date, 'EEEE HH:mm', { locale: vi });
    } else {
      return format(date, 'dd/MM/yyyy HH:mm');
    }
  };

  return (
    <>
      <div
        className={`p-4 border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors ${
          transaction.type === 'income' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
        }`}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{category?.icon || '📦'}</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {category?.name || 'Unknown'}
              </div>
              {transaction.note && (
                <div className="text-sm text-gray-600 mt-1">
                  {transaction.note}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(transaction.date)}
              </div>
            </div>
          </div>
          <div className={`text-right font-semibold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}>
            <div className="text-lg">
              {transaction.type === 'income' ? '+' : '-'}
              {formatAmount(transaction.amount)}
            </div>
          </div>
        </div>

        {/* Long press menu */}
        {showMenu && (
          <div className="absolute right-4 top-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onEdit?.(transaction);
                setShowMenu(false);
              }}
              className="w-full justify-start"
            >
              ✏️ Sửa
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowDeleteDialog(true);
                setShowMenu(false);
              }}
              className="w-full justify-start text-red-600"
            >
              🗑️ Xoá
            </Button>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xoá giao dịch này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Huỷ
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};