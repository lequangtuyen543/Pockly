// src/components/category/CategoryManager.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCategoryStore } from '@/store/categoryStore';
import { useTransactionStore } from '@/store/transactionStore';
import { EmojiPicker } from './EmojiPicker';
import type { Category } from '@/lib/storage';

export const CategoryManager: React.FC = () => {
  const {
    categories,
    isLoading,
    error,
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleHidden,
    canDeleteCategory
  } = useCategoryStore();

  const { transactions } = useTransactionStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    color: '#6b7280'
  });

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '📦',
      color: '#6b7280'
    });
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) return;

    const result = await addCategory({
      name: formData.name.trim(),
      icon: formData.icon,
      color: formData.color,
    });

    if (result) {
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
  };

  const handleUpdate = async () => {
    if (!editingCategory || !formData.name.trim()) return;

    const result = await updateCategory(editingCategory.id, {
      name: formData.name.trim(),
      icon: formData.icon,
      color: formData.color,
    });

    if (result) {
      setEditingCategory(null);
      resetForm();
    }
  };

  const handleDelete = async (category: Category) => {
    const canDelete = canDeleteCategory(category.id);
    await deleteCategory(category.id);

    if (!canDelete) {
      // Category was hidden instead of deleted
      console.log(`Category "${category.name}" has been hidden because it contains transactions`);
    }
  };

  const handleToggleHidden = async (categoryId: string) => {
    await toggleHidden(categoryId);
  };

  const visibleCategories = categories.filter(c => !c.hidden);
  const hiddenCategories = categories.filter(c => c.hidden);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger>
            <Button>Thêm danh mục</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm danh mục mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Biểu tượng:</label>
                <EmojiPicker
                  value={formData.icon}
                  onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tên danh mục:</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Màu sắc:</label>
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAdd} disabled={!formData.name.trim()}>
                  Thêm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Visible Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Danh mục đang sử dụng ({visibleCategories.length})</h3>
        <div className="grid gap-3">
          {visibleCategories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-gray-500">
                    {transactions.filter(t => t.category === category.id).length} giao dịch
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                >
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleHidden(category.id)}
                >
                  Ẩn
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setCategoryToDelete(category);
                    setDeleteDialogOpen(true);
                  }}
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden Categories */}
      {hiddenCategories.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Danh mục đã ẩn ({hiddenCategories.length})</h3>
          <div className="grid gap-3">
            {hiddenCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500">
                      {transactions.filter(t => t.category === category.id).length} giao dịch
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleHidden(category.id)}
                  >
                    Hiện
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setCategoryToDelete(category);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Xóa vĩnh viễn
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa danh mục</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Biểu tượng:</label>
              <EmojiPicker
                value={formData.icon}
                onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tên danh mục:</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên danh mục"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Màu sắc:</label>
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Hủy
              </Button>
              <Button onClick={handleUpdate} disabled={!formData.name.trim()}>
                Lưu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          {categoryToDelete && (
            <div className="space-y-4">
              <p>
                {canDeleteCategory(categoryToDelete.id)
                  ? `Bạn có chắc muốn xóa danh mục "${categoryToDelete.name}"?`
                  : `Danh mục "${categoryToDelete.name}" có giao dịch. Bạn có muốn ẩn nó thay vì xóa?`
                }
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(categoryToDelete);
                    setDeleteDialogOpen(false);
                    setCategoryToDelete(null);
                  }}
                >
                  {canDeleteCategory(categoryToDelete.id) ? 'Xóa' : 'Ẩn'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};