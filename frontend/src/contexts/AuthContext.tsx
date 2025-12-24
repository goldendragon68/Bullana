import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

// Authentication state interface
interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
}

// Authentication actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: any }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Context interface
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<any>;
  verify2FA: (tempToken: string, tfaCode: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<any>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication on app start
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'AUTH_START' });
      
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getUser();
          if (userData) {
            // Validate token and refresh user data
            const isValid = await authService.validateToken();
            if (isValid) {
              dispatch({ type: 'AUTH_SUCCESS', payload: userData });
            } else {
              await authService.logout();
              dispatch({ type: 'AUTH_LOGOUT' });
            }
          } else {
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await authService.logout();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const result = await authService.login(email, password);
      
      if (result.success && !result.requiresTFA) {
        dispatch({ type: 'AUTH_SUCCESS', payload: result.user });
      }
      
      return result;
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  // 2FA verification function
  const verify2FA = async (tempToken: string, tfaCode: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const result = await authService.verify2FA(tempToken, tfaCode);
      
      if (result.success) {
        dispatch({ type: 'AUTH_SUCCESS', payload: result.user });
      }
      
      return result;
    } catch (error: any) {
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Register function (enhanced)
  const register = async (userData: any) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      console.log('🔄 AuthContext: Starting registration process...');
      const result = await authService.register(userData);
      console.log('🔄 AuthContext: Registration result:', result);
      
      // Don't dispatch AUTH_SUCCESS here for registration
      // Just return the result to the component
      return result;
    } catch (error: any) {
      console.error('🔄 AuthContext: Registration error:', error);
      dispatch({ type: 'AUTH_ERROR', payload: error.message });
      throw error;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const userData = await authService.refreshUser();
      if (userData) {
        dispatch({ type: 'AUTH_SUCCESS', payload: userData });
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    state,
    login,
    verify2FA,
    logout,
    register,
    refreshUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
