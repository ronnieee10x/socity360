import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default to local machine or configurable backend host
export const BASE_API_URL = 'http://10.0.2.2:8080/api'; // Android Emulator alias for localhost, or http://localhost:8080/api for iOS

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  const societyId = await AsyncStorage.getItem('society_id');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (societyId) {
    config.headers['X-Society-ID'] = societyId;
  }
  return config;
});

export default api;
