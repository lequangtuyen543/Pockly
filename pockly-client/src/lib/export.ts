// src/lib/export.ts
import { format } from 'date-fns';
import type { Transaction, Category } from './storage';

/**
 * Generates a CSV string from transactions and categories.
 */
export const generateCSV = (transactions: Transaction[], categories: Category[]) => {
  const headers = [
    'Ngày',
    'Loại',
    'Số tiền',
    'Danh mục',
    'Ghi chú'
  ];

  const rows = transactions.map(t => {
    const category = categories.find(c => c.id === t.category);
    return [
      format(new Date(t.date), 'yyyy-MM-dd HH:mm:ss'),
      t.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
      t.amount.toString(),
      category ? `${category.icon} ${category.name}` : 'Danh mục không xác định',
      t.note || ''
    ];
  });

  const csvData = [headers, ...rows];

  return csvData.map(row =>
    row.map(field => {
      const fieldStr = String(field);
      // Escape fields containing commas, quotes, or newlines
      if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
        return `"${fieldStr.replace(/"/g, '""')}"`;
      }
      return fieldStr;
    }).join(',')
  ).join('\n');
};

/**
 * Triggers a download of the CSV content.
 * This function is intended to be used in a browser environment.
 */
export const downloadCSV = (content: string, filename: string) => {
  if (typeof document === 'undefined') return;

  // Create blob with UTF-8 BOM for proper Vietnamese encoding
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
