
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/services/api';
import { ScheduleMeetingInput } from '@/models/Meeting';

interface ScheduleMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMeetingScheduled: () => void;
}

export const ScheduleMeetingDialog: React.FC<ScheduleMeetingDialogProps> = ({ 
  open, 
  onOpenChange,
  onMeetingScheduled
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ScheduleMeetingInput>({
    title: '',
    type: 'standup',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: '30 min',
    participants: [],
    meetingLink: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      await api.meetings.schedule(formData);
      onMeetingScheduled();
      onOpenChange(false);
      setFormData({
        title: '',
        type: 'standup',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        duration: '30 min',
        participants: [],
        meetingLink: ''
      });
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMeetingTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      standup: 'Daily Standup',
      planning: 'Sprint Planning',
      review: 'Sprint Review',
      retrospective: 'Retrospective',
      other: 'Other'
    };
    return labels[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule a Meeting</DialogTitle>
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
            <Label htmlFor="meetingLink" className="text-right">Meeting Link</Label>
            <Input
              id="meetingLink"
              placeholder="Optional custom meeting URL"
              className="col-span-3"
              value={formData.meetingLink}
              onChange={(e) => handleChange('meetingLink', e.target.value)}
            />
          </div>
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
