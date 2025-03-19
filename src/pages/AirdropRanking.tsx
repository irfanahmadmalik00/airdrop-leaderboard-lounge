
import { useState, useEffect } from 'react';
import { Search, Filter, Award, ChevronDown, Edit, Trash, Plus, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { airdrops, Airdrop } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';

interface RankedAirdrop extends Airdrop {
  rank: number;
  ratingScore: number;
  potentialValue: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const AirdropRanking = () => {
  const { user, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [rankedAirdrops, setRankedAirdrops] = useState<RankedAirdrop[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<Partial<RankedAirdrop>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Load ranked airdrops from localStorage or initialize from airdrops data
  useEffect(() => {
    const storedRankings = localStorage.getItem('airdropRankings');
    
    if (storedRankings) {
      setRankedAirdrops(JSON.parse(storedRankings));
    } else {
      // Create initial rankings from airdrops data
      const initialRankings = airdrops.map((airdrop, index) => ({
        ...airdrop,
        rank: index + 1,
        ratingScore: Math.floor(Math.random() * 50) + 50, // 50-100 score
        potentialValue: ['$10-$100', '$100-$1,000', '$1,000-$10,000'][Math.floor(Math.random() * 3)],
        difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as 'Easy' | 'Medium' | 'Hard',
      }));
      
      // Sort by rank
      initialRankings.sort((a, b) => a.rank - b.rank);
      
      setRankedAirdrops(initialRankings);
      localStorage.setItem('airdropRankings', JSON.stringify(initialRankings));
    }
  }, []);
  
  // Save rankings to localStorage whenever they change
  useEffect(() => {
    if (rankedAirdrops.length > 0) {
      localStorage.setItem('airdropRankings', JSON.stringify(rankedAirdrops));
    }
  }, [rankedAirdrops]);
  
  // Filter airdrops
  const filteredAirdrops = rankedAirdrops.filter((airdrop) => {
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
  
  // Get unique categories from airdrops
  const categories = ['all', ...new Set(rankedAirdrops.map(airdrop => airdrop.category))];
  
  // Get category label
  const getCategoryLabel = (category: string) => {
    if (category === 'all') {
      return 'All Categories';
    }
    return category;
  };
  
  // Add new ranked airdrop
  const handleAddRankedAirdrop = () => {
    if (!editingAirdrop.name || !editingAirdrop.tokenSymbol || !editingAirdrop.category) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const newRankedAirdrop: RankedAirdrop = {
      id: `ranked-${Date.now()}`,
      name: editingAirdrop.name || 'Unnamed Airdrop',
      tokenSymbol: editingAirdrop.tokenSymbol || 'TOKEN',
      logo: editingAirdrop.logo || 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022',
      description: editingAirdrop.description || 'No description provided',
      fundingAmount: editingAirdrop.fundingAmount || 1000000,
      listingDate: new Date().toISOString().split('T')[0],
      telegramLink: editingAirdrop.telegramLink || 'https://t.me/example',
      twitterLink: editingAirdrop.twitterLink || 'https://twitter.com/example',
      website: editingAirdrop.website || 'https://example.com',
      category: editingAirdrop.category || 'DeFi',
      requirements: editingAirdrop.requirements || ['Requirement 1', 'Requirement 2'],
      estimatedValue: editingAirdrop.estimatedValue || '$100-$1,000',
      status: editingAirdrop.status || 'upcoming',
      popularity: editingAirdrop.popularity || 50,
      rank: editingAirdrop.rank || rankedAirdrops.length + 1,
      ratingScore: editingAirdrop.ratingScore || 75,
      potentialValue: editingAirdrop.potentialValue || '$100-$1,000',
      difficulty: editingAirdrop.difficulty || 'Medium',
    };
    
    setRankedAirdrops(prev => {
      const updated = [...prev, newRankedAirdrop];
      // Sort by rank
      updated.sort((a, b) => a.rank - b.rank);
      return updated;
    });
    
    toast.success('Airdrop ranking added successfully!');
    setEditingAirdrop({});
    setIsAddDialogOpen(false);
  };
  
  // Update ranked airdrop
  const handleUpdateRankedAirdrop = (id: string) => {
    if (!editingAirdrop.name || !editingAirdrop.tokenSymbol || !editingAirdrop.category) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setRankedAirdrops(prev => {
      const updated = prev.map(airdrop => {
        if (airdrop.id === id) {
          return {
            ...airdrop,
            ...editingAirdrop,
          } as RankedAirdrop;
        }
        return airdrop;
      });
      
      // Sort by rank
      updated.sort((a, b) => a.rank - b.rank);
      return updated;
    });
    
    toast.success('Airdrop ranking updated successfully!');
    setEditingAirdrop({});
    setIsEditing(false);
  };
  
  // Delete ranked airdrop
  const handleDeleteRankedAirdrop = (id: string) => {
    setRankedAirdrops(prev => prev.filter(airdrop => airdrop.id !== id));
    toast.success('Airdrop ranking deleted successfully!');
  };
  
  // Edit ranked airdrop
  const startEditingRankedAirdrop = (airdrop: RankedAirdrop) => {
    setEditingAirdrop(airdrop);
    setIsEditing(true);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingAirdrop({});
    setIsEditing(false);
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
              Discover the top-rated airdrops ranked by potential value, difficulty, and overall score
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
                placeholder="Search airdrops..."
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
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category} 
                      onClick={() => setFilterCategory(category)}
                      className="hover:bg-crypto-lightGray"
                    >
                      {getCategoryLabel(category)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Add Airdrop Ranking Button (Admin Only) */}
              {isAdmin && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Ranking
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-crypto-gray border-crypto-lightGray/30 max-w-xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Add New Airdrop Ranking</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Input
                        placeholder="Airdrop Name"
                        value={editingAirdrop.name || ''}
                        onChange={(e) => setEditingAirdrop({ ...editingAirdrop, name: e.target.value })}
                        className="bg-crypto-black/50 border-crypto-lightGray/30"
                      />
                      <Input
                        placeholder="Token Symbol"
                        value={editingAirdrop.tokenSymbol || ''}
                        onChange={(e) => setEditingAirdrop({ ...editingAirdrop, tokenSymbol: e.target.value })}
                        className="bg-crypto-black/50 border-crypto-lightGray/30"
                      />
                      <Input
                        placeholder="Logo URL"
                        value={editingAirdrop.logo || ''}
                        onChange={(e) => setEditingAirdrop({ ...editingAirdrop, logo: e.target.value })}
                        className="bg-crypto-black/50 border-crypto-lightGray/30"
                      />
                      <Input
                        placeholder="Website"
                        value={editingAirdrop.website || ''}
                        onChange={(e) => setEditingAirdrop({ ...editingAirdrop, website: e.target.value })}
                        className="bg-crypto-black/50 border-crypto-lightGray/30"
                      />
                      <Input
                        type="number"
                        placeholder="Rank (1-100)"
                        value={editingAirdrop.rank || ''}
                        onChange={(e) => setEditingAirdrop({ ...editingAirdrop, rank: Number(e.target.value) })}
                        className="bg-crypto-black/50 border-crypto-lightGray/30"
                        min="1" 
                        max="100"
                      />
                      <Input
                        type="number"
                        placeholder="Rating Score (1-100)"
                        value={editingAirdrop.ratingScore || ''}
                        onChange={(e) => setEditingAirdrop({ ...editingAirdrop, ratingScore: Number(e.target.value) })}
                        className="bg-crypto-black/50 border-crypto-lightGray/30"
                        min="1" 
                        max="100"
                      />
                      <Input
                        placeholder="Potential Value (e.g. $100-$1,000)"
                        value={editingAirdrop.potentialValue || ''}
                        onChange={(e) => setEditingAirdrop({ ...editingAirdrop, potentialValue: e.target.value })}
                        className="bg-crypto-black/50 border-crypto-lightGray/30"
                      />
                      <select
                        value={editingAirdrop.category || ''}
                        onChange={(e) => setEditingAirdrop({ ...editingAirdrop, category: e.target.value })}
                        className="bg-crypto-black/50 border-crypto-lightGray/30 rounded-md p-2 text-white"
                      >
                        <option value="" disabled>Select Category</option>
                        <option value="DeFi">DeFi</option>
                        <option value="Layer 1">Layer 1</option>
                        <option value="Layer 2">Layer 2</option>
                        <option value="ZK Rollup">ZK Rollup</option>
                        <option value="Modular Blockchain">Modular Blockchain</option>
                        <option value="Smart Contract Platform">Smart Contract Platform</option>
                        <option value="Top 10 Projects">Top 10 Projects</option>
                        <option value="Testnet Mainnet">Testnet Mainnet</option>
                        <option value="Telegram Bot Airdrops">Telegram Bot Airdrops</option>
                        <option value="Daily Check-in Airdrops">Daily Check-in Airdrops</option>
                        <option value="Twitter Airdrops">Twitter Airdrops</option>
                        <option value="Social Airdrops">Social Airdrops</option>
                        <option value="AI Airdrops">AI Airdrops</option>
                        <option value="Wallet Airdrops">Wallet Airdrops</option>
                        <option value="Exchange Airdrops">Exchange Airdrops</option>
                      </select>
                      <select
                        value={editingAirdrop.difficulty || ''}
                        onChange={(e) => setEditingAirdrop({ ...editingAirdrop, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                        className="bg-crypto-black/50 border-crypto-lightGray/30 rounded-md p-2 text-white"
                      >
                        <option value="" disabled>Select Difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                      <select
                        value={editingAirdrop.status || ''}
                        onChange={(e) => setEditingAirdrop({ ...editingAirdrop, status: e.target.value as 'upcoming' | 'active' | 'ended' })}
                        className="bg-crypto-black/50 border-crypto-lightGray/30 rounded-md p-2 text-white"
                      >
                        <option value="" disabled>Select Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active</option>
                        <option value="ended">Ended</option>
                      </select>
                      <div className="md:col-span-2">
                        <Textarea
                          placeholder="Description"
                          value={editingAirdrop.description || ''}
                          onChange={(e) => setEditingAirdrop({ ...editingAirdrop, description: e.target.value })}
                          className="bg-crypto-black/50 border-crypto-lightGray/30 min-h-[100px]"
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsAddDialogOpen(false);
                          setEditingAirdrop({});
                        }}
                        className="border-crypto-lightGray/30"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddRankedAirdrop}
                        className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                      >
                        Add Ranking
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
      
      {/* Rankings Table */}
      <section className="py-10 px-4">
        <div className="container mx-auto">
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-crypto-lightGray/20">
                    <th className="px-6 py-4 text-left text-sm font-medium">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Airdrop</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Value</th>
                    <th className="px-6 py-4 text-left text-sm font-medium">Difficulty</th>
                    {isAdmin && <th className="px-6 py-4 text-right text-sm font-medium">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredAirdrops.map((airdrop) => (
                    <tr 
                      key={airdrop.id} 
                      className="border-b border-crypto-lightGray/10 hover:bg-crypto-gray/10 transition-colors"
                    >
                      {/* Rank */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-crypto-gray/60">
                          <span className="text-sm font-bold">{airdrop.rank}</span>
                        </div>
                      </td>
                      
                      {/* Airdrop */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            src={airdrop.logo} 
                            alt={airdrop.name} 
                            className="w-8 h-8 rounded-full mr-3 border border-crypto-lightGray/20"
                          />
                          <div>
                            <div className="font-medium">{airdrop.name}</div>
                            <div className="text-sm text-gray-400">{airdrop.tokenSymbol}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Category */}
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="font-normal">
                          {airdrop.category}
                        </Badge>
                      </td>
                      
                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge 
                          className={`font-normal ${
                            airdrop.status === 'active' 
                              ? 'bg-green-500/20 text-green-500 border-green-500/30'
                              : airdrop.status === 'upcoming'
                                ? 'bg-blue-500/20 text-blue-500 border-blue-500/30'
                                : 'bg-gray-500/20 text-gray-500 border-gray-500/30'
                          }`}
                        >
                          {airdrop.status.charAt(0).toUpperCase() + airdrop.status.slice(1)}
                        </Badge>
                      </td>
                      
                      {/* Rating */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-crypto-gray/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-crypto-green"
                              style={{ width: `${airdrop.ratingScore}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm">{airdrop.ratingScore}/100</span>
                        </div>
                      </td>
                      
                      {/* Value */}
                      <td className="px-6 py-4">
                        <span className="text-crypto-green">{airdrop.potentialValue}</span>
                      </td>
                      
                      {/* Difficulty */}
                      <td className="px-6 py-4">
                        <Badge 
                          className={`font-normal ${
                            airdrop.difficulty === 'Easy' 
                              ? 'bg-green-500/20 text-green-500 border-green-500/30'
                              : airdrop.difficulty === 'Medium'
                                ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                                : 'bg-red-500/20 text-red-500 border-red-500/30'
                          }`}
                        >
                          {airdrop.difficulty}
                        </Badge>
                      </td>
                      
                      {/* Actions (Admin Only) */}
                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditingRankedAirdrop(airdrop)}
                              className="text-gray-400 hover:text-crypto-green"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRankedAirdrop(airdrop.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {filteredAirdrops.length === 0 && (
            <div className="text-center py-12">
              <Award className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Rankings Found</h3>
              <p className="text-gray-400 mb-6">
                We couldn't find any airdrop rankings matching your criteria.
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
          )}
        </div>
      </section>
      
      {/* Edit Dialog (Admin Only) */}
      {isAdmin && isEditing && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="bg-crypto-gray border-crypto-lightGray/30 max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Edit Airdrop Ranking</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                placeholder="Airdrop Name"
                value={editingAirdrop.name || ''}
                onChange={(e) => setEditingAirdrop({ ...editingAirdrop, name: e.target.value })}
                className="bg-crypto-black/50 border-crypto-lightGray/30"
              />
              <Input
                placeholder="Token Symbol"
                value={editingAirdrop.tokenSymbol || ''}
                onChange={(e) => setEditingAirdrop({ ...editingAirdrop, tokenSymbol: e.target.value })}
                className="bg-crypto-black/50 border-crypto-lightGray/30"
              />
              <Input
                placeholder="Logo URL"
                value={editingAirdrop.logo || ''}
                onChange={(e) => setEditingAirdrop({ ...editingAirdrop, logo: e.target.value })}
                className="bg-crypto-black/50 border-crypto-lightGray/30"
              />
              <Input
                placeholder="Website"
                value={editingAirdrop.website || ''}
                onChange={(e) => setEditingAirdrop({ ...editingAirdrop, website: e.target.value })}
                className="bg-crypto-black/50 border-crypto-lightGray/30"
              />
              <Input
                type="number"
                placeholder="Rank (1-100)"
                value={editingAirdrop.rank || ''}
                onChange={(e) => setEditingAirdrop({ ...editingAirdrop, rank: Number(e.target.value) })}
                className="bg-crypto-black/50 border-crypto-lightGray/30"
                min="1" 
                max="100"
              />
              <Input
                type="number"
                placeholder="Rating Score (1-100)"
                value={editingAirdrop.ratingScore || ''}
                onChange={(e) => setEditingAirdrop({ ...editingAirdrop, ratingScore: Number(e.target.value) })}
                className="bg-crypto-black/50 border-crypto-lightGray/30"
                min="1" 
                max="100"
              />
              <Input
                placeholder="Potential Value (e.g. $100-$1,000)"
                value={editingAirdrop.potentialValue || ''}
                onChange={(e) => setEditingAirdrop({ ...editingAirdrop, potentialValue: e.target.value })}
                className="bg-crypto-black/50 border-crypto-lightGray/30"
              />
              <select
                value={editingAirdrop.category || ''}
                onChange={(e) => setEditingAirdrop({ ...editingAirdrop, category: e.target.value })}
                className="bg-crypto-black/50 border-crypto-lightGray/30 rounded-md p-2 text-white"
              >
                <option value="" disabled>Select Category</option>
                <option value="DeFi">DeFi</option>
                <option value="Layer 1">Layer 1</option>
                <option value="Layer 2">Layer 2</option>
                <option value="ZK Rollup">ZK Rollup</option>
                <option value="Modular Blockchain">Modular Blockchain</option>
                <option value="Smart Contract Platform">Smart Contract Platform</option>
                <option value="Top 10 Projects">Top 10 Projects</option>
                <option value="Testnet Mainnet">Testnet Mainnet</option>
                <option value="Telegram Bot Airdrops">Telegram Bot Airdrops</option>
                <option value="Daily Check-in Airdrops">Daily Check-in Airdrops</option>
                <option value="Twitter Airdrops">Twitter Airdrops</option>
                <option value="Social Airdrops">Social Airdrops</option>
                <option value="AI Airdrops">AI Airdrops</option>
                <option value="Wallet Airdrops">Wallet Airdrops</option>
                <option value="Exchange Airdrops">Exchange Airdrops</option>
              </select>
              <select
                value={editingAirdrop.difficulty || ''}
                onChange={(e) => setEditingAirdrop({ ...editingAirdrop, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                className="bg-crypto-black/50 border-crypto-lightGray/30 rounded-md p-2 text-white"
              >
                <option value="" disabled>Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select
                value={editingAirdrop.status || ''}
                onChange={(e) => setEditingAirdrop({ ...editingAirdrop, status: e.target.value as 'upcoming' | 'active' | 'ended' })}
                className="bg-crypto-black/50 border-crypto-lightGray/30 rounded-md p-2 text-white"
              >
                <option value="" disabled>Select Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
              </select>
              <div className="md:col-span-2">
                <Textarea
                  placeholder="Description"
                  value={editingAirdrop.description || ''}
                  onChange={(e) => setEditingAirdrop({ ...editingAirdrop, description: e.target.value })}
                  className="bg-crypto-black/50 border-crypto-lightGray/30 min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                onClick={cancelEditing}
                className="border-crypto-lightGray/30"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleUpdateRankedAirdrop(editingAirdrop.id as string)}
                className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
              >
                Update Ranking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AirdropRanking;
