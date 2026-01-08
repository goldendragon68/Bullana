import axios, { AxiosInstance } from 'axios';

// Export TypeScript interfaces
export interface User {
  id: string;
  username: string;
  email: string;
  status?: number;
  tfa_status?: number;
  kyc_status?: number;
  favourites?: string[];
  liked?: string[];
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  requiresTFA?: boolean;
  tempToken?: string;
  message?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  refer?: string;
  walletAddress?: string;
  walletType?: string;
}

// Configure axios defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:13578';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'bullana_auth_token';
const USER_KEY = 'bullana_user_data';

class AuthService {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    apiClient.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  setUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser() {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/basic/auth/login', {
        email,
        password,
      });

      const { success, token, user, requiresTFA } = response.data;

      if (success && !requiresTFA) {
        this.setToken(token);
        this.setUser(user);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async verify2FA(tempToken: string, tfaCode: string) {
    try {
      const response = await apiClient.post('/basic/auth/verify-2fa', {
        tempToken,
        tfaCode,
      });

      const { success, token, user } = response.data;

      if (success) {
        this.setToken(token);
        this.setUser(user);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '2FA verification failed');
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/basic/auth/profile');
      const { user } = response.data;
      
      if (user) {
        this.setUser(user);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  }

  async logout() {
    try {
      await apiClient.post('/basic/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.removeToken();
      localStorage.removeItem(USER_KEY);
    }
  }

  async validateToken() {
    try {
      const response = await apiClient.get('/basic/auth/validate');
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }

  async register(userData: RegisterData): Promise<any> {
    try {
      const response = await apiClient.post('/basic/signup', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async refreshUser() {
    try {
      const response = await this.getCurrentUser();
      return response.user;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to refresh user data');
    }
  }
}

const authService = new AuthService();
export default authService;
