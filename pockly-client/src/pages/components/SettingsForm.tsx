import React, { useState } from 'react';
import { format } from 'date-fns';
import { useTransactionStore } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';
import { exportStorage } from '@/lib/storage';
import { SectionCard } from '@/components/shared/SectionCard';

export const SettingsForm: React.FC = () => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const { transactions } = useTransactionStore();
  const { categories } = useCategoryStore();

  const handleExport = async () => {
    if (!exportStartDate || !exportEndDate) return;

    setIsExporting(true);

    try {
      const startDate = new Date(exportStartDate);
      const endDate = new Date(exportEndDate);
      endDate.setHours(23, 59, 59, 999);

      const filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      const csvContent = generateCSV(filteredTransactions);
      downloadCSV(csvContent, `pockly-export-${exportStartDate}-to-${exportEndDate}.csv`);
      exportStorage.setLastDate(new Date().toISOString());

      setIsExportDialogOpen(false);
      setExportStartDate('');
      setExportEndDate('');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Có lỗi xảy ra khi xuất dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSV = (transactions: any[]) => {
    const headers = ['Ngày', 'Loại', 'Số tiền', 'Danh mục', 'Ghi chú'];
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
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      }).join(',')
    ).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
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

  const handleQuickExport = (period: 'month' | '3months' | 'year') => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    setExportStartDate(format(startDate, 'yyyy-MM-dd'));
    setExportEndDate(format(now, 'yyyy-MM-dd'));
    setIsExportDialogOpen(true);
  };

  return (
    <>
      <SectionCard className="mt-6">
        <h3 className="font-title-sm text-title-sm" style={{ color: '#231916' }}>Export Data</h3>
        <p className="font-body-sm text-body-sm mb-4" style={{ color: '#5f5e5a' }}>
          Export your transaction data as a CSV file for backup or analysis.
        </p>

        <div className="space-y-4">
          {/* Quick Export Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleQuickExport('month')}
              className="flex-1 min-w-[80px] py-2 px-4 rounded-lg font-label-caps text-label-caps transition-colors hover:bg-stone-100"
              style={{
                backgroundColor: '#ffffff',
                color: '#1c1c19',
                border: '1px solid #e8e6dc'
              }}
            >
              Export This Month
            </button>
            <button
              onClick={() => handleQuickExport('3months')}
              className="flex-1 min-w-[80px] py-2 px-4 rounded-lg font-label-caps text-label-caps transition-colors hover:bg-stone-100"
              style={{
                backgroundColor: '#ffffff',
                color: '#1c1c19',
                border: '1px solid #e8e6dc'
              }}
            >
              Export 3 Months
            </button>
            <button
              onClick={() => handleQuickExport('year')}
              className="flex-1 min-w-[80px] py-2 px-4 rounded-lg font-label-caps text-label-caps transition-colors hover:bg-stone-100"
              style={{
                backgroundColor: '#ffffff',
                color: '#1c1c19',
                border: '1px solid #e8e6dc'
              }}
            >
              Export This Year
            </button>
          </div>

          {/* Custom Export Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsExportDialogOpen(true)}
              className="px-4 py-2 rounded-lg font-label-caps text-label-caps transition-colors hover:bg-stone-100"
              style={{
                backgroundColor: '#c96442',
                color: '#ffffff'
              }}
            >
              Custom Export
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Export Dialog */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${isExportDialogOpen ? 'block' : 'hidden'}`}
      >
        <div className="bg-[#faf9f5] rounded-xl p-lg w-full max-w-md" style={{ border: '1px solid #e8e6dc' }}>
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-title-sm text-title-sm" style={{ color: '#231916' }}>Export CSV Data</h2>
              <button
                onClick={() => setIsExportDialogOpen(false)}
                className="text-sm hover:text-[#c96442] transition-colors"
                style={{ color: '#5f5e5a' }}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body-sm text-body-sm" style={{ color: '#5f5e5a' }}>From Date</label>
                  <input
                    type="date"
                    value={exportStartDate}
                    onChange={(e) => setExportStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:border-[#c96442] focus:ring-0 bg-transparent"
                    style={{ borderColor: '#e8e6dc' }}
                  />
                </div>
                <div>
                  <label className="font-body-sm text-body-sm" style={{ color: '#5f5e5a' }}>To Date</label>
                  <input
                    type="date"
                    value={exportEndDate}
                    onChange={(e) => setExportEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:border-[#c96442] focus:ring-0 bg-transparent"
                    style={{ borderColor: '#e8e6dc' }}
                  />
                </div>
              </div>

              <div className="text-sm" style={{ color: '#5f5e5a' }}>
                Will export {
                  transactions.filter(t => {
                    if (!exportStartDate || !exportEndDate) return false;
                    const transactionDate = new Date(t.date);
                    const start = new Date(exportStartDate);
                    const end = new Date(exportEndDate);
                    end.setHours(23, 59, 59, 999);
                    return transactionDate >= start && transactionDate <= end;
                  }).length
                } transactions
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsExportDialogOpen(false)}
                  className="px-4 py-2 rounded-lg font-label-caps text-label-caps transition-colors hover:bg-stone-100"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#5f5e5a',
                    border: '1px solid #e8e6dc'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={!exportStartDate || !exportEndDate || isExporting}
                  className="px-4 py-2 rounded-lg font-label-caps text-label-caps transition-colors hover:bg-stone-100 disabled:opacity-50"
                  style={{
                    backgroundColor: '#c96442',
                    color: '#ffffff'
                  }}
                >
                  {isExporting ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};