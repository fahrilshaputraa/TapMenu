import api from './api';
import type { LoginResponse, User, StaffProfile } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterStaffData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  restaurant_name: string;
}

export interface RegisterCustomerData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login/', credentials);
    return response.data;
  },

  async registerStaff(data: RegisterStaffData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register_staff/', data);
    return response.data;
  },

  async registerCustomer(data: RegisterCustomerData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register_customer/', data);
    return response.data;
  },

  async getMe(): Promise<User & { staff_profiles?: StaffProfile[] }> {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change_password/', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  async logout(refreshToken?: string): Promise<void> {
    await api.post('/auth/logout/', { refresh: refreshToken });
  },
};
