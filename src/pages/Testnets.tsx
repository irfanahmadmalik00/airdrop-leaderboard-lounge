import { useState, useEffect } from 'react';
import { Search, Filter, Award, ArrowUpDown, ChevronDown, Clock as ClockIcon, BarChart2, Pin, Plus, CheckCircle, ExternalLink } from 'lucide-react';
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
import { useAuth } from '@/lib/auth';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2 } from 'lucide-react';

type SortOption = 'popularity' | 'date' | 'funding';
type FilterOption = 'all' | 'active' | 'upcoming' | 'ended';

// Define predefined categories
const predefinedCategories = [
  'Galxe Testnet',
  'Bridge Mining',
  'Layer 1 Projects',
  'Daily Testnet Tasks (With 50+ task links)'
];

const Testnets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [allTestnets, setAllTestnets] = useState([]);
  const [editingTestnet, setEditingTestnet] = useState(null);
  const { user, isAdmin } = useAuth();
  
  // Load testnets from localStorage if available
  useEffect(() => {
    const storedTestnets = localStorage.getItem('userTestnets');
    if (storedTestnets) {
      try {
        const parsedTestnets = JSON.parse(storedTestnets);
        setAllTestnets(parsedTestnets);
      } catch (error) {
        console.error('Failed to parse stored testnets', error);
      }
    }
  }, []);
  
  // Save testnets to localStorage when they change
  useEffect(() => {
    if (allTestnets.length) {
      localStorage.setItem('userTestnets', JSON.stringify(allTestnets));
    }
  }, [allTestnets]);
  
  // Filter testnets
  const filteredTestnets = allTestnets.filter((testnet) => {
    // Search filter
    if (searchQuery && !testnet.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
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
  
  // Sort testnets
  const sortedTestnets = [...filteredTestnets].sort((a, b) => {
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

  // Handle adding a new testnet
  const handleAddTestnet = (formData: any) => {
    if (!user) {
      toast.error('You must be logged in to add testnets');
      return;
    }
    
    const now = new Date();
    const newTestnet = {
      id: `testnet-${Math.random().toString(36).substring(2, 11)}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      logo: formData.logo || '/placeholder.svg',
      status: formData.status,
      fundingAmount: Number(formData.fundingAmount),
      popularity: 1,
      listingDate: now.toISOString(),
      estimatedValue: formData.rewards,
      website: formData.links?.[0]?.url || '',
      telegramLink: formData.links?.find((link: any) => link.name.toLowerCase().includes('telegram'))?.url || '',
      twitterLink: formData.links?.find((link: any) => link.name.toLowerCase().includes('twitter'))?.url || '',
      requirements: [formData.workRequired],
      addedBy: user.id,
    };
    
    setAllTestnets([...allTestnets, newTestnet]);
    setIsAddDialogOpen(false);
    toast.success('Testnet added successfully!');
  };

  // Handle editing a testnet
  const handleEditTestnet = (formData: any) => {
    if (!editingTestnet) return;
    
    const updatedTestnets = allTestnets.map(testnet => 
      testnet.id === editingTestnet.id 
        ? {
            ...testnet,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            logo: formData.logo,
            status: formData.status,
            fundingAmount: Number(formData.fundingAmount),
            estimatedValue: formData.rewards,
          }
        : testnet
    );
    
    setAllTestnets(updatedTestnets);
    setEditingTestnet(null);
    toast.success('Testnet updated successfully!');
  };

  // Handle deleting a testnet
  const handleDeleteTestnet = (id: string) => {
    const updatedTestnets = allTestnets.filter(testnet => testnet.id !== id);
    setAllTestnets(updatedTestnets);
    toast.success('Testnet deleted successfully!');
  };

  // Start editing a testnet
  const startEditing = (testnet: any) => {
    setEditingTestnet(testnet);
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
              <span className="text-white">Crypto </span>
              <span className="text-crypto-green">Testnets</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Participate in the latest crypto testnets and earn rewards
            </p>
            
            {user && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Testnet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTestnet ? 'Edit Testnet' : 'Add New Testnet'}
                    </DialogTitle>
                  </DialogHeader>
                  <TestnetForm 
                    onSubmit={editingTestnet ? handleEditTestnet : handleAddTestnet}
                    isEditing={!!editingTestnet}
                    currentTestnet={editingTestnet}
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
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    {getDropdownLabel(sortBy)}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-crypto-gray border-crypto-lightGray/30">
                  <DropdownMenuItem onClick={() => setSortBy('popularity')} className="hover:bg-crypto-lightGray">
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Popularity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('date')} className="hover:bg-crypto-lightGray">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    Listing Date
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('funding')} className="hover:bg-crypto-lightGray">
                    <BarChart2 className="w-4 h-4 mr-2" />
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
              {sortBy === 'popularity' && 'Sorted by popularity ranking'}
              {sortBy === 'date' && 'Sorted by most recent listing date'}
              {sortBy === 'funding' && 'Sorted by highest funding amount'}
            </p>
          </div>
          
          {sortedTestnets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTestnets.map((testnet) => (
                <Card key={testnet.id} className="bg-crypto-gray border-crypto-lightGray/30 animate-on-scroll">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{testnet.name}</CardTitle>
                        <CardDescription className="text-gray-400 mt-1">
                          {testnet.category}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(testnet.status)}`}>
                        {testnet.status.charAt(0).toUpperCase() + testnet.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-gray-300 mb-3">
                      {testnet.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-400">Funding</p>
                        <p className="font-medium">${testnet.fundingAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Rewards</p>
                        <p className="font-medium">{testnet.estimatedValue}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs border-crypto-lightGray/30"
                      onClick={() => startEditing(testnet)}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs border-crypto-lightGray/30 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50"
                      onClick={() => handleDeleteTestnet(testnet.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-10 text-center animate-fadeIn">
              <div className="flex flex-col items-center">
                <Award className="h-12 w-12 text-gray-500 mb-4" />
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

interface TestnetFormProps {
  onSubmit: (formData: any) => void;
  isEditing?: boolean;
  currentTestnet?: any;
}

const TestnetForm = ({ onSubmit, isEditing = false, currentTestnet = null }: TestnetFormProps) => {
  const [formData, setFormData] = useState({
    name: currentTestnet?.name || '',
    description: currentTestnet?.description || '',
    category: currentTestnet?.category || '',
    logo: currentTestnet?.logo || '',
    fundingAmount: currentTestnet?.fundingAmount || 0,
    rewards: currentTestnet?.rewards || '',
    timeCommitment: currentTestnet?.timeCommitment || '',
    workRequired: currentTestnet?.workRequired || '',
    status: currentTestnet?.status || 'upcoming',
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Testnet Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter testnet name"
            className="bg-crypto-gray border-crypto-lightGray/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="logo">Logo URL (optional)</Label>
          <Input
            id="logo"
            value={formData.logo}
            onChange={(e) => handleInputChange('logo', e.target.value)}
            placeholder="https://example.com/logo.png"
            className="bg-crypto-gray border-crypto-lightGray/30"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the testnet"
          className="bg-crypto-gray border-crypto-lightGray/30 min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger className="bg-crypto-gray border-crypto-lightGray/30">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-crypto-gray border-crypto-lightGray/30">
              {predefinedCategories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleInputChange('status', value)}
          >
            <SelectTrigger className="bg-crypto-gray border-crypto-lightGray/30">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-crypto-gray border-crypto-lightGray/30">
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fundingAmount">Funding Amount ($)</Label>
          <Input
            id="fundingAmount"
            type="number"
            value={formData.fundingAmount.toString()}
            onChange={(e) => handleInputChange('fundingAmount', Number(e.target.value))}
            placeholder="Enter funding amount"
            className="bg-crypto-gray border-crypto-lightGray/30"
            min="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rewards">Rewards</Label>
          <Input
            id="rewards"
            value={formData.rewards}
            onChange={(e) => handleInputChange('rewards', e.target.value)}
            placeholder="e.g. 500-1000 tokens"
            className="bg-crypto-gray border-crypto-lightGray/30"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          variant="outline" 
          className="border-crypto-lightGray/30"
          type="button"
          onClick={() => onSubmit(null)} // Cancel
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
        >
          {isEditing ? 'Update Testnet' : 'Add Testnet'}
        </Button>
      </div>
    </form>
  );
};

export default Testnets;
