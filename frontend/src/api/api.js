import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== EQUIPMENT API =====
export const equipmentAPI = {
  getAll: () => api.get('/equipment'),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.patch(`/equipment/${id}`, data),
  delete: (id) => api.delete(`/equipment/${id}`),
  scrap: (id) => api.patch(`/equipment/${id}`, { isScrapped: true }),
};

// ===== TEAMS API =====
export const teamsAPI = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.patch(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
};

// ===== TECHNICIANS API =====
export const techniciansAPI = {
  getAll: () => api.get('/technicians'),
  getById: (id) => api.get(`/technicians/${id}`),
  getByTeamId: (teamId) => api.get(`/technicians?teamId=${teamId}`),
  create: (data) => api.post('/technicians', data),
  update: (id, data) => api.patch(`/technicians/${id}`, data),
  delete: (id) => api.delete(`/technicians/${id}`),
};

// ===== MAINTENANCE REQUESTS API =====
export const maintenanceRequestsAPI = {
  getAll: () => api.get('/maintenanceRequests'),
  getById: (id) => api.get(`/maintenanceRequests/${id}`),
  getByEquipmentId: (equipmentId) => api.get(`/maintenanceRequests?equipmentId=${equipmentId}`),
  getByType: (type) => api.get(`/maintenanceRequests?type=${type}`),
  create: (data) => api.post('/maintenanceRequests', data),
  update: (id, data) => api.patch(`/maintenanceRequests/${id}`, data),
  updateStage: (id, stage) => api.patch(`/maintenanceRequests/${id}`, { stage }),
  delete: (id) => api.delete(`/maintenanceRequests/${id}`),
};

// ===== USERS API =====
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
};

export default api;
