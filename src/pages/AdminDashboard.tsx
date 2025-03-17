import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video as VideoIcon, 
  Award, 
  Users, 
  ChevronDown, 
  Edit, 
  Trash, 
  Plus, 
  Save, 
  X,
  AlertTriangle,
  Check
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
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { videos, airdrops, Airdrop } from '@/lib/data';
import type { Video as VideoType } from '@/lib/data';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('videos');
  const [videosList, setVideosList] = useState<VideoType[]>(videos);
  const [airdropsList, setAirdropsList] = useState<Airdrop[]>(airdrops);
  
  // New video form
  const [newVideo, setNewVideo] = useState<Partial<VideoType>>({
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: '',
    category: 'Tutorial'
  });
  
  // New airdrop form
  const [newAirdrop, setNewAirdrop] = useState<Partial<Airdrop>>({
    name: '',
    tokenSymbol: '',
    description: '',
    logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=022',
    fundingAmount: 0,
    category: 'DeFi',
    status: 'upcoming'
  });
  
  // Edit states
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [isAddingAirdrop, setIsAddingAirdrop] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingAirdropId, setEditingAirdropId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'video' | 'airdrop'>('video');
  
  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast.error('Access denied. Admin privileges required.');
    }
  }, [isAdmin, navigate]);
  
  // Cancel all edit states
  const cancelAllEdits = () => {
    setIsAddingVideo(false);
    setIsAddingAirdrop(false);
    setEditingVideoId(null);
    setEditingAirdropId(null);
    setShowDeleteConfirm(null);
    
    // Reset forms
    setNewVideo({
      title: '',
      description: '',
      thumbnailUrl: '',
      videoUrl: '',
      category: 'Tutorial'
    });
    
    setNewAirdrop({
      name: '',
      tokenSymbol: '',
      description: '',
      logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=022',
      fundingAmount: 0,
      category: 'DeFi',
      status: 'upcoming'
    });
  };
  
  // Add new video
  const handleAddVideo = () => {
    const newVideoEntry: VideoType = {
      id: `v${videosList.length + 1}`,
      title: newVideo.title || 'Untitled Video',
      description: newVideo.description || 'No description provided',
      thumbnailUrl: newVideo.thumbnailUrl || 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      videoUrl: newVideo.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      dateAdded: new Date().toISOString().split('T')[0],
      views: 0,
      category: newVideo.category || 'Tutorial'
    };
    
    setVideosList([newVideoEntry, ...videosList]);
    toast.success('Video added successfully!');
    setIsAddingVideo(false);
    
    // Reset form
    setNewVideo({
      title: '',
      description: '',
      thumbnailUrl: '',
      videoUrl: '',
      category: 'Tutorial'
    });
  };
  
  // Update video
  const handleUpdateVideo = (id: string) => {
    const updatedVideos = videosList.map(video => {
      if (video.id === id) {
        return {
          ...video,
          title: newVideo.title || video.title,
          description: newVideo.description || video.description,
          thumbnailUrl: newVideo.thumbnailUrl || video.thumbnailUrl,
          videoUrl: newVideo.videoUrl || video.videoUrl,
          category: newVideo.category || video.category
        };
      }
      return video;
    });
    
    setVideosList(updatedVideos);
    toast.success('Video updated successfully!');
    setEditingVideoId(null);
    
    // Reset form
    setNewVideo({
      title: '',
      description: '',
      thumbnailUrl: '',
      videoUrl: '',
      category: 'Tutorial'
    });
  };
  
  // Delete video
  const handleDeleteVideo = (id: string) => {
    const updatedVideos = videosList.filter(video => video.id !== id);
    setVideosList(updatedVideos);
    toast.success('Video deleted successfully!');
    setShowDeleteConfirm(null);
  };
  
  // Add new airdrop
  const handleAddAirdrop = () => {
    const newAirdropEntry: Airdrop = {
      id: `custom-${airdropsList.length + 1}`,
      name: newAirdrop.name || 'Untitled Airdrop',
      tokenSymbol: newAirdrop.tokenSymbol || 'TOKEN',
      logo: newAirdrop.logo || 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=022',
      description: newAirdrop.description || 'No description provided',
      fundingAmount: newAirdrop.fundingAmount || 1000000,
      listingDate: new Date().toISOString().split('T')[0],
      telegramLink: 'https://t.me/example',
      twitterLink: 'https://twitter.com/example',
      website: 'https://example.com',
      category: newAirdrop.category || 'DeFi',
      requirements: ['Requirement 1', 'Requirement 2'],
      estimatedValue: '$100-$1,000',
      status: newAirdrop.status || 'upcoming',
      popularity: 50
    };
    
    setAirdropsList([newAirdropEntry, ...airdropsList]);
    toast.success('Airdrop added successfully!');
    setIsAddingAirdrop(false);
    
    // Reset form
    setNewAirdrop({
      name: '',
      tokenSymbol: '',
      description: '',
      logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=022',
      fundingAmount: 0,
      category: 'DeFi',
      status: 'upcoming'
    });
  };
  
  // Update airdrop
  const handleUpdateAirdrop = (id: string) => {
    const updatedAirdrops = airdropsList.map(airdrop => {
      if (airdrop.id === id) {
        return {
          ...airdrop,
          name: newAirdrop.name || airdrop.name,
          tokenSymbol: newAirdrop.tokenSymbol || airdrop.tokenSymbol,
          logo: newAirdrop.logo || airdrop.logo,
          description: newAirdrop.description || airdrop.description,
          fundingAmount: newAirdrop.fundingAmount || airdrop.fundingAmount,
          category: newAirdrop.category || airdrop.category,
          status: newAirdrop.status || airdrop.status
        };
      }
      return airdrop;
    });
    
    setAirdropsList(updatedAirdrops);
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
      status: 'upcoming'
    });
  };
  
  // Delete airdrop
  const handleDeleteAirdrop = (id: string) => {
    const updatedAirdrops = airdropsList.filter(airdrop => airdrop.id !== id);
    setAirdropsList(updatedAirdrops);
    toast.success('Airdrop deleted successfully!');
    setShowDeleteConfirm(null);
  };
  
  // Editing a video
  const startEditingVideo = (video: VideoType) => {
    setEditingVideoId(video.id);
    setNewVideo({
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      category: video.category
    });
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
      status: airdrop.status
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
              <LayoutDashboard className="h-12 w-12 text-crypto-green" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-white">Admin </span>
              <span className="text-crypto-green">Dashboard</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Manage videos, airdrops, and user accounts
            </p>
          </div>
        </div>
      </section>
      
      {/* Tabs Section */}
      <section className="py-6 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="videos" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="videos" className="data-[state=active]:shadow-[0_0_10px_rgba(0,255,128,0.3)]">
                <VideoIcon className="w-4 h-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="airdrops" className="data-[state=active]:shadow-[0_0_10px_rgba(0,255,128,0.3)]">
                <Award className="w-4 h-4 mr-2" />
                Airdrops
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:shadow-[0_0_10px_rgba(0,255,128,0.3)] hidden">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:shadow-[0_0_10px_rgba(0,255,128,0.3)] hidden">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            {/* Videos Tab */}
            <TabsContent value="videos" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Videos</h2>
                <Button onClick={() => {
                    setIsAddingVideo(true);
                    cancelAllEdits();
                  }}
                  className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </div>
              
              {/* Add Video Form */}
              {isAddingVideo && (
                <div className="glass-panel rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Add New Video</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Video Title"
                        value={newVideo.title || ''}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Thumbnail URL"
                        value={newVideo.thumbnailUrl || ''}
                        onChange={(e) => setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })}
                        className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Video URL"
                        value={newVideo.videoUrl || ''}
                        onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                        className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                      />
                    </div>
                    <div>
                      <select
                        value={newVideo.category || 'Tutorial'}
                        onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value as 'Tutorial' | 'Analysis' })}
                        className="w-full rounded-md border border-crypto-lightGray/30 bg-crypto-gray text-gray-300 focus:border-crypto-green focus:ring-crypto-green/20"
                      >
                        <option value="Tutorial">Tutorial</option>
                        <option value="Analysis">Analysis</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Textarea
                        placeholder="Video Description"
                        value={newVideo.description || ''}
                        onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
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
                      onClick={handleAddVideo}
                      className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Video
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Video List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videosList.map((video) => (
                  <div key={video.id} className="glass-panel rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{video.title}</h3>
                        <Badge className="bg-crypto-lightGray/50 text-xs">{video.category}</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => startEditingVideo(video)}
                          disabled={editingVideoId !== null}
                          className="text-gray-300 hover:text-crypto-green"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setShowDeleteConfirm(video.id);
                            setDeleteType('video');
                          }}
                          disabled={showDeleteConfirm !== null}
                          className="text-gray-300 hover:text-red-500"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Edit Video Form */}
                    {editingVideoId === video.id ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Input
                              type="text"
                              placeholder="Video Title"
                              value={newVideo.title || ''}
                              onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                              className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              placeholder="Thumbnail URL"
                              value={newVideo.thumbnailUrl || ''}
                              onChange={(e) => setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })}
                              className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              placeholder="Video URL"
                              value={newVideo.videoUrl || ''}
                              onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                              className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                            />
                          </div>
                          <div>
                            <select
                              value={newVideo.category || 'Tutorial'}
                              onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value as 'Tutorial' | 'Analysis' })}
                              className="w-full rounded-md border border-crypto-lightGray/30 bg-crypto-gray text-gray-300 focus:border-crypto-green focus:ring-crypto-green/20"
                            >
                              <option value="Tutorial">Tutorial</option>
                              <option value="Analysis">Analysis</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <Textarea
                              placeholder="Video Description"
                              value={newVideo.description || ''}
                              onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                              className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                            />
                          </div>
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
                            onClick={() => handleUpdateVideo(video.id)}
                            className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Update Video
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400">{video.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Airdrops Tab */}
            <TabsContent value="airdrops" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Airdrops</h2>
                <Button 
                  onClick={() => {
                    setIsAddingAirdrop(true);
                    cancelAllEdits();
                  }}
                  className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Airdrop
                </Button>
              </div>
              
              {/* Add Airdrop Form */}
              {isAddingAirdrop && (
                <div className="glass-panel rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Add New Airdrop</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Airdrop Name"
                        value={newAirdrop.name || ''}
                        onChange={(e) => setNewAirdrop({ ...newAirdrop, name: e.target.value })}
                        className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Token Symbol"
                        value={newAirdrop.tokenSymbol || ''}
                        onChange={(e) => setNewAirdrop({ ...newAirdrop, tokenSymbol: e.target.value })}
                        className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Logo URL"
                        value={newAirdrop.logo || ''}
                        onChange={(e) => setNewAirdrop({ ...newAirdrop, logo: e.target.value })}
                        className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Funding Amount"
                        value={newAirdrop.fundingAmount || 0}
                        onChange={(e) => setNewAirdrop({ ...newAirdrop, fundingAmount: Number(e.target.value) })}
                        className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                      />
                    </div>
                    <div>
                      <select
                        value={newAirdrop.category || 'DeFi'}
                        onChange={(e) => setNewAirdrop({ ...newAirdrop, category: e.target.value as 'DeFi' | 'Layer 1' | 'Layer 2' | 'ZK Rollup' | 'Modular Blockchain' | 'Smart Contract Platform' })}
                        className="w-full rounded-md border border-crypto-lightGray/30 bg-crypto-gray text-gray-300 focus:border-crypto-green focus:ring-crypto-green/20"
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
                      <select
                        value={newAirdrop.status || 'upcoming'}
                        onChange={(e) => setNewAirdrop({ ...newAirdrop, status: e.target.value as 'upcoming' | 'active' | 'ended' })}
                        className="w-full rounded-md border border-crypto-lightGray/30 bg-crypto-gray text-gray-300 focus:border-crypto-green focus:ring-crypto-green/20"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active</option>
                        <option value="ended">Ended</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
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
                      Save Airdrop
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Airdrop List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {airdropsList.map((airdrop) => (
                  <div key={airdrop.id} className="glass-panel rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{airdrop.name}</h3>
                        <Badge className="bg-crypto-lightGray/50 text-xs">{airdrop.category}</Badge>
                      </div>
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
                          onClick={() => {
                            setShowDeleteConfirm(airdrop.id);
                            setDeleteType('airdrop');
                          }}
                          disabled={showDeleteConfirm !== null}
                          className="text-gray-300 hover:text-red-500"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Edit Airdrop Form */}
                    {editingAirdropId === airdrop.id ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Input
                              type="text"
                              placeholder="Airdrop Name"
                              value={newAirdrop.name || ''}
                              onChange={(e) => setNewAirdrop({ ...newAirdrop, name: e.target.value })}
                              className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              placeholder="Token Symbol"
                              value={newAirdrop.tokenSymbol || ''}
                              onChange={(e) => setNewAirdrop({ ...newAirdrop, tokenSymbol: e.target.value })}
                              className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                            />
                          </div>
                          <div>
                            <Input
                              type="text"
                              placeholder="Logo URL"
                              value={newAirdrop.logo || ''}
                              onChange={(e) => setNewAirdrop({ ...newAirdrop, logo: e.target.value })}
                              className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Funding Amount"
                              value={newAirdrop.fundingAmount || 0}
                              onChange={(e) => setNewAirdrop({ ...newAirdrop, fundingAmount: Number(e.target.value) })}
                              className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                            />
                          </div>
                          <div>
                            <select
                              value={newAirdrop.category || 'DeFi'}
                              onChange={(e) => setNewAirdrop({ ...newAirdrop, category: e.target.value as 'DeFi' | 'Layer 1' | 'Layer 2' | 'ZK Rollup' | 'Modular Blockchain' | 'Smart Contract Platform' })}
                              className="w-full rounded-md border border-crypto-lightGray/30 bg-crypto-gray text-gray-300 focus:border-crypto-green focus:ring-crypto-green/20"
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
                            <select
                              value={newAirdrop.status || 'upcoming'}
                              onChange={(e) => setNewAirdrop({ ...newAirdrop, status: e.target.value as 'upcoming' | 'active' | 'ended' })}
                              className="w-full rounded-md border border-crypto-lightGray/30 bg-crypto-gray text-gray-300 focus:border-crypto-green focus:ring-crypto-green/20"
                            >
                              <option value="upcoming">Upcoming</option>
                              <option value="active">Active</option>
                              <option value="ended">Ended</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <Textarea
                              placeholder="Airdrop Description"
                              value={newAirdrop.description || ''}
                              onChange={(e) => setNewAirdrop({ ...newAirdrop, description: e.target.value })}
                              className="bg-crypto-gray border-crypto-lightGray/30 focus:border-crypto-green focus:ring-crypto-green/20"
                            />
                          </div>
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
                            Update Airdrop
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400">{airdrop.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
              <Alert className="bg-crypto-gray/80 border-crypto-green/30">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs text-gray-300">
                  This feature is under development.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <Alert className="bg-crypto-gray/80 border-crypto-green/30">
                <AlertTriangle className="h-
