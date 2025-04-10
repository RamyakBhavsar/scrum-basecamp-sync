
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
import { supabaseApi } from '@/services/supabaseApi';
import { toast } from 'sonner';
import { Meeting } from '@/models/Meeting';
import { format } from 'date-fns';

export const RecordingUploadDialog = ({ 
  open, 
  onOpenChange, 
  onRecordingUploaded,
  meetings = []
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordingUploaded: () => void;
  meetings: Meeting[];
}) => {
  const [meetingId, setMeetingId] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setMeetingId('');
      setRecordingUrl('');
      setDuration('');
      setFileSize('');
    }
  }, [open]);

  // Filter meetings to only include completed meetings without recordings
  const eligibleMeetings = meetings.filter(meeting => 
    meeting.status === 'completed' && !meeting.recording
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meetingId || !recordingUrl) {
      toast.error('Please select a meeting and provide a recording URL');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Convert inputs to appropriate types
      const durationInSeconds = duration ? parseInt(duration, 10) : undefined;
      const fileSizeInBytes = fileSize ? parseInt(fileSize, 10) : undefined;
      
      await supabaseApi.meetings.addRecording({
        meetingId,
        recordingUrl,
        duration: durationInSeconds,
        fileSize: fileSizeInBytes
      });
      
      toast.success('Recording added successfully');
      onOpenChange(false);
      onRecordingUploaded();
    } catch (error) {
      console.error('Error adding recording:', error);
      toast.error('Failed to add recording');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatMeetingDate = (meeting: Meeting) => {
    const date = new Date(meeting.date);
    return `${format(date, 'PP')} at ${meeting.time}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Meeting Recording</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting">Meeting *</Label>
            {meetings.length === 0 ? (
              <div className="py-2">Loading meetings...</div>
            ) : eligibleMeetings.length === 0 ? (
              <div className="py-2 text-amber-500">
                No eligible meetings found. Only completed meetings without recordings can be selected.
              </div>
            ) : (
              <Select 
                value={meetingId} 
                onValueChange={setMeetingId}
              >
                <SelectTrigger id="meeting">
                  <SelectValue placeholder="Select a meeting" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleMeetings.map(meeting => (
                    <SelectItem key={meeting.id} value={meeting.id}>
                      {meeting.title} - {formatMeetingDate(meeting)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {eligibleMeetings.length === 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                You can use "Mark as Completed" in the meeting details to make a meeting eligible.
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recordingUrl">Recording URL *</Label>
            <Input 
              id="recordingUrl" 
              type="url"
              value={recordingUrl} 
              onChange={(e) => setRecordingUrl(e.target.value)} 
              placeholder="https://example.com/recording.mp4"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input 
                id="duration" 
                type="number"
                min="0"
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
                placeholder="300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fileSize">File Size (bytes)</Label>
              <Input 
                id="fileSize" 
                type="number"
                min="0"
                value={fileSize} 
                onChange={(e) => setFileSize(e.target.value)} 
                placeholder="10000000"
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isSubmitting || eligibleMeetings.length === 0}
            >
              {isSubmitting ? 'Uploading...' : 'Upload Recording'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
