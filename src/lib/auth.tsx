
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
  deviceId?: string; // Store device ID for security
  completedAirdrops?: string[];
  completedTestnets?: string[];
  pinnedAirdrops?: string[];
  pinnedTestnets?: string[];
  pinnedTools?: string[];
  level?: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string, inviteCode: string, mathAnswer: number) => Promise<void>;
  logout: () => void;
  register: (email: string, username: string, password: string, inviteCode: string, mathAnswer: number) => Promise<void>;
  isAdmin: boolean;
  generateMathQuestion: () => { question: string, answer: number };
  currentMathQuestion: { question: string, answer: number } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Special invitation code (only one code is valid)
const SPECIAL_INVITATION_CODE = 'ishowcryptoairdrops';

// Admin credentials
const ADMIN_EMAIL = 'malickirfan00@gmail.com';
const ADMIN_USERNAME = 'UmarCryptospace';
const ADMIN_PASSWORD = 'Irfan@123#13';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMathQuestion, setCurrentMathQuestion] = useState<{ question: string, answer: number } | null>(null);

  // Generate a device ID for security
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };

  // Generate a simple math question
  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let answer: number;
    let question: string;
    
    switch (operator) {
      case '+':
        question = `${num1} + ${num2} = ?`;
        answer = num1 + num2;
        break;
      case '-':
        // Ensure positive result
        if (num1 >= num2) {
          question = `${num1} - ${num2} = ?`;
          answer = num1 - num2;
        } else {
          question = `${num2} - ${num1} = ?`;
          answer = num2 - num1;
        }
        break;
      case '*':
        question = `${num1} × ${num2} = ?`;
        answer = num1 * num2;
        break;
      default:
        question = `${num1} + ${num2} = ?`;
        answer = num1 + num2;
    }
    
    const mathQuestion = { question, answer };
    setCurrentMathQuestion(mathQuestion);
    return mathQuestion;
  };

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cryptoUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('cryptoUser');
      }
    }
    setIsLoading(false);
    
    // Generate initial math question
    generateMathQuestion();
  }, []);

  // Register a new user
  const register = async (
    email: string, 
    username: string, 
    password: string, 
    inviteCode: string,
    mathAnswer: number
  ) => {
    setIsLoading(true);
    
    try {
      // Validate inputs
      if (!email || !username || !password) {
        throw new Error('All fields are required');
      }
      
      // Check math answer
      if (!currentMathQuestion || mathAnswer !== currentMathQuestion.answer) {
        throw new Error('Incorrect math answer. Please try again.');
      }
      
      // Validate invite code
      if (inviteCode !== SPECIAL_INVITATION_CODE) {
        throw new Error('Invalid invitation code');
      }
      
      // Check if user already exists
      const storedUsers = localStorage.getItem('registeredUsers');
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const existingUser = users.find(
        (u: User) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase()
      );
      
      if (existingUser) {
        if (existingUser.email.toLowerCase() === email.toLowerCase()) {
          throw new Error('User with this email already exists');
        } else {
          throw new Error('Username is already taken');
        }
      }
      
      // Check if admin email and username
      const isAdmin = (
        email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && 
        username === ADMIN_USERNAME && 
        password === ADMIN_PASSWORD
      );
      
      // Create a new user
      const deviceId = getDeviceId();
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        username,
        role: isAdmin ? 'admin' : 'user',
        deviceId,
        completedAirdrops: [],
        completedTestnets: [],
        pinnedAirdrops: [],
        pinnedTestnets: [],
        pinnedTools: [],
        level: 1,
        createdAt: new Date().toISOString(),
      };
      
      // Add to registered users
      users.push({...newUser, password}); // Store password for login
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      // Log the user in
      const userWithoutPassword = {...newUser}; // Don't store password in session
      setUser(userWithoutPassword);
      localStorage.setItem('cryptoUser', JSON.stringify(userWithoutPassword));
      
      // Generate new math question for next login
      generateMathQuestion();
      
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration failed', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with username/email and password
  const login = async (
    usernameOrEmail: string, 
    password: string, 
    inviteCode: string,
    mathAnswer: number
  ) => {
    setIsLoading(true);
    
    try {
      // Validate inputs
      if (!usernameOrEmail || !password) {
        throw new Error('All fields are required');
      }
      
      // Check math answer
      if (!currentMathQuestion || mathAnswer !== currentMathQuestion.answer) {
        throw new Error('Incorrect math answer. Please try again.');
      }
      
      // Validate invite code
      if (inviteCode !== SPECIAL_INVITATION_CODE) {
        throw new Error('Invalid invitation code');
      }
      
      // Check for admin login
      if (
        (usernameOrEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() || 
         usernameOrEmail === ADMIN_USERNAME) && 
        password === ADMIN_PASSWORD
      ) {
        const deviceId = getDeviceId();
        const adminUser: User = {
          id: 'admin-1',
          email: ADMIN_EMAIL,
          username: ADMIN_USERNAME,
          role: 'admin',
          deviceId,
          completedAirdrops: [],
          completedTestnets: [],
          pinnedAirdrops: [],
          pinnedTestnets: [],
          pinnedTools: [],
          level: 10,
          createdAt: new Date().toISOString(),
        };
        
        setUser(adminUser);
        localStorage.setItem('cryptoUser', JSON.stringify(adminUser));
        
        // Check registered users and add admin if not present
        const storedUsers = localStorage.getItem('registeredUsers');
        let users = storedUsers ? JSON.parse(storedUsers) : [];
        
        const adminExists = users.find(
          (u: any) => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
        );
        
        if (!adminExists) {
          users.push({...adminUser, password: ADMIN_PASSWORD});
          localStorage.setItem('registeredUsers', JSON.stringify(users));
        }
        
        toast.success('Welcome back, admin!');
        return;
      }
      
      // Check if user exists in localStorage
      const storedUsers = localStorage.getItem('registeredUsers');
      if (!storedUsers) {
        throw new Error('User not found. Please register first.');
      }
      
      const users = JSON.parse(storedUsers);
      const existingUser = users.find(
        (u: any) => 
          (u.email.toLowerCase() === usernameOrEmail.toLowerCase() || 
           u.username.toLowerCase() === usernameOrEmail.toLowerCase()) && 
          u.password === password
      );
      
      if (!existingUser) {
        throw new Error('Invalid credentials. Please try again.');
      }
      
      // Update user with current device ID but preserve other attributes
      const deviceId = getDeviceId();
      const userToSave = {...existingUser, deviceId};
      delete userToSave.password; // Don't store password in session
      
      // Update registeredUsers with new device ID
      const updatedUsers = users.map((u: any) => 
        u.id === existingUser.id ? {...u, deviceId} : u
      );
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      setUser(userToSave);
      localStorage.setItem('cryptoUser', JSON.stringify(userToSave));
      
      // Generate new math question for next login
      generateMathQuestion();
      
      toast.success('Login successful!');
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
    
    // Generate new math question for next login
    generateMathQuestion();
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
        isAdmin,
        generateMathQuestion,
        currentMathQuestion,
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
