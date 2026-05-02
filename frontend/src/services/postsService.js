import api from './api';

export const getPosts = async (params = {}) => {
  return await api.get('posts', { params });
};

export const getPostDetail = async (id) => {
  return await api.get(`posts/detail/${id}`);
};

export const createPost = async (data) => {
  return await api.post('posts/create', data);
};

export const updatePost = async (id, data) => {
  return await api.patch(`posts/edit/${id}`, data);
};

export const deletePost = async (id) => {
  return await api.delete(`posts/delete/${id}`);
};
