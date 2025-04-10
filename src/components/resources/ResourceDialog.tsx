
import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter, DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabaseApi } from '@/services/supabaseApi';
import { toast } from 'sonner';
import { ResourceAllocation } from '@/models/Resource';

export const ResourceDialog = ({ 
  open, 
  onOpenChange, 
  resource,
  onResourceSaved,
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: ResourceAllocation | null;
  onResourceSaved: () => void;
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set initial form values when resource changes
  useEffect(() => {
    if (resource) {
      setName(resource.name);
      setEmail(resource.email);
      setRole(resource.role || '');
    } else {
      setName('');
      setEmail('');
      setRole('');
    }
  }, [resource, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast.error('Please fill in required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (resource) {
        // Update existing resource
        await supabaseApi.resources.update(resource.id, {
          name,
          email,
          role: role || undefined
        });
        toast.success('Resource updated successfully');
      } else {
        // Create new resource
        await supabaseApi.resources.create({
          name,
          email,
          role: role || undefined
        });
        toast.success('Resource created successfully');
      }
      
      onOpenChange(false);
      onResourceSaved();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{resource ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input 
              id="email" 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="john.doe@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              placeholder="Developer, Designer, etc."
            />
          </div>
          
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : resource ? 'Save Changes' : 'Add Resource'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
