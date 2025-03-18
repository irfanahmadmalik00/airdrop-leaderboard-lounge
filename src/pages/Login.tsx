
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Mail, Key, ArrowRight, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const Login = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [codeSent, setCodeSent] = useState(false);
  const [isInviteCode, setIsInviteCode] = useState(false);
  
  const { 
    login, 
    register, 
    requestVerificationCode, 
    pendingVerificationEmail, 
    setPendingVerificationEmail 
  } = useAuth();
  const navigate = useNavigate();

  // If there's a pending verification email, use it
  useEffect(() => {
    if (pendingVerificationEmail) {
      setEmail(pendingVerificationEmail);
      setCodeSent(true);
    }
  }, [pendingVerificationEmail]);

  const handleSendVerificationCode = async (isLogin = true) => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      await requestVerificationCode(email, isLogin);
      setCodeSent(true);
    } catch (error) {
      console.error('Error sending verification code:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, verificationCode);
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
    
    if (!email || !username) {
      toast.error('Please enter both email and username');
      return;
    }
    
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(email, username, verificationCode);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      // Error handling is already in the register function
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the form when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCodeSent(false);
    setVerificationCode('');
    setPendingVerificationEmail(null);
    setIsInviteCode(false);
  };

  // Toggle between verification code and invitation code
  const toggleCodeType = () => {
    setIsInviteCode(!isInviteCode);
    setVerificationCode(isInviteCode ? '' : 'ishowcryptoairdrops');
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
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                      disabled={codeSent}
                    />
                  </div>
                  
                  {!codeSent ? (
                    <Button
                      type="button"
                      onClick={() => handleSendVerificationCode(true)}
                      className="w-full h-12 bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen transition-colors group"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : (
                        <>
                          Send Verification Code
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-gray-400">
                            {isInviteCode 
                              ? "Enter the special invitation code" 
                              : `Enter the 6-digit verification code sent to ${email}`}
                          </p>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={toggleCodeType}
                            className="text-crypto-green hover:text-crypto-darkGreen text-xs"
                          >
                            {isInviteCode ? "Use verification code" : "Use invitation code"}
                          </Button>
                        </div>
                        
                        {isInviteCode ? (
                          <Input
                            placeholder="Invitation code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                          />
                        ) : (
                          <InputOTP 
                            maxLength={6}
                            value={verificationCode} 
                            onChange={setVerificationCode}
                            render={({ slots }) => (
                              <InputOTPGroup className="gap-2 justify-center">
                                {slots.map((slot, index) => (
                                  <InputOTPSlot 
                                    key={index} 
                                    {...slot} 
                                    index={index}
                                    className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                                  />
                                ))}
                              </InputOTPGroup>
                            )}
                          />
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCodeSent(false);
                            setPendingVerificationEmail(null);
                          }}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          Change Email
                        </Button>
                        
                        {!isInviteCode && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendVerificationCode(true)}
                            className="text-crypto-green hover:text-crypto-darkGreen"
                          >
                            Resend Code
                          </Button>
                        )}
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full h-12 bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen transition-colors group"
                        disabled={isLoading || (!isInviteCode && verificationCode.length < 6) || (isInviteCode && !verificationCode)}
                      >
                        {isLoading ? 'Signing in...' : (
                          <>
                            Sign in
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
                
                <Alert className="bg-crypto-gray/80 border-crypto-green/30">
                  <AlertCircle className="h-4 w-4 text-crypto-green" />
                  <AlertDescription className="text-xs text-gray-300">
                    For demo: use verification code <span className="text-crypto-green font-medium">123456</span> or 
                    invitation code <span className="text-crypto-green font-medium">ishowcryptoairdrops</span>
                  </AlertDescription>
                </Alert>
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
                      disabled={codeSent}
                    />
                  </div>
                  
                  {!codeSent ? (
                    <>
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
                      
                      <Button
                        type="button"
                        onClick={() => handleSendVerificationCode(false)}
                        className="w-full h-12 bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen transition-colors group"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Sending...' : (
                          <>
                            Send Verification Code
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
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
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-gray-400">
                            {isInviteCode 
                              ? "Enter the special invitation code" 
                              : `Enter the 6-digit verification code sent to ${email}`}
                          </p>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={toggleCodeType}
                            className="text-crypto-green hover:text-crypto-darkGreen text-xs"
                          >
                            {isInviteCode ? "Use verification code" : "Use invitation code"}
                          </Button>
                        </div>
                        
                        {isInviteCode ? (
                          <Input
                            placeholder="Invitation code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20 h-12"
                          />
                        ) : (
                          <InputOTP 
                            maxLength={6}
                            value={verificationCode} 
                            onChange={setVerificationCode}
                            render={({ slots }) => (
                              <InputOTPGroup className="gap-2 justify-center">
                                {slots.map((slot, index) => (
                                  <InputOTPSlot 
                                    key={index} 
                                    {...slot} 
                                    index={index}
                                    className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                                  />
                                ))}
                              </InputOTPGroup>
                            )}
                          />
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCodeSent(false);
                            setPendingVerificationEmail(null);
                          }}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          Change Email
                        </Button>
                        
                        {!isInviteCode && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendVerificationCode(false)}
                            className="text-crypto-green hover:text-crypto-darkGreen"
                          >
                            Resend Code
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                {codeSent && (
                  <>
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
                      disabled={isLoading || (!isInviteCode && verificationCode.length < 6) || (isInviteCode && !verificationCode)}
                    >
                      {isLoading ? 'Registering...' : (
                        <>
                          Register
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </>
                )}
                
                <Alert className="bg-crypto-gray/80 border-crypto-green/30">
                  <AlertCircle className="h-4 w-4 text-crypto-green" />
                  <AlertDescription className="text-xs text-gray-300">
                    For demo: use verification code <span className="text-crypto-green font-medium">123456</span> or 
                    invitation code <span className="text-crypto-green font-medium">ishowcryptoairdrops</span>
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
