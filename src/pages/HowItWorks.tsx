
import { Layers, BookOpen, FileText, Wallet, Gift, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-crypto-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 md:pt-32 md:pb-16">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-fadeIn">
            <div className="p-3 bg-crypto-gray/60 rounded-full mb-4">
              <BookOpen className="h-12 w-12 text-crypto-green" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-white">How </span>
              <span className="text-crypto-green">It Works</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Learn how to use iShowCrypto to find, track, and participate in cryptocurrency airdrops
            </p>
          </div>
        </div>
      </section>
      
      {/* What are Airdrops */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="glass-panel rounded-2xl p-8 md:p-12 mb-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-full md:w-2/3">
                <h2 className="text-3xl font-bold mb-6">What Are Crypto Airdrops?</h2>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Cryptocurrency airdrops are free distributions of tokens or coins to wallet addresses, usually as part of marketing campaigns, community building, or to increase adoption of a new blockchain project.
                </p>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Projects distribute tokens to users who complete certain tasks, such as signing up for a newsletter, following social media accounts, or using their protocol. These tokens often have real value and can be traded or sold.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Airdrops have become a popular way for crypto enthusiasts to discover new projects and earn rewards without investing their own capital.
                </p>
              </div>
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="p-4 bg-crypto-gray/60 rounded-full green-glow">
                  <Gift className="h-32 w-32 text-crypto-green" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Step by Step */}
          <h2 className="text-2xl font-bold mb-8 text-center">How to Use iShowCrypto</h2>
          
          <div className="space-y-8 mb-12">
            <div className="glass-panel rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-crypto-green/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-crypto-green">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Create an Account</h3>
                  <p className="text-gray-300 mb-4">
                    Sign up for a free account on iShowCrypto. You'll need to verify your email address with a verification code that will be sent to you. 
                  </p>
                  <div className="bg-crypto-lightGray/20 rounded-lg p-4 text-sm">
                    <p className="text-gray-300">
                      <span className="text-crypto-green font-semibold">Pro Tip:</span> Use a dedicated email address for crypto-related activities to stay organized and enhance security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-crypto-green/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-crypto-green">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Browse Available Airdrops</h3>
                  <p className="text-gray-300 mb-4">
                    Explore our comprehensive database of upcoming, active, and past airdrops. Use filters to find airdrops based on category, status, or potential value.
                  </p>
                  <div className="bg-crypto-lightGray/20 rounded-lg p-4 text-sm">
                    <p className="text-gray-300">
                      <span className="text-crypto-green font-semibold">Pro Tip:</span> Look for airdrops with "active" status to find opportunities you can participate in immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-crypto-green/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-crypto-green">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Register for Airdrops</h3>
                  <p className="text-gray-300 mb-4">
                    Click on an airdrop to view detailed information about the project, requirements, and estimated value. Follow the provided links to participate in the airdrop on the project's website.
                  </p>
                  <div className="bg-crypto-lightGray/20 rounded-lg p-4 text-sm">
                    <p className="text-gray-300">
                      <span className="text-crypto-green font-semibold">Pro Tip:</span> Always verify the legitimacy of a project before connecting your wallet or providing personal information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-crypto-green/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-crypto-green">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Submit Your Own Airdrops</h3>
                  <p className="text-gray-300 mb-4">
                    As a registered user, you can submit airdrops you discover to share with the community. Navigate to your dashboard and use the "Submit New Airdrop" button to provide details about the project.
                  </p>
                  <div className="bg-crypto-lightGray/20 rounded-lg p-4 text-sm">
                    <p className="text-gray-300">
                      <span className="text-crypto-green font-semibold">Pro Tip:</span> Providing comprehensive and accurate information increases the likelihood of your submission being approved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-crypto-green/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-crypto-green">5</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Track Your Participation</h3>
                  <p className="text-gray-300 mb-4">
                    Use your dashboard to manage and track the airdrops you've submitted. You can edit or update information as needed to keep the community informed.
                  </p>
                  <div className="bg-crypto-lightGray/20 rounded-lg p-4 text-sm">
                    <p className="text-gray-300">
                      <span className="text-crypto-green font-semibold">Pro Tip:</span> Regularly check your dashboard to ensure your submissions are up-to-date with the latest information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Safety Tips */}
          <h2 className="text-2xl font-bold mb-6 text-center">Safety Tips for Participating in Airdrops</h2>
          <div className="glass-panel rounded-xl p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-crypto-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Use a Dedicated Wallet</h3>
                  <p className="text-gray-300 text-sm">
                    Create a separate wallet specifically for interacting with airdrops to isolate risks from your main funds.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-crypto-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Research Before Participating</h3>
                  <p className="text-gray-300 text-sm">
                    Always research a project thoroughly before providing any personal information or connecting your wallet.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-crypto-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Be Wary of Phishing</h3>
                  <p className="text-gray-300 text-sm">
                    Only follow links from official sources and double-check URLs before entering any information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-crypto-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Never Share Private Keys</h3>
                  <p className="text-gray-300 text-sm">
                    Legitimate projects will never ask for your private keys or seed phrases. Never share these with anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="glass-panel rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Now that you understand how iShowCrypto works, it's time to create an account and start discovering valuable airdrop opportunities!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login">
                <Button className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen w-full sm:w-auto">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/airdrops">
                <Button variant="outline" className="border-crypto-green text-crypto-green hover:bg-crypto-green/10 w-full sm:w-auto">
                  Browse Airdrops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-crypto-lightGray/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Layers className="h-6 w-6 text-crypto-green mr-2" />
              <span className="text-lg font-bold">
                <span className="text-white">iShow</span>
                <span className="text-crypto-green">Crypto</span>
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <Link to="/about" className="text-gray-400 hover:text-crypto-green transition-colors">About Us</Link>
              <Link to="/how-it-works" className="text-crypto-green hover:text-crypto-darkGreen transition-colors">How It Works</Link>
              <a href="#" className="text-gray-400 hover:text-crypto-green transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-crypto-green transition-colors">Privacy Policy</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-crypto-lightGray/20 flex flex-col md:flex-row md:justify-between md:items-center">
            <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0">
              © 2023 iShowCrypto. All rights reserved.
            </p>
            
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4 text-gray-500" />
              <p className="text-gray-500 text-sm">
                Cryptocurrency investments are subject to market risks.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
