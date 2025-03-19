
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, X, Link as LinkIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AirdropLink {
  name: string;
  url: string;
}

interface AddEditAirdropDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: any) => void;
  isEditing: boolean;
  currentAirdrop: any;
  predefinedCategories: string[];
}

const AddEditAirdropDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isEditing,
  currentAirdrop,
  predefinedCategories
}: AddEditAirdropDialogProps) => {
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [links, setLinks] = useState<AirdropLink[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    fundingAmount: 0,
    rewards: '',
    timeCommitment: '',
    workRequired: '',
    status: 'upcoming' as 'active' | 'upcoming' | 'ended'
  });

  // Reset form when dialog opens/closes or when editing a different airdrop
  useEffect(() => {
    if (isOpen) {
      if (isEditing && currentAirdrop) {
        // Convert single link to array if needed
        let airdropLinks = currentAirdrop.links || [];
        if (currentAirdrop.link && !currentAirdrop.links) {
          airdropLinks = [{ name: 'Main Link', url: currentAirdrop.link }];
        }
        
        setFormData({
          name: currentAirdrop.name || '',
          description: currentAirdrop.description || '',
          category: currentAirdrop.category || '',
          fundingAmount: currentAirdrop.fundingAmount || 0,
          rewards: currentAirdrop.rewards || '',
          timeCommitment: currentAirdrop.timeCommitment || '',
          workRequired: currentAirdrop.workRequired || '',
          status: currentAirdrop.status || 'upcoming',
        });
        
        setLinks(airdropLinks);
      } else {
        // Reset form for new airdrop
        resetForm();
      }
    }
  }, [isOpen, currentAirdrop, isEditing]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      fundingAmount: 0,
      rewards: '',
      timeCommitment: '',
      workRequired: '',
      status: 'upcoming'
    });
    setLinks([{ name: 'Main Link', url: '' }]);
    setNewCategory('');
  };

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-crypto-gray border-crypto-lightGray/30">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? 'Edit Airdrop' : 'Add New Airdrop'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-crypto-black border-crypto-lightGray/30"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-crypto-black border-crypto-lightGray/30 min-h-[100px]"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <div className="flex gap-2">
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger className="bg-crypto-black border-crypto-lightGray/30 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-crypto-black border-crypto-lightGray/30 max-h-[300px] overflow-y-auto">
                    {predefinedCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
                  <DialogContent className="sm:max-w-[400px] bg-crypto-gray border-crypto-lightGray/30">
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input 
                        placeholder="Enter new category" 
                        value={newCategory} 
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="bg-crypto-black border-crypto-lightGray/30"
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
                
                <Button
                  variant="outline"
                  className="border-crypto-lightGray/30"
                  onClick={() => setIsNewCategoryDialogOpen(true)}
                  type="button"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fundingAmount">Funding Amount ($) *</Label>
                <Input 
                  id="fundingAmount" 
                  type="number"
                  value={formData.fundingAmount.toString()} 
                  onChange={(e) => handleInputChange('fundingAmount', parseInt(e.target.value) || 0)}
                  className="bg-crypto-black border-crypto-lightGray/30"
                  min="0"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="rewards">Rewards *</Label>
                <Input 
                  id="rewards" 
                  value={formData.rewards} 
                  onChange={(e) => handleInputChange('rewards', e.target.value)}
                  className="bg-crypto-black border-crypto-lightGray/30"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="timeCommitment">Time Commitment *</Label>
                <Input 
                  id="timeCommitment" 
                  value={formData.timeCommitment} 
                  onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
                  className="bg-crypto-black border-crypto-lightGray/30"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="workRequired">Work Required *</Label>
                <Input 
                  id="workRequired" 
                  value={formData.workRequired} 
                  onChange={(e) => handleInputChange('workRequired', e.target.value)}
                  className="bg-crypto-black border-crypto-lightGray/30"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'upcoming' | 'ended') => 
                  handleInputChange('status', value)
                }
              >
                <SelectTrigger className="bg-crypto-black border-crypto-lightGray/30">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-crypto-black border-crypto-lightGray/30">
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
                        className="bg-crypto-black border-crypto-lightGray/30 text-sm"
                      />
                    </div>
                    <div className="flex-1 flex gap-2 items-center">
                      <LinkIcon className="h-4 w-4 text-crypto-green" />
                      <Input
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                        placeholder="https://..."
                        className="bg-crypto-black border-crypto-lightGray/30 text-sm"
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
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              className="border-crypto-lightGray/30"
              onClick={() => onOpenChange(false)}
              type="button"
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
      </DialogContent>
    </Dialog>
  );
};

export default AddEditAirdropDialog;
