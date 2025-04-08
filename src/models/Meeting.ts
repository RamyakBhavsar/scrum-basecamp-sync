
export interface Meeting {
  id: string;
  title: string;
  type: 'standup' | 'planning' | 'review' | 'retrospective' | 'other';
  sprintId?: string;
  date: string; // ISO string
  time: string;
  duration: string;
  participants: number;
  meetingLink?: string;
  recording?: boolean;
  recordingUrl?: string;
  jitsiRoomName?: string; // Added for Jitsi integration
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  userId?: string; // Added to match with DB
}

export interface ScheduleMeetingInput {
  title: string;
  type: 'standup' | 'planning' | 'review' | 'retrospective' | 'other';
  sprintId?: string; 
  date: string;
  time: string;
  duration: string;
  participants: string[]; // email addresses
  meetingLink?: string;
}
