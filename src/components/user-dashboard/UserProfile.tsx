
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Calendar, CheckSquare, Clock } from 'lucide-react';

interface UserProfileProps {
  userAirdrops: Array<{
    id: string;
    completed: boolean;
    pinned: boolean;
  }>;
  stats: {
    totalAirdrops: number;
    completedAirdrops: number;
    activeTestnets: number;
    dailyTasks: number;
  };
  userLevel: number;
}

const UserProfile = ({ userAirdrops, stats, userLevel }: UserProfileProps) => {
  const { user } = useAuth();

  // Calculate level progress percentage
  const getLevelProgress = () => {
    const current = userLevel;
    const nextLevelThreshold = current * 3; // 3 completed airdrops per level
    const prevLevelThreshold = (current - 1) * 3;
    const completedCount = stats.completedAirdrops;
    
    // Calculate progress to next level
    const progress = prevLevelThreshold === nextLevelThreshold 
      ? 100 
      : ((completedCount - prevLevelThreshold) / (nextLevelThreshold - prevLevelThreshold)) * 100;
    
    return Math.min(Math.max(0, progress), 100);
  };

  return (
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
        <p className="text-gray-400 text-sm mb-2">
          {user?.email || 'user@example.com'}
        </p>
        
        <div className="flex items-center gap-2 mb-4 bg-crypto-lightGray/20 px-3 py-1 rounded-full">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-sm">Level {userLevel}</span>
        </div>
        
        {/* Level progress bar */}
        <div className="w-full h-2 bg-crypto-gray rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-crypto-green"
            style={{ width: `${getLevelProgress()}%` }}
          />
        </div>
        
        <div className="w-full border-t border-crypto-lightGray/20 pt-4 mt-2">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center bg-crypto-gray/50 p-3 rounded-lg">
              <Star className="w-5 h-5 text-crypto-green mb-2" />
              <span className="font-bold text-lg">{stats.totalAirdrops}</span>
              <span className="text-xs text-gray-400">Total Airdrops</span>
            </div>
            
            <div className="flex flex-col items-center bg-crypto-gray/50 p-3 rounded-lg">
              <CheckSquare className="w-5 h-5 text-green-500 mb-2" />
              <span className="font-bold text-lg">{stats.completedAirdrops}</span>
              <span className="text-xs text-gray-400">Completed</span>
            </div>
            
            <div className="flex flex-col items-center bg-crypto-gray/50 p-3 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400 mb-2" />
              <span className="font-bold text-lg">{stats.activeTestnets}</span>
              <span className="text-xs text-gray-400">Active Testnets</span>
            </div>
            
            <div className="flex flex-col items-center bg-crypto-gray/50 p-3 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400 mb-2" />
              <span className="font-bold text-lg">{stats.dailyTasks}</span>
              <span className="text-xs text-gray-400">Daily Tasks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
