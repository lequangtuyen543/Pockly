// src/components/category/EmojiPicker.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  trigger?: React.ReactNode;
}

const COMMON_EMOJIS = [
  // Food & Dining
  '🍽️', '🍕', '🍔', '🍟', '🌭', '🍿', '🥤', '☕', '🍵', '🥤',
  // Transportation
  '🚗', '🚕', '🚙', '🚌', '🚇', '🚆', '✈️', '🚀', '🚲', '🛵',
  // Shopping
  '🛍️', '🛒', '💳', '🛍️', '👕', '👗', '👠', '💄', '💍', '⌚',
  // Entertainment
  '🎬', '🎵', '🎶', '🎤', '🎧', '🎸', '🎹', '🎪', '🎭', '🎨',
  // Bills & Utilities
  '💡', '⚡', '🔌', '📱', '📞', '💻', '🖥️', '🖨️', '📺', '🛀',
  // Income
  '💰', '💵', '💸', '💳', '🏦', '💼', '💻', '📈', '📊', '💎',
  // Other
  '📦', '🎁', '🏠', '🏢', '🏥', '🏫', '⛽', '🏥', '💊', '🏃',
  // Nature & Activities
  '🌳', '🌞', '🌙', '⭐', '🌈', '🎈', '🎊', '🎉', '🎂', '🍰',
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  value,
  onChange,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (emoji: string) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {trigger || (
          <Button variant="outline" size="sm" className="w-12 h-12 p-0">
            {value || '😊'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chọn biểu tượng</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-8 gap-2 p-4">
          {COMMON_EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              variant={value === emoji ? "default" : "outline"}
              size="sm"
              className="w-10 h-10 p-0 text-lg"
              onClick={() => handleSelect(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};