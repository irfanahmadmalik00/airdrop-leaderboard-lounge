import { useState } from 'react';
import { Search, Filter, Layers, ChevronDown, Clock, BarChart3, Plus, Check, ExternalLink, ArrowRight } from 'lucide-react';
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
import { useAuth } from '@/lib/auth';

// Temporary testnet data until we implement proper backend storage
const testnets = [
  {
    id: 't1',
    name: 'Arbitrum Nova',
    category: 'Layer 2',
    description: 'Participate in the Arbitrum Nova testnet to earn rewards',
    logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=022',
    status: 'active',
    rewards: 'Up to 500 ARB tokens',
    timeCommitment: '2-3 hours per week',
    links: [
      { name: 'Official Website', url: 'https://arbitrum.io/nova' },
      { name: 'Testnet Guide', url: 'https://medium.com/arbitrum' }
    ],
    pinned: false,
    completed: false,
    dateAdded: '2023-08-15'
  },
  {
    id: 't2',
    name: 'Celestia Testnet',
    category: 'Modular Blockchain',
    description: 'Test the Celestia modular blockchain platform',
    logo: 'https://cryptologos.cc/logos/cosmos-atom-logo.png?v=022',
    status: 'active',
    rewards: 'Potential airdrop',
    timeCommitment: '5-10 hours per week',
    links: [
      { name: 'Documentation', url: 'https://docs.celestia.org' },
      { name: 'Discord', url: 'https://discord.gg/celestiacommunity' }
    ],
    pinned: true,
    completed: false,
    dateAdded: '2023-09-20'
  }
];

type SortOption = 'date' | 'rewards';
type FilterOption = 'all' | 'active' | 'completed' | 'upcoming';
type CategoryOption = 'all' | 'Layer 1' | 'Layer 2' | 'Galxe Testnet' | 'Bridge Mining' | 'Modular Blockchain';

const Testnets = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [filterCategory, setFilterCategory] = useState<CategoryOption>('all');
  const [testnetsList, setTestnetsList] = useState(testnets);
  
  // Filter testnets
  const filteredTestnets = testnetsList.filter((testnet) => {
    // Search filter
    if (searchQuery && !testnet.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !testnet.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filterStatus === 'completed' && !testnet.completed) {
      return false;
    } else if (filterStatus === 'active' && (testnet.status !== 'active' || testnet.completed)) {
      return false;
    } else if (filterStatus === 'upcoming' && testnet.status !== 'upcoming') {
      return false;
    }
    
    // Category filter
    if (filterCategory !== 'all' && testnet.category !== filterCategory) {
      return false;
    }
    
    return true;
  });
  
  // Sort testnets - pinned ones always come first
  const sortedTestnets = [...filteredTestnets].sort((a, b) => {
    // Pinned items always come first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    // Then apply the selected sort
    if (sortBy === 'date') {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
    
    // For "rewards" we would need some numerical value, using alphabetical for demo
    return a.name.localeCompare(b.name);
  });
  
  const getDropdownLabel = (sortOption: SortOption) => {
    switch (sortOption) {
      case 'date':
        return 'Date Added';
      case 'rewards':
        return 'Rewards';
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
      case 'completed':
        return 'Completed';
      case 'upcoming':
        return 'Upcoming';
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

  // Toggle pin status
  const togglePinTestnet = (id: string) => {
    if (!user) return;
    
    setTestnetsList(testnetsList.map(testnet => 
      testnet.id === id ? {...testnet, pinned: !testnet.pinned} : testnet
    ));
  };
  
  // Toggle completed status
  const toggleCompleteTestnet = (id: string) => {
    if (!user) return;
    
    setTestnetsList(testnetsList.map(testnet => 
      testnet.id === id ? {...testnet, completed: !testnet.completed} : testnet
    ));
  };

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
              <span className="text-white">Testnet </span>
              <span className="text-crypto-green">Tracker</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Track and participate in the latest blockchain testnets to earn rewards and gain early access
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
                placeholder="Search testnets..."
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
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {getDropdownLabel(sortBy)}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-crypto-gray border-crypto-lightGray/30">
                  <DropdownMenuItem onClick={() => setSortBy('date')} className="hover:bg-crypto-lightGray">
                    <Clock className="w-4 h-4 mr-2" />
                    Date Added
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('rewards')} className="hover:bg-crypto-lightGray">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Rewards
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
                  <DropdownMenuItem onClick={() => setFilterStatus('completed')} className="hover:bg-crypto-lightGray">
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('upcoming')} className="hover:bg-crypto-lightGray">
                    Upcoming
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
                  <DropdownMenuItem onClick={() => setFilterCategory('Layer 1')} className="hover:bg-crypto-lightGray">
                    Layer 1
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Layer 2')} className="hover:bg-crypto-lightGray">
                    Layer 2
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Galxe Testnet')} className="hover:bg-crypto-lightGray">
                    Galxe Testnet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Bridge Mining')} className="hover:bg-crypto-lightGray">
                    Bridge Mining
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Modular Blockchain')} className="hover:bg-crypto-lightGray">
                    Modular Blockchain
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {user && (
                <Button className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testnet
                </Button>
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
            <h2 className="text-2xl font-bold">{sortedTestnets.length} Testnets Found</h2>
            <p className="text-gray-400">
              {sortBy === 'date' && 'Sorted by most recent'}
              {sortBy === 'rewards' && 'Sorted by reward value'}
            </p>
          </div>
          
          {/* Testnet cards will go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTestnets.map((testnet) => (
              <div key={testnet.id} className="glass-card rounded-xl overflow-hidden hover-effect">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={testnet.logo} 
                        alt={testnet.name} 
                        className="w-10 h-10 rounded-full object-cover bg-white p-1"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{testnet.name}</h3>
                        <div className="flex items-center">
                          <Badge className="bg-crypto-lightGray/50 text-xs mr-2">
                            {testnet.category}
                          </Badge>
                          <Badge className={`${testnet.status === 'active' ? 'bg-crypto-green text-crypto-black' : 'bg-gray-500'} text-xs`}>
                            {testnet.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {testnet.pinned && (
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        Pinned
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-300 mb-3">
                    {testnet.description}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-crypto-lightGray/30 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Rewards</p>
                      <p className="font-medium text-crypto-green">{testnet.rewards}</p>
                    </div>
                    <div className="bg-crypto-lightGray/30 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Time Commitment</p>
                      <p className="font-medium">{testnet.timeCommitment}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {user && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`text-xs ${testnet.completed ? 'bg-crypto-green/20 text-crypto-green border-crypto-green/30' : 'border-crypto-lightGray/30'}`}
                            onClick={() => toggleCompleteTestnet(testnet.id)}
                          >
                            {testnet.completed ? 'Completed' : 'Mark Complete'}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className={`text-xs ${testnet.pinned ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'border-crypto-lightGray/30'}`}
                            onClick={() => togglePinTestnet(testnet.id)}
                          >
                            {testnet.pinned ? 'Unpin' : 'Pin'}
                          </Button>
                        </>
                      )}
                    </div>
                    
                    <Button size="sm" variant="outline" className="text-sm border-crypto-green text-crypto-green hover:bg-crypto-green/10">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {sortedTestnets.length === 0 && (
            <div className="glass-panel rounded-xl p-10 text-center animate-fadeIn">
              <div className="flex flex-col items-center">
                <Layers className="h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Testnets Found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any testnets matching your search criteria.
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

export default Testnets;
