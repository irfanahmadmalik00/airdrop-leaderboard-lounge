
import { useState, useEffect } from 'react';
import { Search, Filter, Award, SortAsc, ChevronDown, Clock, BarChart3, PlusCircle, Edit, Trash2, CheckCircle, Pin } from 'lucide-react';
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
import AirdropCard from '@/components/AirdropCard';
import { airdrops } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import AddEditAirdropForm from '@/components/airdrop/AddEditAirdropForm';

type SortOption = 'popularity' | 'date' | 'funding';
type FilterOption = 'all' | 'active' | 'upcoming' | 'ended';

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

const Airdrops = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAirdrop, setCurrentAirdrop] = useState<any>(null);
  const [allAirdrops, setAllAirdrops] = useState(airdrops);
  const [completedAirdrops, setCompletedAirdrops] = useState<string[]>([]);
  const [pinnedAirdrops, setPinnedAirdrops] = useState<string[]>([]);
  const { user, isAdmin } = useAuth();
  
  // Load airdrops from localStorage if available
  useEffect(() => {
    const storedAirdrops = localStorage.getItem('publicAirdrops');
    if (storedAirdrops) {
      try {
        const parsedAirdrops = JSON.parse(storedAirdrops);
        // Merge with predefined airdrops
        const combinedAirdrops = [...airdrops, ...parsedAirdrops];
        // Remove duplicates by ID
        const uniqueAirdrops = combinedAirdrops.filter((airdrop, index, self) =>
          index === self.findIndex((a) => a.id === airdrop.id)
        );
        setAllAirdrops(uniqueAirdrops);
      } catch (error) {
        console.error('Failed to parse stored airdrops', error);
      }
    }
    
    // Load completed airdrops
    const storedCompleted = localStorage.getItem('completedAirdrops');
    if (storedCompleted) {
      try {
        setCompletedAirdrops(JSON.parse(storedCompleted));
      } catch (error) {
        console.error('Failed to parse completed airdrops', error);
      }
    }
    
    // Load pinned airdrops
    const storedPinned = localStorage.getItem('pinnedAirdrops');
    if (storedPinned) {
      try {
        setPinnedAirdrops(JSON.parse(storedPinned));
      } catch (error) {
        console.error('Failed to parse pinned airdrops', error);
      }
    }
  }, []);
  
  // Save airdrops to localStorage when they change
  useEffect(() => {
    // Only save user-added airdrops, not the predefined ones
    const userAddedAirdrops = allAirdrops.filter(
      airdrop => !airdrops.some(a => a.id === airdrop.id)
    );
    if (userAddedAirdrops.length) {
      localStorage.setItem('publicAirdrops', JSON.stringify(userAddedAirdrops));
    }
    
    // Save completed and pinned airdrops
    localStorage.setItem('completedAirdrops', JSON.stringify(completedAirdrops));
    localStorage.setItem('pinnedAirdrops', JSON.stringify(pinnedAirdrops));
    
    // Sync with UserDashboard
    const userDashboardAirdrops = localStorage.getItem('userDashboardAirdrops');
    if (userDashboardAirdrops) {
      try {
        const dashboardAirdrops = JSON.parse(userDashboardAirdrops);
        // Update dashboard airdrops based on deleted public airdrops
        const updatedDashboardAirdrops = dashboardAirdrops.filter((dashAirdrop: any) => 
          allAirdrops.some(publicAirdrop => publicAirdrop.id === dashAirdrop.id)
        );
        localStorage.setItem('userDashboardAirdrops', JSON.stringify(updatedDashboardAirdrops));
      } catch (error) {
        console.error('Failed to sync dashboard airdrops', error);
      }
    }
  }, [allAirdrops, completedAirdrops, pinnedAirdrops]);
  
  // Filter airdrops
  const filteredAirdrops = allAirdrops.filter((airdrop) => {
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
    // First sort by pinned status
    if (pinnedAirdrops.includes(a.id) && !pinnedAirdrops.includes(b.id)) return -1;
    if (!pinnedAirdrops.includes(a.id) && pinnedAirdrops.includes(b.id)) return 1;
    
    // Then by the selected sort option
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
  
  const getCategoryLabel = (categoryOption: string) => {
    if (categoryOption === 'all') {
      return 'All Categories';
    }
    return categoryOption;
  };

  // Get all categories from airdrops data
  const getAllCategories = () => {
    const categoriesSet = new Set<string>();
    
    // Add predefined categories
    predefinedCategories.forEach(category => categoriesSet.add(category));
    
    // Add categories from airdrops
    allAirdrops.forEach(airdrop => {
      if (airdrop.category) {
        categoriesSet.add(airdrop.category);
      }
    });
    
    return Array.from(categoriesSet);
  };

  const handleAddAirdrop = (formData: any) => {
    if (!user) {
      toast.error('You must be logged in to add airdrops');
      return;
    }
    
    const now = new Date();
    const newAirdrop = {
      id: `user-${Math.random().toString(36).substring(2, 11)}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      logo: formData.logo || '/placeholder.svg', // Use placeholder if no logo provided
      status: formData.status,
      fundingAmount: Number(formData.fundingAmount),
      popularity: 1, // Start with low popularity
      listingDate: now.toISOString(),
      estimatedValue: formData.rewards,
      website: formData.links?.[0]?.url || '',
      telegramLink: formData.links?.find((link: any) => link.name.toLowerCase().includes('telegram'))?.url || '',
      twitterLink: formData.links?.find((link: any) => link.name.toLowerCase().includes('twitter'))?.url || '',
      requirements: [formData.workRequired], // Convert to requirements array
      addedBy: user.id,
      tokenSymbol: formData.tokenSymbol || 'TOKEN',
    };
    
    setAllAirdrops([...allAirdrops, newAirdrop]);
    setIsAddDialogOpen(false);
    toast.success('Airdrop added successfully!');
  };

  const handleEditAirdrop = (formData: any) => {
    if (!currentAirdrop || !isAdmin) return;
    
    const updatedAirdrops = allAirdrops.map(airdrop => 
      airdrop.id === currentAirdrop.id
        ? { 
            ...airdrop,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            status: formData.status,
            fundingAmount: Number(formData.fundingAmount),
            estimatedValue: formData.rewards,
            website: formData.links?.[0]?.url || airdrop.website,
            telegramLink: formData.links?.find((link: any) => link.name.toLowerCase().includes('telegram'))?.url || airdrop.telegramLink,
            twitterLink: formData.links?.find((link: any) => link.name.toLowerCase().includes('twitter'))?.url || airdrop.twitterLink,
            requirements: [formData.workRequired],
            tokenSymbol: formData.tokenSymbol || airdrop.tokenSymbol,
          }
        : airdrop
    );
    
    setAllAirdrops(updatedAirdrops);
    setIsEditDialogOpen(false);
    setCurrentAirdrop(null);
    toast.success('Airdrop updated successfully!');
  };

  const handleDeleteAirdrop = (id: string) => {
    if (!isAdmin && !allAirdrops.find(a => a.id === id)?.addedBy === user?.id) {
      toast.error('You do not have permission to delete this airdrop');
      return;
    }
    
    setAllAirdrops(allAirdrops.filter(airdrop => airdrop.id !== id));
    toast.success('Airdrop deleted successfully!');
    
    // Also remove from completed and pinned lists
    if (completedAirdrops.includes(id)) {
      setCompletedAirdrops(completedAirdrops.filter(airdropId => airdropId !== id));
    }
    
    if (pinnedAirdrops.includes(id)) {
      setPinnedAirdrops(pinnedAirdrops.filter(airdropId => airdropId !== id));
    }
  };

  const toggleCompletionStatus = (id: string) => {
    if (!user) {
      toast.error('You must be logged in to mark airdrops as completed');
      return;
    }
    
    if (completedAirdrops.includes(id)) {
      setCompletedAirdrops(completedAirdrops.filter(airdropId => airdropId !== id));
      toast.info('Airdrop marked as incomplete');
    } else {
      setCompletedAirdrops([...completedAirdrops, id]);
      toast.success('Airdrop marked as completed!');
    }
  };

  const togglePinStatus = (id: string) => {
    if (!user) {
      toast.error('You must be logged in to pin airdrops');
      return;
    }
    
    if (pinnedAirdrops.includes(id)) {
      setPinnedAirdrops(pinnedAirdrops.filter(airdropId => airdropId !== id));
      toast.info('Airdrop unpinned');
    } else {
      setPinnedAirdrops([...pinnedAirdrops, id]);
      toast.success('Airdrop pinned!');
    }
  };

  const allCategories = getAllCategories();

  // Render enhanced AirdropCard with action buttons
  const renderAirdropCard = (airdrop: any, index: number) => {
    const isCompleted = completedAirdrops.includes(airdrop.id);
    const isPinned = pinnedAirdrops.includes(airdrop.id);
    
    return (
      <div key={airdrop.id} className="animate-on-scroll relative">
        {isPinned && (
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-b-0 border-l-0 border-t-yellow-500 border-r-transparent z-10"></div>
        )}
        <AirdropCard airdrop={airdrop} rank={index + 1} />
        {user && (
          <div className="mt-2 flex flex-wrap gap-2 justify-end">
            {(isAdmin || airdrop.addedBy === user.id) && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs border-crypto-lightGray/30 h-8"
                  onClick={() => {
                    setCurrentAirdrop(airdrop);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs border-crypto-lightGray/30 h-8 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50"
                  onClick={() => handleDeleteAirdrop(airdrop.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </>
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              className={`text-xs h-8 ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}
              onClick={() => toggleCompletionStatus(airdrop.id)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {isCompleted ? 'Completed' : 'Complete'}
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className={`text-xs h-8 ${isPinned ? 'text-yellow-500' : 'text-gray-400'}`}
              onClick={() => togglePinStatus(airdrop.id)}
            >
              <Pin className="h-3 w-3 mr-1" />
              {isPinned ? 'Pinned' : 'Pin'}
            </Button>
          </div>
        )}
      </div>
    );
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
            
            {user && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add New Airdrop
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Add New Airdrop</DialogTitle>
                  </DialogHeader>
                  <AddEditAirdropForm 
                    onSubmit={handleAddAirdrop}
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
                <DropdownMenuContent align="end" className="bg-crypto-gray border-crypto-lightGray/30 max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem onClick={() => setFilterCategory('all')} className="hover:bg-crypto-lightGray">
                    All Categories
                  </DropdownMenuItem>
                  {allCategories.map((category) => (
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
              {sortedAirdrops.map((airdrop, index) => renderAirdropCard(airdrop, index))}
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
      
      {/* Edit Airdrop Dialog */}
      {currentAirdrop && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Airdrop</DialogTitle>
            </DialogHeader>
            <AddEditAirdropForm 
              onSubmit={handleEditAirdrop}
              predefinedCategories={predefinedCategories}
              initialData={{
                name: currentAirdrop.name,
                description: currentAirdrop.description,
                category: currentAirdrop.category,
                status: currentAirdrop.status,
                fundingAmount: currentAirdrop.fundingAmount,
                rewards: currentAirdrop.estimatedValue,
                workRequired: currentAirdrop.requirements?.[0] || '',
                tokenSymbol: currentAirdrop.tokenSymbol,
                links: [
                  { name: "Website", url: currentAirdrop.website || '' },
                  { name: "Telegram", url: currentAirdrop.telegramLink || '' },
                  { name: "Twitter", url: currentAirdrop.twitterLink || '' },
                ].filter(link => link.url)
              }}
            />
          </DialogContent>
        </Dialog>
      )}
      
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
