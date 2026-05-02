import api from './api';

export const getCategories = async (params = {}) => {
  return await api.get('categories', { params });
};

export const createCategory = async (data) => {
  return await api.post('categories', data);
};

export const updateCategory = async (id, data) => {
  return await api.patch(`categories/${id}`, data);
};

export const deleteCategory = async (id) => {
  return await api.delete(`categories/${id}`);
};
