import { describe, it, expect } from 'vitest';
import { getBudgetAlertLevel } from './budgetAlerts';
import { calculateStats } from './stats';
import type { Transaction } from './storage';

/**
 * Unit tests for BUDGET ALERT logic.
 * 
 * Thresholds validated:
 * - 0% (no spending)
 * - 80% (warning)
 * - 100% (limit reached)
 * - 120% (overspending)
 * 
 * Edge cases:
 * - No budget defined
 * - Zero budget
 * - Negative values
 */
describe('Budget Alert Logic', () => {
  const BUDGET_LIMIT = 1000000; // 1,000,000 VND

  // Mock transaction data for reuse
  const mockTransactions: Transaction[] = [
    { id: '1', type: 'expense', amount: 400000, category: 'food', date: '2026-05-01' },
    { id: '2', type: 'expense', amount: 400000, category: 'shopping', date: '2026-05-02' },
    { id: '3', type: 'income', amount: 500000, category: 'salary', date: '2026-05-03' },
  ];

  describe('Threshold Requirements', () => {
    it('should return "none" for 0% spending (no spending)', () => {
      expect(getBudgetAlertLevel(0, BUDGET_LIMIT)).toBe('none');
    });

    it('should return "warning" for 80% spending', () => {
      // 800,000 / 1,000,000 = 80%
      expect(getBudgetAlertLevel(800000, BUDGET_LIMIT)).toBe('warning');
    });

    it('should return "danger" for 100% spending (limit reached)', () => {
      // 1,000,000 / 1,000,000 = 100%
      expect(getBudgetAlertLevel(1000000, BUDGET_LIMIT)).toBe('danger');
    });

    it('should return "critical" for 120% spending (overspending)', () => {
      // 1,200,000 / 1,000,000 = 120%
      expect(getBudgetAlertLevel(1200000, BUDGET_LIMIT)).toBe('critical');
    });
  });

  describe('Integration with Mock Transactions', () => {
    it('should return "warning" for current mock spending (80%)', () => {
      const stats = calculateStats(mockTransactions);
      expect(stats.totalExpense).toBe(800000);
      expect(getBudgetAlertLevel(stats.totalExpense, BUDGET_LIMIT)).toBe('warning');
    });

    it('should return "danger" when reaching exactly 100%', () => {
      const extraTx: Transaction = { id: '4', type: 'expense', amount: 200000, category: 'bills', date: '2026-05-04' };
      const stats = calculateStats([...mockTransactions, extraTx]);
      expect(stats.totalExpense).toBe(1000000);
      expect(getBudgetAlertLevel(stats.totalExpense, BUDGET_LIMIT)).toBe('danger');
    });

    it('should return "critical" when overspending by 120% or more', () => {
      const extraTx: Transaction = { id: '4', type: 'expense', amount: 400000, category: 'bills', date: '2026-05-04' };
      const stats = calculateStats([...mockTransactions, extraTx]);
      expect(stats.totalExpense).toBe(1200000);
      expect(getBudgetAlertLevel(stats.totalExpense, BUDGET_LIMIT)).toBe('critical');
    });
  });

  describe('Edge Cases', () => {
    it('should handle no budget defined (null or undefined)', () => {
      expect(getBudgetAlertLevel(500000, null)).toBe('none');
      expect(getBudgetAlertLevel(500000, undefined)).toBe('none');
    });

    it('should handle zero budget limit gracefully', () => {
      expect(getBudgetAlertLevel(100000, 0)).toBe('none');
    });

    it('should handle negative budget limit', () => {
      expect(getBudgetAlertLevel(100000, -500000)).toBe('none');
    });

    it('should handle negative spending values as zero', () => {
      expect(getBudgetAlertLevel(-5000, BUDGET_LIMIT)).toBe('none');
    });

    it('should handle precision issues near thresholds', () => {
      // 79.99% -> none
      expect(getBudgetAlertLevel(799900, 1000000)).toBe('none');
      // 80.01% -> warning
      expect(getBudgetAlertLevel(800100, 1000000)).toBe('warning');
    });
  });
});
