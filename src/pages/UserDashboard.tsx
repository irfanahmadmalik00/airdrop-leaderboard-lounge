import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import DashboardHeader from '@/components/user-dashboard/DashboardHeader';
import UserProfile from '@/components/user-dashboard/UserProfile';
import AirdropTabs from '@/components/user-dashboard/AirdropTabs';
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

// Define predefined categories
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
  const [userAirdrops, setUserAirdrops] = useState<Airdrop[]>([]);
  const [userTestnets, setUserTestnets] = useState([]);
  const [dailyCompletedAirdrops, setDailyCompletedAirdrops] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAirdrop, setCurrentAirdrop] = useState<Airdrop | null>(null);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    // Load user airdrops
    const storedAirdrops = localStorage.getItem('userDashboardAirdrops');
    if (storedAirdrops) {
      try {
        setUserAirdrops(JSON.parse(storedAirdrops));
      } catch (error) {
        console.error('Failed to parse stored airdrops', error);
      }
    } else {
      // Initialize with mock data if no data exists
      const initialMockData = [
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
          userId: user?.id || '1'
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
          userId: user?.id || '1'
        }
      ];
      setUserAirdrops(initialMockData);
      localStorage.setItem('userDashboardAirdrops', JSON.stringify(initialMockData));
    }
    
    // Load testnets
    const storedTestnets = localStorage.getItem('userTestnets');
    if (storedTestnets) {
      try {
        setUserTestnets(JSON.parse(storedTestnets));
      } catch (error) {
        console.error('Failed to parse stored testnets', error);
      }
    } else {
      // Initialize with mock data if no data exists
      const initialTestnets = [
        {
          id: 't1',
          name: 'Ethereum 2.0 Testnet',
          description: 'Participate in Ethereum 2.0 testnet',
          status: 'active',
          completed: false,
          rewards: 'Potential ETH tokens',
          endDate: '2023-12-31',
          userId: user?.id || '1'
        },
        {
          id: 't2',
          name: 'Arbitrum Nova Testnet',
          description: 'Test the Arbitrum Nova L2 solution',
          status: 'ended',
          completed: true,
          rewards: 'ARB tokens airdrop',
          endDate: '2023-08-15',
          userId: user?.id || '1'
        }
      ];
      setUserTestnets(initialTestnets);
      localStorage.setItem('userTestnets', JSON.stringify(initialTestnets));
    }
    
    // Load daily stats
    const storedDailyStats = localStorage.getItem('dailyCompletedAirdrops');
    if (storedDailyStats) {
      try {
        setDailyCompletedAirdrops(JSON.parse(storedDailyStats));
      } catch (error) {
        console.error('Failed to parse stored daily stats', error);
      }
    } else {
      // Initialize with mock data if no data exists
      const initialDailyStats = [
        { date: '2023-11-01', count: 2 },
        { date: '2023-11-02', count: 1 },
        { date: '2023-11-03', count: 3 },
        { date: '2023-11-04', count: 0 },
        { date: '2023-11-05', count: 2 }
      ];
      setDailyCompletedAirdrops(initialDailyStats);
      localStorage.setItem('dailyCompletedAirdrops', JSON.stringify(initialDailyStats));
    }
    
    // Check if we need to sync with public airdrops data
    const publicAirdrops = localStorage.getItem('publicAirdrops');
    const completedAirdrops = localStorage.getItem('completedAirdrops');
    const pinnedAirdrops = localStorage.getItem('pinnedAirdrops');
    
    if (publicAirdrops && (completedAirdrops || pinnedAirdrops)) {
      syncWithPublicAirdrops(
        JSON.parse(publicAirdrops), 
        completedAirdrops ? JSON.parse(completedAirdrops) : [],
        pinnedAirdrops ? JSON.parse(pinnedAirdrops) : []
      );
    }
  }, [user?.id]);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('userDashboardAirdrops', JSON.stringify(userAirdrops));
  }, [userAirdrops]);
  
  useEffect(() => {
    localStorage.setItem('userTestnets', JSON.stringify(userTestnets));
  }, [userTestnets]);
  
  useEffect(() => {
    localStorage.setItem('dailyCompletedAirdrops', JSON.stringify(dailyCompletedAirdrops));
  }, [dailyCompletedAirdrops]);
  
  // Sync dashboard with public airdrops data
  const syncWithPublicAirdrops = useCallback((publicAirdrops: any[], completed: string[], pinned: string[]) => {
    if (!publicAirdrops.length) return;
    
    // Import relevant public airdrops to dashboard
    const publicAirdropsToImport = publicAirdrops.filter(airdrop => 
      (completed.includes(airdrop.id) || pinned.includes(airdrop.id)) &&
      !userAirdrops.some(ua => ua.id === airdrop.id)
    ).map(airdrop => ({
      id: airdrop.id,
      name: airdrop.name,
      description: airdrop.description,
      category: airdrop.category,
      link: airdrop.website,
      links: [
        { name: 'Website', url: airdrop.website || '' },
        { name: 'Telegram', url: airdrop.telegramLink || '' },
        { name: 'Twitter', url: airdrop.twitterLink || '' }
      ].filter(link => link.url),
      fundingAmount: airdrop.fundingAmount,
      rewards: airdrop.estimatedValue,
      timeCommitment: '1-3 hours', // Default value
      workRequired: airdrop.requirements?.[0] || 'Participate in the project',
      status: airdrop.status,
      completed: completed.includes(airdrop.id),
      pinned: pinned.includes(airdrop.id),
      userId: user?.id || '1'
    }));
    
    if (publicAirdropsToImport.length) {
      setUserAirdrops(prev => [...prev, ...publicAirdropsToImport]);
      toast.success(`Imported ${publicAirdropsToImport.length} airdrops from your public list`);
    }
    
    // Update completion and pin status for existing airdrops
    const updatedAirdrops = userAirdrops.map(airdrop => ({
      ...airdrop,
      completed: completed.includes(airdrop.id) ? true : airdrop.completed,
      pinned: pinned.includes(airdrop.id) ? true : airdrop.pinned
    }));
    
    setUserAirdrops(updatedAirdrops);
  }, [userAirdrops, user?.id]);
  
  // Calculate dashboard stats
  const stats = {
    totalAirdrops: userAirdrops.length,
    completedAirdrops: userAirdrops.filter(a => a.completed).length,
    activeTestnets: userTestnets.filter((t: any) => t.status === 'active').length,
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
    
    // Update daily completion stats if marking as completed
    const airdrop = userAirdrops.find(a => a.id === id);
    if (airdrop && !airdrop.completed) {
      updateDailyCompletionStats();
    }
    
    // Also update in public airdrops completed list
    const completedAirdrops = localStorage.getItem('completedAirdrops');
    if (completedAirdrops) {
      try {
        const parsedCompleted = JSON.parse(completedAirdrops);
        const isCompleted = updatedAirdrops.find(a => a.id === id)?.completed;
        
        if (isCompleted && !parsedCompleted.includes(id)) {
          // Add to completed list
          localStorage.setItem('completedAirdrops', JSON.stringify([...parsedCompleted, id]));
        } else if (!isCompleted && parsedCompleted.includes(id)) {
          // Remove from completed list
          localStorage.setItem('completedAirdrops', JSON.stringify(parsedCompleted.filter((aId: string) => aId !== id)));
        }
      } catch (error) {
        console.error('Failed to update completed airdrops', error);
      }
    }
    
    toast.success('Airdrop status updated!');
  };
  
  // Update daily completion stats
  const updateDailyCompletionStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayStats = dailyCompletedAirdrops.find((item: any) => item.date === today);
    
    if (todayStats) {
      // Update existing day's count
      setDailyCompletedAirdrops(
        dailyCompletedAirdrops.map((item: any) => 
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
  };
  
  // Toggle pin status
  const togglePin = (id: string) => {
    const updatedAirdrops = userAirdrops.map(airdrop => 
      airdrop.id === id 
        ? { ...airdrop, pinned: !airdrop.pinned } 
        : airdrop
    );
    
    setUserAirdrops(updatedAirdrops);
    
    // Also update in public airdrops pinned list
    const pinnedAirdrops = localStorage.getItem('pinnedAirdrops');
    if (pinnedAirdrops) {
      try {
        const parsedPinned = JSON.parse(pinnedAirdrops);
        const isPinned = updatedAirdrops.find(a => a.id === id)?.pinned;
        
        if (isPinned && !parsedPinned.includes(id)) {
          // Add to pinned list
          localStorage.setItem('pinnedAirdrops', JSON.stringify([...parsedPinned, id]));
        } else if (!isPinned && parsedPinned.includes(id)) {
          // Remove from pinned list
          localStorage.setItem('pinnedAirdrops', JSON.stringify(parsedPinned.filter((aId: string) => aId !== id)));
        }
      } catch (error) {
        console.error('Failed to update pinned airdrops', error);
      }
    }
    
    toast.success(updatedAirdrops.find(a => a.id === id)?.pinned ? 'Airdrop pinned!' : 'Airdrop unpinned!');
  };
  
  // Clean up old data
  const handleCleanupData = () => {
    // Remove airdrops with "ended" status that are completed
    const cleanedAirdrops = userAirdrops.filter(airdrop => 
      !(airdrop.status === 'ended' && airdrop.completed)
    );
    
    // Remove ended testnets
    const cleanedTestnets = userTestnets.filter((testnet: any) => 
      testnet.status !== 'ended'
    );
    
    // Keep only the last 7 days of daily stats
    const recentStats = dailyCompletedAirdrops.slice(-7);
    
    let cleanupCount = 0;
    
    if (cleanedAirdrops.length < userAirdrops.length) {
      setUserAirdrops(cleanedAirdrops);
      cleanupCount += userAirdrops.length - cleanedAirdrops.length;
    }
    
    if (cleanedTestnets.length < userTestnets.length) {
      setUserTestnets(cleanedTestnets);
      cleanupCount += userTestnets.length - cleanedTestnets.length;
    }
    
    if (recentStats.length < dailyCompletedAirdrops.length) {
      setDailyCompletedAirdrops(recentStats);
    }
    
    if (cleanupCount > 0) {
      toast.success(`Cleaned up ${cleanupCount} completed items`);
    } else {
      toast.info("No data needed cleanup");
    }
  };

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
          onCleanupData={handleCleanupData}
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
            <AirdropTabs
              userAirdrops={userAirdrops}
              onAddAirdrop={() => setIsAddDialogOpen(true)}
              onEditAirdrop={(airdrop) => {
                setCurrentAirdrop(airdrop);
                setIsEditDialogOpen(true);
              }}
              onDeleteAirdrop={handleDeleteAirdrop}
              onToggleCompletion={toggleCompletion}
              onTogglePin={togglePin}
            />
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
