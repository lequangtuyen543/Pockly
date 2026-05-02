import api from './api';

export const getUsers = async (params = {}) => {
  return await api.get('users', { params });
};

export const getUserInfo = async () => {
  return await api.get('users/info');
};

export const updateUserInfo = async (id, data) => {
  return await api.patch(`users/edit/${id}`, data);
};

export const changePassword = async (data) => {
  return await api.patch('users/change-password', data);
};

export const getUserDetail = async (id) => {
  return await api.get(`users/detail/${id}`);
};

export const deleteUser = async (id) => {
  return await api.delete(`users/delete/${id}`);
};

export const createUser = async (data) => {
  return await api.post('users/create', data);
};