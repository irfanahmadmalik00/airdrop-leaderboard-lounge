
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus,
  Edit,
  Trash,
  Save,
  X,
  AlertTriangle,
  Calendar,
  Globe,
  Twitter,
  ExternalLink,
  User
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { airdrops, Airdrop } from '@/lib/data';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userAirdrops, setUserAirdrops] = useState<Airdrop[]>([]);
  
  // New airdrop form
  const [newAirdrop, setNewAirdrop] = useState<Partial<Airdrop>>({
    name: '',
    tokenSymbol: '',
    description: '',
    logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=022',
    fundingAmount: 0,
    category: 'DeFi',
    status: 'upcoming',
    telegramLink: '',
    twitterLink: '',
    website: ''
  });
  
  // Edit states
  const [isAddingAirdrop, setIsAddingAirdrop] = useState(false);
  const [editingAirdropId, setEditingAirdropId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast.error('Please log in to access the dashboard.');
      return;
    }
    
    // Get user's airdrops from localStorage
    const storedAirdrops = localStorage.getItem('userAirdrops');
    const allAirdrops = storedAirdrops ? JSON.parse(storedAirdrops) : {};
    
    // Get this user's airdrops
    const myAirdrops = allAirdrops[user.id] || [];
    setUserAirdrops(myAirdrops);
  }, [user, navigate]);

  // Cancel all edit states
  const cancelAllEdits = () => {
    setIsAddingAirdrop(false);
    setEditingAirdropId(null);
    setShowDeleteConfirm(null);
    
    // Reset form
    setNewAirdrop({
      name: '',
      tokenSymbol: '',
      description: '',
      logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=022',
      fundingAmount: 0,
      category: 'DeFi',
      status: 'upcoming',
      telegramLink: '',
      twitterLink: '',
      website: ''
    });
  };

  // Add new airdrop
  const handleAddAirdrop = () => {
    if (!user) {
      toast.error('Please log in to submit airdrops');
      return;
    }

    // Validate required fields
    if (!newAirdrop.name || !newAirdrop.tokenSymbol || !newAirdrop.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newAirdropEntry: Airdrop = {
      id: `user-${user.id}-${Date.now()}`,
      name: newAirdrop.name || 'Untitled Airdrop',
      tokenSymbol: newAirdrop.tokenSymbol || 'TOKEN',
      logo: newAirdrop.logo || 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=022',
      description: newAirdrop.description || 'No description provided',
      fundingAmount: newAirdrop.fundingAmount || 1000000,
      listingDate: new Date().toISOString().split('T')[0],
      telegramLink: newAirdrop.telegramLink || 'https://t.me/example',
      twitterLink: newAirdrop.twitterLink || 'https://twitter.com/example',
      website: newAirdrop.website || 'https://example.com',
      category: newAirdrop.category || 'DeFi',
      requirements: ['Complete registration', 'Connect wallet'],
      estimatedValue: '$100-$1,000',
      status: newAirdrop.status || 'upcoming',
      popularity: 50,
      submittedBy: user.id
    };
    
    // Save to user's airdrops
    const updatedAirdrops = [...userAirdrops, newAirdropEntry];
    setUserAirdrops(updatedAirdrops);
    
    // Save to localStorage
    const storedAirdrops = localStorage.getItem('userAirdrops');
    const allAirdrops = storedAirdrops ? JSON.parse(storedAirdrops) : {};
    allAirdrops[user.id] = updatedAirdrops;
    localStorage.setItem('userAirdrops', JSON.stringify(allAirdrops));
    
    // Add to global airdrops for display in main airdrops list
    const globalAirdrops = [...airdrops];
    globalAirdrops.push(newAirdropEntry);
    localStorage.setItem('globalAirdrops', JSON.stringify(globalAirdrops));
    
    toast.success('Airdrop submitted successfully!');
    setIsAddingAirdrop(false);
    
    // Reset form
    setNewAirdrop({
      name: '',
      tokenSymbol: '',
      description: '',
      logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=022',
      fundingAmount: 0,
      category: 'DeFi',
      status: 'upcoming',
      telegramLink: '',
      twitterLink: '',
      website: ''
    });
  };
  
  // Update airdrop
  const handleUpdateAirdrop = (id: string) => {
    if (!user) {
      toast.error('Please log in to update airdrops');
      return;
    }
    
    // Validate required fields
    if (!newAirdrop.name || !newAirdrop.tokenSymbol || !newAirdrop.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const updatedAirdrops = userAirdrops.map(airdrop => {
      if (airdrop.id === id) {
        return {
          ...airdrop,
          name: newAirdrop.name || airdrop.name,
          tokenSymbol: newAirdrop.tokenSymbol || airdrop.tokenSymbol,
          logo: newAirdrop.logo || airdrop.logo,
          description: newAirdrop.description || airdrop.description,
          fundingAmount: newAirdrop.fundingAmount || airdrop.fundingAmount,
          category: newAirdrop.category || airdrop.category,
          status: newAirdrop.status || airdrop.status,
          telegramLink: newAirdrop.telegramLink || airdrop.telegramLink,
          twitterLink: newAirdrop.twitterLink || airdrop.twitterLink,
          website: newAirdrop.website || airdrop.website
        };
      }
      return airdrop;
    });
    
    setUserAirdrops(updatedAirdrops);
    
    // Save to localStorage
    const storedAirdrops = localStorage.getItem('userAirdrops');
    const allAirdrops = storedAirdrops ? JSON.parse(storedAirdrops) : {};
    allAirdrops[user.id] = updatedAirdrops;
    localStorage.setItem('userAirdrops', JSON.stringify(allAirdrops));
    
    // Update global airdrops
    const storedGlobalAirdrops = localStorage.getItem('globalAirdrops');
    if (storedGlobalAirdrops) {
      const globalAirdrops = JSON.parse(storedGlobalAirdrops);
      const updatedGlobalAirdrops = globalAirdrops.map((airdrop: Airdrop) => {
        if (airdrop.id === id) {
          return {
            ...airdrop,
            name: newAirdrop.name || airdrop.name,
            tokenSymbol: newAirdrop.tokenSymbol || airdrop.tokenSymbol,
            logo: newAirdrop.logo || airdrop.logo,
            description: newAirdrop.description || airdrop.description,
            fundingAmount: newAirdrop.fundingAmount || airdrop.fundingAmount,
            category: newAirdrop.category || airdrop.category,
            status: newAirdrop.status || airdrop.status,
            telegramLink: newAirdrop.telegramLink || airdrop.telegramLink,
            twitterLink: newAirdrop.twitterLink || airdrop.twitterLink,
            website: newAirdrop.website || airdrop.website
          };
        }
        return airdrop;
      });
      localStorage.setItem('globalAirdrops', JSON.stringify(updatedGlobalAirdrops));
    }
    
    toast.success('Airdrop updated successfully!');
    setEditingAirdropId(null);
    
    // Reset form
    setNewAirdrop({
      name: '',
      tokenSymbol: '',
      description: '',
      logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=022',
      fundingAmount: 0,
      category: 'DeFi',
      status: 'upcoming',
      telegramLink: '',
      twitterLink: '',
      website: ''
    });
  };
  
  // Delete airdrop
  const handleDeleteAirdrop = (id: string) => {
    if (!user) {
      toast.error('Please log in to delete airdrops');
      return;
    }
    
    const updatedAirdrops = userAirdrops.filter(airdrop => airdrop.id !== id);
    setUserAirdrops(updatedAirdrops);
    
    // Save to localStorage
    const storedAirdrops = localStorage.getItem('userAirdrops');
    const allAirdrops = storedAirdrops ? JSON.parse(storedAirdrops) : {};
    allAirdrops[user.id] = updatedAirdrops;
    localStorage.setItem('userAirdrops', JSON.stringify(allAirdrops));
    
    // Update global airdrops
    const storedGlobalAirdrops = localStorage.getItem('globalAirdrops');
    if (storedGlobalAirdrops) {
      const globalAirdrops = JSON.parse(storedGlobalAirdrops);
      const updatedGlobalAirdrops = globalAirdrops.filter((airdrop: Airdrop) => airdrop.id !== id);
      localStorage.setItem('globalAirdrops', JSON.stringify(updatedGlobalAirdrops));
    }
    
    toast.success('Airdrop deleted successfully!');
    setShowDeleteConfirm(null);
  };
  
  // Editing an airdrop
  const startEditingAirdrop = (airdrop: Airdrop) => {
    setEditingAirdropId(airdrop.id);
    setNewAirdrop({
      name: airdrop.name,
      tokenSymbol: airdrop.tokenSymbol,
      description: airdrop.description,
      logo: airdrop.logo,
      fundingAmount: airdrop.fundingAmount,
      category: airdrop.category,
      status: airdrop.status,
      telegramLink: airdrop.telegramLink,
      twitterLink: airdrop.twitterLink,
      website: airdrop.website
    });
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Status badge color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'active':
        return 'bg-crypto-green text-crypto-black';
      case 'ended':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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
              <User className="h-12 w-12 text-crypto-green" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-white">My </span>
              <span className="text-crypto-green">Dashboard</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Manage your submitted airdrops and see their status
            </p>
          </div>
        </div>
      </section>
      
      {/* Dashboard Section */}
      <section className="py-6 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">My Submitted Airdrops</h2>
            <Button
              onClick={() => {
                setIsAddingAirdrop(true);
                cancelAllEdits();
              }}
              className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit New Airdrop
            </Button>
          </div>
          
          {/* Add Airdrop Form */}
          {isAddingAirdrop && (
            <div className="glass-panel rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Submit New Airdrop</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Airdrop Name *</label>
                  <Input
                    type="text"
                    placeholder="Airdrop Name"
                    value={newAirdrop.name || ''}
                    onChange={(e) => setNewAirdrop({ ...newAirdrop, name: e.target.value })}
                    className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Token Symbol *</label>
                  <Input
                    type="text"
                    placeholder="Token Symbol"
                    value={newAirdrop.tokenSymbol || ''}
                    onChange={(e) => setNewAirdrop({ ...newAirdrop, tokenSymbol: e.target.value })}
                    className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Logo URL</label>
                  <Input
                    type="text"
                    placeholder="Logo URL"
                    value={newAirdrop.logo || ''}
                    onChange={(e) => setNewAirdrop({ ...newAirdrop, logo: e.target.value })}
                    className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Funding Amount ($)</label>
                  <Input
                    type="number"
                    placeholder="Funding Amount"
                    value={newAirdrop.fundingAmount || 0}
                    onChange={(e) => setNewAirdrop({ ...newAirdrop, fundingAmount: Number(e.target.value) })}
                    className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Category</label>
                  <select
                    value={newAirdrop.category || 'DeFi'}
                    onChange={(e) => setNewAirdrop({ ...newAirdrop, category: e.target.value as 'DeFi' | 'Layer 1' | 'Layer 2' | 'ZK Rollup' | 'Modular Blockchain' | 'Smart Contract Platform' })}
                    className="w-full rounded-md border border-crypto-lightGray/30 bg-crypto-gray text-gray-300 focus:border-crypto-green focus:ring-crypto-green/20 h-10 px-3"
                  >
                    <option value="DeFi">DeFi</option>
                    <option value="Layer 1">Layer 1</option>
                    <option value="Layer 2">Layer 2</option>
                    <option value="ZK Rollup">ZK Rollup</option>
                    <option value="Modular Blockchain">Modular Blockchain</option>
                    <option value="Smart Contract Platform">Smart Contract Platform</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Status</label>
                  <select
                    value={newAirdrop.status || 'upcoming'}
                    onChange={(e) => setNewAirdrop({ ...newAirdrop, status: e.target.value as 'upcoming' | 'active' | 'ended' })}
                    className="w-full rounded-md border border-crypto-lightGray/30 bg-crypto-gray text-gray-300 focus:border-crypto-green focus:ring-crypto-green/20 h-10 px-3"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Website URL</label>
                  <Input
                    type="text"
                    placeholder="Website URL"
                    value={newAirdrop.website || ''}
                    onChange={(e) => setNewAirdrop({ ...newAirdrop, website: e.target.value })}
                    className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Twitter URL</label>
                  <Input
                    type="text"
                    placeholder="Twitter URL"
                    value={newAirdrop.twitterLink || ''}
                    onChange={(e) => setNewAirdrop({ ...newAirdrop, twitterLink: e.target.value })}
                    className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Telegram URL</label>
                  <Input
                    type="text"
                    placeholder="Telegram URL"
                    value={newAirdrop.telegramLink || ''}
                    onChange={(e) => setNewAirdrop({ ...newAirdrop, telegramLink: e.target.value })}
                    className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400 mb-1 block">Description *</label>
                  <Textarea
                    placeholder="Airdrop Description"
                    value={newAirdrop.description || ''}
                    onChange={(e) => setNewAirdrop({ ...newAirdrop, description: e.target.value })}
                    className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button 
                  variant="ghost" 
                  onClick={cancelAllEdits}
                  className="text-gray-300 hover:bg-crypto-lightGray"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddAirdrop}
                  className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Submit Airdrop
                </Button>
              </div>
            </div>
          )}
          
          {/* Airdrops List */}
          {userAirdrops.length === 0 ? (
            <div className="glass-panel rounded-xl p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-crypto-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Airdrops Found</h3>
              <p className="text-gray-400 mb-6">You haven't submitted any airdrops yet. Start by adding your first airdrop.</p>
              <Button
                onClick={() => {
                  setIsAddingAirdrop(true);
                  cancelAllEdits();
                }}
                className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit New Airdrop
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userAirdrops.map((airdrop) => (
                <div key={airdrop.id} className="glass-panel rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={airdrop.logo} 
                        alt={airdrop.name} 
                        className="w-10 h-10 rounded-full object-cover bg-white p-1"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{airdrop.name}</h3>
                        <p className="text-sm text-gray-400">{airdrop.tokenSymbol}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(airdrop.status)} capitalize`}>
                      {airdrop.status}
                    </Badge>
                  </div>
                  
                  {editingAirdropId === airdrop.id ? (
                    <>
                      <div className="grid grid-cols-1 gap-3 mb-4">
                        <Input
                          type="text"
                          placeholder="Airdrop Name"
                          value={newAirdrop.name || ''}
                          onChange={(e) => setNewAirdrop({ ...newAirdrop, name: e.target.value })}
                          className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                        />
                        <Input
                          type="text"
                          placeholder="Token Symbol"
                          value={newAirdrop.tokenSymbol || ''}
                          onChange={(e) => setNewAirdrop({ ...newAirdrop, tokenSymbol: e.target.value })}
                          className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                        />
                        <Input
                          type="text"
                          placeholder="Logo URL"
                          value={newAirdrop.logo || ''}
                          onChange={(e) => setNewAirdrop({ ...newAirdrop, logo: e.target.value })}
                          className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                        />
                        <Input
                          type="number"
                          placeholder="Funding Amount"
                          value={newAirdrop.fundingAmount || 0}
                          onChange={(e) => setNewAirdrop({ ...newAirdrop, fundingAmount: Number(e.target.value) })}
                          className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                        />
                        <select
                          value={newAirdrop.category || 'DeFi'}
                          onChange={(e) => setNewAirdrop({ ...newAirdrop, category: e.target.value as 'DeFi' | 'Layer 1' | 'Layer 2' | 'ZK Rollup' | 'Modular Blockchain' | 'Smart Contract Platform' })}
                          className="w-full rounded-md border border-crypto-lightGray/30 bg-crypto-gray text-gray-300 focus:border-crypto-green focus:ring-crypto-green/20 h-10 px-3"
                        >
                          <option value="DeFi">DeFi</option>
                          <option value="Layer 1">Layer 1</option>
                          <option value="Layer 2">Layer 2</option>
                          <option value="ZK Rollup">ZK Rollup</option>
                          <option value="Modular Blockchain">Modular Blockchain</option>
                          <option value="Smart Contract Platform">Smart Contract Platform</option>
                        </select>
                        <select
                          value={newAirdrop.status || 'upcoming'}
                          onChange={(e) => setNewAirdrop({ ...newAirdrop, status: e.target.value as 'upcoming' | 'active' | 'ended' })}
                          className="w-full rounded-md border border-crypto-lightGray/30 bg-crypto-gray text-gray-300 focus:border-crypto-green focus:ring-crypto-green/20 h-10 px-3"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="active">Active</option>
                          <option value="ended">Ended</option>
                        </select>
                        <Textarea
                          placeholder="Airdrop Description"
                          value={newAirdrop.description || ''}
                          onChange={(e) => setNewAirdrop({ ...newAirdrop, description: e.target.value })}
                          className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          onClick={cancelAllEdits}
                          className="text-gray-300 hover:bg-crypto-lightGray"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleUpdateAirdrop(airdrop.id)}
                          className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Update
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                        {airdrop.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-crypto-lightGray/30 rounded-lg p-3">
                          <p className="text-xs text-gray-400 mb-1">Funding</p>
                          <p className="font-medium text-crypto-green">${airdrop.fundingAmount.toLocaleString()}</p>
                        </div>
                        <div className="bg-crypto-lightGray/30 rounded-lg p-3">
                          <p className="text-xs text-gray-400 mb-1">Listed</p>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-crypto-green" />
                            <p className="font-medium text-sm">{formatDate(airdrop.listingDate)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => startEditingAirdrop(airdrop)}
                            disabled={editingAirdropId !== null}
                            className="text-gray-300 hover:text-crypto-green"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setShowDeleteConfirm(airdrop.id)}
                            disabled={showDeleteConfirm !== null}
                            className="text-gray-300 hover:text-red-500"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Badge className="bg-crypto-lightGray/50">{airdrop.category}</Badge>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
          <DialogContent className="bg-crypto-gray border-crypto-lightGray/30">
            <DialogHeader>
              <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete this airdrop? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowDeleteConfirm(null)}
                className="text-gray-300 hover:bg-crypto-lightGray"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteAirdrop(showDeleteConfirm)}
                className="bg-red-500 hover:bg-red-600"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserDashboard;
