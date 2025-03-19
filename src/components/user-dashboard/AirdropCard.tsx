
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Pin, CheckCircle, ExternalLink } from 'lucide-react';

interface AirdropCardProps {
  airdrop: {
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
  };
  onEdit: (airdrop: any) => void;
  onDelete: (id: string) => void;
  onToggleCompletion: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const AirdropCard = ({ airdrop, onEdit, onDelete, onToggleCompletion, onTogglePin }: AirdropCardProps) => {
  // Get the primary link for the airdrop
  const getPrimaryLink = () => {
    if (airdrop.links && airdrop.links.length > 0) {
      return airdrop.links[0].url;
    }
    return airdrop.link || '#';
  };

  return (
    <Card className={`bg-crypto-gray border-crypto-lightGray/30 hover:border-crypto-green/50 transition-all ${airdrop.pinned ? 'border-l-4 border-l-yellow-500' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center">
              {airdrop.name}
              {airdrop.completed && (
                <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
              )}
            </CardTitle>
            <CardDescription className="text-gray-400 mt-1">
              {airdrop.category}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(airdrop.status)}`}>
            {airdrop.status.charAt(0).toUpperCase() + airdrop.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-gray-300 mb-3">
          {airdrop.description}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-400">Funding</p>
            <p className="font-medium">${airdrop.fundingAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Time Required</p>
            <p className="font-medium">{airdrop.timeCommitment}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Rewards</p>
            <p className="font-medium">{airdrop.rewards}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Work Required</p>
            <p className="font-medium">{airdrop.workRequired}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs border-crypto-lightGray/30 h-8"
            onClick={() => onEdit(airdrop)}
          >
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs border-crypto-lightGray/30 h-8 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50"
            onClick={() => onDelete(airdrop.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className={`text-xs h-8 ${airdrop.completed ? 'text-green-500' : 'text-gray-400'}`}
            onClick={() => onToggleCompletion(airdrop.id)}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            {airdrop.completed ? 'Completed' : 'Complete'}
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className={`text-xs h-8 ${airdrop.pinned ? 'text-yellow-500' : 'text-gray-400'}`}
            onClick={() => onTogglePin(airdrop.id)}
          >
            <Pin className="h-3 w-3 mr-1" />
            {airdrop.pinned ? 'Pinned' : 'Pin'}
          </Button>
          <a 
            href={getPrimaryLink()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-xs px-2 py-1 h-8 rounded-md text-crypto-green hover:bg-crypto-green/10 transition-colors"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Visit
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

// Helper function to get status color for badges
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'upcoming':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'ended':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export default AirdropCard;
