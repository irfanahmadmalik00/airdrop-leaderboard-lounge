
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Mail, Lock, Key, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('ishowcryptoairdrops'); // Pre-fill with the valid code
  const [isLoading, setIsLoading] = useState(false);
  const [showCodeInfo, setShowCodeInfo] = useState(false);
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
      // Error handling is already in the login function
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    if (!inviteCode) {
      toast.error('Invite code is required to register');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password, inviteCode);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      // Error handling is already in the login function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-crypto-black p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl overflow-hidden p-8 animate-fadeIn shadow-[0_0_30px_rgba(0,255,128,0.1)]">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 p-3 bg-crypto-gray/60 rounded-full green-glow">
              <Layers className="h-12 w-12 text-crypto-green animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Welcome to <span className="text-white">iShow</span>
              <span className="text-crypto-green text-outline">Crypto</span>
            </h1>
            <p className="text-gray-400 mt-2 text-center">
              Sign in to access exclusive crypto airdrops and videos
            </p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:shadow-[0_0_10px_rgba(0,255,128,0.3)]">Login</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:shadow-[0_0_10px_rgba(0,255,128,0.3)]">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
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
                  className="w-full h-12 bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen transition-colors group"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-6">
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
                  
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Invite code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="pl-10 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-3 text-crypto-green hover:text-crypto-darkGreen"
                      onClick={() => setShowCodeInfo(!showCodeInfo)}
                    >
                      <AlertCircle className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {showCodeInfo && (
                    <Alert className="bg-crypto-gray/80 border-crypto-green/30">
                      <AlertDescription className="text-xs text-gray-300">
                        The invite code is <span className="text-crypto-green font-medium">ishowcryptoairdrops</span>. This is required to register for an account.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-crypto-lightGray/30 text-crypto-green focus:ring-crypto-green/20"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                    I agree to the <a href="#" className="text-crypto-green hover:text-crypto-darkGreen">Terms of Service</a>
                  </label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-12 bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen transition-colors group"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : (
                    <>
                      Register
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-400 text-center mt-2">
                  Need an invite code? Join our <a href="#" className="text-crypto-green hover:text-crypto-darkGreen">community</a>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
