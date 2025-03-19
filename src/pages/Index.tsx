
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is logged in, redirect to dashboard
  if (user) {
    navigate("/dashboard");
    return null;
  }
  
  return (
    <div className="min-h-screen bg-crypto-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center animate-fadeIn">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="text-white">Discover and Track </span>
              <span className="text-crypto-green gradient-text">Crypto Airdrops</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Find the most valuable airdrops, track your progress, and never miss a crypto opportunity with iShowCrypto
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                className="bg-crypto-green hover:bg-crypto-darkGreen text-crypto-black px-8 py-6 text-lg rounded-xl group transition-all"
                asChild
              >
                <Link to="/airdrops">
                  Explore Airdrops
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-crypto-green text-crypto-green hover:bg-crypto-green/10 px-8 py-6 text-lg rounded-xl"
                asChild
              >
                <Link to="/login">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 border-t border-crypto-lightGray/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose iShowCrypto?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A complete platform to discover, track, and manage your crypto airdrops and testnet participation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl">
              <div className="bg-crypto-green/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-crypto-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Discover Opportunities</h3>
              <p className="text-gray-400">
                Find the latest airdrops and testnets with our regularly updated database
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="bg-crypto-green/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-crypto-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-gray-400">
                Manage all your airdrop applications and testnet participation in one place
              </p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="bg-crypto-green/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-crypto-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Never Miss Out</h3>
              <p className="text-gray-400">
                Stay updated with the latest airdrops and increase your chances of qualifying
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-card rounded-2xl p-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Earning Crypto?</h2>
            <p className="text-gray-300 mb-8">
              Join thousands of crypto enthusiasts who use iShowCrypto to find and track valuable airdrops and testnets
            </p>
            <Button 
              className="bg-crypto-green hover:bg-crypto-darkGreen text-crypto-black px-8 py-6 text-lg rounded-xl"
              asChild
            >
              <Link to="/register">
                Create Your Account
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-crypto-lightGray/20">
        <div className="container mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2023 iShowCrypto. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
