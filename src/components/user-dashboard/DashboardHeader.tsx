
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface DashboardHeaderProps {
  onAddAirdrop: () => void;
}

const DashboardHeader = ({ onAddAirdrop }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <h1 className="text-3xl font-bold mb-4 md:mb-0">My Airdrop Dashboard</h1>
      
      <Button 
        onClick={onAddAirdrop}
        className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Airdrop
      </Button>
    </div>
  );
};

export default DashboardHeader;
