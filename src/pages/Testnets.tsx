import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Plus, 
  Trash, 
  Edit, 
  Check, 
  X, 
  Save, 
  Pinboard 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Custom type for Testnet
interface Testnet {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  status: 'active' | 'upcoming' | 'ended';
  rewards: string;
  timeCommitment: string;
  links: Array<{name: string, url: string}>;
  pinned: boolean;
  completed: boolean;
  dateAdded: string;
  userId?: string;
}

// Sample testnets
const sampleTestnets: Testnet[] = [
  {
    id: '1',
    name: 'Ethereum 2.0 Testnet',
    category: 'Layer 1 & Testnet Mainnet',
    description: 'Participate in the Ethereum 2.0 Beacon Chain testnet and help secure the future of Ethereum.',
    logo: '/placeholder.svg',
    status: 'active',
    rewards: 'Early contributor status and potential future airdrops',
    timeCommitment: '2-3 hours to set up, ongoing maintenance',
    links: [
      { name: 'Official Website', url: 'https://ethereum.org' },
      { name: 'Setup Guide', url: 'https://ethereum.org/en/developers/docs/' }
    ],
    pinned: false,
    completed: false,
    dateAdded: '2023-05-15'
  },
  {
    id: '2',
    name: 'Polygon zkEVM Testnet',
    category: 'Layer 2 & Scaling',
    description: 'Test the next generation of Polygon scaling solutions with zero-knowledge proofs.',
    logo: '/placeholder.svg',
    status: 'upcoming',
    rewards: 'Potential future token airdrop for active participants',
    timeCommitment: '1-2 hours',
    links: [
      { name: 'Official Website', url: 'https://polygon.technology' }
    ],
    pinned: false,
    completed: false,
    dateAdded: '2023-06-20'
  }
];

// Define predefined categories
const predefinedCategories = [
  'Layer 1 & Testnet Mainnet',
  'Layer 2 & Scaling',
  'ZK Rollups',
  'Smart Contract Development',
  'Cross-Chain Solutions',
  'DeFi Protocols',
  'NFT & Gaming',
  'DAO Governance',
  'Modular Blockchain'
];

