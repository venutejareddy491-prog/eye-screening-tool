import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const screeningAPI = {
  submit: (data) => api.post('/screening/submit', data),
  results: () => api.get('/screening/results'),
  getById: (id) => api.get(`/screening/${id}`),
  emailReport: (id) => api.post(`/screening/${id}/email`),
};

export const appointmentAPI = {
  book: (data) => api.post('/appointment/book', data),
  mine: () => api.get('/appointment/mine'),
};

export const adminAPI = {
  users: (params) => api.get('/admin/users', { params }),
  reports: (params) => api.get('/admin/reports', { params }),
  updateAppointment: (id, status) => api.patch(`/admin/appointments/${id}`, { status }),
};

export default api;
