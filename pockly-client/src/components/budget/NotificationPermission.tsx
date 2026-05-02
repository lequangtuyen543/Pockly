// src/components/budget/NotificationPermission.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const NotificationPermission: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    try {
      if ('Notification' in window) {
        const result = await Notification.requestPermission();
        setPermission(result);

        if (result === 'granted') {
          // Show a test notification
          new Notification('Pockly - Cảnh báo ngân sách', {
            body: 'Thông báo đã được bật! Bạn sẽ nhận được cảnh báo khi vượt quá ngân sách.',
            icon: '/favicon.ico',
          });
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
    setShowDialog(false);
  };

  const handleEnableNotifications = () => {
    if (permission === 'default') {
      setShowDialog(true);
    } else if (permission === 'denied') {
      // Show instructions for manually enabling
      alert('Thông báo đã bị từ chối. Vui lòng bật thông báo trong cài đặt trình duyệt của bạn.');
    }
  };

  // Don't show if notifications are not supported or already granted
  if (!('Notification' in window) || permission === 'granted') {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleEnableNotifications}
        className="text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        🔔 Bật thông báo
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bật thông báo ngân sách</DialogTitle>
            <DialogDescription>
              Cho phép Pockly gửi thông báo khi bạn sắp vượt quá hoặc đã vượt quá ngân sách đã đặt.
              Điều này giúp bạn kiểm soát chi tiêu tốt hơn.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-medium text-blue-900">Cảnh báo kịp thời</p>
                <p className="text-sm text-blue-700">
                  Nhận thông báo ngay khi chi tiêu vượt ngưỡng 80% và 100% ngân sách.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Để sau
            </Button>
            <Button onClick={requestPermission}>
              Bật thông báo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};