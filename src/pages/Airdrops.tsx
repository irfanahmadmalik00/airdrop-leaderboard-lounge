
import { useState } from 'react';
import { Search, Filter, Award, SortAsc, ChevronDown, Clock, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import AirdropCard from '@/components/AirdropCard';
import { airdrops } from '@/lib/data';

type SortOption = 'popularity' | 'date' | 'funding';
type FilterOption = 'all' | 'active' | 'upcoming' | 'ended';
type CategoryOption = 'all' | 'DeFi' | 'Layer 1' | 'Layer 2' | 'ZK Rollup' | 'Modular Blockchain' | 'Smart Contract Platform';

const Airdrops = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [filterCategory, setFilterCategory] = useState<CategoryOption>('all');
  
  // Filter airdrops
  const filteredAirdrops = airdrops.filter((airdrop) => {
    // Search filter
    if (searchQuery && !airdrop.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !airdrop.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filterStatus !== 'all' && airdrop.status !== filterStatus) {
      return false;
    }
    
    // Category filter
    if (filterCategory !== 'all' && airdrop.category !== filterCategory) {
      return false;
    }
    
    return true;
  });
  
  // Sort airdrops
  const sortedAirdrops = [...filteredAirdrops].sort((a, b) => {
    if (sortBy === 'popularity') {
      return b.popularity - a.popularity;
    } else if (sortBy === 'date') {
      return new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime();
    } else if (sortBy === 'funding') {
      return b.fundingAmount - a.fundingAmount;
    }
    return 0;
  });
  
  const getDropdownLabel = (sortOption: SortOption) => {
    switch (sortOption) {
      case 'popularity':
        return 'Popularity';
      case 'date':
        return 'Listing Date';
      case 'funding':
        return 'Funding Amount';
      default:
        return 'Sort By';
    }
  };
  
  const getStatusLabel = (statusOption: FilterOption) => {
    switch (statusOption) {
      case 'all':
        return 'All Status';
      case 'active':
        return 'Active';
      case 'upcoming':
        return 'Upcoming';
      case 'ended':
        return 'Ended';
      default:
        return 'Status';
    }
  };
  
  const getCategoryLabel = (categoryOption: CategoryOption) => {
    if (categoryOption === 'all') {
      return 'All Categories';
    }
    return categoryOption;
  };

  return (
    <div className="min-h-screen bg-crypto-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 md:pt-32 md:pb-16">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-fadeIn">
            <div className="p-3 bg-crypto-gray/60 rounded-full mb-4">
              <Award className="h-12 w-12 text-crypto-green" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-white">Airdrops </span>
              <span className="text-crypto-green">Leaderboard</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover and participate in the latest cryptocurrency airdrops ranked by popularity and potential value
            </p>
          </div>
        </div>
      </section>
      
      {/* Filters Section */}
      <section className="py-6 px-4 border-y border-crypto-lightGray/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full md:w-1/3 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search airdrops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
              />
            </div>
            
            <div className="flex flex-wrap md:flex-nowrap gap-3">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-crypto-lightGray/30 bg-crypto-gray">
                    <SortAsc className="w-4 h-4 mr-2" />
                    {getDropdownLabel(sortBy)}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-crypto-gray border-crypto-lightGray/30">
                  <DropdownMenuItem onClick={() => setSortBy('popularity')} className="hover:bg-crypto-lightGray">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Popularity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('date')} className="hover:bg-crypto-lightGray">
                    <Clock className="w-4 h-4 mr-2" />
                    Listing Date
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('funding')} className="hover:bg-crypto-lightGray">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Funding Amount
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-crypto-lightGray/30 bg-crypto-gray">
                    <Filter className="w-4 h-4 mr-2" />
                    {getStatusLabel(filterStatus)}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-crypto-gray border-crypto-lightGray/30">
                  <DropdownMenuItem onClick={() => setFilterStatus('all')} className="hover:bg-crypto-lightGray">
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('active')} className="hover:bg-crypto-lightGray">
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('upcoming')} className="hover:bg-crypto-lightGray">
                    Upcoming
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('ended')} className="hover:bg-crypto-lightGray">
                    Ended
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-crypto-lightGray/30 bg-crypto-gray">
                    <Filter className="w-4 h-4 mr-2" />
                    {getCategoryLabel(filterCategory)}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-crypto-gray border-crypto-lightGray/30">
                  <DropdownMenuItem onClick={() => setFilterCategory('all')} className="hover:bg-crypto-lightGray">
                    All Categories
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('DeFi')} className="hover:bg-crypto-lightGray">
                    DeFi
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Layer 1')} className="hover:bg-crypto-lightGray">
                    Layer 1
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Layer 2')} className="hover:bg-crypto-lightGray">
                    Layer 2
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('ZK Rollup')} className="hover:bg-crypto-lightGray">
                    ZK Rollup
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Modular Blockchain')} className="hover:bg-crypto-lightGray">
                    Modular Blockchain
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Smart Contract Platform')} className="hover:bg-crypto-lightGray">
                    Smart Contract Platform
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Active Filters */}
          {(filterStatus !== 'all' || filterCategory !== 'all' || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filterStatus !== 'all' && (
                <Badge className="bg-crypto-lightGray text-white hover:bg-crypto-gray">
                  Status: {getStatusLabel(filterStatus)}
                  <button 
                    onClick={() => setFilterStatus('all')}
                    className="ml-2 hover:text-gray-300"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {filterCategory !== 'all' && (
                <Badge className="bg-crypto-lightGray text-white hover:bg-crypto-gray">
                  Category: {getCategoryLabel(filterCategory)}
                  <button 
                    onClick={() => setFilterCategory('all')}
                    className="ml-2 hover:text-gray-300"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {searchQuery && (
                <Badge className="bg-crypto-lightGray text-white hover:bg-crypto-gray">
                  Search: {searchQuery}
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-gray-300"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              <Button 
                variant="link" 
                onClick={() => {
                  setFilterStatus('all');
                  setFilterCategory('all');
                  setSearchQuery('');
                }}
                className="text-crypto-green hover:text-crypto-darkGreen px-2 h-7"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Results Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{sortedAirdrops.length} Airdrops Found</h2>
            <p className="text-gray-400">
              {sortBy === 'popularity' && 'Sorted by popularity ranking'}
              {sortBy === 'date' && 'Sorted by most recent listing date'}
              {sortBy === 'funding' && 'Sorted by highest funding amount'}
            </p>
          </div>
          
          {sortedAirdrops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAirdrops.map((airdrop, index) => (
                <div key={airdrop.id} className="animate-on-scroll">
                  <AirdropCard airdrop={airdrop} rank={index + 1} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-10 text-center animate-fadeIn">
              <div className="flex flex-col items-center">
                <Award className="h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Airdrops Found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any airdrops matching your search criteria.
                </p>
                <Button 
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterCategory('all');
                    setSearchQuery('');
                  }}
                  className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
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

export default Airdrops;
