import axios from 'axios';
import { LoginCredentials, RegisterCredentials, User } from './types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const register = async (credentials: RegisterCredentials): Promise<void> => {
  await axios.post(`${apiBaseUrl}/api/v1/accounts/register/`, credentials);
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await axios.post(`${apiBaseUrl}/api/v1/accounts/login/`, credentials);
  localStorage.setItem('token', response.data.token);
  return response.data.user;
};

export const logout = async (): Promise<void> => {
  await axios.post(`${apiBaseUrl}/api/v1/accounts/logout/`);
};