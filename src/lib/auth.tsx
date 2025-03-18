
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
  ownedAirdrops?: string[]; // IDs of airdrops owned by this user
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, code?: string) => Promise<void>;
  logout: () => void;
  register: (email: string, username: string, code: string) => Promise<void>;
  requestVerificationCode: (email: string, isLogin?: boolean) => Promise<void>;
  isAdmin: boolean;
  pendingVerificationEmail: string | null;
  setPendingVerificationEmail: (email: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin user
const adminUser: User = {
  id: '1',
  email: 'malickirfan00@gmail.com',
  username: 'UmarCryptospace',
  role: 'admin',
  ownedAirdrops: [],
};

// Valid invite/verification code for demo
const VALID_VERIFICATION_CODE = '123456';
// Special invitation code
const SPECIAL_INVITATION_CODE = 'ishowcryptoairdrops';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

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

  // Request a verification code (for both login and registration)
  const requestVerificationCode = async (email: string, isLogin = false) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would send an email with a verification code
      // For demo purposes, we'll just pretend an email was sent
      
      // Check if trying to login as admin
      if (isLogin && email === adminUser.email) {
        toast.success(`Verification code sent to ${email}. (Use "123456" for demo)`);
      } else {
        // For regular users
        toast.success(`Verification code sent to ${email}. (Use "123456" for demo)`);
        
        // Store the pending verification email
        setPendingVerificationEmail(email);
      }
    } catch (error) {
      console.error('Failed to send verification code', error);
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Register a new user
  const register = async (email: string, username: string, code: string) => {
    setIsLoading(true);
    
    try {
      // Validate verification code or special invitation code
      if (code !== VALID_VERIFICATION_CODE && code !== SPECIAL_INVITATION_CODE) {
        throw new Error('Invalid verification code');
      }
      
      // Check if user already exists
      const storedUsers = localStorage.getItem('registeredUsers');
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      const existingUser = users.find((u: User) => u.email === email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Check if special admin email
      const isAdminEmail = email === adminUser.email;
      
      // Create a new user
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        username,
        role: isAdminEmail ? 'admin' : 'user',
        ownedAirdrops: [],
      };
      
      // Add to registered users
      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      // Log the user in
      setUser(newUser);
      localStorage.setItem('cryptoUser', JSON.stringify(newUser));
      
      // Clear pending verification email
      setPendingVerificationEmail(null);
      
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration failed', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email verification code
  const login = async (email: string, code?: string) => {
    setIsLoading(true);
    
    try {
      // If no code provided, we're just requesting a code
      if (!code) {
        throw new Error('Verification code required');
      }
      
      // Validate verification code or special invitation code
      if (code !== VALID_VERIFICATION_CODE && code !== SPECIAL_INVITATION_CODE) {
        throw new Error('Invalid verification code');
      }
      
      // Check if admin login
      if (email === adminUser.email) {
        setUser(adminUser);
        localStorage.setItem('cryptoUser', JSON.stringify(adminUser));
        toast.success('Welcome back, admin!');
        return;
      }
      
      // Check if user exists in localStorage
      const storedUsers = localStorage.getItem('registeredUsers');
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      const existingUser = users.find((u: User) => u.email === email);
      
      if (existingUser) {
        setUser(existingUser);
        localStorage.setItem('cryptoUser', JSON.stringify(existingUser));
        toast.success('Login successful!');
      } else {
        throw new Error('User not found. Please register first.');
      }
      
      // Clear pending verification email
      setPendingVerificationEmail(null);
    } catch (error) {
      console.error('Login failed', error);
      toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
      throw error;
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
        register,
        requestVerificationCode,
        isAdmin,
        pendingVerificationEmail,
        setPendingVerificationEmail,
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
