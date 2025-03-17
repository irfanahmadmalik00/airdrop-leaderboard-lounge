
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Layers, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import PriceCard from '@/components/PriceCard';
import ChartCard from '@/components/ChartCard';
import AirdropCard from '@/components/AirdropCard';
import VideoCard from '@/components/VideoCard';
import { marketData, btcPriceHistory, marketDominance, airdrops, videos } from '@/lib/data';

const Index = () => {
  // Animate elements on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-crypto-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 md:pt-32 md:pb-16">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-fadeIn">
            <div className="p-3 bg-crypto-gray/60 rounded-full mb-4">
              <Layers className="h-12 w-12 text-crypto-green" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-white">Discover Exclusive </span>
              <span className="text-crypto-green">Crypto Airdrops</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Your premier destination for the latest cryptocurrency airdrops, market data, and educational videos
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/airdrops">
                <Button className="px-8 py-6 bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen transition-all hover:translate-y-[-2px] shadow-lg">
                  <Award className="w-5 h-5 mr-2" />
                  Browse Airdrops
                </Button>
              </Link>
              <Link to="/videos">
                <Button variant="outline" className="px-8 py-6 border-crypto-green text-crypto-green hover:bg-crypto-green/10 transition-all hover:translate-y-[-2px]">
                  Watch Videos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Market Data Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6 animate-on-scroll">
            <div>
              <h2 className="text-2xl font-bold">Market Overview</h2>
              <p className="text-gray-400">Latest cryptocurrency prices and market data</p>
            </div>
            <Link to="/">
              <Button variant="ghost" className="text-crypto-green hover:text-crypto-darkGreen hover:bg-crypto-green/10">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {marketData.slice(0, 3).map((crypto) => (
              <div key={crypto.id} className="animate-on-scroll">
                <PriceCard crypto={crypto} />
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 animate-on-scroll">
              <ChartCard 
                title="Bitcoin Price Chart"
                subtitle="Historical BTC price in USD"
                data={btcPriceHistory}
                type="area"
                xKey="date"
                yKey="price"
                height={350}
              />
            </div>
            <div className="animate-on-scroll">
              <ChartCard 
                title="Market Dominance"
                subtitle="Percentage of total market cap"
                data={marketDominance}
                type="pie"
                xKey="name"
                yKey="value"
                height={350}
                colors={['#00FF80', '#39E991', '#00CC66', '#009249', '#004D26']}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Trending Airdrops Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6 animate-on-scroll">
            <div>
              <h2 className="text-2xl font-bold">Trending Airdrops</h2>
              <p className="text-gray-400">Participate in the most popular crypto airdrops</p>
            </div>
            <Link to="/airdrops">
              <Button variant="ghost" className="text-crypto-green hover:text-crypto-darkGreen hover:bg-crypto-green/10">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {airdrops.slice(0, 3).map((airdrop) => (
              <div key={airdrop.id} className="animate-on-scroll">
                <AirdropCard airdrop={airdrop} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Educational Videos Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6 animate-on-scroll">
            <div>
              <h2 className="text-2xl font-bold">Latest Videos</h2>
              <p className="text-gray-400">Learn about cryptocurrency and airdrops</p>
            </div>
            <Link to="/videos">
              <Button variant="ghost" className="text-crypto-green hover:text-crypto-darkGreen hover:bg-crypto-green/10">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="animate-on-scroll">
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="glass-panel rounded-2xl p-8 md:p-12 animate-on-scroll">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Stay Updated</h2>
                <p className="text-gray-300 max-w-xl">
                  Don't miss new airdrops and opportunities. Sign up now to receive alerts and increase your chances of earning crypto rewards.
                </p>
              </div>
              <Link to="/login">
                <Button className="px-8 py-6 bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen transition-all hover:translate-y-[-2px] shadow-lg">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Get Started
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
              <a href="#" className="text-gray-400 hover:text-crypto-green transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-crypto-green transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-crypto-green transition-colors">Contact</a>
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

export default Index;
