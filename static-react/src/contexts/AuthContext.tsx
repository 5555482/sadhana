import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthUser, LoginRequest, RegisterRequest, UpdateUserRequest, UpdatePasswordRequest } from '../types';
import { apiService } from '../services/api';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthUser }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: UpdateUserRequest) => Promise<void>;
  updatePassword: (passwordData: UpdatePasswordRequest) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext < AuthContextType | undefined > (undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
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

const initialState: AuthState = {
  user: null,
  isLoading: true, // Start with loading to check for existing auth
  isAuthenticated: false,
  error: null,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = apiService.getAuthToken();
      if (token) {
        try {
          const response = await apiService.auth.getCurrentUser();
          if (response.data) {
            dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
          } else {
            throw new Error('Invalid token');
          }
        } catch (error) {
          // Token is invalid, clear it
          apiService.clearAuthToken();
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await apiService.auth.login(credentials);
      if (response.data) {
        apiService.setAuthToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await apiService.auth.register(userData);
      if (response.data) {
        apiService.setAuthToken(response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    apiService.clearAuthToken();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const updateUser = async (userData: UpdateUserRequest) => {
    if (!state.user) throw new Error('Not authenticated');

    dispatch({ type: 'AUTH_START' });
    try {
      const response = await apiService.auth.updateUser(userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      } else {
        throw new Error(response.error || 'Update failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Update failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updatePassword = async (passwordData: UpdatePasswordRequest) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await apiService.auth.updatePassword(passwordData);
      if (response.error) {
        throw new Error(response.error);
      }
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Password update failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    updatePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};