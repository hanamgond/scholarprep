import React, { createContext, useContext, useState, useEffect } from 'react'; // 1. ADD 'useContext'
import { authService } from '../features/auth/services/auth';
import { jwtDecode } from 'jwt-decode';

// This interface should match the decoded token
interface User {
  id: string;
  email: string;
  tenantId: string;
  campusId?: string;
  role: string;
  permissions: string[];
}

// 2. ADDED: This interface belongs here
interface DecodedToken {
  email: string;
  userId: string;
  tenantId: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// ... (The 'handleAuthToken' helper function is correct) ...
const handleAuthToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('accessToken');
      return null;
    }
    
    localStorage.setItem('accessToken', token);
    
    const user: User = {
      id: decoded.userId,
      email: decoded.email,
      tenantId: decoded.tenantId,
      role: 'Admin', // TODO: Add role to your JWT claims
      permissions: [], // TODO: Add permissions to your JWT claims
    };
    return user;

  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('accessToken');
    return null;
  }
};


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  // ... (The 'checkAuthStatus', 'login', and 'logout' functions are all correct) ...
  
  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const user = handleAuthToken(token);
        setUser(user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { accessToken } = await authService.login(email, password); 
      const user = handleAuthToken(accessToken); 
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };


  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. FIX: Restore the 'useAuth' hook implementation
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext); // This uses 'useContext'
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // This returns the context
};