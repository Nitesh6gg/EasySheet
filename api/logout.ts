import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/components/env';

export const logout = async () => {
  try {
    await AsyncStorage.clear();
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error clearing AsyncStorage during logout:', error);
    throw error;
  }
};