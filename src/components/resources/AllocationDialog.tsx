
import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter, DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabaseApi } from '@/services/supabaseApi';
import { toast } from 'sonner';
import { Resource } from '@/models/Resource';

export const AllocationDialog = ({ 
  open, 
  onOpenChange,
  resourceId,
  onAllocationSaved,
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceId?: string;
  onAllocationSaved: () => void;
}) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  const [projectName, setProjectName] = useState('');
  const [allocationPercentage, setAllocationPercentage] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days in the future
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourcesList = await supabaseApi.resources.getAll();
        setResources(resourcesList);
        setIsLoading(false);
        
        // If resourceId is provided, select it
        if (resourceId) {
          setSelectedResourceId(resourceId);
        } else if (resourcesList.length > 0) {
          setSelectedResourceId(resourcesList[0].id);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        toast.error('Failed to load resources');
        setIsLoading(false);
      }
    };
    
    if (open) {
      fetchResources();
    }
  }, [open, resourceId]);
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (resourceId) {
        setSelectedResourceId(resourceId);
      }
      setProjectName('');
      setAllocationPercentage('');
      setStartDate(new Date());
      setEndDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    }
  }, [open, resourceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedResourceId || !projectName || !allocationPercentage || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const percentage = parseInt(allocationPercentage, 10);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast.error('Allocation percentage must be between 0 and 100');
      return;
    }
    
    if (endDate < startDate) {
      toast.error('End date cannot be before start date');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await supabaseApi.allocations.create({
        resourceId: selectedResourceId,
        projectName,
        allocationPercentage: percentage,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd')
      });
      
      toast.success('Allocation created successfully');
      onOpenChange(false);
      onAllocationSaved();
    } catch (error) {
      console.error('Error creating allocation:', error);
      toast.error('Failed to create allocation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Project Allocation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resource">Resource *</Label>
            {isLoading ? (
              <div className="py-2">Loading resources...</div>
            ) : resources.length === 0 ? (
              <div className="py-2 text-red-500">No resources available. Please add a resource first.</div>
            ) : (
              <Select 
                value={selectedResourceId} 
                onValueChange={setSelectedResourceId}
                disabled={!!resourceId}
              >
                <SelectTrigger id="resource">
                  <SelectValue placeholder="Select a resource" />
                </SelectTrigger>
                <SelectContent>
                  {resources.map(resource => (
                    <SelectItem key={resource.id} value={resource.id}>
                      {resource.name} ({resource.role || 'Team Member'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project">Project Name *</Label>
            <Input 
              id="project" 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)} 
              placeholder="Project X"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="allocation">Allocation Percentage (%) *</Label>
            <Input 
              id="allocation" 
              type="number"
              min="0"
              max="100"
              value={allocationPercentage} 
              onChange={(e) => setAllocationPercentage(e.target.value)} 
              placeholder="50"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    fromDate={startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isSubmitting || isLoading || resources.length === 0}
            >
              {isSubmitting ? 'Creating...' : 'Create Allocation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
