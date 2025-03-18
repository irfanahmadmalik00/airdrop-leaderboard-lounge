
import { Layers, Mail, Globe, Users, Shield, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-crypto-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 md:pt-32 md:pb-16">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-fadeIn">
            <div className="p-3 bg-crypto-gray/60 rounded-full mb-4">
              <Users className="h-12 w-12 text-crypto-green" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-white">About </span>
              <span className="text-crypto-green">iShowCrypto</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Learn more about our mission, team, and why we created the ultimate airdrop tracking platform
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="glass-panel rounded-2xl p-8 md:p-12 mb-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-full md:w-2/3">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  At iShowCrypto, our mission is to democratize access to cryptocurrency airdrops by creating the most comprehensive, user-friendly platform for discovering and tracking opportunities in the crypto space.
                </p>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  We believe that everyone should have equal access to participate in the growth of blockchain ecosystems through airdrops, which often serve as a gateway for new users to enter the crypto world.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Our platform is designed to bring transparency, reliability, and community participation to the airdrop landscape, helping both newcomers and experienced crypto enthusiasts find genuine opportunities.
                </p>
              </div>
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="p-4 bg-crypto-gray/60 rounded-full green-glow">
                  <Layers className="h-32 w-32 text-crypto-green" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Values */}
          <h2 className="text-2xl font-bold mb-6 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-panel rounded-xl p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-crypto-gray/60 rounded-full mb-4 green-glow">
                <Shield className="h-8 w-8 text-crypto-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Security First</h3>
              <p className="text-gray-300">
                We prioritize the security of our users with robust verification systems and stringent vetting of listed airdrops.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-crypto-gray/60 rounded-full mb-4 green-glow">
                <Users className="h-8 w-8 text-crypto-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community Driven</h3>
              <p className="text-gray-300">
                Our platform empowers users to contribute by submitting and verifying airdrops, fostering a collaborative ecosystem.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-6 flex flex-col items-center text-center">
              <div className="p-3 bg-crypto-gray/60 rounded-full mb-4 green-glow">
                <Globe className="h-8 w-8 text-crypto-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Access</h3>
              <p className="text-gray-300">
                We strive to make cryptocurrency airdrops accessible to everyone, regardless of their location or experience level.
              </p>
            </div>
          </div>
          
          {/* Team */}
          <h2 className="text-2xl font-bold mb-6 text-center">Meet Our Team</h2>
          <div className="glass-panel rounded-xl p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="aspect-square w-48 h-48 rounded-full overflow-hidden border-4 border-crypto-green/30">
                  <img 
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
                    alt="Founder" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Irfan Malik</h3>
                <p className="text-crypto-green mb-3">Founder & CEO</p>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  A blockchain enthusiast with a passion for making crypto accessible to everyone. Irfan founded iShowCrypto to help users navigate the complex world of cryptocurrency airdrops and maximize their potential rewards.
                </p>
                <div className="flex justify-center md:justify-start space-x-3">
                  <a 
                    href="mailto:malickirfan00@gmail.com"
                    className="flex items-center justify-center w-10 h-10 bg-crypto-lightGray/50 rounded-full hover:bg-crypto-lightGray transition-colors"
                  >
                    <Mail className="w-5 h-5 text-crypto-green" />
                  </a>
                  <a 
                    href="#"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-crypto-lightGray/50 rounded-full hover:bg-crypto-lightGray transition-colors"
                  >
                    <Globe className="w-5 h-5 text-crypto-green" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact */}
          <h2 className="text-2xl font-bold mb-6 text-center">Get In Touch</h2>
          <div className="glass-panel rounded-xl p-8 text-center">
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Have questions, suggestions, or want to collaborate with us? We'd love to hear from you! Reach out to our team using the contact information below.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
              <div className="flex items-center justify-center">
                <Mail className="w-5 h-5 text-crypto-green mr-2" />
                <a href="mailto:contact@ishowcrypto.com" className="text-crypto-green hover:underline">
                  contact@ishowcrypto.com
                </a>
              </div>
              <div className="flex items-center justify-center">
                <Globe className="w-5 h-5 text-crypto-green mr-2" />
                <a href="#" className="text-crypto-green hover:underline">
                  www.ishowcrypto.com
                </a>
              </div>
            </div>
            <Link to="/login">
              <Button className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                Join Our Community
              </Button>
            </Link>
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
              <Link to="/about" className="text-crypto-green hover:text-crypto-darkGreen transition-colors">About Us</Link>
              <Link to="/how-it-works" className="text-gray-400 hover:text-crypto-green transition-colors">How It Works</Link>
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

export default AboutUs;
