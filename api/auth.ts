
import axios from 'axios';
import { API_URL } from '@/components/env';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // e.g. token, user info, etc.
  } catch (error) {
    throw error;
  }
};
