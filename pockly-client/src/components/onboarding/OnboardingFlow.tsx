import React, { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { useBudgetStore } from '@/store/budgetStore';
import { useTransactionStore } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const { completeOnboarding } = useAppStore();
  const { setBudget } = useBudgetStore();
  const { addTransaction } = useTransactionStore();
  const { categories, loadCategories } = useCategoryStore();

  // State for step 2: Budget
  const [budgetAmount, setBudgetAmount] = useState('5000000');

  // State for step 3: First Transaction
  const [txAmount, setTxAmount] = useState('50000');
  const [txNote, setTxNote] = useState('Ăn sáng');
  const [selectedCategory, setSelectedCategory] = useState('');

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleFinish = async () => {
    // Save Budget
    const currentMonth = format(new Date(), 'yyyy-MM');
    await setBudget({
      month: currentMonth,
      total: Number(budgetAmount),
      categories: {},
    });

    // Save First Transaction
    await addTransaction({
      type: 'expense',
      amount: Number(txAmount),
      category: selectedCategory,
      note: txNote,
      date: new Date().toISOString(),
    });

    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-margin-mobile">
      <div className="w-full max-w-md space-y-xl text-center">
        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mb-xl">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mx-auto w-24 h-24 bg-surface-container rounded-full flex items-center justify-center ring-subtle">
              <span className="material-symbols-outlined text-primary text-5xl">wallet</span>
            </div>
            <div className="space-y-sm">
              <h1 className="font-serif text-3xl text-foreground">Chào mừng tới Pockly</h1>
              <p className="text-muted-foreground">
                Ứng dụng ghi chép thu chi siêu tốc, giúp bạn quản lý tài chính cá nhân hiệu quả chỉ trong vài giây.
              </p>
            </div>
            <Button onClick={handleNextStep} className="w-full py-6 text-lg rounded-xl">
              Bắt đầu ngay
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-lg animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-sm text-left">
              <h2 className="font-serif text-2xl text-foreground">Ngân sách tháng này?</h2>
              <p className="text-muted-foreground">
                Hãy đặt một mục tiêu chi tiêu cho tháng {format(new Date(), 'MM/yyyy')}. Chúng tôi sẽ giúp bạn theo dõi.
              </p>
            </div>
            <div className="space-y-md">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₫</span>
                <Input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="pl-8 py-8 text-2xl font-serif rounded-xl border-border focus:border-primary"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-muted-foreground text-left italic">
                * Bạn có thể thay đổi ngân sách này bất cứ lúc nào trong phần cài đặt.
              </p>
            </div>
            <Button onClick={handleNextStep} className="w-full py-6 text-lg rounded-xl">
              Tiếp theo
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-lg animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-sm text-left">
              <h2 className="font-serif text-2xl text-foreground">Giao dịch đầu tiên</h2>
              <p className="text-muted-foreground">
                Thử ghi lại một khoản chi gần nhất của bạn.
              </p>
            </div>
            <div className="space-y-md text-left">
              <div className="space-y-sm">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Số tiền</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₫</span>
                  <Input
                    type="number"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="pl-8 py-6 text-xl font-serif rounded-xl border-border focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-sm">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Danh mục</label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.slice(0, 8).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        selectedCategory === cat.id 
                        ? 'bg-primary text-white scale-105 shadow-md' 
                        : 'bg-surface-container text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-[10px] truncate w-full text-center">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-sm">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ghi chú</label>
                <Input
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  className="py-4 rounded-xl border-border focus:border-primary"
                  placeholder="Ví dụ: Ăn trưa, Cafe..."
                />
              </div>
            </div>
            <Button onClick={handleFinish} className="w-full py-6 text-lg rounded-xl">
              Hoàn tất & Khám phá
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
