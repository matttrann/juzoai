import api, { setAuthToken, clearAuthToken, getAuthToken } from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  provider?: 'github' | 'google' | 'email';
}

interface AuthResponse {
  token: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// Environment variables - these should be in .env file and loaded by your environment
// The environment variables would be in the form of:
// REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
// REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
// REACT_APP_AUTH_REDIRECT_URI=http://localhost:3000/auth/callback
const AUTH_CONFIG = {
  github: {
    clientId: process.env.REACT_APP_GITHUB_CLIENT_ID || 'your_github_client_id',
    redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URI || 'http://localhost:3000/auth/callback',
    scope: 'user:email'
  },
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your_google_client_id',
    redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URI || 'http://localhost:3000/auth/callback',
    scope: 'email profile'
  }
};

// Using localStorage to persist user session - in production you would use 
// HTTP-only secure cookies for better security
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const authService = {
  // Check if user is currently logged in
  isAuthenticated: (): boolean => {
    return getAuthToken() !== null;
  },
  
  // Get currently logged in user
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as User;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  // Save auth data
  saveAuthData: (token: string, user: User): void => {
    // Ensure user always has a name (use username as fallback)
    if (!user.name) {
      user.name = user.username;
    }
    setAuthToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  
  // Clear auth data on logout
  clearAuthData: (): void => {
    clearAuthToken();
    localStorage.removeItem(USER_KEY);
  },
  
  // Email/Password Login
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { token, user } = response.data;
      authService.saveAuthData(token, user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Email/Password Registration
  register: async (credentials: RegisterCredentials): Promise<User> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      const { token, user } = response.data;
      authService.saveAuthData(token, user);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Logout
  logout: async (): Promise<void> => {
    try {
      // In a real app, you might want to invalidate the token on the server
      // await api.post('/auth/logout');
      authService.clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if the API call fails
      authService.clearAuthData();
    }
  }
};

export default authService; 