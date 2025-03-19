
import { useState, useEffect } from 'react';
import { Search, Filter, Wrench, ChevronDown, ExternalLink, Plus, Pencil, Trash2, Pin } from 'lucide-react';
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
interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  url: string;
  pinned: boolean;
  userId?: string;
}

// Initial predefined categories
const predefinedCategories = [
  'Wallet Connect',
  'Airdrop Claim Checker',
  'Gas Fee Calculator',
  'Testnet Token Faucets',
  'Crypto Wallet Extensions',
  'Swaps & Bridges'
];

// Initial tools data
const initialTools = [
  {
    id: 'tool1',
    name: 'MetaMask',
    category: 'Crypto Wallet Extensions',
    description: 'A crypto wallet & gateway to blockchain apps',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
    url: 'https://metamask.io/',
    pinned: true
  },
  {
    id: 'tool2',
    name: 'Uniswap',
    category: 'Swaps & Bridges',
    description: 'Swap, earn, and build on the leading decentralized crypto trading protocol',
    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.svg?v=025',
    url: 'https://uniswap.org/',
    pinned: false
  },
  {
    id: 'tool3',
    name: 'Optimism Faucet',
    category: 'Testnet Token Faucets',
    description: 'Get testnet tokens for Optimism network',
    logo: 'https://cryptologos.cc/logos/optimism-op-logo.svg?v=025',
    url: 'https://app.optimism.io/faucet',
    pinned: false
  },
  {
    id: 'tool4',
    name: 'ETH Gas Tracker',
    category: 'Gas Fee Calculator',
    description: 'Track Ethereum gas fees in real-time',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025',
    url: 'https://etherscan.io/gastracker',
    pinned: false
  },
  {
    id: 'tool5',
    name: 'Wallet Connect',
    category: 'Wallet Connect',
    description: 'Open protocol for connecting wallets to dApps',
    logo: 'https://cryptologos.cc/logos/walletconnect-wc-logo.svg?v=025',
    url: 'https://walletconnect.com/',
    pinned: true
  }
];

type FilterOption = 'all' | 'Wallet Connect' | 'Gas Fee Calculator' | 'Testnet Token Faucets' | 'Crypto Wallet Extensions' | 'Swaps & Bridges' | 'Airdrop Claim Checker';

