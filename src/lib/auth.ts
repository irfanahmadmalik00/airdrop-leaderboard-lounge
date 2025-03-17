
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'sonner';

// Define user types
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin user
const adminUser: User = {
  id: '1',
  email: 'malickirfan00@gmail.com',
  username: 'UmarCryptospace',
  role: 'admin',
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cryptoUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('cryptoUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simple mock authentication
      if (email === adminUser.email && password === 'Irfan@123#13') {
        setUser(adminUser);
        localStorage.setItem('cryptoUser', JSON.stringify(adminUser));
        toast.success('Welcome back, admin!');
      } else {
        // Create a regular user
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          email,
          username: email.split('@')[0],
          role: 'user',
        };
        setUser(newUser);
        localStorage.setItem('cryptoUser', JSON.stringify(newUser));
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cryptoUser');
    toast.info('You have been logged out');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
