// src/store/categoryStore.ts
import { create } from 'zustand';
import type { Category } from '@/lib/storage';
import { categoryStorage, validateCategory } from '@/lib/storage';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCategories: () => void;
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category | null>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  loadCategories: () => {
    set({ isLoading: true, error: null });
    try {
      const categories = categoryStorage.getAll();
      // If no categories, add defaults
      if (categories.length === 0) {
        const defaults: Omit<Category, 'id'>[] = [
          { name: 'Food & Dining', icon: '🍽️', color: '#ef4444' },
          { name: 'Transportation', icon: '🚗', color: '#f97316' },
          { name: 'Shopping', icon: '🛍️', color: '#eab308' },
          { name: 'Entertainment', icon: '🎬', color: '#22c55e' },
          { name: 'Bills & Utilities', icon: '💡', color: '#3b82f6' },
          { name: 'Salary', icon: '💰', color: '#10b981' },
          { name: 'Freelance', icon: '💻', color: '#8b5cf6' },
          { name: 'Other', icon: '📦', color: '#6b7280' },
        ];
        defaults.forEach(cat => categoryStorage.add(cat));
        const newCategories = categoryStorage.getAll();
        set({ categories: newCategories, isLoading: false });
      } else {
        set({ categories, isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to load categories', isLoading: false });
    }
  },

  addCategory: async (category) => {
    if (!validateCategory(category)) {
      set({ error: 'Invalid category data' });
      return null;
    }

    set({ isLoading: true, error: null });
    try {
      const newCategory = categoryStorage.add(category);
      set(state => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));
      return newCategory;
    } catch (error) {
      set({ error: 'Failed to add category', isLoading: false });
      return null;
    }
  },

  updateCategory: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = categoryStorage.update(id, updates);
      if (!updated) {
        set({ error: 'Category not found', isLoading: false });
        return false;
      }
      set(state => ({
        categories: state.categories.map(c => c.id === id ? updated : c),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: 'Failed to update category', isLoading: false });
      return false;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const success = categoryStorage.delete(id);
      if (!success) {
        set({ error: 'Category not found', isLoading: false });
        return false;
      }
      set(state => ({
        categories: state.categories.filter(c => c.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ error: 'Failed to delete category', isLoading: false });
      return false;
    }
  },
}));