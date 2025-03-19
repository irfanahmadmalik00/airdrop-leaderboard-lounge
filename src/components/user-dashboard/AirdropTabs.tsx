
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AirdropCard from './AirdropCard';
import { useState } from 'react';

interface Airdrop {
  id: string;
  name: string;
  description: string;
  category: string;
  links?: Array<{name: string, url: string}>;
  link?: string;
  fundingAmount: number;
  rewards: string;
  timeCommitment: string;
  workRequired: string;
  status: 'active' | 'upcoming' | 'ended';
  completed: boolean;
  pinned: boolean;
  userId: string;
}

interface AirdropTabsProps {
  userAirdrops: Airdrop[];
  onAddAirdrop: () => void;
  onEditAirdrop: (airdrop: Airdrop) => void;
  onDeleteAirdrop: (id: string) => void;
  onToggleCompletion: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const AirdropTabs = ({ 
  userAirdrops, 
  onAddAirdrop, 
  onEditAirdrop, 
  onDeleteAirdrop, 
  onToggleCompletion, 
  onTogglePin 
}: AirdropTabsProps) => {
  const [activeTab, setActiveTab] = useState('all');

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
                onEdit={onEditAirdrop} 
                onDelete={onDeleteAirdrop}
                onToggleCompletion={onToggleCompletion}
                onTogglePin={onTogglePin}
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
            <Button 
              onClick={onAddAirdrop}
              className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Airdrop
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default AirdropTabs;
