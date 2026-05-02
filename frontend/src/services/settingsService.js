import api from './api';

export const getSettings = async () => {
  return await api.get('settings');
};

export const updateSettings = async (data) => {
  return await api.patch('settings', data);
};
