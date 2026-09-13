import api from './api';

export const getTasks = async (params = {}) => {
  const response = await api.get('/tasks', { params });
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const completeTask = async (id) => {
  const response = await api.post(`/tasks/${id}/complete`);
  return response.data;
};

export const triggerHabit = async (id, action) => {
  const response = await api.post(`/tasks/${id}/habit`, { action });
  return response.data;
};
