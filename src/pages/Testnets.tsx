
import { useState, useEffect } from 'react';
import { Search, Filter, Layers, ChevronDown, Clock, BarChart3, Plus, Check, ExternalLink, ArrowRight, Pencil, Trash2, Pin } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Tool interface
interface Testnet {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  status: 'active' | 'upcoming' | 'ended';
  rewards: string;
  timeCommitment: string;
  workRequired?: string;
  links?: Array<{name: string, url: string}>;
  pinned: boolean;
  completed: boolean;
  userId?: string;
  dateAdded: string;
}

// Initial predefined categories
const predefinedCategories = [
  'Layer 1',
  'Layer 2',
  'Galxe Testnet',
  'Bridge Mining',
  'Modular Blockchain',
  'ZK Rollup',
  'DeFi Testnet',
  'DAO Testnet'
];

// Initial tools data
const initialTestnets = [
  {
    id: 'tool1',
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
    id: 'tool2',
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
type CategoryOption = 'all' | 'Layer 1' | 'Layer 2' | 'Galxe Testnet' | 'Bridge Mining' | 'Modular Blockchain' | 'ZK Rollup' | 'DeFi Testnet' | 'DAO Testnet';

const Testnets = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [filterCategory, setFilterCategory] = useState<CategoryOption>('all');
  const [testnetsList, setTestnetsList] = useState<Testnet[]>([]);
  const [categories, setCategories] = useState<string[]>(predefinedCategories);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTestnet, setCurrentTestnet] = useState<Testnet | null>(null);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Form data for adding/editing tools
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    logo: '',
    rewards: '',
    timeCommitment: '',
    workRequired: '',
    status: 'upcoming',
    links: [{ name: 'Official Website', url: '' }]
  });

  // Load testnets from localStorage on component mount
  useEffect(() => {
    const storedTestnets = localStorage.getItem('userTestnets');
    const storedCategories = localStorage.getItem('testnetCategories');
    
    if (storedTestnets) {
      try {
        const parsedTestnets = JSON.parse(storedTestnets);
        // If user is logged in, filter to show only their testnets and public ones
        if (user) {
          const filteredTestnets = parsedTestnets.filter((testnet: Testnet) => 
            !testnet.userId || testnet.userId === user.id
          );
          setTestnetsList(filteredTestnets);
        } else {
          // For non-logged in users, only show testnets without userId (public ones)
          const publicTestnets = parsedTestnets.filter((testnet: Testnet) => !testnet.userId);
          setTestnetsList(publicTestnets);
        }
      } catch (error) {
        console.error('Failed to parse stored testnets', error);
        setTestnetsList(initialTestnets);
        localStorage.setItem('userTestnets', JSON.stringify(initialTestnets));
      }
    } else {
      // Initialize with default testnets
      setTestnetsList(initialTestnets);
      localStorage.setItem('userTestnets', JSON.stringify(initialTestnets));
    }
    
    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories));
      } catch (error) {
        console.error('Failed to parse stored categories', error);
        setCategories(predefinedCategories);
        localStorage.setItem('testnetCategories', JSON.stringify(predefinedCategories));
      }
    } else {
      localStorage.setItem('testnetCategories', JSON.stringify(predefinedCategories));
    }
  }, [user]);
  
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
    
    // For "rewards" we sort alphabetically as a proxy
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
    if (!user) {
      toast.error("You must be logged in to pin testnets");
      return;
    }
    
    setTestnetsList(prevList => {
      const updated = prevList.map(testnet => 
        testnet.id === id ? {...testnet, pinned: !testnet.pinned} : testnet
      );
      
      // Save to localStorage
      localStorage.setItem('userTestnets', JSON.stringify(updated));
      return updated;
    });
    
    toast.success('Testnet pin status updated!');
  };
  
  // Toggle completed status
  const toggleCompleteTestnet = (id: string) => {
    if (!user) {
      toast.error("You must be logged in to mark testnets as completed");
      return;
    }
    
    setTestnetsList(prevList => {
      const updated = prevList.map(testnet => 
        testnet.id === id ? {...testnet, completed: !testnet.completed} : testnet
      );
      
      // Save to localStorage
      localStorage.setItem('userTestnets', JSON.stringify(updated));
      return updated;
    });
    
    const isNowCompleted = testnetsList.find(t => t.id === id)?.completed;
    toast.success(isNowCompleted ? 'Testnet marked as incomplete' : 'Testnet marked as completed!');
  };

  // Open the edit dialog
  const handleEditTestnet = (testnet: Testnet) => {
    setCurrentTestnet(testnet);
    setFormData({
      name: testnet.name,
      category: testnet.category,
      description: testnet.description,
      logo: testnet.logo,
      rewards: testnet.rewards,
      timeCommitment: testnet.timeCommitment,
      workRequired: testnet.workRequired || '',
      status: testnet.status,
      links: testnet.links || [{ name: 'Official Website', url: '' }]
    });
    setIsEditDialogOpen(true);
  };

  // Delete a testnet
  const handleDeleteTestnet = (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete testnets");
      return;
    }
    
    // Check if user owns this testnet or is admin
    const testnet = testnetsList.find(t => t.id === id);
    if (testnet?.userId && testnet.userId !== user.id && user.role !== 'admin') {
      toast.error("You can only delete your own testnets");
      return;
    }
    
    setTestnetsList(prevList => {
      const updated = prevList.filter(testnet => testnet.id !== id);
      
      // Save to localStorage
      localStorage.setItem('userTestnets', JSON.stringify(updated));
      return updated;
    });
    
    toast.success('Testnet deleted successfully!');
  };

  // Add a new testnet
  const handleAddTestnet = () => {
    if (!user) {
      toast.error("You must be logged in to add testnets");
      return;
    }
    
    if (!formData.name || !formData.category || !formData.status) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newTestnet: Testnet = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      logo: formData.logo || 'https://cryptologos.cc/logos/question-mark.svg',
      status: formData.status as 'active' | 'upcoming' | 'ended',
      rewards: formData.rewards,
      timeCommitment: formData.timeCommitment,
      workRequired: formData.workRequired,
      links: formData.links,
      pinned: false,
      completed: false,
      userId: user.id,
      dateAdded: new Date().toISOString()
    };
    
    setTestnetsList(prevList => {
      const updated = [...prevList, newTestnet];
      
      // Save to localStorage
      localStorage.setItem('userTestnets', JSON.stringify(updated));
      return updated;
    });
    
    // Reset form and close dialog
    setFormData({
      name: '',
      category: '',
      description: '',
      logo: '',
      rewards: '',
      timeCommitment: '',
      workRequired: '',
      status: 'upcoming',
      links: [{ name: 'Official Website', url: '' }]
    });
    setIsAddDialogOpen(false);
    toast.success('Testnet added successfully!');
  };

  // Update an existing testnet
  const handleUpdateTestnet = () => {
    if (!currentTestnet || !user) return;
    
    if (!formData.name || !formData.category || !formData.status) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Check if user owns this testnet or is admin
    if (currentTestnet.userId && currentTestnet.userId !== user.id && user.role !== 'admin') {
      toast.error("You can only edit your own testnets");
      return;
    }
    
    const updatedTestnet = {
      ...currentTestnet,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      logo: formData.logo,
      status: formData.status as 'active' | 'upcoming' | 'ended',
      rewards: formData.rewards,
      timeCommitment: formData.timeCommitment,
      workRequired: formData.workRequired,
      links: formData.links
    };
    
    setTestnetsList(prevList => {
      const updated = prevList.map(testnet => 
        testnet.id === currentTestnet.id ? updatedTestnet : testnet
      );
      
      // Save to localStorage
      localStorage.setItem('userTestnets', JSON.stringify(updated));
      return updated;
    });
    
    // Reset form and close dialog
    setFormData({
      name: '',
      category: '',
      description: '',
      logo: '',
      rewards: '',
      timeCommitment: '',
      workRequired: '',
      status: 'upcoming',
      links: [{ name: 'Official Website', url: '' }]
    });
    setIsEditDialogOpen(false);
    toast.success('Testnet updated successfully!');
  };

  // Add a new category
  const handleAddCategory = () => {
    if (!user) {
      toast.error("You must be logged in to add categories");
      return;
    }
    
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    if (categories.includes(newCategory)) {
      toast.error('This category already exists');
      return;
    }
    
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('testnetCategories', JSON.stringify(updatedCategories));
    setNewCategory('');
    setIsNewCategoryDialogOpen(false);
    toast.success('New category added!');
  };

  // Handle adding a new link field
  const handleAddLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { name: '', url: '' }]
    });
  };

  // Handle removing a link field
  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...formData.links];
    updatedLinks.splice(index, 1);
    setFormData({
      ...formData,
      links: updatedLinks
    });
  };

  // Handle updating a link field
  const handleUpdateLink = (index: number, field: 'name' | 'url', value: string) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index][field] = value;
    setFormData({
      ...formData,
      links: updatedLinks
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
                    {getCategoryLabel(filterCategory as CategoryOption)}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-crypto-gray border-crypto-lightGray/30">
                  <DropdownMenuItem onClick={() => setFilterCategory('all')} className="hover:bg-crypto-lightGray">
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category} 
                      onClick={() => setFilterCategory(category as CategoryOption)} 
                      className="hover:bg-crypto-lightGray"
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {user && (
                <>
                  <Button 
                    variant="outline" 
                    className="border-crypto-lightGray/30 bg-crypto-gray"
                    onClick={() => setIsNewCategoryDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                  
                  <Button 
                    className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Testnet
                  </Button>
                </>
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
                  Category: {getCategoryLabel(filterCategory as CategoryOption)}
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
          
          {/* Testnet cards */}
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
                        <div className="flex items-center flex-wrap gap-1">
                          <Badge className="bg-crypto-lightGray/50 text-xs">
                            {testnet.category}
                          </Badge>
                          <Badge className={`${testnet.status === 'active' ? 'bg-crypto-green text-crypto-black' : 
                                     testnet.status === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-500'} text-xs`}>
                            {testnet.status.charAt(0).toUpperCase() + testnet.status.slice(1)}
                          </Badge>
                          {testnet.completed && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Completed
                            </Badge>
                          )}
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
                  
                  {/* Links section - Show max first 2 links */}
                  {testnet.links && testnet.links.length > 0 && (
                    <div className="flex flex-col gap-2 mb-4">
                      {testnet.links.slice(0, 2).map((link, index) => (
                        <a 
                          key={index}
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm flex items-center text-crypto-green hover:underline"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {link.name}
                        </a>
                      ))}
                      {testnet.links.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{testnet.links.length - 2} more links
                        </div>
                      )}
                    </div>
                  )}
                  
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
                            <Pin className="h-3 w-3 mr-1" />
                            {testnet.pinned ? 'Unpin' : 'Pin'}
                          </Button>
                        </>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {user && (testnet.userId === user.id || user.role === 'admin') && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-crypto-lightGray/30"
                            onClick={() => handleEditTestnet(testnet)}
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-crypto-lightGray/30 hover:bg-red-900/20 hover:text-red-400"
                            onClick={() => handleDeleteTestnet(testnet.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                          </Button>
                        </>
                      )}
                    </div>
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
      
      {/* Add Testnet Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-crypto-gray border-crypto-lightGray/30">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Testnet</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Testnet Name</label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <div className="flex gap-2">
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className="bg-crypto-black border-crypto-lightGray/30 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-crypto-black border-crypto-lightGray/30">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  className="border-crypto-lightGray/30"
                  onClick={() => setIsNewCategoryDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30 min-h-[80px]"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="logo" className="text-sm font-medium">Logo URL</label>
              <Input 
                id="logo" 
                value={formData.logo} 
                onChange={(e) => setFormData({...formData, logo: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
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
            
            <div className="grid gap-2">
              <label htmlFor="rewards" className="text-sm font-medium">Rewards</label>
              <Input 
                id="rewards" 
                value={formData.rewards} 
                onChange={(e) => setFormData({...formData, rewards: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
                placeholder="e.g. 500 tokens, NFT, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="timeCommitment" className="text-sm font-medium">Time Commitment</label>
              <Input 
                id="timeCommitment" 
                value={formData.timeCommitment} 
                onChange={(e) => setFormData({...formData, timeCommitment: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
                placeholder="e.g. 2-3 hours per week"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="workRequired" className="text-sm font-medium">Work Required</label>
              <Input 
                id="workRequired" 
                value={formData.workRequired} 
                onChange={(e) => setFormData({...formData, workRequired: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
                placeholder="e.g. Complete 5 transactions, stake tokens, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Links</label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddLink}
                  className="h-7 px-2 border-crypto-lightGray/30"
                  disabled={formData.links.length >= 50}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Link
                </Button>
              </div>
              
              {formData.links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    placeholder="Link Name" 
                    value={link.name} 
                    onChange={(e) => handleUpdateLink(index, 'name', e.target.value)}
                    className="bg-crypto-black border-crypto-lightGray/30 flex-1"
                  />
                  <Input 
                    placeholder="URL" 
                    value={link.url} 
                    onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                    className="bg-crypto-black border-crypto-lightGray/30 flex-2"
                  />
                  {formData.links.length > 1 && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleRemoveLink(index)}
                      className="h-8 w-8 p-0 border-crypto-lightGray/30"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              {formData.links.length >= 50 && (
                <p className="text-xs text-yellow-400">Maximum 50 links allowed</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-crypto-lightGray/30">
              Cancel
            </Button>
            <Button 
              onClick={handleAddTestnet} 
              className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
            >
              Add Testnet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Testnet Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-crypto-gray border-crypto-lightGray/30">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Testnet</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <label htmlFor="edit-name" className="text-sm font-medium">Testnet Name</label>
              <Input 
                id="edit-name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-category" className="text-sm font-medium">Category</label>
              <div className="flex gap-2">
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className="bg-crypto-black border-crypto-lightGray/30 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-crypto-black border-crypto-lightGray/30">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  className="border-crypto-lightGray/30"
                  onClick={() => setIsNewCategoryDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="edit-description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30 min-h-[80px]"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-logo" className="text-sm font-medium">Logo URL</label>
              <Input 
                id="edit-logo" 
                value={formData.logo} 
                onChange={(e) => setFormData({...formData, logo: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-status" className="text-sm font-medium">Status</label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
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
            
            <div className="grid gap-2">
              <label htmlFor="edit-rewards" className="text-sm font-medium">Rewards</label>
              <Input 
                id="edit-rewards" 
                value={formData.rewards} 
                onChange={(e) => setFormData({...formData, rewards: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-timeCommitment" className="text-sm font-medium">Time Commitment</label>
              <Input 
                id="edit-timeCommitment" 
                value={formData.timeCommitment} 
                onChange={(e) => setFormData({...formData, timeCommitment: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-workRequired" className="text-sm font-medium">Work Required</label>
              <Input 
                id="edit-workRequired" 
                value={formData.workRequired} 
                onChange={(e) => setFormData({...formData, workRequired: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Links</label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddLink}
                  className="h-7 px-2 border-crypto-lightGray/30"
                  disabled={formData.links.length >= 50}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Link
                </Button>
              </div>
              
              {formData.links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    placeholder="Link Name" 
                    value={link.name} 
                    onChange={(e) => handleUpdateLink(index, 'name', e.target.value)}
                    className="bg-crypto-black border-crypto-lightGray/30 flex-1"
                  />
                  <Input 
                    placeholder="URL" 
                    value={link.url} 
                    onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                    className="bg-crypto-black border-crypto-lightGray/30 flex-2"
                  />
                  {formData.links.length > 1 && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleRemoveLink(index)}
                      className="h-8 w-8 p-0 border-crypto-lightGray/30"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-crypto-lightGray/30">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateTestnet} 
              className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Category Dialog */}
      <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-crypto-gray border-crypto-lightGray/30">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Category</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Input 
              placeholder="Enter new category name" 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-crypto-black border-crypto-lightGray/30"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsNewCategoryDialogOpen(false)} className="border-crypto-lightGray/30">
              Cancel
            </Button>
            <Button 
              onClick={handleAddCategory} 
              className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
            >
              Add Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
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
