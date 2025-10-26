import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  email: string;
  phone_number?: string;
  user_type: 'lister' | 'renter';
}

export interface House {
  id: number;
  user_id: number;
  property_title: string;
  images: string[];
  monthly_rent: number;
  address: string;
  property_type: string;
  rooms: number;
  bathrooms: number;
  square_feet: number;
  description: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
}

export const houseApi = {
  getAll: async (): Promise<House[]> => {
    const response = await api.get('/houses');
    return response.data;
  },

  getOne: async (id: number): Promise<House> => {
    const response = await api.get(`/houses/${id}`);
    return response.data;
  },

  getUserListings: async (): Promise<House[]> => {
    const response = await api.get('/houses/user/my-listings');
    return response.data;
  },

  create: async (house: Omit<House, 'id' | 'user_id' | 'created_at'>): Promise<House> => {
    const response = await api.post('/houses', house);
    return response.data;
  },

  update: async (id: number, house: Partial<Omit<House, 'id' | 'user_id' | 'created_at'>>): Promise<House> => {
    const response = await api.put(`/houses/${id}`, house);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/houses/${id}`);
  },
};

export const favoritesApi = {
  getAll: async (): Promise<House[]> => {
    const response = await api.get('/favorites');
    return response.data;
  },

  add: async (houseId: number): Promise<void> => {
    await api.post('/favorites', { houseId });
  },

  remove: async (houseId: number): Promise<void> => {
    await api.delete(`/favorites/${houseId}`);
  },

  check: async (houseId: number): Promise<boolean> => {
    const response = await api.get(`/favorites/check/${houseId}`);
    return response.data.isFavorite;
  },
};

export const authApi = {
  register: async (email: string, password: string, phone_number: string, user_type: 'lister' | 'renter', rememberMe = false) => {
    // Register then auto-login to get token
    await api.post('/auth/register', { email, password, phone_number, user_type });
    return authApi.login(email, password, rememberMe);
  },

  login: async (email: string, password: string, rememberMe = false) => {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem('authToken', token);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore errors on logout
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  getUser: (): User | null => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  },
};

export default api;