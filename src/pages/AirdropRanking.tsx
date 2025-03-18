
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
import { useAuth } from '@/lib/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type SortOption = 'popularity' | 'date' | 'funding';
type FilterOption = 'all' | 'active' | 'upcoming' | 'ended';
type CategoryOption = 'all' | 'DeFi' | 'Layer 1' | 'Layer 2' | 'ZK Rollup' | 'Modular Blockchain' | 'Smart Contract Platform';

const AirdropRanking = () => {
  const { user, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [filterCategory, setFilterCategory] = useState<CategoryOption>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state for adding/editing ranked airdrops (admin only)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    fundingAmount: 0,
    popularity: 0,
    status: 'upcoming' as 'active' | 'upcoming' | 'ended'
  });
  
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

  // Handle adding a new ranked airdrop (admin only)
  const handleAddRankedAirdrop = () => {
    // This would make an API call in a real app
    toast.success('Ranked airdrop added successfully!');
    setIsAddDialogOpen(false);
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      fundingAmount: 0,
      popularity: 0,
      status: 'upcoming'
    });
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
              <span className="text-crypto-green">Ranking Board</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover top-ranked cryptocurrency airdrops by potential value, team quality, and community engagement
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
                placeholder="Search ranked airdrops..."
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
              
              {/* Admin-only Add Button */}
              {isAdmin && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                      Add Ranked Airdrop
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px] bg-crypto-gray border-crypto-lightGray/30">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Add Ranked Airdrop</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input 
                          id="name" 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="bg-crypto-black border-crypto-lightGray/30"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <label htmlFor="description" className="text-sm font-medium">Description</label>
                        <Textarea 
                          id="description" 
                          value={formData.description} 
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="bg-crypto-black border-crypto-lightGray/30 min-h-[100px]"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <label htmlFor="category" className="text-sm font-medium">Category</label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData({...formData, category: value})}
                        >
                          <SelectTrigger className="bg-crypto-black border-crypto-lightGray/30">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-crypto-black border-crypto-lightGray/30">
                            <SelectItem value="DeFi">DeFi</SelectItem>
                            <SelectItem value="Layer 1">Layer 1</SelectItem>
                            <SelectItem value="Layer 2">Layer 2</SelectItem>
                            <SelectItem value="ZK Rollup">ZK Rollup</SelectItem>
                            <SelectItem value="Modular Blockchain">Modular Blockchain</SelectItem>
                            <SelectItem value="Smart Contract Platform">Smart Contract Platform</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <label htmlFor="fundingAmount" className="text-sm font-medium">Funding Amount ($)</label>
                        <Input 
                          id="fundingAmount" 
                          type="number"
                          value={formData.fundingAmount.toString()} 
                          onChange={(e) => setFormData({...formData, fundingAmount: parseInt(e.target.value) || 0})}
                          className="bg-crypto-black border-crypto-lightGray/30"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <label htmlFor="popularity" className="text-sm font-medium">Popularity Ranking (1-100)</label>
                        <Input 
                          id="popularity" 
                          type="number"
                          min="1"
                          max="100"
                          value={formData.popularity.toString()} 
                          onChange={(e) => setFormData({...formData, popularity: parseInt(e.target.value) || 0})}
                          className="bg-crypto-black border-crypto-lightGray/30"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <label htmlFor="status" className="text-sm font-medium">Status</label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value: 'active' | 'upcoming' | 'ended') => setFormData({...formData, status: value})}
                        >
                          <SelectTrigger className="bg-crypto-black border-crypto-lightGray/30">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-crypto-black border-crypto-lightGray/30">
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="ended">Ended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-crypto-lightGray/30">
                        Cancel
                      </Button>
                      <Button onClick={handleAddRankedAirdrop} className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                        Add Ranked Airdrop
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
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
            <h2 className="text-2xl font-bold">{sortedAirdrops.length} Ranked Airdrops</h2>
            <p className="text-gray-400">
              {sortBy === 'popularity' && 'Sorted by highest popularity ranking'}
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
                <h3 className="text-xl font-semibold mb-2">No Ranked Airdrops Found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any ranked airdrops matching your search criteria.
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

export default AirdropRanking;
