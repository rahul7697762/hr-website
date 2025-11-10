import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Generic API request function
export const apiRequest = async <T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.request({
      method,
      url: endpoint,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message || 'API request failed');
  }
};

// Convenience methods
export const get = <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> =>
  apiRequest<T>('GET', endpoint, undefined, config);

export const post = <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
  apiRequest<T>('POST', endpoint, data, config);

export const put = <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
  apiRequest<T>('PUT', endpoint, data, config);

export const del = <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> =>
  apiRequest<T>('DELETE', endpoint, undefined, config);

export default api;