const Tools = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<FilterOption>('all');
  const [toolsList, setToolsList] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>(predefinedCategories);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool | null>(null);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Form data for adding/editing tools
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    logo: '',
    url: ''
  });

  // Load tools from localStorage on component mount
  useEffect(() => {
    const storedTools = localStorage.getItem('cryptoTools');
    const storedCategories = localStorage.getItem('toolCategories');
    
    if (storedTools) {
      setToolsList(JSON.parse(storedTools));
    } else {
      // Initialize with default tools
      setToolsList(initialTools);
      localStorage.setItem('cryptoTools', JSON.stringify(initialTools));
    }
    
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Initialize with default categories
      localStorage.setItem('toolCategories', JSON.stringify(predefinedCategories));
    }
  }, []);
  
  // Filter tools
  const filteredTools = toolsList.filter((tool) => {
    // Search filter
    if (searchQuery && !tool.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tool.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filterCategory !== 'all' && tool.category !== filterCategory) {
      return false;
    }
    
    return true;
  });
  
  // Sort tools - pinned ones always come first
  const sortedTools = [...filteredTools].sort((a, b) => {
    // Pinned items always come first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    // Then sort alphabetically
    return a.name.localeCompare(b.name);
  });
  
  const getCategoryLabel = (categoryOption: FilterOption) => {
    if (categoryOption === 'all') {
      return 'All Categories';
    }
    return categoryOption;
  };

  // Toggle pin status
  const togglePinTool = (id: string) => {
    if (!user) return;
    
    const updatedTools = toolsList.map(tool => 
      tool.id === id ? {...tool, pinned: !tool.pinned} : tool
    );
    
    setToolsList(updatedTools);
    localStorage.setItem('cryptoTools', JSON.stringify(updatedTools));
    toast.success('Tool pin status updated!');
  };

  // Open edit dialog and set current tool
  const handleEditTool = (tool: Tool) => {
    setCurrentTool(tool);
    setFormData({
      name: tool.name,
      category: tool.category,
      description: tool.description,
      logo: tool.logo,
      url: tool.url
    });
    setIsEditDialogOpen(true);
  };

  // Delete a tool
  const handleDeleteTool = (id: string) => {
    if (!user) return;
    
    const updatedTools = toolsList.filter(tool => tool.id !== id);
    setToolsList(updatedTools);
    localStorage.setItem('cryptoTools', JSON.stringify(updatedTools));
    toast.success('Tool deleted successfully!');
  };

  // Add a new tool
  const handleAddTool = () => {
    if (!formData.name || !formData.category || !formData.url) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newTool: Tool = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      logo: formData.logo || 'https://cryptologos.cc/logos/question-mark.svg',
      url: formData.url,
      pinned: false,
      userId: user?.id
    };
    
    const updatedTools = [...toolsList, newTool];
    setToolsList(updatedTools);
    localStorage.setItem('cryptoTools', JSON.stringify(updatedTools));
    
    // Reset form and close dialog
    setFormData({
      name: '',
      category: '',
      description: '',
      logo: '',
      url: ''
    });
    setIsAddDialogOpen(false);
    toast.success('Tool added successfully!');
  };

  // Update an existing tool
  const handleUpdateTool = () => {
    if (!currentTool) return;
    
    if (!formData.name || !formData.category || !formData.url) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const updatedTool = {
      ...currentTool,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      logo: formData.logo,
      url: formData.url
    };
    
    const updatedTools = toolsList.map(tool => 
      tool.id === currentTool.id ? updatedTool : tool
    );
    
    setToolsList(updatedTools);
    localStorage.setItem('cryptoTools', JSON.stringify(updatedTools));
    
    // Reset form and close dialog
    setFormData({
      name: '',
      category: '',
      description: '',
      logo: '',
      url: ''
    });
    setIsEditDialogOpen(false);
    toast.success('Tool updated successfully!');
  };

  // Add a new category
  const handleAddCategory = () => {
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
    localStorage.setItem('toolCategories', JSON.stringify(updatedCategories));
    setNewCategory('');
    setIsNewCategoryDialogOpen(false);
    toast.success('New category added!');
  };

  return (
    <div className="min-h-screen bg-crypto-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 md:pt-32 md:pb-16">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-fadeIn">
            <div className="p-3 bg-crypto-gray/60 rounded-full mb-4">
              <Wrench className="h-12 w-12 text-crypto-green" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-white">Crypto </span>
              <span className="text-crypto-green">Tools</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Essential tools for cryptocurrency traders, developers, and enthusiasts
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
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
              />
            </div>
            
            <div className="flex flex-wrap md:flex-nowrap gap-3">
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
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category} 
                      onClick={() => setFilterCategory(category as FilterOption)} 
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
                    Add Tool
                  </Button>
                </>
              )}
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
            <h2 className="text-2xl font-bold">{sortedTools.length} Tools Found</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedTools.map((tool) => (
              <div key={tool.id} className="glass-card rounded-xl overflow-hidden hover-effect">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <img 
                      src={tool.logo} 
                      alt={tool.name} 
                      className="w-12 h-12 rounded-lg object-contain bg-white p-1"
                    />
                    {tool.pinned && user && (
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        Pinned
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-1">{tool.name}</h3>
                  <Badge className="bg-crypto-lightGray/50 text-xs mb-3">
                    {tool.category}
                  </Badge>
                  
                  <p className="text-sm text-gray-300 mb-4">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {user && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className={`text-xs ${tool.pinned ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'border-crypto-lightGray/30'}`}
                          onClick={() => togglePinTool(tool.id)}
                        >
                          <Pin className="h-3 w-3 mr-1" />
                          {tool.pinned ? 'Unpin' : 'Pin'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-crypto-lightGray/30"
                          onClick={() => handleEditTool(tool)}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-crypto-lightGray/30 hover:bg-red-900/20 hover:text-red-400"
                          onClick={() => handleDeleteTool(tool.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                    
                    <a 
                      href={tool.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center px-3 py-1 rounded-md bg-crypto-green/10 text-crypto-green border border-crypto-green/30 hover:bg-crypto-green/20 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open Tool
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {sortedTools.length === 0 && (
            <div className="glass-panel rounded-xl p-10 text-center animate-fadeIn">
              <div className="flex flex-col items-center">
                <Wrench className="h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Tools Found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any tools matching your search criteria.
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
      
      {/* Add Tool Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px] bg-crypto-gray border-crypto-lightGray/30">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Tool</DialogTitle>
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
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger className="bg-crypto-black border-crypto-lightGray/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-crypto-black border-crypto-lightGray/30">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <label htmlFor="url" className="text-sm font-medium">Tool URL</label>
              <Input 
                id="url" 
                value={formData.url} 
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-crypto-lightGray/30">
              Cancel
            </Button>
            <Button 
              onClick={handleAddTool} 
              className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
            >
              Add Tool
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Tool Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px] bg-crypto-gray border-crypto-lightGray/30">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Tool</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
              <Input 
                id="edit-name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-category" className="text-sm font-medium">Category</label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger className="bg-crypto-black border-crypto-lightGray/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-crypto-black border-crypto-lightGray/30">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <label htmlFor="edit-url" className="text-sm font-medium">Tool URL</label>
              <Input 
                id="edit-url" 
                value={formData.url} 
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                className="bg-crypto-black border-crypto-lightGray/30"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-crypto-lightGray/30">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateTool} 
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

export default Tools;
