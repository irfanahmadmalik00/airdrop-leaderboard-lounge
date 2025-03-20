
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);
  
  // Return loading state or content
  return (
    <div className="min-h-screen bg-crypto-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to <span className="text-white">iShow</span>
          <span className="text-crypto-green">Crypto</span>
        </h1>
        <p className="text-gray-400 mb-8">
          Your gateway to the best crypto airdrops and testnets
        </p>
      </div>
    </div>
  );
};

export default Index;
