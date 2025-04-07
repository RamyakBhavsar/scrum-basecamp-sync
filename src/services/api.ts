
import { Meeting, ScheduleMeetingInput } from '@/models/Meeting';
import { Sprint, SprintInput } from '@/models/Sprint';
import { toast } from "sonner";

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Generate a readable room name for Jitsi
const generateJitsiRoomName = (type: string, id: string) => {
  const timestamp = new Date().getTime().toString().slice(-6);
  return `scrum-${type}-${id}-${timestamp}`;
};

// Format Jitsi Meet URL
const formatJitsiUrl = (roomName: string) => {
  // Encode the room name to make it URL-safe
  const encodedRoom = encodeURIComponent(roomName);
  return `https://meet.jit.si/${encodedRoom}`;
};

// Local Storage Keys
const MEETINGS_KEY = 'scrum_extension_meetings';
const SPRINTS_KEY = 'scrum_extension_sprints';

// Initialize local storage with sample data if empty
const initializeLocalStorage = () => {
  // Initialize Meetings
  if (!localStorage.getItem(MEETINGS_KEY)) {
    const upcomingMeetings: Meeting[] = [
      {
        id: '1',
        title: "Daily Standup",
        date: new Date().toISOString(),
        time: "10:00 AM",
        duration: "15 min",
        type: "standup",
        participants: 7,
        jitsiRoomName: "scrum-standup-1-342576",
        meetingLink: "https://meet.jit.si/scrum-standup-1-342576",
        status: "scheduled"
      },
      {
        id: '2',
        title: "Sprint Review",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        time: "2:00 PM",
        duration: "1 hour",
        type: "review",
        participants: 12,
        jitsiRoomName: "scrum-review-2-342578",
        meetingLink: "https://meet.jit.si/scrum-review-2-342578",
        status: "scheduled"
      },
      {
        id: '3',
        title: "Sprint Retrospective",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        time: "4:00 PM",
        duration: "45 min",
        type: "retrospective",
        participants: 7,
        jitsiRoomName: "scrum-retrospective-3-342579",
        meetingLink: "https://meet.jit.si/scrum-retrospective-3-342579",
        status: "scheduled"
      }
    ];
    
    const pastMeetings: Meeting[] = [
      {
        id: '4',
        title: "Sprint Planning",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        time: "10:00 AM",
        duration: "2 hours",
        type: "planning",
        participants: 7,
        recording: true,
        recordingUrl: "#",
        jitsiRoomName: "scrum-planning-4-342580",
        meetingLink: "https://meet.jit.si/scrum-planning-4-342580",
        status: "completed"
      },
      {
        id: '5',
        title: "Sprint 22 Review",
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        time: "2:00 PM",
        duration: "1 hour",
        type: "review",
        participants: 12,
        recording: true,
        recordingUrl: "#",
        jitsiRoomName: "scrum-review-5-342581",
        meetingLink: "https://meet.jit.si/scrum-review-5-342581",
        status: "completed"
      }
    ];
    
    localStorage.setItem(MEETINGS_KEY, JSON.stringify([...upcomingMeetings, ...pastMeetings]));
  }
  
  // Initialize Sprints
  if (!localStorage.getItem(SPRINTS_KEY)) {
    const sprints: Sprint[] = [
      {
        id: '1',
        title: 'Sprint 23',
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: ['Task 1', 'Task 2', 'Task 3']
      }
    ];
    localStorage.setItem(SPRINTS_KEY, JSON.stringify(sprints));
  }
};

// Initialize on import
initializeLocalStorage();

