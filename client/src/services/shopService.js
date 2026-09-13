import api from './api';

export const getShopItems = async (category) => {
  const response = await api.get('/shop', { params: { category } });
  return response.data;
};

export const purchaseItem = async (itemId) => {
  const response = await api.post(`/shop/purchase/${itemId}`);
  return response.data;
};

export const equipItem = async (itemId) => {
  const response = await api.post(`/shop/equip/${itemId}`);
  return response.data;
};

export const createCustomReward = async (rewardData) => {
  const response = await api.post('/shop/custom-reward', rewardData);
  return response.data;
};

export const deleteCustomReward = async (id) => {
  const response = await api.delete(`/shop/custom-reward/${id}`);
  return response.data;
};
