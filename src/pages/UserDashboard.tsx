
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { PlusCircle, Pencil, Trash2, Pin, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define the Airdrop interface to match your data structure
interface Airdrop {
  id: string;
  name: string;
  description: string;
  category: string;
  link: string;
  fundingAmount: number;
  rewards: string;
  timeCommitment: string;
  workRequired: string;
  status: 'active' | 'upcoming' | 'ended';
  completed: boolean;
  pinned: boolean;
  userId: string; // ID of the user who added this airdrop
}

// Mock data for user's airdrops
const mockUserAirdrops: Airdrop[] = [
  {
    id: 'ua1',
    name: 'My Ethereum 2.0 Airdrop',
    description: 'Early contributor airdrop for Ethereum 2.0 stakers',
    category: 'Layer 1 & Testnet Mainnet',
    link: 'https://ethereum.org',
    fundingAmount: 25000000,
    rewards: 'Approximately 50-500 ETH tokens',
    timeCommitment: '2-3 hours',
    workRequired: 'Stake ETH in the beacon chain',
    status: 'active',
    completed: false,
    pinned: true,
    userId: '1'
  },
  {
    id: 'ua2',
    name: 'Polygon zkEVM Testnet',
    description: 'Participate in the Polygon zkEVM testnet for potential airdrop',
    category: 'Layer 1 & Testnet Mainnet',
    link: 'https://polygon.technology',
    fundingAmount: 10000000,
    rewards: 'Estimated 100-1000 MATIC tokens',
    timeCommitment: '1-2 hours',
    workRequired: 'Complete 5 transactions on the testnet',
    status: 'upcoming',
    completed: false,
    pinned: false,
    userId: '1'
  }
];

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

const UserDashboard = () => {
  const { user } = useAuth();
  const [userAirdrops, setUserAirdrops] = useState<Airdrop[]>(mockUserAirdrops);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAirdrop, setCurrentAirdrop] = useState<Airdrop | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [newCategory, setNewCategory] = useState('');
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  
  // Form state for new/edit airdrop
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    link: '',
    fundingAmount: 0,
    rewards: '',
    timeCommitment: '',
    workRequired: '',
    status: 'upcoming' as 'active' | 'upcoming' | 'ended'
  });

  // Initialize form data when editing an airdrop
  useEffect(() => {
    if (currentAirdrop) {
      setFormData({
        name: currentAirdrop.name,
        description: currentAirdrop.description,
        category: currentAirdrop.category,
        link: currentAirdrop.link,
        fundingAmount: currentAirdrop.fundingAmount,
        rewards: currentAirdrop.rewards,
        timeCommitment: currentAirdrop.timeCommitment,
        workRequired: currentAirdrop.workRequired,
        status: currentAirdrop.status
      });
    }
  }, [currentAirdrop]);

  // Handle adding a new airdrop
  const handleAddAirdrop = () => {
    const newAirdrop: Airdrop = {
      id: Math.random().toString(36).substring(2, 9),
      ...formData,
      completed: false,
      pinned: false,
      userId: user?.id || ''
    };
    
    setUserAirdrops([...userAirdrops, newAirdrop]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Airdrop added successfully!');
  };

  // Handle updating an airdrop
  const handleUpdateAirdrop = () => {
    if (!currentAirdrop) return;
    
    const updatedAirdrops = userAirdrops.map(airdrop => 
      airdrop.id === currentAirdrop.id 
        ? { ...airdrop, ...formData } 
        : airdrop
    );
    
    setUserAirdrops(updatedAirdrops);
    setIsEditDialogOpen(false);
    resetForm();
    toast.success('Airdrop updated successfully!');
  };

  // Handle deleting an airdrop
  const handleDeleteAirdrop = (id: string) => {
    const updatedAirdrops = userAirdrops.filter(airdrop => airdrop.id !== id);
    setUserAirdrops(updatedAirdrops);
    toast.success('Airdrop deleted successfully!');
  };

  // Toggle completion status
  const toggleCompletion = (id: string) => {
    const updatedAirdrops = userAirdrops.map(airdrop => 
      airdrop.id === id 
        ? { ...airdrop, completed: !airdrop.completed } 
        : airdrop
    );
    
    setUserAirdrops(updatedAirdrops);
    toast.success('Airdrop status updated!');
  };

  // Toggle pin status
  const togglePin = (id: string) => {
    const updatedAirdrops = userAirdrops.map(airdrop => 
      airdrop.id === id 
        ? { ...airdrop, pinned: !airdrop.pinned } 
        : airdrop
    );
    
    setUserAirdrops(updatedAirdrops);
    toast.success(updatedAirdrops.find(a => a.id === id)?.pinned ? 'Airdrop pinned!' : 'Airdrop unpinned!');
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      link: '',
      fundingAmount: 0,
      rewards: '',
      timeCommitment: '',
      workRequired: '',
      status: 'upcoming'
    });
    setCurrentAirdrop(null);
  };

  // Add new category
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    // In a real app, you would save this to your backend
    toast.success(`New category "${newCategory}" added!`);
    setIsNewCategoryDialogOpen(false);
    setFormData({...formData, category: newCategory});
    setNewCategory('');
  };

  // Filter airdrops based on active tab
  const filteredAirdrops = userAirdrops.filter(airdrop => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return airdrop.completed;
    if (activeTab === 'pinned') return airdrop.pinned;
    if (activeTab === 'active') return airdrop.status === 'active';
    if (activeTab === 'upcoming') return airdrop.status === 'upcoming';
    if (activeTab === 'ended') return airdrop.status === 'ended';
    return true;
  })
  // Sort - pinned first, then by name
  .sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen bg-crypto-black">
      <Navbar />
      
      <div className="container mx-auto pt-24 pb-10 px-4">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* User Profile Section */}
          <div className="w-full lg:w-1/4 glass-card rounded-xl p-6 mb-6 lg:mb-0">
            <div className="flex flex-col items-center">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user?.username || 'User'} 
                  className="w-24 h-24 rounded-full border-4 border-crypto-green mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-crypto-gray flex items-center justify-center mb-4 text-2xl font-bold text-white border-4 border-crypto-green">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              
              <h2 className="text-xl font-bold mb-1">
                {user?.username || 'User'}
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                {user?.email || 'user@example.com'}
              </p>
              
              <div className="w-full border-t border-crypto-lightGray/20 pt-4 mt-2">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Airdrops</span>
                  <span className="font-semibold">{userAirdrops.length}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Completed</span>
                  <span className="font-semibold">{userAirdrops.filter(a => a.completed).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pinned</span>
                  <span className="font-semibold">{userAirdrops.filter(a => a.pinned).length}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Section */}
          <div className="w-full lg:w-3/4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-3xl font-bold mb-4 md:mb-0">My Airdrop Dashboard</h1>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Airdrop
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px] bg-crypto-gray border-crypto-lightGray/30">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Add New Airdrop</DialogTitle>
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
                      <div className="flex gap-2">
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData({...formData, category: value})}
                        >
                          <SelectTrigger className="bg-crypto-black border-crypto-lightGray/30 w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-crypto-black border-crypto-lightGray/30">
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
                              <Button onClick={handleAddCategory} className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                                Add Category
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="link" className="text-sm font-medium">Link</label>
                      <Input 
                        id="link" 
                        value={formData.link} 
                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                        className="bg-crypto-black border-crypto-lightGray/30"
                      />
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
                      <label htmlFor="rewards" className="text-sm font-medium">Rewards</label>
                      <Input 
                        id="rewards" 
                        value={formData.rewards} 
                        onChange={(e) => setFormData({...formData, rewards: e.target.value})}
                        className="bg-crypto-black border-crypto-lightGray/30"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="timeCommitment" className="text-sm font-medium">Time Commitment</label>
                      <Input 
                        id="timeCommitment" 
                        value={formData.timeCommitment} 
                        onChange={(e) => setFormData({...formData, timeCommitment: e.target.value})}
                        className="bg-crypto-black border-crypto-lightGray/30"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="workRequired" className="text-sm font-medium">Work Required</label>
                      <Input 
                        id="workRequired" 
                        value={formData.workRequired} 
                        onChange={(e) => setFormData({...formData, workRequired: e.target.value})}
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
                    <Button onClick={handleAddAirdrop} className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                      Add Airdrop
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Tabs for filtering */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="bg-crypto-gray">
                <TabsTrigger value="all" className="data-[state=active]:bg-crypto-green data-[state=active]:text-crypto-black">
                  All
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-crypto-green data-[state=active]:text-crypto-black">
                  Active
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-crypto-green data-[state=active]:text-crypto-black">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-crypto-green data-[state=active]:text-crypto-black">
                  Completed
                </TabsTrigger>
                <TabsTrigger value="pinned" className="data-[state=active]:bg-crypto-green data-[state=active]:text-crypto-black">
                  Pinned
                </TabsTrigger>
              </TabsList>
              
              {/* Tab content */}
              <TabsContent value={activeTab} className="mt-6">
                {filteredAirdrops.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAirdrops.map((airdrop) => (
                      <Card key={airdrop.id} className={`bg-crypto-gray border-crypto-lightGray/30 hover:border-crypto-green/50 transition-all ${airdrop.pinned ? 'border-l-4 border-l-yellow-500' : ''}`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl flex items-center">
                                {airdrop.name}
                                {airdrop.completed && (
                                  <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                                )}
                              </CardTitle>
                              <CardDescription className="text-gray-400 mt-1">
                                {airdrop.category}
                              </CardDescription>
                            </div>
                            <Badge className={`${getStatusColor(airdrop.status)}`}>
                              {airdrop.status.charAt(0).toUpperCase() + airdrop.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm text-gray-300 mb-3">
                            {airdrop.description}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-gray-400">Funding</p>
                              <p className="font-medium">${airdrop.fundingAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Time Required</p>
                              <p className="font-medium">{airdrop.timeCommitment}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Rewards</p>
                              <p className="font-medium">{airdrop.rewards}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Work Required</p>
                              <p className="font-medium">{airdrop.workRequired}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 flex justify-between">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs border-crypto-lightGray/30 h-8"
                              onClick={() => {
                                setCurrentAirdrop(airdrop);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-3 w-3 mr-1" />
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
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className={`text-xs h-8 ${airdrop.completed ? 'text-green-500' : 'text-gray-400'}`}
                              onClick={() => toggleCompletion(airdrop.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {airdrop.completed ? 'Completed' : 'Complete'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className={`text-xs h-8 ${airdrop.pinned ? 'text-yellow-500' : 'text-gray-400'}`}
                              onClick={() => togglePin(airdrop.id)}
                            >
                              <Pin className="h-3 w-3 mr-1" />
                              {airdrop.pinned ? 'Pinned' : 'Pin'}
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel rounded-xl p-10 text-center">
                    <h3 className="text-xl font-semibold mb-2">No Airdrops Found</h3>
                    <p className="text-gray-400 mb-6">
                      {activeTab === 'all' 
                        ? "You haven't added any airdrops yet." 
                        : `You don't have any ${activeTab} airdrops.`}
                    </p>
                    <Button 
                      onClick={() => setIsAddDialogOpen(true)}
                      className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Airdrop
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {/* Edit Airdrop Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[550px] bg-crypto-gray border-crypto-lightGray/30">
                <DialogHeader>
                  <DialogTitle className="text-xl">Edit Airdrop</DialogTitle>
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
                    <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                    <Textarea 
                      id="edit-description" 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="bg-crypto-black border-crypto-lightGray/30 min-h-[100px]"
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
                            <Button onClick={handleAddCategory} className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                              Add Category
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  {/* Repeat other form fields */}
                  <div className="grid gap-2">
                    <label htmlFor="edit-link" className="text-sm font-medium">Link</label>
                    <Input 
                      id="edit-link" 
                      value={formData.link} 
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                      className="bg-crypto-black border-crypto-lightGray/30"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="edit-fundingAmount" className="text-sm font-medium">Funding Amount ($)</label>
                    <Input 
                      id="edit-fundingAmount" 
                      type="number"
                      value={formData.fundingAmount.toString()} 
                      onChange={(e) => setFormData({...formData, fundingAmount: parseInt(e.target.value) || 0})}
                      className="bg-crypto-black border-crypto-lightGray/30"
                    />
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
                    <label htmlFor="edit-status" className="text-sm font-medium">Status</label>
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
                  <Button variant="outline" onClick={() => {
                    setIsEditDialogOpen(false);
                    resetForm();
                  }} className="border-crypto-lightGray/30">
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateAirdrop} className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
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

export default UserDashboard;