// API methods
export const api = {
  // Meeting APIs
  meetings: {
    getAll: async (): Promise<Meeting[]> => {
      await delay(500); // Simulate network delay
      const meetings = JSON.parse(localStorage.getItem(MEETINGS_KEY) || '[]');
      return meetings;
    },
    
    getUpcoming: async (): Promise<Meeting[]> => {
      await delay(500);
      const meetings = JSON.parse(localStorage.getItem(MEETINGS_KEY) || '[]');
      const now = new Date();
      return meetings.filter((meeting: Meeting) => new Date(meeting.date) >= now);
    },
    
    getPast: async (): Promise<Meeting[]> => {
      await delay(500);
      const meetings = JSON.parse(localStorage.getItem(MEETINGS_KEY) || '[]');
      const now = new Date();
      return meetings.filter((meeting: Meeting) => new Date(meeting.date) < now);
    },
    
    getById: async (id: string): Promise<Meeting | null> => {
      await delay(300);
      const meetings = JSON.parse(localStorage.getItem(MEETINGS_KEY) || '[]');
      return meetings.find((meeting: Meeting) => meeting.id === id) || null;
    },
    
    schedule: async (meetingData: ScheduleMeetingInput): Promise<Meeting> => {
      await delay(700);
      
      const meetingId = generateId();
      const jitsiRoomName = generateJitsiRoomName(meetingData.type, meetingId);
      
      // Generate meeting link using Jitsi
      const jitsiLink = meetingData.meetingLink || formatJitsiUrl(jitsiRoomName);
      
      const newMeeting: Meeting = {
        id: meetingId,
        title: meetingData.title,
        type: meetingData.type,
        sprintId: meetingData.sprintId,
        date: meetingData.date,
        time: meetingData.time,
        duration: meetingData.duration,
        participants: meetingData.participants.length,
        meetingLink: jitsiLink,
        jitsiRoomName: jitsiRoomName,
        status: 'scheduled',
        recording: false
      };
      
      const meetings = JSON.parse(localStorage.getItem(MEETINGS_KEY) || '[]');
      meetings.push(newMeeting);
      localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
      
      toast.success("Meeting scheduled successfully!");
      return newMeeting;
    },
    
    delete: async (id: string): Promise<void> => {
      await delay(500);
      const meetings = JSON.parse(localStorage.getItem(MEETINGS_KEY) || '[]');
      const updatedMeetings = meetings.filter((meeting: Meeting) => meeting.id !== id);
      localStorage.setItem(MEETINGS_KEY, JSON.stringify(updatedMeetings));
      toast.success("Meeting deleted successfully!");
    },
    
    startMeeting: async (id: string): Promise<Meeting> => {
      await delay(300);
      const meetings = JSON.parse(localStorage.getItem(MEETINGS_KEY) || '[]');
      const meetingIndex = meetings.findIndex((meeting: Meeting) => meeting.id === id);
      
      if (meetingIndex === -1) {
        throw new Error('Meeting not found');
      }
      
      meetings[meetingIndex].status = 'in-progress';
      localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
      
      window.open(meetings[meetingIndex].meetingLink, '_blank');
      toast.success("Meeting started!");
      
      return meetings[meetingIndex];
    },
    
    completeMeeting: async (id: string, recordingUrl?: string): Promise<Meeting> => {
      await delay(500);
      const meetings = JSON.parse(localStorage.getItem(MEETINGS_KEY) || '[]');
      const meetingIndex = meetings.findIndex((meeting: Meeting) => meeting.id === id);
      
      if (meetingIndex === -1) {
        throw new Error('Meeting not found');
      }
      
      meetings[meetingIndex].status = 'completed';
      
      if (recordingUrl) {
        meetings[meetingIndex].recording = true;
        meetings[meetingIndex].recordingUrl = recordingUrl;
      }
      
      localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
      toast.success("Meeting completed!");
      
      return meetings[meetingIndex];
    }
  },
  
  // Sprint APIs
  sprints: {
    getAll: async (): Promise<Sprint[]> => {
      await delay(500);
      const sprints = JSON.parse(localStorage.getItem(SPRINTS_KEY) || '[]');
      return sprints;
    },
    
    getById: async (id: string): Promise<Sprint | null> => {
      await delay(300);
      const sprints = JSON.parse(localStorage.getItem(SPRINTS_KEY) || '[]');
      return sprints.find((sprint: Sprint) => sprint.id === id) || null;
    },
    
    create: async (sprintData: SprintInput): Promise<Sprint> => {
      await delay(700);
      
      const newSprint: Sprint = {
        id: generateId(),
        title: sprintData.title,
        startDate: sprintData.startDate,
        endDate: sprintData.endDate,
        tasks: sprintData.tasks || []
      };
      
      const sprints = JSON.parse(localStorage.getItem(SPRINTS_KEY) || '[]');
      sprints.push(newSprint);
      localStorage.setItem(SPRINTS_KEY, JSON.stringify(sprints));
      
      toast.success("Sprint created successfully!");
      return newSprint;
    },
    
    update: async (id: string, sprintData: Partial<SprintInput>): Promise<Sprint> => {
      await delay(700);
      
      const sprints = JSON.parse(localStorage.getItem(SPRINTS_KEY) || '[]');
      const sprintIndex = sprints.findIndex((sprint: Sprint) => sprint.id === id);
      
      if (sprintIndex === -1) {
        throw new Error('Sprint not found');
      }
      
      const updatedSprint = {
        ...sprints[sprintIndex],
        ...sprintData
      };
      
      sprints[sprintIndex] = updatedSprint;
      localStorage.setItem(SPRINTS_KEY, JSON.stringify(sprints));
      
      toast.success("Sprint updated successfully!");
      return updatedSprint;
    },
    
    delete: async (id: string): Promise<void> => {
      await delay(500);
      const sprints = JSON.parse(localStorage.getItem(SPRINTS_KEY) || '[]');
      const updatedSprints = sprints.filter((sprint: Sprint) => sprint.id !== id);
      localStorage.setItem(SPRINTS_KEY, JSON.stringify(updatedSprints));
      toast.success("Sprint deleted successfully!");
    }
  },
  
  // Basecamp integration (mock)
  basecamp: {
    connect: async (credentials: { email: string; token: string }): Promise<boolean> => {
      await delay(1000);
      localStorage.setItem('basecamp_connected', 'true');
      localStorage.setItem('basecamp_email', credentials.email);
      toast.success("Successfully connected to Basecamp!");
      return true;
    },
    
    isConnected: (): boolean => {
      return localStorage.getItem('basecamp_connected') === 'true';
    },
    
    disconnect: async (): Promise<void> => {
      await delay(500);
      localStorage.removeItem('basecamp_connected');
      localStorage.removeItem('basecamp_email');
      toast.success("Disconnected from Basecamp");
    }
  }
};
