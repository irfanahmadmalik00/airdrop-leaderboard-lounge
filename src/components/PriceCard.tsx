
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CryptoMarketData } from '@/lib/data';

interface PriceCardProps {
  crypto: CryptoMarketData;
}

const PriceCard = ({ crypto }: PriceCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(2)}T`;
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(2)}B`;
    } else if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden hover-effect">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-10 h-10 rounded-full object-cover bg-white p-1"
            />
            <div>
              <h3 className="font-bold">{crypto.name}</h3>
              <p className="text-sm text-gray-400">{crypto.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{formatPrice(crypto.price)}</p>
            <div className={`flex items-center justify-end text-sm ${
              crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {crypto.change24h >= 0 ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              )}
              <span>{Math.abs(crypto.change24h).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-crypto-lightGray/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Market Cap</p>
            <p className="font-medium">{formatMarketCap(crypto.marketCap)}</p>
          </div>
          <div className="bg-crypto-lightGray/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Volume (24h)</p>
            <p className="font-medium">{formatVolume(crypto.volume24h)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
