
import { useState, useEffect } from 'react';
import { Search, Filter, Award, ArrowUpDown, ChevronDown, BarChart2, Pin, Plus, Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { airdrops } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import AddEditAirdropForm from '@/components/airdrop/AddEditAirdropForm';

type SortOption = 'rank' | 'funding' | 'rewards';

// Define predefined categories
const predefinedCategories = [
  'Top 10 Projects',
  'Layer 1 & Testnet Mainnet',
  'Telegram Bot Airdrops',
  'Daily Check-in Airdrops',
  'Twitter Airdrops',
  'Social Airdrops',
  'AI Airdrops',
  'Wallet Airdrops',
  'Exchange Airdrops'
];

const AirdropRanking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rank');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [allRankedAirdrops, setAllRankedAirdrops] = useState<any[]>([]);
  const [editingAirdrop, setEditingAirdrop] = useState<any>(null);
  const { user, isAdmin } = useAuth();
  
  // Load airdrops from localStorage if available
  useEffect(() => {
    const storedRankings = localStorage.getItem('airdropRankings');
    if (storedRankings) {
      try {
        const parsedRankings = JSON.parse(storedRankings);
        setAllRankedAirdrops(parsedRankings);
      } catch (error) {
        console.error('Failed to parse stored airdrop rankings', error);
        // Initialize with sample data if parsing fails
        initializeWithSampleData();
      }
    } else {
      // Initialize with sample data if no data in localStorage
      initializeWithSampleData();
    }
  }, []);
  
  // Initialize with sample data
  const initializeWithSampleData = () => {
    // Generate sample ranked airdrops from the existing airdrops data
    const sampleRankings = airdrops.slice(0, 10).map((airdrop, index) => ({
      ...airdrop,
      rank: index + 1,
      rating: Math.floor(Math.random() * 5) + 1,
      reviewCount: Math.floor(Math.random() * 100) + 10,
    }));
    
    setAllRankedAirdrops(sampleRankings);
    localStorage.setItem('airdropRankings', JSON.stringify(sampleRankings));
  };
  
  // Save rankings to localStorage when they change
  useEffect(() => {
    if (allRankedAirdrops.length) {
      localStorage.setItem('airdropRankings', JSON.stringify(allRankedAirdrops));
    }
  }, [allRankedAirdrops]);
  
  // Filter airdrops
  const filteredAirdrops = allRankedAirdrops.filter((airdrop) => {
    // Search filter
    if (searchQuery && !airdrop.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !airdrop.description.toLowerCase().includes(searchQuery.toLowerCase())) {
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
    if (sortBy === 'rank') {
      return a.rank - b.rank;
    } else if (sortBy === 'funding') {
      return b.fundingAmount - a.fundingAmount;
    } else if (sortBy === 'rewards') {
      return b.rating - a.rating;
    }
    return 0;
  });
  
  const getDropdownLabel = (sortOption: SortOption) => {
    switch (sortOption) {
      case 'rank':
        return 'Rank';
      case 'funding':
        return 'Funding Amount';
      case 'rewards':
        return 'Reward Rating';
      default:
        return 'Sort By';
    }
  };
  
  const getCategoryLabel = (categoryOption: string) => {
    if (categoryOption === 'all') {
      return 'All Categories';
    }
    return categoryOption;
  };

  // Handle adding a new ranked airdrop
  const handleAddRankedAirdrop = (formData: any) => {
    if (!isAdmin) {
      toast.error('Only admins can add to the rankings');
      return;
    }
    
    const now = new Date();
    const newRankedAirdrop = {
      id: `ranking-${Math.random().toString(36).substring(2, 11)}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      logo: formData.logo || '/placeholder.svg',
      status: formData.status,
      fundingAmount: Number(formData.fundingAmount),
      rank: allRankedAirdrops.length + 1,
      rating: 5, // Default maximum rating for newly added
      reviewCount: 0,
      listingDate: now.toISOString(),
      estimatedValue: formData.rewards,
      website: formData.links?.[0]?.url || '',
      telegramLink: formData.links?.find((link: any) => link.name.toLowerCase().includes('telegram'))?.url || '',
      twitterLink: formData.links?.find((link: any) => link.name.toLowerCase().includes('twitter'))?.url || '',
      requirements: [formData.workRequired],
      tokenSymbol: formData.tokenSymbol || 'TOKEN',
      links: formData.links || [],
    };
    
    setAllRankedAirdrops([...allRankedAirdrops, newRankedAirdrop]);
    setIsAddDialogOpen(false);
    toast.success('Airdrop added to rankings successfully!');
  };

  // Handle editing a ranked airdrop
  const handleEditRankedAirdrop = (formData: any) => {
    if (!isAdmin) {
      toast.error('Only admins can edit the rankings');
      return;
    }
    
    if (!editingAirdrop) return;
    
    const updatedAirdrops = allRankedAirdrops.map(airdrop => 
      airdrop.id === editingAirdrop.id 
        ? {
            ...airdrop,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            logo: formData.logo,
            status: formData.status,
            fundingAmount: Number(formData.fundingAmount),
            estimatedValue: formData.rewards,
            tokenSymbol: formData.tokenSymbol,
            links: formData.links,
          }
        : airdrop
    );
    
    setAllRankedAirdrops(updatedAirdrops);
    setEditingAirdrop(null);
    toast.success('Ranking updated successfully!');
  };

  // Handle deleting a ranked airdrop
  const handleDeleteRankedAirdrop = (id: string) => {
    if (!isAdmin) {
      toast.error('Only admins can delete from the rankings');
      return;
    }
    
    const updatedAirdrops = allRankedAirdrops.filter(airdrop => airdrop.id !== id);
    // Recalculate ranks
    const rerankedAirdrops = updatedAirdrops.map((airdrop, index) => ({
      ...airdrop,
      rank: index + 1
    }));
    
    setAllRankedAirdrops(rerankedAirdrops);
    toast.success('Airdrop removed from rankings');
  };

  // Start editing a ranked airdrop
  const startEditing = (airdrop: any) => {
    if (!isAdmin) {
      toast.error('Only admins can edit the rankings');
      return;
    }
    
    setEditingAirdrop(airdrop);
    setIsAddDialogOpen(true);
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
              <span className="text-white">Airdrop </span>
              <span className="text-crypto-green">Rankings</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              The top crypto airdrops ranked by value, funding, and potential rewards
            </p>
            
            {isAdmin && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                    <Plus className="h-5 w-5 mr-2" />
                    Add To Rankings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAirdrop ? 'Edit Ranked Airdrop' : 'Add Airdrop to Rankings'}
                    </DialogTitle>
                  </DialogHeader>
                  <AddEditAirdropForm 
                    onSubmit={editingAirdrop ? handleEditRankedAirdrop : handleAddRankedAirdrop}
                    isEditing={!!editingAirdrop}
                    currentAirdrop={editingAirdrop}
                    predefinedCategories={predefinedCategories}
                  />
                </DialogContent>
              </Dialog>
            )}
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
                placeholder="Search rankings..."
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
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    {getDropdownLabel(sortBy)}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-crypto-gray border-crypto-lightGray/30">
                  <DropdownMenuItem onClick={() => setSortBy('rank')} className="hover:bg-crypto-lightGray">
                    <Pin className="w-4 h-4 mr-2" />
                    Rank
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('funding')} className="hover:bg-crypto-lightGray">
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Funding Amount
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('rewards')} className="hover:bg-crypto-lightGray">
                    <Award className="w-4 h-4 mr-2" />
                    Reward Rating
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
                <DropdownMenuContent align="end" className="bg-crypto-gray border-crypto-lightGray/30 max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem onClick={() => setFilterCategory('all')} className="hover:bg-crypto-lightGray">
                    All Categories
                  </DropdownMenuItem>
                  {predefinedCategories.map((category) => (
                    <DropdownMenuItem 
                      key={category} 
                      onClick={() => setFilterCategory(category)} 
                      className="hover:bg-crypto-lightGray"
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Active Filters */}
          {(filterCategory !== 'all' || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-4">
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
              {sortBy === 'rank' && 'Sorted by official ranking'}
              {sortBy === 'funding' && 'Sorted by highest funding amount'}
              {sortBy === 'rewards' && 'Sorted by highest reward rating'}
            </p>
          </div>
          
          {sortedAirdrops.length > 0 ? (
            <div className="space-y-4">
              {sortedAirdrops.map((airdrop) => (
                <Card key={airdrop.id} className="bg-crypto-gray border-crypto-lightGray/30 animate-on-scroll">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="flex items-center justify-center bg-crypto-green/10 w-12 h-12 rounded-full">
                      <span className="text-xl font-bold text-crypto-green">{airdrop.rank}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{airdrop.name}</CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            {airdrop.category}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge className={`${getStatusColor(airdrop.status)}`}>
                            {airdrop.status.charAt(0).toUpperCase() + airdrop.status.slice(1)}
                          </Badge>
                          <div className="flex items-center mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={`h-4 w-4 ${i < airdrop.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                            ))}
                            <span className="text-xs text-gray-400 ml-2">({airdrop.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-gray-300 mb-3">
                      {airdrop.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Funding</p>
                        <p className="font-medium">${airdrop.fundingAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Token</p>
                        <p className="font-medium">{airdrop.tokenSymbol}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Est. Value</p>
                        <p className="font-medium">{airdrop.estimatedValue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Listed</p>
                        <p className="font-medium">{new Date(airdrop.listingDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between flex-wrap gap-2">
                    <div className="flex gap-2">
                      {isAdmin && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs border-crypto-lightGray/30 h-8"
                            onClick={() => startEditing(airdrop)}
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs border-crypto-lightGray/30 h-8 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50"
                            onClick={() => handleDeleteRankedAirdrop(airdrop.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {airdrop.website && (
                        <a 
                          href={airdrop.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center text-xs px-3 py-1 h-8 rounded-md text-crypto-green hover:bg-crypto-green/10 transition-colors"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </CardFooter>
                </Card>
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

// Helper function to get status color for badges
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'upcoming':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'ended':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export default AirdropRanking;
