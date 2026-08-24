import { api } from './api.js';

export const getLevels = async () => {
  const response = await api.get('/levels');
  return response.data.data;
};

export const getSubjects = async () => {
  const response = await api.get('/subjects');
  return response.data.data;
};

export const createLevel = async (data) => {
  const response = await api.post('/levels', data);
  return response.data.data;
};

export const updateLevel = async (id, data) => {
  const response = await api.put(`/levels/${id}`, data);
  return response.data.data;
};

export const deleteLevel = async (id) => {
  await api.delete(`/levels/${id}`);
};

export const createSubject = async (data) => {
  const response = await api.post('/subjects', data);
  return response.data.data;
};

export const updateSubject = async (id, data) => {
  const response = await api.put(`/subjects/${id}`, data);
  return response.data.data;
};

export const deleteSubject = async (id) => {
  await api.delete(`/subjects/${id}`);
};