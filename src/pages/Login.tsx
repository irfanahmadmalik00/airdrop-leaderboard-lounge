
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-crypto-black p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl overflow-hidden p-8 animate-fadeIn">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 p-3 bg-crypto-gray/60 rounded-full">
              <Layers className="h-12 w-12 text-crypto-green" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Welcome to <span className="text-white">iShow</span>
              <span className="text-crypto-green">Crypto</span>
            </h1>
            <p className="text-gray-400 mt-2 text-center">
              Sign in to access exclusive crypto airdrops and videos
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-crypto-lightGray/30 text-crypto-green focus:ring-crypto-green/20"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="text-crypto-green hover:text-crypto-darkGreen transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-400">Don't have an account? </span>
              <a href="#" className="text-crypto-green hover:text-crypto-darkGreen transition-colors">
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
