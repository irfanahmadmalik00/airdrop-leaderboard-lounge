
import { useState } from 'react';
import { Search, Filter, Video as VideoIcon, ChevronDown, Edit, Trash, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import VideoCard from '@/components/VideoCard';
import { videos } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

type FilterOption = 'all' | 'Tutorial' | 'Analysis' | 'Crypto Series' | 'Top Testnets' | 'Mining Projects' | 'Airdrop Guide' | 'Problems' | 'Market' | 'New airdrop' | 'New testnet';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  dateAdded: string;
  views: number;
  category: string;
  isPinned?: boolean;
}

const Videos = () => {
  const { user, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<FilterOption>('all');
  const [videosList, setVideosList] = useState<Video[]>(() => {
    // Get videos from localStorage or use the default
    const storedVideos = localStorage.getItem('videosList');
    if (storedVideos) {
      return JSON.parse(storedVideos);
    }
    return videos;
  });
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Partial<Video>>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  
  // Filter videos
  const filteredVideos = videosList.filter((video) => {
    // Search filter
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !video.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filterCategory !== 'all' && video.category !== filterCategory) {
      return false;
    }
    
    return true;
  });
  
  // Sort videos by pinned status first, then by date (newest first)
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
  });
  
  const getCategoryLabel = (categoryOption: FilterOption) => {
    if (categoryOption === 'all') {
      return 'All Categories';
    }
    return categoryOption;
  };
  
  // Add new video
  const handleAddVideo = () => {
    if (!editingVideo.title || !editingVideo.videoUrl) {
      toast.error('Title and video URL are required');
      return;
    }
    
    const newVideo: Video = {
      id: `v${Date.now()}`,
      title: editingVideo.title,
      description: editingVideo.description || 'No description provided',
      thumbnailUrl: editingVideo.thumbnailUrl || 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      videoUrl: editingVideo.videoUrl,
      dateAdded: new Date().toISOString().split('T')[0],
      views: 0,
      category: editingVideo.category || 'Tutorial',
      isPinned: editingVideo.isPinned || false
    };
    
    const updatedVideos = [newVideo, ...videosList];
    setVideosList(updatedVideos);
    localStorage.setItem('videosList', JSON.stringify(updatedVideos));
    
    toast.success('Video added successfully!');
    setIsAddDialogOpen(false);
    setEditingVideo({});
  };
  
  // Edit video
  const handleEditVideo = () => {
    if (!editingVideo.id || !editingVideo.title || !editingVideo.videoUrl) {
      toast.error('Title and video URL are required');
      return;
    }
    
    const updatedVideos = videosList.map(video => 
      video.id === editingVideo.id 
        ? { 
            ...video, 
            title: editingVideo.title || video.title,
            description: editingVideo.description || video.description,
            thumbnailUrl: editingVideo.thumbnailUrl || video.thumbnailUrl,
            videoUrl: editingVideo.videoUrl || video.videoUrl,
            category: editingVideo.category || video.category,
            isPinned: editingVideo.isPinned || false
          } 
        : video
    );
    
    setVideosList(updatedVideos);
    localStorage.setItem('videosList', JSON.stringify(updatedVideos));
    
    toast.success('Video updated successfully!');
    setIsEditDialogOpen(false);
    setEditingVideo({});
  };
  
  // Delete video
  const handleDeleteVideo = () => {
    if (!deletingVideoId) return;
    
    const updatedVideos = videosList.filter(video => video.id !== deletingVideoId);
    setVideosList(updatedVideos);
    localStorage.setItem('videosList', JSON.stringify(updatedVideos));
    
    toast.success('Video deleted successfully!');
    setIsDeleteDialogOpen(false);
    setDeletingVideoId(null);
  };
  
  // Toggle pin status
  const handleTogglePin = (id: string) => {
    const updatedVideos = videosList.map(video => 
      video.id === id 
        ? { ...video, isPinned: !video.isPinned } 
        : video
    );
    
    setVideosList(updatedVideos);
    localStorage.setItem('videosList', JSON.stringify(updatedVideos));
    
    toast.success(`Video ${updatedVideos.find(v => v.id === id)?.isPinned ? 'pinned' : 'unpinned'} successfully!`);
  };

  return (
    <div className="min-h-screen bg-crypto-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4 md:pt-32 md:pb-16">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-fadeIn">
            <div className="p-3 bg-crypto-gray/60 rounded-full mb-4">
              <VideoIcon className="h-12 w-12 text-crypto-green" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-white">Educational </span>
              <span className="text-crypto-green">Videos</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Learn about cryptocurrency airdrops, blockchain technology, and how to maximize your rewards
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
                placeholder="Search videos..."
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
                  <DropdownMenuItem onClick={() => setFilterCategory('Tutorial')} className="hover:bg-crypto-lightGray">
                    Tutorial
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Analysis')} className="hover:bg-crypto-lightGray">
                    Analysis
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Crypto Series')} className="hover:bg-crypto-lightGray">
                    Crypto Series
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Top Testnets')} className="hover:bg-crypto-lightGray">
                    Top Testnets
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Mining Projects')} className="hover:bg-crypto-lightGray">
                    Mining Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Airdrop Guide')} className="hover:bg-crypto-lightGray">
                    Airdrop Guide
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Problems')} className="hover:bg-crypto-lightGray">
                    Problems
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('Market')} className="hover:bg-crypto-lightGray">
                    Market
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('New airdrop')} className="hover:bg-crypto-lightGray">
                    New Airdrop
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCategory('New testnet')} className="hover:bg-crypto-lightGray">
                    New Testnet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Add Video Button (Admin Only) */}
              {isAdmin && (
                <Button 
                  onClick={() => {
                    setEditingVideo({});
                    setIsAddDialogOpen(true);
                  }}
                  className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
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
            <h2 className="text-2xl font-bold">{sortedVideos.length} Videos Found</h2>
            <p className="text-gray-400">Sorted by pinned, then newest first</p>
          </div>
          
          {sortedVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedVideos.map((video) => (
                <div key={video.id} className="animate-on-scroll">
                  <div className="relative">
                    <VideoCard video={video} />
                    
                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => {
                            setEditingVideo(video);
                            setIsEditDialogOpen(true);
                          }}
                          className="w-7 h-7 rounded-full bg-black/70 hover:bg-black/90"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => {
                            setDeletingVideoId(video.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="w-7 h-7 rounded-full bg-black/70 hover:bg-black/90"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => handleTogglePin(video.id)}
                          className={`w-7 h-7 rounded-full ${
                            video.isPinned 
                              ? 'bg-crypto-green/70 hover:bg-crypto-green/90' 
                              : 'bg-black/70 hover:bg-black/90'
                          }`}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="17" x2="12" y2="22" />
                            <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                          </svg>
                        </Button>
                      </div>
                    )}
                    
                    {/* Pinned Badge */}
                    {video.isPinned && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-crypto-green text-crypto-black">
                          Pinned
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-10 text-center animate-fadeIn">
              <div className="flex flex-col items-center">
                <VideoIcon className="h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Videos Found</h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find any videos matching your search criteria.
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
      
      {/* Add Video Dialog (Admin Only) */}
      {isAdmin && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-crypto-gray border-crypto-lightGray/30 max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right text-sm">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Video Title"
                  className="col-span-3 bg-crypto-black/50 border-crypto-lightGray/30"
                  value={editingVideo.title || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="videoUrl" className="text-right text-sm">
                  Video URL
                </label>
                <Input
                  id="videoUrl"
                  placeholder="YouTube URL"
                  className="col-span-3 bg-crypto-black/50 border-crypto-lightGray/30"
                  value={editingVideo.videoUrl || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="thumbnailUrl" className="text-right text-sm">
                  Thumbnail URL
                </label>
                <Input
                  id="thumbnailUrl"
                  placeholder="Thumbnail URL (optional)"
                  className="col-span-3 bg-crypto-black/50 border-crypto-lightGray/30"
                  value={editingVideo.thumbnailUrl || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, thumbnailUrl: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="category" className="text-right text-sm">
                  Category
                </label>
                <select
                  id="category"
                  className="col-span-3 bg-crypto-black/50 border-crypto-lightGray/30 rounded-md p-2 text-white"
                  value={editingVideo.category || 'Tutorial'}
                  onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                >
                  <option value="Tutorial">Tutorial</option>
                  <option value="Analysis">Analysis</option>
                  <option value="Crypto Series">Crypto Series</option>
                  <option value="Top Testnets">Top Testnets</option>
                  <option value="Mining Projects">Mining Projects</option>
                  <option value="Airdrop Guide">Airdrop Guide</option>
                  <option value="Problems">Problems</option>
                  <option value="Market">Market</option>
                  <option value="New airdrop">New Airdrop</option>
                  <option value="New testnet">New Testnet</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="description" className="text-right text-sm">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Video Description"
                  className="col-span-3 bg-crypto-black/50 border-crypto-lightGray/30 min-h-[100px]"
                  value={editingVideo.description || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-sm">
                  Pin Video
                </div>
                <div className="col-span-3 flex items-center">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={editingVideo.isPinned || false}
                    onChange={(e) => setEditingVideo({ ...editingVideo, isPinned: e.target.checked })}
                    className="h-4 w-4 rounded border-crypto-lightGray/30 text-crypto-green focus:ring-crypto-green/20"
                  />
                  <label htmlFor="isPinned" className="ml-2 block text-sm">
                    Pin this video to the top
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setEditingVideo({});
                }}
                className="border-crypto-lightGray/30"
              >
                Cancel
              </Button>
              <Button onClick={handleAddVideo} className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                Add Video
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Video Dialog (Admin Only) */}
      {isAdmin && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-crypto-gray border-crypto-lightGray/30 max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Video</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-title" className="text-right text-sm">
                  Title
                </label>
                <Input
                  id="edit-title"
                  placeholder="Video Title"
                  className="col-span-3 bg-crypto-black/50 border-crypto-lightGray/30"
                  value={editingVideo.title || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-videoUrl" className="text-right text-sm">
                  Video URL
                </label>
                <Input
                  id="edit-videoUrl"
                  placeholder="YouTube URL"
                  className="col-span-3 bg-crypto-black/50 border-crypto-lightGray/30"
                  value={editingVideo.videoUrl || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-thumbnailUrl" className="text-right text-sm">
                  Thumbnail URL
                </label>
                <Input
                  id="edit-thumbnailUrl"
                  placeholder="Thumbnail URL"
                  className="col-span-3 bg-crypto-black/50 border-crypto-lightGray/30"
                  value={editingVideo.thumbnailUrl || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, thumbnailUrl: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-category" className="text-right text-sm">
                  Category
                </label>
                <select
                  id="edit-category"
                  className="col-span-3 bg-crypto-black/50 border-crypto-lightGray/30 rounded-md p-2 text-white"
                  value={editingVideo.category || 'Tutorial'}
                  onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                >
                  <option value="Tutorial">Tutorial</option>
                  <option value="Analysis">Analysis</option>
                  <option value="Crypto Series">Crypto Series</option>
                  <option value="Top Testnets">Top Testnets</option>
                  <option value="Mining Projects">Mining Projects</option>
                  <option value="Airdrop Guide">Airdrop Guide</option>
                  <option value="Problems">Problems</option>
                  <option value="Market">Market</option>
                  <option value="New airdrop">New Airdrop</option>
                  <option value="New testnet">New Testnet</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="edit-description" className="text-right text-sm">
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  placeholder="Video Description"
                  className="col-span-3 bg-crypto-black/50 border-crypto-lightGray/30 min-h-[100px]"
                  value={editingVideo.description || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-sm">
                  Pin Video
                </div>
                <div className="col-span-3 flex items-center">
                  <input
                    type="checkbox"
                    id="edit-isPinned"
                    checked={editingVideo.isPinned || false}
                    onChange={(e) => setEditingVideo({ ...editingVideo, isPinned: e.target.checked })}
                    className="h-4 w-4 rounded border-crypto-lightGray/30 text-crypto-green focus:ring-crypto-green/20"
                  />
                  <label htmlFor="edit-isPinned" className="ml-2 block text-sm">
                    Pin this video to the top
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingVideo({});
                }}
                className="border-crypto-lightGray/30"
              >
                Cancel
              </Button>
              <Button onClick={handleEditVideo} className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen">
                Update Video
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      {isAdmin && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-crypto-gray border-crypto-lightGray/30">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="text-gray-300">
              Are you sure you want to delete this video? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeletingVideoId(null);
                }}
                className="border-crypto-lightGray/30"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteVideo}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
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

export default Videos;
