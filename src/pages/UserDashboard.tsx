import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/user-dashboard/DashboardHeader';
import UserProfile from '@/components/user-dashboard/UserProfile';
import AirdropCard from '@/components/user-dashboard/AirdropCard';
import AddEditAirdropDialog from '@/components/user-dashboard/AddEditAirdropDialog';

// Define the Airdrop interface to match your data structure
interface Airdrop {
  id: string;
  name: string;
  description: string;
  category: string;
  link?: string;
  links?: Array<{name: string, url: string}>;
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

// Mock data for testnets
const mockUserTestnets = [
  {
    id: 't1',
    name: 'Ethereum 2.0 Testnet',
    description: 'Participate in Ethereum 2.0 testnet',
    status: 'active',
    completed: false,
    rewards: 'Potential ETH tokens',
    endDate: '2023-12-31',
    userId: '1'
  },
  {
    id: 't2',
    name: 'Arbitrum Nova Testnet',
    description: 'Test the Arbitrum Nova L2 solution',
    status: 'ended',
    completed: true,
    rewards: 'ARB tokens airdrop',
    endDate: '2023-08-15',
    userId: '1'
  }
];

// Mock data for daily completed airdrops
const mockDailyCompletedAirdrops = [
  { date: '2023-11-01', count: 2 },
  { date: '2023-11-02', count: 1 },
  { date: '2023-11-03', count: 3 },
  { date: '2023-11-04', count: 0 },
  { date: '2023-11-05', count: 2 }
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
  const [userTestnets, setUserTestnets] = useState(mockUserTestnets);
  const [dailyCompletedAirdrops, setDailyCompletedAirdrops] = useState(mockDailyCompletedAirdrops);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAirdrop, setCurrentAirdrop] = useState<Airdrop | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Calculate dashboard stats
  const stats = {
    totalAirdrops: userAirdrops.length,
    completedAirdrops: userAirdrops.filter(a => a.completed).length,
    activeTestnets: userTestnets.filter(t => t.status === 'active').length,
    dailyTasks: 3, // Mock value
  };
  
  // User level based on completed airdrops (1 level per 3 completed airdrops)
  const userLevel = Math.max(1, Math.floor(stats.completedAirdrops / 3) + 1);

  // Handle adding a new airdrop
  const handleAddAirdrop = (formData: any) => {
    const newAirdrop: Airdrop = {
      id: Math.random().toString(36).substring(2, 9),
      ...formData,
      completed: false,
      pinned: false,
      userId: user?.id || ''
    };
    
    setUserAirdrops([...userAirdrops, newAirdrop]);
    setIsAddDialogOpen(false);
    toast.success('Airdrop added successfully!');
  };

  // Handle updating an airdrop
  const handleUpdateAirdrop = (formData: any) => {
    if (!currentAirdrop) return;
    
    const updatedAirdrops = userAirdrops.map(airdrop => 
      airdrop.id === currentAirdrop.id 
        ? { ...airdrop, ...formData } 
        : airdrop
    );
    
    setUserAirdrops(updatedAirdrops);
    setIsEditDialogOpen(false);
    setCurrentAirdrop(null);
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
    
    // Update daily completion stats
    const today = new Date().toISOString().split('T')[0];
    const todayStats = dailyCompletedAirdrops.find(item => item.date === today);
    
    if (todayStats) {
      // Update existing day's count
      setDailyCompletedAirdrops(
        dailyCompletedAirdrops.map(item => 
          item.date === today 
            ? { ...item, count: item.count + 1 } 
            : item
        )
      );
    } else {
      // Add new day
      setDailyCompletedAirdrops([
        ...dailyCompletedAirdrops, 
        { date: today, count: 1 }
      ]);
    }
    
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

  // Clean up old data (simulated - in real app would use timestamp comparison)
  useEffect(() => {
    // This simulates cleaning up old data every 24 hours
    const cleanup = () => {
      // Remove airdrops with "ended" status that are older than X days
      const cleanedAirdrops = userAirdrops.filter(airdrop => 
        !(airdrop.status === 'ended' && airdrop.completed)
      );
      
      // Remove ended testnets
      const cleanedTestnets = userTestnets.filter(testnet => 
        testnet.status !== 'ended'
      );
      
      // Keep only the last 7 days of daily stats
      const recentStats = dailyCompletedAirdrops.slice(-7);
      
      if (cleanedAirdrops.length < userAirdrops.length) {
        setUserAirdrops(cleanedAirdrops);
        toast.info('Old completed airdrops have been archived');
      }
      
      if (cleanedTestnets.length < userTestnets.length) {
        setUserTestnets(cleanedTestnets);
        toast.info('Old testnets have been archived');
      }
      
      if (recentStats.length < dailyCompletedAirdrops.length) {
        setDailyCompletedAirdrops(recentStats);
      }
    };
    
    // Call cleanup once on component mount
    // cleanup();
    
    // Setup interval to run every 24 hours
    // const interval = setInterval(cleanup, 24 * 60 * 60 * 1000);
    // return () => clearInterval(interval);
  }, [userAirdrops, userTestnets, dailyCompletedAirdrops]);

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
    <div className="container mx-auto pt-24 pb-10 px-4">
      <div className="flex flex-col gap-8">
        {/* Dashboard Header */}
        <DashboardHeader 
          onAddAirdrop={() => setIsAddDialogOpen(true)}
          totalAirdrops={stats.totalAirdrops}
          completedAirdrops={stats.completedAirdrops}
          activeTestnets={stats.activeTestnets}
          dailyTasks={stats.dailyTasks}
        />
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* User Profile Section */}
          <UserProfile 
            userAirdrops={userAirdrops} 
            stats={stats}
            userLevel={userLevel}
          />
          
          {/* Main Content Section */}
          <div className="w-full lg:w-3/4">
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
                      <AirdropCard 
                        key={airdrop.id} 
                        airdrop={airdrop}
                        onEdit={(airdrop) => {
                          setCurrentAirdrop(airdrop);
                          setIsEditDialogOpen(true);
                        }}
                        onDelete={handleDeleteAirdrop}
                        onToggleCompletion={toggleCompletion}
                        onTogglePin={togglePin}
                      />
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
                    <button 
                      onClick={() => setIsAddDialogOpen(true)}
                      className="bg-crypto-green text-crypto-black px-4 py-2 rounded-md hover:bg-crypto-darkGreen flex items-center justify-center gap-2"
                    >
                      <span className="text-sm">Add Your First Airdrop</span>
                    </button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Add/Edit Airdrop Dialog */}
      <AddEditAirdropDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddAirdrop}
        isEditing={false}
        currentAirdrop={null}
        predefinedCategories={predefinedCategories}
      />
      
      <AddEditAirdropDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateAirdrop}
        isEditing={true}
        currentAirdrop={currentAirdrop}
        predefinedCategories={predefinedCategories}
      />
    </div>
  );
};

export default UserDashboard;
