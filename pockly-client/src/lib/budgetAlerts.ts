// src/lib/budgetAlerts.ts

export type AlertLevel = 'none' | 'warning' | 'danger' | 'critical';

/**
 * Determines the alert level based on spending and budget limit.
 * 
 * Thresholds:
 * - < 80%: none
 * - 80% - 99.9%: warning
 * - 100% - 119.9%: danger (limit reached)
 * - >= 120%: critical (overspending)
 */
export const getBudgetAlertLevel = (spent: number, limit: number | null | undefined): AlertLevel => {
  if (limit === null || limit === undefined || limit <= 0) {
    return 'none';
  }

  // Handle negative spending as 0 for alert purposes
  const effectiveSpent = Math.max(0, spent);
  const percentage = (effectiveSpent / limit) * 100;

  if (percentage >= 120) return 'critical';
  if (percentage >= 100) return 'danger';
  if (percentage >= 80) return 'warning';
  
  return 'none';
};
