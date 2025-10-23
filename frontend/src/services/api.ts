import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface House {
  id: number;
  property_title: string;
  image: string;
  monthly_rent: number;
  address: string;
  property_type: string;
  rooms: number;
  bathrooms: number;
  square_feet: number;
  description: string;
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

  create: async (house: Omit<House, 'id' | 'created_at'>): Promise<House> => {
    const response = await api.post('/houses', house);
    return response.data;
  },

  update: async (id: number, house: Partial<House>): Promise<House> => {
    const response = await api.put(`/houses/${id}`, house);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/houses/${id}`);
  },
};

export default api;