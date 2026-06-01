import axios from 'axios';

let baseURL = process.env.REACT_APP_API_URL || '/api';
if (baseURL !== '/api') {
  if (!baseURL.startsWith('http')) baseURL = 'https://' + baseURL;
  if (!baseURL.endsWith('/api')) baseURL = baseURL.replace(/\/$/, '') + '/api';
}
const API = axios.create({ baseURL });

API.interceptors.request.use(cfg => {
  const t = localStorage.getItem('cly_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cly_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register:  d => API.post('/auth/register', d),
  login:     d => API.post('/auth/login', d),
  me:        () => API.get('/auth/me'),
  changePass:d => API.put('/auth/update-password', d),
};

export const donorAPI = {
  getAll:   p => API.get('/donors', { params: p }),
  getMap:   () => API.get('/donors/map'),
  getMe:    () => API.get('/donors/me'),
  register: d => API.post('/donors', d),
  update:   d => API.put('/donors/me', d),
  getById:  id=> API.get(`/donors/${id}`),
};

export const bloodAPI = {
  getAll:    p  => API.get('/blood', { params: p }),
  getMap:    () => API.get('/blood/map'),
  stats:     () => API.get('/blood/stats'),
  create:    d  => API.post('/blood', d),
  fulfill:   id => API.put(`/blood/${id}/fulfill`),
  remove:    id => API.delete(`/blood/${id}`),
};

export const organAPI = {
  getAll:   p      => API.get('/organs', { params: p }),
  create:   d      => API.post('/organs', d),
  setStatus:(id, s)=> API.put(`/organs/${id}/status`, { status: s }),
};

export const hospitalAPI = {
  getAll: p  => API.get('/hospitals', { params: p }),
  getMap: () => API.get('/hospitals/map'),
};

export const userAPI = {
  getProfile: ()=> API.get('/users/profile'),
  update:     d => API.put('/users/profile', d),
};

export const seedAPI = { run: () => API.post('/seed') };

export default API;
