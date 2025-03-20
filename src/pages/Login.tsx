
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Mail, Key, ArrowRight, AlertCircle, User, Calculator, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  // Auth hooks
  const { login, register, generateMathQuestion, currentMathQuestion } = useAuth();
  const navigate = useNavigate();
  
  // Form states
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('ishowcryptoairdrops');
  const [mathAnswer, setMathAnswer] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState('');
  
  // Init math question
  useEffect(() => {
    if (!currentMathQuestion) {
      generateMathQuestion();
    }
  }, [currentMathQuestion, generateMathQuestion]);
  
  // Reset the form when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setEmail('');
    setUsername('');
    setPassword('');
    setInviteCode('ishowcryptoairdrops');
    setMathAnswer('');
    setError('');
    generateMathQuestion();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password || !inviteCode || mathAnswer === '') {
      setError('All fields are required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(username, password, inviteCode, Number(mathAnswer));
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !username || !password || !inviteCode || mathAnswer === '') {
      setError('All fields are required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(email, username, password, inviteCode, Number(mathAnswer));
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Registration failed. Please try again.');
      }
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
              Sign in to access exclusive crypto airdrops and submit your own
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/40 border-red-500/50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:shadow-[0_0_10px_rgba(0,255,128,0.3)]">Login</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:shadow-[0_0_10px_rgba(0,255,128,0.3)]">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Username or Email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                    />
                  </div>
                  
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                    />
                  </div>
                  
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Invitation Code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="pl-10 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                    />
                  </div>
                  
                  <div className="relative">
                    <Calculator className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <div className="flex items-center gap-2">
                      <span className="bg-crypto-gray border border-crypto-lightGray/30 rounded-md px-4 py-2 min-w-24 text-center">
                        {currentMathQuestion?.question || 'Loading...'}
                      </span>
                      <Input
                        type="number"
                        placeholder="Answer"
                        value={mathAnswer}
                        onChange={(e) => setMathAnswer(e.target.value === '' ? '' : Number(e.target.value))}
                        className="pl-3 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                      />
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
                </div>
                
                <Alert className="bg-crypto-gray/80 border-crypto-green/30">
                  <AlertCircle className="h-4 w-4 text-crypto-green" />
                  <AlertDescription className="text-xs text-gray-300">
                    Admin login: Username <span className="text-crypto-green font-medium">UmarCryptospace</span>, 
                    Password <span className="text-crypto-green font-medium">(hidden)</span>, 
                    Invite Code <span className="text-crypto-green font-medium">ishowcryptoairdrops</span>
                  </AlertDescription>
                </Alert>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-3">
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
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                    />
                  </div>
                  
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                    />
                  </div>
                  
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Invitation Code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="pl-10 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                    />
                  </div>
                  
                  <div className="relative">
                    <Calculator className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <div className="flex items-center gap-2">
                      <span className="bg-crypto-gray border border-crypto-lightGray/30 rounded-md px-4 py-2 min-w-24 text-center">
                        {currentMathQuestion?.question || 'Loading...'}
                      </span>
                      <Input
                        type="number"
                        placeholder="Answer"
                        value={mathAnswer}
                        onChange={(e) => setMathAnswer(e.target.value === '' ? '' : Number(e.target.value))}
                        className="pl-3 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                      />
                    </div>
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
                </div>
                
                <Alert className="bg-crypto-gray/80 border-crypto-green/30">
                  <AlertCircle className="h-4 w-4 text-crypto-green" />
                  <AlertDescription className="text-xs text-gray-300">
                    To register, you need an invitation code. Default: <span className="text-crypto-green font-medium">ishowcryptoairdrops</span>
                  </AlertDescription>
                </Alert>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
