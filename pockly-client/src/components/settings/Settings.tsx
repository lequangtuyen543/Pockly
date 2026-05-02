// src/components/settings/Settings.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTransactionStore } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';
import { format } from 'date-fns';

export const Settings: React.FC = () => {
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
      // Filter transactions by date range
      const startDate = new Date(exportStartDate);
      const endDate = new Date(exportEndDate);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date

      const filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      // Generate CSV content
      const csvContent = generateCSV(filteredTransactions);

      // Download the file
      downloadCSV(csvContent, `pockly-export-${exportStartDate}-to-${exportEndDate}.csv`);

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

    // Combine headers and rows
    const csvData = [headers, ...rows];

    // Convert to CSV string
    return csvData.map(row =>
      row.map(field => {
        // Escape fields containing commas, quotes, or newlines
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      }).join(',')
    ).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    // Create blob with UTF-8 BOM for proper Vietnamese encoding
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Cài đặt</h2>
      </div>

      {/* Export Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <h3 className="text-lg font-semibold">Xuất dữ liệu</h3>
        <p className="text-gray-600 text-sm">
          Xuất dữ liệu giao dịch của bạn dưới dạng file CSV để sao lưu hoặc phân tích.
        </p>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => handleQuickExport('month')}
            >
              Xuất tháng này
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickExport('3months')}
            >
              Xuất 3 tháng
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickExport('year')}
            >
              Xuất năm nay
            </Button>
          </div>

          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger>
              <Button variant="default">
                Xuất tùy chỉnh
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xuất dữ liệu CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium mb-1">Từ ngày</label>
                    <Input
                      id="start-date"
                      type="date"
                      value={exportStartDate}
                      onChange={(e) => setExportStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium mb-1">Đến ngày</label>
                    <Input
                      id="end-date"
                      type="date"
                      value={exportEndDate}
                      onChange={(e) => setExportEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Sẽ xuất {transactions.filter(t => {
                    if (!exportStartDate || !exportEndDate) return false;
                    const transactionDate = new Date(t.date);
                    const start = new Date(exportStartDate);
                    const end = new Date(exportEndDate);
                    end.setHours(23, 59, 59, 999);
                    return transactionDate >= start && transactionDate <= end;
                  }).length} giao dịch
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsExportDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleExport}
                    disabled={!exportStartDate || !exportEndDate || isExporting}
                  >
                    {isExporting ? 'Đang xuất...' : 'Xuất CSV'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Other Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <h3 className="text-lg font-semibold">Khác</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dữ liệu ứng dụng</p>
              <p className="text-sm text-gray-600">
                {transactions.length} giao dịch • {categories.filter(c => !c.hidden).length} danh mục
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Pockly v2.1.888 - Quản lý tiền cá nhân đơn giản
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};