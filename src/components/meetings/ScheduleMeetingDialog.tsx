
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
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabaseApi } from '@/services/supabaseApi';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const ScheduleMeetingDialog = ({ 
  open, 
  onOpenChange, 
  onMeetingScheduled,
  initialType
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMeetingScheduled: () => void;
  initialType?: 'standup' | 'planning' | 'review' | 'retrospective' | 'other';
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'standup' | 'planning' | 'review' | 'retrospective' | 'other'>(initialType || 'standup');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('30m');
  const [participants, setParticipants] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferredPlatform, setPreferredPlatform] = useState<'jitsi' | 'google-meet'>('jitsi');

  // Set type when initialType changes
  useEffect(() => {
    if (initialType) {
      setType(initialType);
    }
  }, [initialType]);

  const addParticipant = () => {
    setParticipants([...participants, '']);
  };

  const removeParticipant = (index: number) => {
    const updatedParticipants = [...participants];
    updatedParticipants.splice(index, 1);
    setParticipants(updatedParticipants);
  };

  const updateParticipant = (index: number, value: string) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = value;
    setParticipants(updatedParticipants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error('Please enter a meeting title');
      return;
    }
    
    if (!date) {
      toast.error('Please select a date');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      const filteredParticipants = participants.filter(p => p.trim() !== '');
      
      await supabaseApi.meetings.schedule({
        title,
        type,
        date: formattedDate,
        time,
        duration,
        participants: filteredParticipants,
        preferredPlatform
      });
      
      // Reset form
      setTitle('');
      setType(initialType || 'standup');
      setDate(new Date());
      setTime('09:00');
      setDuration('30m');
      setParticipants(['']);
      setPreferredPlatform('jitsi');
      
      onOpenChange(false);
      onMeetingScheduled();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Sprint Planning Meeting"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Meeting Type</Label>
            <Select 
              value={type} 
              onValueChange={(value: 'standup' | 'planning' | 'review' | 'retrospective' | 'other') => setType(value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select meeting type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standup">Daily Standup</SelectItem>
                <SelectItem value="planning">Sprint Planning</SelectItem>
                <SelectItem value="review">Sprint Review</SelectItem>
                <SelectItem value="retrospective">Retrospective</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input 
                id="time" 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select 
              value={duration} 
              onValueChange={setDuration}
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">15 minutes</SelectItem>
                <SelectItem value="30m">30 minutes</SelectItem>
                <SelectItem value="45m">45 minutes</SelectItem>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="1h 30m">1 hour 30 minutes</SelectItem>
                <SelectItem value="2h">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Meeting Platform</Label>
            <RadioGroup 
              defaultValue="jitsi" 
              value={preferredPlatform}
              onValueChange={(value) => setPreferredPlatform(value as 'jitsi' | 'google-meet')}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jitsi" id="jitsi" />
                <Label htmlFor="jitsi" className="font-normal">Jitsi Meet (Default)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="google-meet" id="google-meet" />
                <Label htmlFor="google-meet" className="font-normal">Google Meet</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Participants</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addParticipant}
              >
                Add Participant
              </Button>
            </div>
            
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    value={participant} 
                    onChange={(e) => updateParticipant(index, e.target.value)} 
                    placeholder="Email address"
                    className="flex-grow"
                  />
                  {participants.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeParticipant(index)}
                      className="h-10 px-2"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
