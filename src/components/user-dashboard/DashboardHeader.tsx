
import { Button } from '@/components/ui/button';
import { Plus, Activity, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface DashboardHeaderProps {
  onAddAirdrop: () => void;
  totalAirdrops: number;
  completedAirdrops: number;
  activeTestnets: number;
  dailyTasks: number;
}

const DashboardHeader = ({ 
  onAddAirdrop,
  totalAirdrops,
  completedAirdrops, 
  activeTestnets,
  dailyTasks
}: DashboardHeaderProps) => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Crypto Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, <span className="text-crypto-green font-medium">{user?.username}</span>
            {user?.level && (
              <span className="ml-2 bg-crypto-green/20 text-crypto-green px-2 py-0.5 rounded-full text-xs">
                Level {user.level}
              </span>
            )}
          </p>
        </div>
        
        <Button 
          onClick={onAddAirdrop}
          className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen mt-4 md:mt-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Airdrop
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Airdrops</h3>
            <Activity className="h-4 w-4 text-crypto-green" />
          </div>
          <p className="text-3xl font-bold">{totalAirdrops}</p>
          <div className="mt-2 text-xs">
            <span className={completedAirdrops > 0 ? "text-crypto-green" : "text-gray-400"}>
              {completedAirdrops} completed
            </span>
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-400">Completion Rate</h3>
            <CheckCircle className="h-4 w-4 text-crypto-green" />
          </div>
          <p className="text-3xl font-bold">
            {totalAirdrops > 0 
              ? Math.round((completedAirdrops / totalAirdrops) * 100) 
              : 0}%
          </p>
          <div className="mt-2 h-1.5 w-full bg-crypto-gray/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-crypto-green"
              style={{ 
                width: `${totalAirdrops > 0 
                  ? Math.round((completedAirdrops / totalAirdrops) * 100) 
                  : 0}%` 
              }}
            ></div>
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-400">Active Testnets</h3>
            <Calendar className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-3xl font-bold">{activeTestnets}</p>
          <div className="mt-2 text-xs">
            <span className="text-blue-400">Ongoing participation</span>
          </div>
        </div>
        
        <div className="glass-panel rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-400">Daily Tasks</h3>
            <Clock className="h-4 w-4 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold">{dailyTasks}</p>
          <div className="mt-2 text-xs">
            <span className="text-yellow-400">Requires attention</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
