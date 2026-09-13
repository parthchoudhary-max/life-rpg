import api from './api';

export const getCharacterStats = async () => {
  const response = await api.get('/character/stats');
  return response.data;
};

export const consumePotion = async (itemId) => {
  const response = await api.post(`/character/consume/${itemId}`);
  return response.data;
};
