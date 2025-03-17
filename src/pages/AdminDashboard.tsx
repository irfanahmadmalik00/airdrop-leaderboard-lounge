
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash, Edit, Video, Award, Upload, AlertTriangle, 
  Check, X, Save, ExternalLink, Clock, Users, Eye
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { videos, Video, airdrops, Airdrop } from '@/lib/data';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('videos');
  const [videosList, setVideosList] = useState<Video[]>(videos);
  const [airdropsList, setAirdropsList] = useState<Airdrop[]>(airdrops);
  
  // New video form
  const [newVideo, setNewVideo] = useState<Partial<Video>>({
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: '',
    category: '',
  });
  
  // New airdrop form
  const [newAirdrop, setNewAirdrop] = useState<Partial<Airdrop>>({
    name: '',
    tokenSymbol: '',
    logo: '',
    description: '',
    fundingAmount: 0,
    listingDate: '',
    telegramLink: '',
    twitterLink: '',
    website: '',
    category: '',
    requirements: [''],
    estimatedValue: '',
    status: 'upcoming',
  });
  
  // Redirect if not an admin
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [user, isAdmin, navigate]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Add new video
  const handleAddVideo = () => {
    const newVideoEntry: Video = {
      id: `v${videosList.length + 1}`,
      title: newVideo.title || 'Untitled Video',
      description: newVideo.description || 'No description provided',
      thumbnailUrl: newVideo.thumbnailUrl || 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      videoUrl: newVideo.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      dateAdded: new Date().toISOString().split('T')[0],
      views: 0,
      category: newVideo.category || 'Tutorial',
    };
    
    setVideosList([newVideoEntry, ...videosList]);
    setNewVideo({
      title: '',
      description: '',
      thumbnailUrl: '',
      videoUrl: '',
      category: '',
    });
    
    toast.success('Video added successfully');
  };
  
  // Delete video
  const handleDeleteVideo = (id: string) => {
    setVideosList(videosList.filter(video => video.id !== id));
    toast.success('Video deleted successfully');
  };
  
  // Add new airdrop
  const handleAddAirdrop = () => {
    const requirements = newAirdrop.requirements?.filter(req => req.trim() !== '') || ['No requirements specified'];
    
    const newAirdropEntry: Airdrop = {
      id: `airdrop-${airdropsList.length + 1}`,
      name: newAirdrop.name || 'Untitled Airdrop',
      tokenSymbol: newAirdrop.tokenSymbol || 'TOKEN',
      logo: newAirdrop.logo || 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022',
      description: newAirdrop.description || 'No description provided',
      fundingAmount: newAirdrop.fundingAmount || 1000000,
      listingDate: newAirdrop.listingDate || new Date().toISOString().split('T')[0],
      telegramLink: newAirdrop.telegramLink || 'https://t.me/',
      twitterLink: newAirdrop.twitterLink || 'https://twitter.com/',
      website: newAirdrop.website || 'https://example.com',
      category: newAirdrop.category || 'DeFi',
      requirements,
      estimatedValue: newAirdrop.estimatedValue || '$100-$1,000',
      status: newAirdrop.status || 'upcoming',
      popularity: 50, // Default popularity score
    };
    
    setAirdropsList([newAirdropEntry, ...airdropsList]);
    setNewAirdrop({
      name: '',
      tokenSymbol: '',
      logo: '',
      description: '',
      fundingAmount: 0,
      listingDate: '',
      telegramLink: '',
      twitterLink: '',
      website: '',
      category: '',
      requirements: [''],
      estimatedValue: '',
      status: 'upcoming',
    });
    
    toast.success('Airdrop added successfully');
  };
  
  // Delete airdrop
  const handleDeleteAirdrop = (id: string) => {
    setAirdropsList(airdropsList.filter(airdrop => airdrop.id !== id));
    toast.success('Airdrop deleted successfully');
  };
  
  // Add requirement field
  const addRequirementField = () => {
    if (newAirdrop.requirements) {
      setNewAirdrop({
        ...newAirdrop,
        requirements: [...newAirdrop.requirements, '']
      });
    }
  };
  
  // Update requirement
  const updateRequirement = (index: number, value: string) => {
    if (newAirdrop.requirements) {
      const updatedRequirements = [...newAirdrop.requirements];
      updatedRequirements[index] = value;
      setNewAirdrop({
        ...newAirdrop,
        requirements: updatedRequirements
      });
    }
  };
  
  // Remove requirement field
  const removeRequirementField = (index: number) => {
    if (newAirdrop.requirements && newAirdrop.requirements.length > 1) {
      const updatedRequirements = [...newAirdrop.requirements];
      updatedRequirements.splice(index, 1);
      setNewAirdrop({
        ...newAirdrop,
        requirements: updatedRequirements
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-crypto-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-crypto-green/20 mb-4"></div>
          <div className="h-6 w-32 bg-crypto-green/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crypto-black">
      <Navbar />
      
      {/* Admin Dashboard */}
      <section className="pt-24 pb-8 px-4 md:pt-32">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Manage your videos and airdrops content</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-crypto-gray px-4 py-2 rounded-lg">
              <Users className="w-4 h-4 text-crypto-green" />
              <span className="text-sm">Logged in as <span className="text-crypto-green">{user?.username}</span></span>
            </div>
          </div>
          
          <Tabs defaultValue="videos" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-crypto-gray">
              <TabsTrigger value="videos" className="data-[state=active]:bg-crypto-green data-[state=active]:text-crypto-black">
                <Video className="w-4 h-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="airdrops" className="data-[state=active]:bg-crypto-green data-[state=active]:text-crypto-black">
                <Award className="w-4 h-4 mr-2" />
                Airdrops
              </TabsTrigger>
            </TabsList>
            
            {/* Videos Tab */}
            <TabsContent value="videos" className="mt-6">
              <div className="glass-panel rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Manage Videos</h2>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Video
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-crypto-gray border-crypto-lightGray max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Add New Video</DialogTitle>
                        <DialogDescription>
                          Fill in the details to add a new educational video.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 gap-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Title</label>
                          <Input
                            placeholder="Enter video title"
                            value={newVideo.title}
                            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Description</label>
                          <Textarea
                            placeholder="Enter video description"
                            value={newVideo.description}
                            onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30 min-h-[100px]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Thumbnail URL</label>
                          <Input
                            placeholder="Enter thumbnail URL"
                            value={newVideo.thumbnailUrl}
                            onChange={(e) => setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Video URL</label>
                          <Input
                            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                            value={newVideo.videoUrl}
                            onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Category</label>
                          <Select
                            value={newVideo.category}
                            onValueChange={(value) => setNewVideo({ ...newVideo, category: value })}
                          >
                            <SelectTrigger className="bg-crypto-lightGray/30 border-crypto-lightGray/30">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-crypto-gray border-crypto-lightGray">
                              <SelectItem value="Tutorial">Tutorial</SelectItem>
                              <SelectItem value="Analysis">Analysis</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          onClick={handleAddVideo}
                          className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Video
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-crypto-lightGray/30">
                        <th className="text-left py-3 px-4">Title</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Date Added</th>
                        <th className="text-left py-3 px-4">Views</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videosList.map((video) => (
                        <tr key={video.id} className="border-b border-crypto-lightGray/20 hover:bg-crypto-lightGray/10">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-10 h-10 object-cover rounded mr-3"
                              />
                              <div className="truncate max-w-[200px]">{video.title}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{video.category}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-2 text-gray-400" />
                              {video.dateAdded}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 mr-2 text-gray-400" />
                              {video.views.toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <a 
                                href={video.videoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button 
                                onClick={() => handleDeleteVideo(video.id)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            {/* Airdrops Tab */}
            <TabsContent value="airdrops" className="mt-6">
              <div className="glass-panel rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Manage Airdrops</h2>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Airdrop
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-crypto-gray border-crypto-lightGray max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Airdrop</DialogTitle>
                        <DialogDescription>
                          Fill in the details to add a new crypto airdrop.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Name</label>
                          <Input
                            placeholder="Enter airdrop name"
                            value={newAirdrop.name}
                            onChange={(e) => setNewAirdrop({ ...newAirdrop, name: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Token Symbol</label>
                          <Input
                            placeholder="Enter token symbol"
                            value={newAirdrop.tokenSymbol}
                            onChange={(e) => setNewAirdrop({ ...newAirdrop, tokenSymbol: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Logo URL</label>
                          <Input
                            placeholder="Enter logo URL"
                            value={newAirdrop.logo}
                            onChange={(e) => setNewAirdrop({ ...newAirdrop, logo: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Category</label>
                          <Select
                            value={newAirdrop.category}
                            onValueChange={(value) => setNewAirdrop({ ...newAirdrop, category: value })}
                          >
                            <SelectTrigger className="bg-crypto-lightGray/30 border-crypto-lightGray/30">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-crypto-gray border-crypto-lightGray">
                              <SelectItem value="DeFi">DeFi</SelectItem>
                              <SelectItem value="Layer 1">Layer 1</SelectItem>
                              <SelectItem value="Layer 2">Layer 2</SelectItem>
                              <SelectItem value="ZK Rollup">ZK Rollup</SelectItem>
                              <SelectItem value="Modular Blockchain">Modular Blockchain</SelectItem>
                              <SelectItem value="Smart Contract Platform">Smart Contract Platform</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm text-gray-400">Description</label>
                          <Textarea
                            placeholder="Enter airdrop description"
                            value={newAirdrop.description}
                            onChange={(e) => setNewAirdrop({ ...newAirdrop, description: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30 min-h-[100px]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Funding Amount (USD)</label>
                          <Input
                            type="number"
                            placeholder="Enter funding amount"
                            value={newAirdrop.fundingAmount?.toString() || ''}
                            onChange={(e) => setNewAirdrop({ 
                              ...newAirdrop, 
                              fundingAmount: parseFloat(e.target.value) || 0 
                            })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Listing Date</label>
                          <Input
                            type="date"
                            value={newAirdrop.listingDate}
                            onChange={(e) => setNewAirdrop({ ...newAirdrop, listingDate: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Telegram Link</label>
                          <Input
                            placeholder="Enter Telegram link"
                            value={newAirdrop.telegramLink}
                            onChange={(e) => setNewAirdrop({ ...newAirdrop, telegramLink: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Twitter Link</label>
                          <Input
                            placeholder="Enter Twitter link"
                            value={newAirdrop.twitterLink}
                            onChange={(e) => setNewAirdrop({ ...newAirdrop, twitterLink: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Website</label>
                          <Input
                            placeholder="Enter website URL"
                            value={newAirdrop.website}
                            onChange={(e) => setNewAirdrop({ ...newAirdrop, website: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Estimated Value</label>
                          <Input
                            placeholder="Enter estimated value range"
                            value={newAirdrop.estimatedValue}
                            onChange={(e) => setNewAirdrop({ ...newAirdrop, estimatedValue: e.target.value })}
                            className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Status</label>
                          <Select
                            value={newAirdrop.status}
                            onValueChange={(value: 'upcoming' | 'active' | 'ended') => 
                              setNewAirdrop({ ...newAirdrop, status: value })}
                          >
                            <SelectTrigger className="bg-crypto-lightGray/30 border-crypto-lightGray/30">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-crypto-gray border-crypto-lightGray">
                              <SelectItem value="upcoming">Upcoming</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="ended">Ended</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="md:col-span-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-400">Requirements</label>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={addRequirementField}
                              className="h-7 px-2 border-crypto-green text-crypto-green hover:bg-crypto-green/10"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Requirement
                            </Button>
                          </div>
                          
                          {newAirdrop.requirements?.map((req, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Input
                                placeholder={`Requirement ${index + 1}`}
                                value={req}
                                onChange={(e) => updateRequirement(index, e.target.value)}
                                className="bg-crypto-lightGray/30 border-crypto-lightGray/30"
                              />
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => removeRequirementField(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                disabled={newAirdrop.requirements?.length === 1}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          onClick={handleAddAirdrop}
                          className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Airdrop
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-crypto-lightGray/30">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Listing Date</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {airdropsList.map((airdrop) => (
                        <tr key={airdrop.id} className="border-b border-crypto-lightGray/20 hover:bg-crypto-lightGray/10">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <img
                                src={airdrop.logo}
                                alt={airdrop.name}
                                className="w-8 h-8 object-cover rounded-full bg-white p-1 mr-3"
                              />
                              <div>
                                <div>{airdrop.name}</div>
                                <div className="text-xs text-gray-400">{airdrop.tokenSymbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{airdrop.category}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                              airdrop.status === 'active' 
                                ? 'bg-crypto-green/20 text-crypto-green' 
                                : airdrop.status === 'upcoming'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {airdrop.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-2 text-gray-400" />
                              {airdrop.listingDate}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <a 
                                href={airdrop.telegramLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button 
                                onClick={() => handleDeleteAirdrop(airdrop.id)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
