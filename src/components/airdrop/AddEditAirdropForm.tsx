
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PlusCircle, X, Link as LinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AirdropLink {
  name: string;
  url: string;
}

interface AddEditAirdropFormProps {
  onSubmit: (formData: any) => void;
  isEditing?: boolean;
  currentAirdrop?: any;
  predefinedCategories: string[];
}

const AddEditAirdropForm = ({ 
  onSubmit, 
  isEditing = false, 
  currentAirdrop = null,
  predefinedCategories 
}: AddEditAirdropFormProps) => {
  const [newCategory, setNewCategory] = useState('');
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [links, setLinks] = useState<AirdropLink[]>(
    currentAirdrop?.links || []
  );
  const [formData, setFormData] = useState({
    name: currentAirdrop?.name || '',
    description: currentAirdrop?.description || '',
    category: currentAirdrop?.category || '',
    tokenSymbol: currentAirdrop?.tokenSymbol || '',
    logo: currentAirdrop?.logo || '',
    fundingAmount: currentAirdrop?.fundingAmount || 0,
    rewards: currentAirdrop?.rewards || '',
    timeCommitment: currentAirdrop?.timeCommitment || '',
    workRequired: currentAirdrop?.workRequired || '',
    status: currentAirdrop?.status || 'upcoming',
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    setFormData({...formData, category: newCategory});
    setIsNewCategoryDialogOpen(false);
    setNewCategory('');
    toast.success(`New category "${newCategory}" added!`);
  };

  const handleAddLink = () => {
    if (links.length >= 50) {
      toast.error('Maximum 50 links allowed per airdrop');
      return;
    }
    
    setLinks([...links, { name: '', url: '' }]);
  };

  const handleLinkChange = (index: number, field: 'name' | 'url', value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name) {
      toast.error('Airdrop name is required');
      return;
    }
    
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    
    // Submit with links
    onSubmit({ ...formData, links });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Airdrop Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter airdrop name"
            className="bg-crypto-gray border-crypto-lightGray/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tokenSymbol">Token Symbol</Label>
          <Input
            id="tokenSymbol"
            value={formData.tokenSymbol}
            onChange={(e) => handleInputChange('tokenSymbol', e.target.value)}
            placeholder="e.g. ETH, SOL, etc."
            className="bg-crypto-gray border-crypto-lightGray/30"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the airdrop"
          className="bg-crypto-gray border-crypto-lightGray/30 min-h-[100px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <div className="flex gap-2">
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger className="bg-crypto-gray border-crypto-lightGray/30 w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-crypto-gray border-crypto-lightGray/30 max-h-[300px]">
              {predefinedCategories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-crypto-lightGray/30" type="button">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-crypto-gray border-crypto-lightGray/30">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input 
                  placeholder="Enter new category" 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-crypto-gray border-crypto-lightGray/30"
                />
                <Button 
                  onClick={handleAddCategory} 
                  className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
                  type="button"
                >
                  Add Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="logo">Logo URL (optional)</Label>
        <Input
          id="logo"
          value={formData.logo}
          onChange={(e) => handleInputChange('logo', e.target.value)}
          placeholder="https://example.com/logo.png"
          className="bg-crypto-gray border-crypto-lightGray/30"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fundingAmount">Funding Amount ($) *</Label>
          <Input
            id="fundingAmount"
            type="number"
            value={formData.fundingAmount.toString()}
            onChange={(e) => handleInputChange('fundingAmount', Number(e.target.value))}
            placeholder="Enter funding amount"
            className="bg-crypto-gray border-crypto-lightGray/30"
            min="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rewards">Rewards *</Label>
          <Input
            id="rewards"
            value={formData.rewards}
            onChange={(e) => handleInputChange('rewards', e.target.value)}
            placeholder="e.g. 500-1000 tokens"
            className="bg-crypto-gray border-crypto-lightGray/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timeCommitment">Time Commitment *</Label>
          <Input
            id="timeCommitment"
            value={formData.timeCommitment}
            onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
            placeholder="e.g. 2-3 hours"
            className="bg-crypto-gray border-crypto-lightGray/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="workRequired">Work Required *</Label>
          <Input
            id="workRequired"
            value={formData.workRequired}
            onChange={(e) => handleInputChange('workRequired', e.target.value)}
            placeholder="e.g. Complete 5 transactions"
            className="bg-crypto-gray border-crypto-lightGray/30"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleInputChange('status', value)}
        >
          <SelectTrigger className="bg-crypto-gray border-crypto-lightGray/30">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-crypto-gray border-crypto-lightGray/30">
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Links Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Links (Up to 50)</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddLink}
            className="h-8 text-xs border-crypto-green text-crypto-green"
            type="button"
          >
            <PlusCircle className="h-3 w-3 mr-1" /> Add Link
          </Button>
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {links.length === 0 && (
            <div className="text-center py-4 text-gray-400 text-sm italic">
              No links added yet. Click "Add Link" to add website, social media, or documentation links.
            </div>
          )}
          
          {links.map((link, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="w-1/3">
                <Input
                  value={link.name}
                  onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                  placeholder="Link name"
                  className="bg-crypto-gray border-crypto-lightGray/30 text-sm"
                />
              </div>
              <div className="flex-1 flex gap-2 items-center">
                <LinkIcon className="h-4 w-4 text-crypto-green" />
                <Input
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="bg-crypto-gray border-crypto-lightGray/30 text-sm"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveLink(index)}
                className="h-8 w-8 p-0 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          variant="outline" 
          className="border-crypto-lightGray/30"
          type="button"
          onClick={() => onSubmit(null)} // Cancel
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen"
        >
          {isEditing ? 'Update Airdrop' : 'Add Airdrop'}
        </Button>
      </div>
    </form>
  );
};

export default AddEditAirdropForm;
