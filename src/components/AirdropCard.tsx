
import { useState } from 'react';
import { Calendar, ExternalLink, Globe, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Airdrop } from '@/lib/data';

interface AirdropCardProps {
  airdrop: Airdrop;
  rank?: number;
}

const AirdropCard = ({ airdrop, rank }: AirdropCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatFunding = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'active':
        return 'bg-crypto-green text-crypto-black';
      case 'ended':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div 
      className="glass-card rounded-xl overflow-hidden hover-effect"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {rank && (
              <div className="flex items-center justify-center w-7 h-7 bg-crypto-lightGray rounded-full text-sm font-semibold">
                {rank}
              </div>
            )}
            <img 
              src={airdrop.logo} 
              alt={airdrop.name} 
              className="w-10 h-10 rounded-full object-cover bg-white p-1"
            />
            <div>
              <h3 className="font-bold text-lg">{airdrop.name}</h3>
              <p className="text-sm text-gray-400">{airdrop.tokenSymbol}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(airdrop.status)} capitalize`}>
            {airdrop.status}
          </Badge>
        </div>
        
        <div className="text-sm text-gray-300 mb-3 line-clamp-2">
          {airdrop.description}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-crypto-lightGray/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Funding</p>
            <p className="font-medium text-crypto-green">{formatFunding(airdrop.fundingAmount)}</p>
          </div>
          <div className="bg-crypto-lightGray/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Listing Date</p>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-crypto-green" />
              <p className="font-medium text-sm">{formatDate(airdrop.listingDate)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <a 
              href={airdrop.telegramLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 bg-crypto-lightGray/50 rounded-full hover:bg-crypto-lightGray transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-crypto-green" />
            </a>
            <a 
              href={airdrop.twitterLink}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 bg-crypto-lightGray/50 rounded-full hover:bg-crypto-lightGray transition-colors"
            >
              <Twitter className="w-4 h-4 text-crypto-green" />
            </a>
            <a 
              href={airdrop.website}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 bg-crypto-lightGray/50 rounded-full hover:bg-crypto-lightGray transition-colors"
            >
              <Globe className="w-4 h-4 text-crypto-green" />
            </a>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-sm border-crypto-green text-crypto-green hover:bg-crypto-green/10">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-crypto-gray border-crypto-lightGray max-w-3xl">
              <DialogHeader>
                <div className="flex items-center space-x-3">
                  <img 
                    src={airdrop.logo} 
                    alt={airdrop.name} 
                    className="w-12 h-12 rounded-full object-cover bg-white p-1"
                  />
                  <div>
                    <DialogTitle className="text-xl">{airdrop.name} ({airdrop.tokenSymbol})</DialogTitle>
                    <DialogDescription>{airdrop.category}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <p className="text-gray-300 mb-4">{airdrop.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-crypto-lightGray/30 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Funding Amount</p>
                      <p className="font-medium text-crypto-green">${airdrop.fundingAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-crypto-lightGray/30 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Listing Date</p>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-crypto-green" />
                        <p className="font-medium">{formatDate(airdrop.listingDate)}</p>
                      </div>
                    </div>
                    <div className="bg-crypto-lightGray/30 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Status</p>
                      <Badge className={`${getStatusColor(airdrop.status)} capitalize mt-1`}>
                        {airdrop.status}
                      </Badge>
                    </div>
                    <div className="bg-crypto-lightGray/30 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Estimated Value</p>
                      <p className="font-medium">{airdrop.estimatedValue}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <a 
                      href={airdrop.telegramLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-crypto-lightGray/50 rounded-lg hover:bg-crypto-lightGray transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2 text-crypto-green" />
                      Telegram
                    </a>
                    <a 
                      href={airdrop.twitterLink}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-crypto-lightGray/50 rounded-lg hover:bg-crypto-lightGray transition-colors"
                    >
                      <Twitter className="w-4 h-4 mr-2 text-crypto-green" />
                      Twitter
                    </a>
                    <a 
                      href={airdrop.website}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-crypto-lightGray/50 rounded-lg hover:bg-crypto-lightGray transition-colors"
                    >
                      <Globe className="w-4 h-4 mr-2 text-crypto-green" />
                      Website
                    </a>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-3">Requirements</h4>
                  <ul className="space-y-2 mb-6">
                    {airdrop.requirements.map((req, index) => (
                      <li key={index} className="bg-crypto-lightGray/30 p-3 rounded-lg flex items-center">
                        <div className="w-5 h-5 rounded-full bg-crypto-green/20 flex items-center justify-center mr-3">
                          <span className="text-crypto-green text-xs">{index + 1}</span>
                        </div>
                        {req}
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                    Participate Now
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AirdropCard;
