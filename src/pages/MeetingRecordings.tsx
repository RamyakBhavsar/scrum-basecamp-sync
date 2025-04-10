
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Plus, Search, Trash, Calendar, Video, Clock, FileUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabaseApi } from '@/services/supabaseApi';
import { MeetingRecording } from '@/models/Resource';
import { Meeting } from '@/models/Meeting';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { RecordingUploadDialog } from '@/components/meetings/RecordingUploadDialog';
import { format } from 'date-fns';
import { bytesToSize } from '@/lib/utils';

const MeetingRecordings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [recordingToDelete, setRecordingToDelete] = useState<string | null>(null);

  // Get recordings and meetings
  const { data: recordings = [], isLoading: isLoadingRecordings, refetch: refetchRecordings } = 
    useQuery({
      queryKey: ['recordings'],
      queryFn: () => supabaseApi.meetings.getRecordings()
    });
    
  const { data: meetings = [], isLoading: isLoadingMeetings } = 
    useQuery({
      queryKey: ['meetings'],
      queryFn: supabaseApi.meetings.getAll
    });
    
  // Filter recordings based on search
  const filteredRecordings = recordings.filter(recording => {
    const meeting = meetings.find(m => m.id === recording.meetingId);
    const matchesTitle = meeting?.title.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesDate = format(new Date(recording.recordingDate), 'PPP').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTitle || matchesDate;
  });
  
  // Handle upload completed
  const handleRecordingUploaded = () => {
    refetchRecordings();
  };
  
  // Handle recording deletion
  const handleDeleteRecording = async (id: string) => {
    try {
      await supabaseApi.meetings.deleteRecording(id);
      refetchRecordings();
      setRecordingToDelete(null);
    } catch (error) {
      console.error('Failed to delete recording:', error);
    }
  };
  
  // Get meeting details
  const getMeetingDetails = (meetingId: string): Meeting | undefined => {
    return meetings.find(meeting => meeting.id === meetingId);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };
  
  // Format time
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  // Format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meeting Recordings</h1>
            <p className="text-muted-foreground mt-1">
              Access and manage your meeting recordings.
            </p>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Upload Recording
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search recordings..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingRecordings || isLoadingMeetings ? (
            <div className="col-span-full text-center py-10">Loading recordings...</div>
          ) : filteredRecordings.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              {searchTerm ? 'No recordings match your search criteria.' : 'No recordings found. Upload your first recording.'}
            </div>
          ) : (
            filteredRecordings.map(recording => {
              const meeting = getMeetingDetails(recording.meetingId);
              
              return (
                <Card key={recording.id} className="card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{meeting?.title || 'Unknown Meeting'}</CardTitle>
                      <div className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {meeting?.type ? meeting.type.charAt(0).toUpperCase() + meeting.type.slice(1) : 'Recording'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(recording.recordingDate)}</span>
                        <Clock className="h-4 w-4 ml-1 text-muted-foreground" />
                        <span>{formatTime(recording.recordingDate)}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {recording.duration && (
                          <div className="flex items-center gap-2 text-sm">
                            <Video className="h-4 w-4 text-muted-foreground" />
                            <span>Duration: {formatDuration(recording.duration)}</span>
                          </div>
                        )}
                        
                        {recording.fileSize && (
                          <div className="flex items-center gap-2 text-sm">
                            <FileUp className="h-4 w-4 text-muted-foreground" />
                            <span>Size: {bytesToSize(recording.fileSize)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-2 flex gap-2">
                        <Button 
                          className="flex-1" 
                          onClick={() => window.open(recording.recordingUrl, '_blank')}
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Watch
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => window.open(recording.recordingUrl, '_blank')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="h-10 w-10 p-0">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Recording</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this recording? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteRecording(recording.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
      
      <RecordingUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onRecordingUploaded={handleRecordingUploaded}
        meetings={meetings}
      />
    </MainLayout>
  );
};

export default MeetingRecordings;
