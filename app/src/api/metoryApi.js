import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Thay thế bằng URL của Vercel/Cloud Run khi deploy
const API_URL = 'http://127.0.0.1:8000'; 

const instance = axios.create({
  baseURL: API_URL,
});

// Tự động đính kèm token vào mỗi request
instance.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;