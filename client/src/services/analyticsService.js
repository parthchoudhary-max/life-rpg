import api from './api';

export const getActivityLogs = async (params = {}) => {
  const response = await api.get('/analytics/logs', { params });
  return response.data;
};

export const getSummaryStats = async () => {
  const response = await api.get('/analytics/summary');
  return response.data;
};
