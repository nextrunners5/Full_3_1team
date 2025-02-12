import axiosInstance from '../../../shared/axios/axios';

interface SignupData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/api/auth/login', { email, password });
  return response.data;
};

export const signup = async (userData: SignupData) => {
  const response = await axiosInstance.post('/api/auth/signup', userData);
  return response.data;
};

export const checkEmail = async (email: string) => {
  const response = await axiosInstance.post('/api/auth/check-email', { email });
  return response.data;
};

export const findId = async (name: string, phone: string) => {
  const response = await axiosInstance.post('/api/auth/find-id', { name, phone });
  return response.data;
};

export const findPassword = async (email: string, phone: string) => {
  const response = await axiosInstance.post('/api/auth/find-password', { email, phone });
  return response.data;
};
