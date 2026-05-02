// src/lib/storage.ts
// LocalStorage layer for Pockly app

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note?: string;
  date: string; // ISO string
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  hidden?: boolean; // Optional field to hide categories
}

export interface Budget {
  month: string; // YYYY-MM
  total: number;
  categories: Record<string, number>; // categoryId -> amount
}

export interface Settings {
  currency: string;
  warningThreshold: number; // percentage
}

// Storage keys
const STORAGE_KEYS = {
  TRANSACTIONS: 'pockly_transactions',
  CATEGORIES: 'pockly_categories',
  BUDGETS: 'pockly_budgets',
  SETTINGS: 'pockly_settings',
} as const;

// Generic storage helpers
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key ${key}:`, error);
  }
}

// Transactions CRUD
export const transactionStorage = {
  getAll: (): Transaction[] => getFromStorage(STORAGE_KEYS.TRANSACTIONS, []),
  add: (transaction: Omit<Transaction, 'id'>): Transaction => {
    const transactions = transactionStorage.getAll();
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    transactions.push(newTransaction);
    setToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    return newTransaction;
  },
  update: (id: string, updates: Partial<Transaction>): Transaction | null => {
    const transactions = transactionStorage.getAll();
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return null;
    transactions[index] = { ...transactions[index], ...updates };
    setToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    return transactions[index];
  },
  delete: (id: string): boolean => {
    const transactions = transactionStorage.getAll();
    const filtered = transactions.filter(t => t.id !== id);
    if (filtered.length === transactions.length) return false;
    setToStorage(STORAGE_KEYS.TRANSACTIONS, filtered);
    return true;
  },
};

// Categories CRUD
export const categoryStorage = {
  getAll: (): Category[] => getFromStorage(STORAGE_KEYS.CATEGORIES, []),
  getById: (id: string): Category | null => {
    const categories = categoryStorage.getAll();
    return categories.find(c => c.id === id) || null;
  },
  add: (category: Omit<Category, 'id'>): Category => {
    const categories = categoryStorage.getAll();
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    categories.push(newCategory);
    setToStorage(STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  },
  update: (id: string, updates: Partial<Category>): Category | null => {
    const categories = categoryStorage.getAll();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    categories[index] = { ...categories[index], ...updates };
    setToStorage(STORAGE_KEYS.CATEGORIES, categories);
    return categories[index];
  },
  delete: (id: string): boolean => {
    const categories = categoryStorage.getAll();
    const filtered = categories.filter(c => c.id !== id);
    if (filtered.length === categories.length) return false;
    setToStorage(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  },
};

// Budgets CRUD
export const budgetStorage = {
  get: (month: string): Budget | null => {
    const budgets = getFromStorage<Record<string, Budget>>(STORAGE_KEYS.BUDGETS, {});
    return budgets[month] || null;
  },
  set: (budget: Budget): void => {
    const budgets = getFromStorage<Record<string, Budget>>(STORAGE_KEYS.BUDGETS, {});
    budgets[budget.month] = budget;
    setToStorage(STORAGE_KEYS.BUDGETS, budgets);
  },
  delete: (month: string): boolean => {
    const budgets = getFromStorage<Record<string, Budget>>(STORAGE_KEYS.BUDGETS, {});
    if (!budgets[month]) return false;
    delete budgets[month];
    setToStorage(STORAGE_KEYS.BUDGETS, budgets);
    return true;
  },
};

// Settings
export const settingsStorage = {
  get: (): Settings => getFromStorage(STORAGE_KEYS.SETTINGS, {
    currency: 'VND',
    warningThreshold: 80,
  }),
  update: (updates: Partial<Settings>): Settings => {
    const current = settingsStorage.get();
    const updated = { ...current, ...updates };
    setToStorage(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },
};

// Schema validation helpers (basic)
export const validateTransaction = (data: any): data is Omit<Transaction, 'id'> => {
  return (
    typeof data.type === 'string' && ['income', 'expense'].includes(data.type) &&
    typeof data.amount === 'number' && data.amount > 0 &&
    typeof data.category === 'string' &&
    typeof data.date === 'string'
  );
};

export const validateCategory = (data: any): data is Omit<Category, 'id'> => {
  return (
    typeof data.name === 'string' && data.name.trim() &&
    typeof data.icon === 'string' &&
    typeof data.color === 'string'
  );
};

export const validateBudget = (data: any): data is Budget => {
  return (
    typeof data.month === 'string' &&
    typeof data.total === 'number' && data.total >= 0 &&
    typeof data.categories === 'object'
  );
};