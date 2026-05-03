import React, { useState, useEffect, useRef } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useBudgetStore } from "@/store/budgetStore";
import { format } from "date-fns";

interface TransactionFormProps {
  onSuccess?: () => void;
  initialData?: any;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess, initialData }) => {
  const [type, setType] = useState<"income" | "expense">(initialData?.type || "expense");
  const [amount, setAmount] = useState(initialData?.amount.toString() || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [note, setNote] = useState(initialData?.note || "");
  const [date, setDate] = useState(
    initialData
      ? format(new Date(initialData.date), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const amountInputRef = useRef<HTMLInputElement>(null);
  const { addTransaction, updateTransaction } = useTransactionStore();
  const { categories, loadCategories } = useCategoryStore();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category) return;

    setIsSubmitting(true);

    const transactionData = {
      type,
      amount: parseFloat(amount),
      category,
      note: note.trim() || undefined,
      date: new Date(date + "T12:00:00").toISOString(),
    };

    let result;
    if (initialData) {
      result = await updateTransaction(initialData.id, transactionData);
    } else {
      result = await addTransaction(transactionData);
    }

    if (result) {
      if (!initialData) {
        setAmount("");
        setNote("");
        setCategory("");
        setDate(format(new Date(), "yyyy-MM-dd"));
      }

      if (transactionData.type === "expense") {
        checkBudgetAlerts(transactionData.amount, transactionData.category);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      onSuccess?.();
    }

    setIsSubmitting(false);
  };

  const checkBudgetAlerts = (expenseAmount: number, categoryId: string) => {
    const currentMonth = format(new Date(), "yyyy-MM");
    const { getBudgetProgress } = useBudgetStore.getState();
    const { transactions } = useTransactionStore.getState();

    const progress = getBudgetProgress(currentMonth, [
      ...transactions,
      {
        type: "expense",
        amount: expenseAmount,
        category: categoryId,
        date: new Date().toISOString(),
      },
    ]);

    if (progress.percentage >= 100 && progress.used - expenseAmount < progress.total) {
      showBudgetNotification("Vượt quá ngân sách!", `Bạn vừa vượt quá hạn mức tháng này.`);
    } else if (progress.percentage >= 80 && progress.used - expenseAmount < progress.total * 0.8) {
      showBudgetNotification("Cảnh báo ngân sách", `Bạn đã chi ${progress.percentage.toFixed(1)}% hạn mức tháng này.`);
    }

    const categoryProgress = progress.categoryProgress[categoryId];
    if (categoryProgress && categoryProgress.percentage >= 100 &&
        categoryProgress.used - expenseAmount < categoryProgress.limit) {
      showBudgetNotification("Vượt quá ngân sách danh mục!", `Danh mục này đã vượt quá hạn mức.`);
    } else if (categoryProgress && categoryProgress.percentage >= 80 &&
               categoryProgress.used - expenseAmount < categoryProgress.limit * 0.8) {
      showBudgetNotification("Cảnh báo danh mục", `Danh mục này đã chi ${categoryProgress.percentage.toFixed(1)}% hạn mức.`);
    }
  };

  const showBudgetNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Pockly - ${title}`, {
        body,
        icon: "/favicon.ico",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e as any);
    }
  };

  const filteredCategories = categories.filter((cat) => !cat.hidden);

  return (
    <div className="space-y-6 pb-24">
      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg animate-bounce">
            Giao dịch đã được lưu!
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-lg">
        {/* Transaction Type Toggle */}
        <div className="flex p-1 rounded-xl" style={{ backgroundColor: "#e2dfda" }}>
          <button
            type="button"
            onClick={() => {
              setType("expense");
              setCategory("");
            }}
            className="flex-1 py-3 px-4 rounded-lg font-label-caps text-label-caps transition-all duration-200"
            style={
              type === "expense"
                ? { backgroundColor: "#ffffff", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", color: "#1c1c19" }
                : { color: "#a8a29e" }
            }
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => {
              setType("income");
              setCategory("");
            }}
            className="flex-1 py-3 px-4 rounded-lg font-label-caps text-label-caps transition-all duration-200"
            style={
              type === "income"
                ? { backgroundColor: "#ffffff", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", color: "#1c1c19" }
                : { color: "#a8a29e" }
            }
          >
            Income
          </button>
        </div>

        {/* Amount Input Section */}
        <section className="text-center">
          <label className="font-title-sm text-title-sm text-stone-400 block mb-xs">Amount</label>
          <div className="relative inline-block">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 font-display-lg text-display-lg" style={{ color: "#c96442" }}>$</span>
            <input
              ref={amountInputRef}
              type="text"
              inputMode="numeric"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-transparent border-none focus:ring-0 text-center font-display-lg text-display-lg w-64 placeholder:opacity-30"
              style={{ color: "#c96442" }}
            />
            <div className="h-0.5 w-full mt-1" style={{ backgroundColor: "#c96442", opacity: 0.2 }}></div>
          </div>
        </section>

        {/* Category Selection */}
        <div className="bg-[#faf9f5] border rounded-xl p-md" style={{ borderColor: "#e8e6dc" }}>
          <label className="font-title-sm text-title-sm block mb-md italic" style={{ color: "#231916" }}>Category</label>
          <div className="grid grid-cols-4 gap-3">
            {filteredCategories.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className="w-12 h-12 rounded-full border flex items-center justify-center transition-all"
                    style={
                      isSelected
                        ? { borderColor: "#c96442", backgroundColor: "#fdeae4" }
                        : { borderColor: "#e8e6dc", backgroundColor: "transparent" }
                    }
                  >
                    <span className="text-xl">{cat.icon}</span>
                  </div>
                  <span
                    className="font-label-caps text-[10px]"
                    style={{ color: isSelected ? "#c96442" : "#a8a29e" }}
                  >
                    {cat.name.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date & Note Inputs */}
        <div className="grid grid-cols-1 gap-md">
          {/* Date */}
          <div className="bg-[#faf9f5] border rounded-xl p-md" style={{ borderColor: "#e8e6dc" }}>
            <label className="font-label-caps text-label-caps block mb-sm" style={{ color: "#a8a29e" }}>DATE</label>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ color: "#a8a29e" }}>calendar_today</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent border-none p-0 focus:ring-0 font-body-lg text-body-lg w-full"
                style={{ color: "#231916" }}
              />
            </div>
          </div>

          {/* Note */}
          <div className="bg-[#faf9f5] border rounded-xl p-md" style={{ borderColor: "#e8e6dc" }}>
            <label className="font-label-caps text-label-caps block mb-sm" style={{ color: "#a8a29e" }}>NOTE</label>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ color: "#a8a29e" }}>edit_note</span>
              <input
                type="text"
                placeholder="Add a description..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-transparent border-none p-0 focus:ring-0 font-body-lg text-body-lg w-full placeholder:text-stone-300"
                style={{ color: "#231916" }}
              />
            </div>
          </div>
        </div>

        {/* Optional Attachment Card */}
        <div
          className="bg-[#faf9f5] border border-dashed rounded-xl p-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors hover:border-[#c96442] group"
          style={{ borderColor: "#e8e6dc" }}
          onClick={() => {}}
        >
          <span className="material-symbols-outlined text-3xl" style={{ color: "#a8a29e" }}>add_a_photo</span>
          <span className="font-label-caps text-label-caps" style={{ color: "#a8a29e" }}>ATTACH RECEIPT</span>
        </div>

        {/* Action Button */}
        <div className="mt-xl pb-lg">
          <button
            type="submit"
            disabled={isSubmitting || !amount || !category}
            className="w-full text-white py-4 rounded-xl font-label-caps text-body-lg tracking-widest active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#c96442",
              boxShadow: "0 10px 15px -3px rgba(201, 100, 66, 0.2)",
            }}
          >
            {isSubmitting ? "SAVING..." : "SAVE TRANSACTION"}
          </button>
        </div>
      </form>
    </div>
  );
};
