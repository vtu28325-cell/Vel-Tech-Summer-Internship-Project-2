import api from './api';
import type { User, LoginFormData, RegisterFormData } from '../types';

// Register a new user
export const register = async (data: Omit<RegisterFormData, 'confirmPassword'>): Promise<User> => {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
};

// Login an existing user
export const login = async (data: LoginFormData): Promise<User> => {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
};
