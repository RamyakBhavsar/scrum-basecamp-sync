
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabaseApi } from '@/services/supabaseApi';
import { ScheduleMeetingInput } from '@/models/Meeting';
import { useQuery } from '@tanstack/react-query';

interface ScheduleMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMeetingScheduled: () => void;
  initialType?: 'standup' | 'planning' | 'review' | 'retrospective' | 'other';
}

export const ScheduleMeetingDialog: React.FC<ScheduleMeetingDialogProps> = ({ 
  open, 
  onOpenChange,
  onMeetingScheduled,
  initialType = 'standup'
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCustomLink, setUseCustomLink] = useState(false);
  const [formData, setFormData] = useState<ScheduleMeetingInput>({
    title: '',
    type: initialType,
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: '30 min',
    participants: [],
    meetingLink: ''
  });

  // Reset form when dialog opens/closes or initialType changes
  useEffect(() => {
    if (open) {
      const defaultTitle = getDefaultTitleForType(initialType);
      setFormData({
        title: defaultTitle,
        type: initialType,
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        duration: getDefaultDurationForType(initialType),
        participants: [],
        meetingLink: ''
      });
      setUseCustomLink(false);
    }
  }, [open, initialType]);

  // Fetch sprints for dropdown
  const { data: sprints = [] } = useQuery({
    queryKey: ['sprints'],
    queryFn: supabaseApi.sprints.getAll,
    enabled: open
  });

  const handleChange = (field: string, value: string) => {
    if (field === 'type') {
      // Ensure value is a valid meeting type before setting it
      const meetingType = validateMeetingType(value);
      
      // Auto-update title when type changes
      const defaultTitle = getDefaultTitleForType(meetingType);
      const defaultDuration = getDefaultDurationForType(meetingType);
      
      setFormData(prev => ({ 
        ...prev, 
        type: meetingType, 
        title: prev.title === getDefaultTitleForType(prev.type) ? defaultTitle : prev.title,
        duration: prev.duration === getDefaultDurationForType(prev.type) ? defaultDuration : prev.duration
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Helper function to validate that the type is one of the allowed meeting types
  const validateMeetingType = (type: string): 'standup' | 'planning' | 'review' | 'retrospective' | 'other' => {
    const validTypes = ['standup', 'planning', 'review', 'retrospective', 'other'];
    return validTypes.includes(type) 
      ? type as 'standup' | 'planning' | 'review' | 'retrospective' | 'other'
      : 'other'; // Default to 'other' if an invalid type is provided
  };

  const getDefaultTitleForType = (type: string): string => {
    const titles: Record<string, string> = {
      standup: 'Daily Standup',
      planning: 'Sprint Planning',
      review: 'Sprint Review',
      retrospective: 'Sprint Retrospective',
      other: 'Team Meeting'
    };
    return titles[type] || 'Team Meeting';
  };

  const getDefaultDurationForType = (type: string): string => {
    const durations: Record<string, string> = {
      standup: '15 min',
      planning: '2 hours',
      review: '1 hour',
      retrospective: '1 hour',
      other: '30 min'
    };
    return durations[type] || '30 min';
  };

  const handleParticipantChange = (value: string) => {
    // In a real app, this would be a proper participant selector
    // For now, we'll just use a comma-separated list
    const emails = value.split(',').map(email => email.trim());
    setFormData(prev => ({ ...prev, participants: emails }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await supabaseApi.meetings.schedule(formData);
      onMeetingScheduled();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule a {getMeetingTypeLabel(formData.type)}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input
              id="title"
              placeholder="Meeting title"
              className="col-span-3"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Meeting Type" />
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
          
          {(formData.type === 'planning' || formData.type === 'review' || formData.type === 'retrospective') && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sprintId" className="text-right">Sprint</Label>
              <Select
                value={formData.sprintId || ''}
                onValueChange={(value) => handleChange('sprintId', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Sprint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {sprints.map((sprint: any) => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      {sprint.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input
              id="date"
              type="date"
              className="col-span-3"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">Time</Label>
            <Input
              id="time"
              type="time"
              className="col-span-3"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">Duration</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => handleChange('duration', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15 min">15 minutes</SelectItem>
                <SelectItem value="30 min">30 minutes</SelectItem>
                <SelectItem value="45 min">45 minutes</SelectItem>
                <SelectItem value="1 hour">1 hour</SelectItem>
                <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                <SelectItem value="2 hours">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="participants" className="text-right">Participants</Label>
            <Input
              id="participants"
              placeholder="Email addresses (comma-separated)"
              className="col-span-3"
              onChange={(e) => handleParticipantChange(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="custom-link" className="text-right">Custom Link</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="custom-link"
                checked={useCustomLink}
                onCheckedChange={setUseCustomLink}
              />
              <Label htmlFor="custom-link" className="cursor-pointer">Use custom meeting URL</Label>
            </div>
          </div>
          
          {useCustomLink && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meetingLink" className="text-right">Meeting URL</Label>
              <Input
                id="meetingLink"
                placeholder="Custom meeting URL"
                className="col-span-3"
                value={formData.meetingLink}
                onChange={(e) => handleChange('meetingLink', e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!formData.title || !formData.date || !formData.time || isSubmitting}>
            {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function getMeetingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    standup: 'Daily Standup',
    planning: 'Sprint Planning',
    review: 'Sprint Review',
    retrospective: 'Retrospective',
    other: 'Meeting'
  };
  return labels[type] || type;
}
