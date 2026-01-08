import axios, { AxiosInstance } from 'axios';

// Dashboard-specific interfaces
export interface DashboardStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  totalEarnings: number;
}

export interface UserActivity {
  lastLogin: string;
  gamesPlayed: number;
  favoriteGames: string[];
  accountAge: number; // days since registration
}

export interface WalletInfo {
  address: string;
  type: string;
  balance?: number;
  isConnected: boolean;
  lastUpdated: string;
}

// Configure axios defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:13578';

// Create axios instance for dashboard
const dashboardClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

class DashboardService {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Add auth token to requests
    dashboardClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('bullana_auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle responses
    dashboardClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Redirect to login on auth failure
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Get user dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await dashboardClient.get('/basic/user/dashboard-stats');
      return response.data;
    } catch (error: any) {
      // Return default stats if API fails
      return {
        totalGames: 0,
        totalWins: 0,
        totalLosses: 0,
        winRate: 0,
        totalEarnings: 0,
      };
    }
  }

  // Get user activity information
  async getUserActivity(): Promise<UserActivity> {
    try {
      const response = await dashboardClient.get('/basic/user/activity');
      return response.data;
    } catch (error: any) {
      // Return default activity if API fails
      return {
        lastLogin: new Date().toISOString(),
        gamesPlayed: 0,
        favoriteGames: [],
        accountAge: 0,
      };
    }
  }

  // Get wallet information from backend
  async getWalletInfo(): Promise<WalletInfo | null> {
    try {
      const response = await dashboardClient.get('/basic/user/wallet-info');
      return response.data;
    } catch (error: any) {
      console.warn('Failed to fetch wallet info from backend:', error.message);
      return null;
    }
  }

  // Update user's last activity
  async updateLastActivity(): Promise<void> {
    try {
      await dashboardClient.post('/basic/user/update-activity', {
        timestamp: new Date().toISOString(),
        action: 'dashboard_visit',
      });
    } catch (error: any) {
      console.warn('Failed to update last activity:', error.message);
    }
  }

  // Get user's recent game history
  async getRecentGames(limit: number = 5): Promise<any[]> {
    try {
      const response = await dashboardClient.get(`/basic/user/recent-games?limit=${limit}`);
      return response.data.games || [];
    } catch (error: any) {
      console.warn('Failed to fetch recent games:', error.message);
      return [];
    }
  }

  // Get user notifications
  async getNotifications(): Promise<any[]> {
    try {
      const response = await dashboardClient.get('/basic/user/notifications');
      return response.data.notifications || [];
    } catch (error: any) {
      console.warn('Failed to fetch notifications:', error.message);
      return [];
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      await dashboardClient.put(`/basic/user/notifications/${notificationId}/read`);
      return true;
    } catch (error: any) {
      console.warn('Failed to mark notification as read:', error.message);
      return false;
    }
  }

  // Get user preferences
  async getUserPreferences(): Promise<any> {
    try {
      const response = await dashboardClient.get('/basic/user/preferences');
      return response.data;
    } catch (error: any) {
      return {
        theme: 'dark',
        notifications: true,
        autoPlay: false,
        language: 'en',
      };
    }
  }

  // Update user preferences
  async updateUserPreferences(preferences: any): Promise<boolean> {
    try {
      await dashboardClient.put('/basic/user/preferences', preferences);
      return true;
    } catch (error: any) {
      console.warn('Failed to update user preferences:', error.message);
      return false;
    }
  }

  // Format wallet address for display
  formatWalletAddress(address: string): string {
    if (!address) return 'Not connected';
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  }

  // Calculate account age in days
  calculateAccountAge(registrationDate: string): number {
    const regDate = new Date(registrationDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - regDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Format currency amounts
  formatCurrency(amount: number, currency: string = 'SOL'): string {
    return `${amount.toFixed(4)} ${currency}`;
  }

  // Get welcome message based on time of day
  getWelcomeMessage(username: string): string {
    const hour = new Date().getHours();
    let greeting = 'Hello';
    
    if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 17) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }
    
    return `${greeting}, ${username}!`;
  }
}

// Create and export singleton instance
const dashboardService = new DashboardService();
export default dashboardService;
