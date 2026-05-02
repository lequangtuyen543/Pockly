// src/components/transaction/TransactionForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactionStore } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';
import { format } from 'date-fns';

interface TransactionFormProps {
  onSuccess?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess }) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const amountInputRef = useRef<HTMLInputElement>(null);
  const { addTransaction } = useTransactionStore();
  const { categories, loadCategories } = useCategoryStore();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    // Auto-focus amount input
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category) return;

    setIsSubmitting(true);

    const transaction = {
      type,
      amount: parseFloat(amount),
      category,
      note: note.trim() || undefined,
      date: new Date(date).toISOString(),
    };

    const result = await addTransaction(transaction);

    if (result) {
      // Reset form
      setAmount('');
      setNote('');
      setDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      onSuccess?.();
    }

    setIsSubmitting(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="space-y-4">
      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg animate-bounce">
            ✅ Giao dịch đã được lưu!
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={type === 'expense' ? 'default' : 'outline'}
            onClick={() => setType('expense')}
            className="flex-1"
          >
            Chi tiêu
          </Button>
          <Button
            type="button"
            variant={type === 'income' ? 'default' : 'outline'}
            onClick={() => setType('income')}
            className="flex-1"
          >
            Thu nhập
          </Button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Số tiền</label>
          <Input
            ref={amountInputRef}
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-lg"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium mb-1">Danh mục</label>
          <Select value={category} onValueChange={(value) => value !== null && setCategory(value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Note Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Ghi chú (tùy chọn)</label>
          <Input
            type="text"
            placeholder="Thêm ghi chú..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Thời gian</label>
          <Input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !amount || !category}
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu giao dịch'}
        </Button>
      </form>
    </div>
  );
};