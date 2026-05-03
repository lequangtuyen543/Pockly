import { describe, it, expect, beforeEach } from 'vitest';
import { transactionStorage } from '@/lib/storage';

describe('transactionStorage CRUD', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add and retrieve a transaction', () => {
    const transaction = {
      type: 'income' as const,
      amount: 180000,
      category: 'salary',
      note: 'Lương tháng 5',
      date: '2026-05-02T08:00:00.000Z',
    };

    const added = transactionStorage.add(transaction);
    expect(added.id).toBeTruthy();
    expect(added).toMatchObject(transaction);

    const all = transactionStorage.getAll();
    expect(all).toHaveLength(1);
    expect(all[0]).toEqual(added);
  });

  it('should update a transaction', () => {
    const initial = transactionStorage.add({
      type: 'expense' as const,
      amount: 65000,
      category: 'food',
      note: 'Cà phê',
      date: '2026-05-02T10:30:00.000Z',
    });

    const updated = transactionStorage.update(initial.id, {
      amount: 75000,
      note: 'Cà phê sáng',
    });

    expect(updated).not.toBeNull();
    expect(updated?.amount).toBe(75000);
    expect(updated?.note).toBe('Cà phê sáng');

    const all = transactionStorage.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].amount).toBe(75000);
  });

  it('should delete a transaction', () => {
    const first = transactionStorage.add({
      type: 'income' as const,
      amount: 220000,
      category: 'gift',
      note: 'Quà tặng',
      date: '2026-05-02T12:00:00.000Z',
    });

    const success = transactionStorage.delete(first.id);
    expect(success).toBe(true);
    expect(transactionStorage.getAll()).toHaveLength(0);
  });

  it('should return false when deleting a missing transaction', () => {
    expect(transactionStorage.delete('missing-id')).toBe(false);
  });
});