const Testnets = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [activeTab, setActiveTab] = useState('discover');
  const [testnets, setTestnets] = useState<Testnet[]>([]);
  const [userTestnets, setUserTestnets] = useState<Testnet[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  // Form state for new/edit testnet
  const [formData, setFormData] = useState<Omit<Testnet, 'id' | 'dateAdded' | 'pinned' | 'completed'>>({
    name: '',
    category: '',
    description: '',
    logo: '/placeholder.svg',
    status: 'upcoming',
    rewards: '',
    timeCommitment: '',
    links: [{ name: 'Official Website', url: '' }]
  });
  
  // Load testnets from localStorage on mount
  useEffect(() => {
    // Load public testnets
    const storedTestnets = localStorage.getItem('publicTestnets');
    if (storedTestnets) {
      try {
        const parsedTestnets = JSON.parse(storedTestnets);
        // Ensure status is one of the allowed values
        const validatedTestnets = parsedTestnets.map((testnet: any) => ({
          ...testnet,
          status: validateStatus(testnet.status)
        }));
        setTestnets([...sampleTestnets, ...validatedTestnets]);
      } catch (error) {
        console.error('Failed to parse testnets', error);
        setTestnets(sampleTestnets);
      }
    } else {
      setTestnets(sampleTestnets);
    }
    
    // Load user's personal testnets
    if (user) {
      const storedUserTestnets = localStorage.getItem(`userTestnets_${user.id}`);
      if (storedUserTestnets) {
        try {
          const parsedUserTestnets = JSON.parse(storedUserTestnets);
          // Ensure status is one of the allowed values
          const validatedUserTestnets = parsedUserTestnets.map((testnet: any) => ({
            ...testnet,
            status: validateStatus(testnet.status)
          }));
          setUserTestnets(validatedUserTestnets);
        } catch (error) {
          console.error('Failed to parse user testnets', error);
        }
      }
    }
  }, [user]);
  
  // Helper to validate status value
  const validateStatus = (status: string): 'active' | 'upcoming' | 'ended' => {
    if (status === 'active' || status === 'upcoming' || status === 'ended') {
      return status;
    }
    return 'upcoming'; // Default fallback
  };
  
  // Save testnets to localStorage whenever they change
  useEffect(() => {
    // Filter out sample testnets
    const customTestnets = testnets.filter(
      testnet => !sampleTestnets.some(sample => sample.id === testnet.id)
    );
    
    if (customTestnets.length > 0) {
      localStorage.setItem('publicTestnets', JSON.stringify(customTestnets));
    }
  }, [testnets]);
  
  // Save user testnets to localStorage whenever they change
  useEffect(() => {
    if (user && userTestnets.length > 0) {
      localStorage.setItem(`userTestnets_${user.id}`, JSON.stringify(userTestnets));
    }
  }, [userTestnets, user]);
  
  // Filter testnets based on search query and filters
  const getFilteredTestnets = (testnetList: Testnet[]) => {
    return testnetList.filter(testnet => {
      // Search filter
      if (searchQuery && 
          !testnet.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !testnet.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filterStatus !== 'all' && testnet.status !== filterStatus) {
        return false;
      }
      
      // Category filter
      if (filterCategory !== 'all' && testnet.category !== filterCategory) {
        return false;
      }
      
      return true;
    });
  };
  
  // Sort testnets
  const getSortedTestnets = (testnetList: Testnet[]) => {
    return [...testnetList].sort((a, b) => {
      // Pinned items first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then apply selected sort
      if (sortBy === 'date') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'status') {
        // Order: active, upcoming, ended
        const statusOrder = { active: 0, upcoming: 1, ended: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });
  };
  
  // Get filtered and sorted testnets
  const filteredPublicTestnets = getSortedTestnets(getFilteredTestnets(testnets));
  const filteredUserTestnets = getSortedTestnets(getFilteredTestnets(userTestnets));
  
  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Handle link changes
  const handleLinkChange = (index: number, field: 'name' | 'url', value: string) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      links: updatedLinks
    });
  };
  
  // Handle adding a new link
  const handleAddLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { name: '', url: '' }]
    });
  };
  
  // Handle removing a link
  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...formData.links];
    updatedLinks.splice(index, 1);
    
    setFormData({
      ...formData,
      links: updatedLinks
    });
  };
  
  // Handle adding a new category
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    setFormData({
      ...formData,
      category: newCategory
    });
    
    setIsNewCategoryDialogOpen(false);
    setNewCategory('');
    toast.success(`New category "${newCategory}" added`);
  };
  
  // Handle submitting the form
  const handleSubmitTestnet = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to add a testnet');
      return;
    }
    
    if (!formData.name || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Create a new testnet
    const newTestnet: Testnet = {
      id: Math.random().toString(36).substring(2, 11),
      ...formData,
      pinned: false,
      completed: false,
      dateAdded: new Date().toISOString(),
      userId: user.id
    };
    
    if (activeTab === 'discover') {
      // Add to public testnets
      setTestnets([...testnets, newTestnet]);
      toast.success('Testnet added to public list');
    } else {
      // Add to user's personal testnets
      setUserTestnets([...userTestnets, newTestnet]);
      toast.success('Testnet added to your personal list');
    }
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      description: '',
      logo: '/placeholder.svg',
      status: 'upcoming',
      rewards: '',
      timeCommitment: '',
      links: [{ name: 'Official Website', url: '' }]
    });
    
    setIsAddDialogOpen(false);
  };
  
  // Handle toggling pin status
  const handleTogglePin = (id: string) => {
    if (activeTab === 'discover') {
      // Update public testnets
      setTestnets(testnets.map(testnet => 
        testnet.id === id ? { ...testnet, pinned: !testnet.pinned } : testnet
      ));
    } else {
      // Update user's testnets
      setUserTestnets(userTestnets.map(testnet => 
        testnet.id === id ? { ...testnet, pinned: !testnet.pinned } : testnet
      ));
    }
  };
  
  // Handle toggling completion status
  const handleToggleCompletion = (id: string) => {
    if (activeTab === 'discover') {
      // Update public testnets
      setTestnets(testnets.map(testnet => 
        testnet.id === id ? { ...testnet, completed: !testnet.completed } : testnet
      ));
    } else {
      // Update user's testnets
      setUserTestnets(userTestnets.map(testnet => 
        testnet.id === id ? { ...testnet, completed: !testnet.completed } : testnet
      ));
    }
  };
  
  // Get all categories from both lists
  const getAllCategories = () => {
    const categoriesSet = new Set([
      ...predefinedCategories,
      ...testnets.map(t => t.category),
      ...userTestnets.map(t => t.category)
    ]);
    return Array.from(categoriesSet);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status color for badges
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

  return (
    <div className="min-h-screen bg-crypto-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 md:pt-32 md:pb-16">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-fadeIn">
            <div className="p-3 bg-crypto-gray/60 rounded-full mb-4">
              <Trophy className="h-12 w-12 text-crypto-green" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-white">Blockchain </span>
              <span className="text-crypto-green">Testnets</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover and track blockchain testnets to earn potential rewards and gain early access to cutting-edge protocols
            </p>
            
            {user && (
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Testnet
              </Button>
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
                    <SortAsc className="w-4 h-4 mr-2" />
                    {sortBy === 'date' ? 'Newest First' : 
                     sortBy === 'name' ? 'Name (A-Z)' : 
                     'Status'}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-crypto-gray border-crypto-lightGray/30">
                  <DropdownMenuItem onClick={() => setSortBy('date')} className="hover:bg-crypto-lightGray">
                    <Clock className="w-4 h-4 mr-2" />
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('name')} className="hover:bg-crypto-lightGray">
                    <SortAsc className="w-4 h-4 mr-2" />
                    Name (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('status')} className="hover:bg-crypto-lightGray">
                    <Filter className="w-4 h-4 mr-2" />
                    Status
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-crypto-lightGray/30 bg-crypto-gray">
                    <Filter className="w-4 h-4 mr-2" />
                    {filterStatus === 'all' ? 'All Status' : 
                     filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
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
                    {filterCategory === 'all' ? 'All Categories' : filterCategory}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-crypto-gray border-crypto-lightGray/30 max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem onClick={() => setFilterCategory('all')} className="hover:bg-crypto-lightGray">
                    All Categories
                  </DropdownMenuItem>
                  {getAllCategories().map((category) => (
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
                  Status: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
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
                  Category: {filterCategory}
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
      
      {/* Tabs & Results Section */}
      <section className="py-10 px-4">
        <div className="container mx-auto">
          {user && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="bg-crypto-gray">
                <TabsTrigger 
                  value="discover" 
                  className="data-[state=active]:bg-crypto-green data-[state=active]:text-crypto-black"
                >
                  Discover Testnets
                </TabsTrigger>
                <TabsTrigger 
                  value="myTestnets" 
                  className="data-[state=active]:bg-crypto-green data-[state=active]:text-crypto-black"
                >
                  My Testnets
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {activeTab === 'discover' ? 
                `${filteredPublicTestnets.length} Testnets Found` : 
                `${filteredUserTestnets.length} of Your Testnets`
              }
            </h2>
            <p className="text-gray-400">
              {sortBy === 'date' && 'Sorted by most recent'}
              {sortBy === 'name' && 'Sorted alphabetically by name'}
              {sortBy === 'status' && 'Sorted by status (active, upcoming, ended)'}
            </p>
          </div>
          
          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'discover' ? filteredPublicTestnets : filteredUserTestnets).map((testnet) => (
              <div key={testnet.id} className="glass-card rounded-xl overflow-hidden hover:border-crypto-green border border-transparent transition-all">
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
                        <p className="text-sm text-gray-400">{testnet.category}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(testnet.status)} capitalize`}>
                      {testnet.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {testnet.description}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-crypto-lightGray/30 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Rewards</p>
                      <p className="font-medium text-crypto-green line-clamp-1">{testnet.rewards}</p>
                    </div>
                    <div className="bg-crypto-lightGray/30 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Time Needed</p>
                      <p className="font-medium text-sm">{testnet.timeCommitment}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      Added: {formatDate(testnet.dateAdded)}
                    </div>
                    
                    {user && (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className={`text-xs h-8 ${testnet.completed ? 'text-green-500' : 'text-gray-400'}`}
                          onClick={() => handleToggleCompletion(testnet.id)}
                        >
                          {testnet.completed ? 'Completed' : 'Mark Complete'}
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className={`text-xs h-8 ${testnet.pinned ? 'text-yellow-500' : 'text-gray-400'}`}
                          onClick={() => handleTogglePin(testnet.id)}
                        >
                          {testnet.pinned ? 'Pinned' : 'Pin'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty State */}
            {(activeTab === 'discover' ? filteredPublicTestnets.length === 0 : filteredUserTestnets.length === 0) && (
              <div className="col-span-full glass-panel rounded-xl p-10 text-center animate-fadeIn">
                <div className="flex flex-col items-center">
                  <Trophy className="h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Testnets Found</h3>
                  <p className="text-gray-400 mb-6">
                    {activeTab === 'discover' 
                      ? "We couldn't find any testnets matching your search criteria." 
                      : "You haven't added any personal testnets yet."}
                  </p>
                  <Button 
                    onClick={() => {
                      if (activeTab === 'discover') {
                        setFilterStatus('all');
                        setFilterCategory('all');
                        setSearchQuery('');
                      } else {
                        setIsAddDialogOpen(true);
                      }
                    }}
                    className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                  >
                    {activeTab === 'discover' ? 'Clear Filters' : 'Add Your First Testnet'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Add Testnet Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-crypto-gray border-crypto-lightGray/30">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Testnet</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitTestnet} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="name">Testnet Name *</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-crypto-black border-crypto-lightGray/30"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="category">Category *</Label>
                <div className="flex gap-2">
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange('category', value)}
                    required
                  >
                    <SelectTrigger className="bg-crypto-black border-crypto-lightGray/30 w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-crypto-black border-crypto-lightGray/30 max-h-[300px] overflow-y-auto">
                      {predefinedCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-crypto-lightGray/30">
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px] bg-crypto-gray border-crypto-lightGray/30">
                      <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Input 
                          placeholder="Enter new category" 
                          value={newCategory} 
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="bg-crypto-black border-crypto-lightGray/30"
                        />
                        <Button 
                          onClick={handleAddCategory} 
                          className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                        >
                          Add Category
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-crypto-black border-crypto-lightGray/30 min-h-[100px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'active' | 'upcoming' | 'ended') => 
                    handleInputChange('status', value)
                  }
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rewards">Rewards</Label>
                  <Input 
                    id="rewards" 
                    value={formData.rewards} 
                    onChange={(e) => handleInputChange('rewards', e.target.value)}
                    className="bg-crypto-black border-crypto-lightGray/30"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="timeCommitment">Time Commitment</Label>
                  <Input 
                    id="timeCommitment" 
                    value={formData.timeCommitment} 
                    onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
                    className="bg-crypto-black border-crypto-lightGray/30"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label>Links</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddLink}
                    className="h-8 text-xs border-crypto-green text-crypto-green"
                    type="button"
                  >
                    <PlusCircle className="h-3 w-3 mr-1" /> Add Link
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={link.name}
                        onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                        placeholder="Link name"
                        className="bg-crypto-black border-crypto-lightGray/30 text-sm"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                        placeholder="https://..."
                        className="bg-crypto-black border-crypto-lightGray/30 text-sm"
                      />
                      {formData.links.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLink(index)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)} 
                className="border-crypto-lightGray/30"
                type="button"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
              >
                Add Testnet
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Testnets;
