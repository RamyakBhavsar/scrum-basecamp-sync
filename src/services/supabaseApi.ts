
import { supabase } from '@/integrations/supabase/client';
import { Meeting, ScheduleMeetingInput } from '@/models/Meeting';
import { Sprint, SprintInput } from '@/models/Sprint';
import { toast } from "sonner";

// Generate readable room names
const generateJitsiRoomName = (type: string, id: string) => {
  const timestamp = new Date().getTime().toString().slice(-6);
  return `scrum-${type}-${id}-${timestamp}`;
};

// Format Jitsi Meet URL
const formatJitsiUrl = (roomName: string) => {
  const encodedRoom = encodeURIComponent(roomName);
  return `https://meet.jit.si/${encodedRoom}`;
};

// Generate Google Meet URL (simplified mock implementation)
const generateGoogleMeetLink = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = 'https://meet.google.com/';
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 2) result += '-';
  }
  return result;
};

export const supabaseApi = {
  // Meeting APIs
  meetings: {
    getAll: async (): Promise<Meeting[]> => {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching meetings:', error);
        toast.error('Failed to fetch meetings');
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        title: item.title,
        date: item.date,
        time: item.time,
        duration: item.duration,
        type: item.type,
        sprintId: item.sprint_id,
        participants: item.participants,
        meetingLink: item.meeting_link,
        jitsiRoomName: item.jitsi_room_name,
        status: item.status,
        recording: item.recording,
        recordingUrl: item.recording_url
      }));
    },
    
    getUpcoming: async (): Promise<Meeting[]> => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .gte('date', now)
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching upcoming meetings:', error);
        toast.error('Failed to fetch upcoming meetings');
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        title: item.title,
        date: item.date,
        time: item.time,
        duration: item.duration,
        type: item.type,
        sprintId: item.sprint_id,
        participants: item.participants,
        meetingLink: item.meeting_link,
        jitsiRoomName: item.jitsi_room_name,
        status: item.status,
        recording: item.recording,
        recordingUrl: item.recording_url
      }));
    },
    
    getPast: async (): Promise<Meeting[]> => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .lt('date', now)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching past meetings:', error);
        toast.error('Failed to fetch past meetings');
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        title: item.title,
        date: item.date,
        time: item.time,
        duration: item.duration,
        type: item.type,
        sprintId: item.sprint_id,
        participants: item.participants,
        meetingLink: item.meeting_link,
        jitsiRoomName: item.jitsi_room_name,
        status: item.status,
        recording: item.recording,
        recordingUrl: item.recording_url
      }));
    },
    
    getById: async (id: string): Promise<Meeting | null> => {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching meeting:', error);
        toast.error('Failed to fetch meeting');
        return null;
      }
      
      if (!data) return null;
      
      return {
        id: data.id,
        title: data.title,
        date: data.date,
        time: data.time,
        duration: data.duration,
        type: data.type,
        sprintId: data.sprint_id,
        participants: data.participants,
        meetingLink: data.meeting_link,
        jitsiRoomName: data.jitsi_room_name,
        status: data.status,
        recording: data.recording,
        recordingUrl: data.recording_url
      };
    },
    
    schedule: async (meetingData: ScheduleMeetingInput): Promise<Meeting> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Generate meeting link based on preferred platform
      let jitsiRoomName = '';
      let meetingLink = '';
      
      if (meetingData.preferredPlatform === 'google-meet') {
        meetingLink = generateGoogleMeetLink();
      } else {
        // Default to Jitsi
        jitsiRoomName = generateJitsiRoomName(meetingData.type, crypto.randomUUID());
        meetingLink = meetingData.meetingLink || formatJitsiUrl(jitsiRoomName);
      }
      
      const { data, error } = await supabase
        .from('meetings')
        .insert({
          title: meetingData.title,
          type: meetingData.type,
          sprint_id: meetingData.sprintId,
          date: meetingData.date,
          time: meetingData.time,
          duration: meetingData.duration,
          participants: meetingData.participants.length,
          meeting_link: meetingLink,
          jitsi_room_name: jitsiRoomName,
          status: 'scheduled',
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error scheduling meeting:', error);
        toast.error('Failed to schedule meeting');
        throw error;
      }
      
      toast.success("Meeting scheduled successfully!");
      
      if (!data) throw new Error('Failed to retrieve created meeting data');
      
      return {
        id: data.id,
        title: data.title,
        date: data.date,
        time: data.time,
        duration: data.duration,
        type: data.type,
        sprintId: data.sprint_id,
        participants: data.participants,
        meetingLink: data.meeting_link,
        jitsiRoomName: data.jitsi_room_name,
        status: data.status,
        recording: data.recording,
        recordingUrl: data.recording_url
      };
    },
    
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting meeting:', error);
        toast.error('Failed to delete meeting');
        throw error;
      }
      
      toast.success("Meeting deleted successfully!");
    },
    
    startMeeting: async (id: string): Promise<Meeting> => {
      const { data, error } = await supabase
        .from('meetings')
        .update({ status: 'in-progress' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error starting meeting:', error);
        toast.error('Failed to start meeting');
        throw error;
      }
      
      if (!data) throw new Error('Failed to retrieve updated meeting data');
      
      window.open(data.meeting_link, '_blank');
      toast.success("Meeting started!");
      
      return {
        id: data.id,
        title: data.title,
        date: data.date,
        time: data.time,
        duration: data.duration,
        type: data.type,
        sprintId: data.sprint_id,
        participants: data.participants,
        meetingLink: data.meeting_link,
        jitsiRoomName: data.jitsi_room_name,
        status: data.status,
        recording: data.recording,
        recordingUrl: data.recording_url
      };
    },
    
    completeMeeting: async (id: string, recordingUrl?: string): Promise<Meeting> => {
      const updateData: any = { status: 'completed' };
      
      if (recordingUrl) {
        updateData.recording = true;
        updateData.recording_url = recordingUrl;
      }
      
      const { data, error } = await supabase
        .from('meetings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error completing meeting:', error);
        toast.error('Failed to complete meeting');
        throw error;
      }
      
      if (!data) throw new Error('Failed to retrieve updated meeting data');
      
      toast.success("Meeting completed!");
      
      return {
        id: data.id,
        title: data.title,
        date: data.date,
        time: data.time,
        duration: data.duration,
        type: data.type,
        sprintId: data.sprint_id,
        participants: data.participants,
        meetingLink: data.meeting_link,
        jitsiRoomName: data.jitsi_room_name,
        status: data.status,
        recording: data.recording,
        recordingUrl: data.recording_url
      };
    }
  },
  
  // Sprint APIs
  sprints: {
    getAll: async (): Promise<Sprint[]> => {
      const { data, error } = await supabase
        .from('sprints')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching sprints:', error);
        toast.error('Failed to fetch sprints');
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        title: item.title,
        startDate: item.start_date,
        endDate: item.end_date,
        tasks: item.tasks || []
      }));
    },
    
    getById: async (id: string): Promise<Sprint | null> => {
      const { data, error } = await supabase
        .from('sprints')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching sprint:', error);
        toast.error('Failed to fetch sprint');
        return null;
      }
      
      if (!data) return null;
      
      return {
        id: data.id,
        title: data.title,
        startDate: data.start_date,
        endDate: data.end_date,
        tasks: data.tasks || []
      };
    },
    
    create: async (sprintData: SprintInput): Promise<Sprint> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('sprints')
        .insert({
          title: sprintData.title,
          start_date: sprintData.startDate,
          end_date: sprintData.endDate,
          tasks: sprintData.tasks || [],
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating sprint:', error);
        toast.error('Failed to create sprint');
        throw error;
      }
      
      if (!data) throw new Error('Failed to retrieve created sprint data');
      
      toast.success("Sprint created successfully!");
      return {
        id: data.id,
        title: data.title,
        startDate: data.start_date,
        endDate: data.end_date,
        tasks: data.tasks || []
      };
    },
    
    update: async (id: string, sprintData: Partial<SprintInput>): Promise<Sprint> => {
      const updateData: any = {};
      
      if (sprintData.title !== undefined) updateData.title = sprintData.title;
      if (sprintData.startDate !== undefined) updateData.start_date = sprintData.startDate;
      if (sprintData.endDate !== undefined) updateData.end_date = sprintData.endDate;
      if (sprintData.tasks !== undefined) updateData.tasks = sprintData.tasks;
      
      const { data, error } = await supabase
        .from('sprints')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating sprint:', error);
        toast.error('Failed to update sprint');
        throw error;
      }
      
      if (!data) throw new Error('Failed to retrieve updated sprint data');
      
      toast.success("Sprint updated successfully!");
      return {
        id: data.id,
        title: data.title,
        startDate: data.start_date,
        endDate: data.end_date,
        tasks: data.tasks || []
      };
    },
    
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('sprints')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting sprint:', error);
        toast.error('Failed to delete sprint');
        throw error;
      }
      
      toast.success("Sprint deleted successfully!");
    }
  },
  
  // Basecamp integration (mock)
  basecamp: {
    connect: async (credentials: { email: string; token: string }): Promise<boolean> => {
      // Store the connection info in user profile
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        
        await supabase
          .from('profiles')
          .update({
            basecamp_connected: true,
            basecamp_email: credentials.email
          })
          .eq('id', user.id);
        
        toast.success("Successfully connected to Basecamp!");
        return true;
      } catch (error) {
        console.error('Error connecting to Basecamp:', error);
        toast.error("Failed to connect to Basecamp");
        return false;
      }
    },
    
    isConnected: async (): Promise<boolean> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;
        
        const { data } = await supabase
          .from('profiles')
          .select('basecamp_connected')
          .eq('id', user.id)
          .single();
        
        return data?.basecamp_connected === true;
      } catch (error) {
        console.error('Error checking Basecamp connection:', error);
        return false;
      }
    },
    
    disconnect: async (): Promise<void> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        await supabase
          .from('profiles')
          .update({
            basecamp_connected: false,
            basecamp_email: null
          })
          .eq('id', user.id);
        
        toast.success("Disconnected from Basecamp");
      } catch (error) {
        console.error('Error disconnecting from Basecamp:', error);
        toast.error("Failed to disconnect from Basecamp");
      }
    }
  }
};
