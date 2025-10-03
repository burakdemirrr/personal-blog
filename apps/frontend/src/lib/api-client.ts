import axios, { AxiosInstance } from 'axios';

const baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const createApiClient = (getToken: () => string | null): AxiosInstance => {
  const instance: AxiosInstance = axios.create({ baseURL });
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
};


