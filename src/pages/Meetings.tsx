
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Download, Plus, Search, Video } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const upcomingMeetings = [
  {
    id: 1,
    title: "Daily Standup",
    date: "Today",
    time: "10:00 AM",
    duration: "15 min",
    type: "Recurring",
    participants: 7
  },
  {
    id: 2,
    title: "Sprint Review",
    date: "Apr 14, 2025",
    time: "2:00 PM",
    duration: "1 hour",
    type: "One-time",
    participants: 12
  },
  {
    id: 3,
    title: "Sprint Retrospective",
    date: "Apr 14, 2025",
    time: "4:00 PM",
    duration: "45 min",
    type: "One-time",
    participants: 7
  }
];

const pastMeetings = [
  {
    id: 1,
    title: "Sprint Planning",
    date: "Apr 1, 2025",
    time: "10:00 AM",
    duration: "2 hours",
    type: "One-time",
    recording: true,
    participants: 7
  },
  {
    id: 2,
    title: "Sprint 22 Review",
    date: "Mar 31, 2025",
    time: "2:00 PM",
    duration: "1 hour",
    type: "One-time",
    recording: true,
    participants: 12
  },
  {
    id: 3,
    title: "Sprint 22 Retrospective",
    date: "Mar 31, 2025",
    time: "4:00 PM",
    duration: "45 min",
    type: "One-time",
    recording: false,
    participants: 7
  }
];

const Meetings = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
            <p className="text-muted-foreground mt-1">
              Schedule, join, and review your scrum ceremony meetings.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Meetings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search meetings..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Meeting Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standup">Daily Standup</SelectItem>
                  <SelectItem value="planning">Sprint Planning</SelectItem>
                  <SelectItem value="review">Sprint Review</SelectItem>
                  <SelectItem value="retro">Retrospective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              {upcomingMeetings.map(meeting => (
                <Card key={meeting.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">{meeting.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{meeting.date} at {meeting.time}</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{meeting.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {meeting.type}
                          </span>
                          <div className="flex items-center gap-1">
                            <div className="flex -space-x-2">
                              {Array.from({ length: Math.min(3, meeting.participants) }).map((_, i) => (
                                <div key={i} className="h-6 w-6 rounded-full bg-brand-100 border border-white" />
                              ))}
                              {meeting.participants > 3 && (
                                <div className="h-6 w-6 rounded-full bg-brand-100 border border-white flex items-center justify-center text-xs text-brand-800">
                                  +{meeting.participants - 3}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground ml-1">{meeting.participants} participants</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col gap-2 justify-end">
                        <Button className="flex-1 md:w-auto">
                          <Video className="mr-2 h-4 w-4" />
                          Join
                        </Button>
                        <Button variant="outline" className="flex-1 md:w-auto">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="past" className="mt-6">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search past meetings..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Meeting Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standup">Daily Standup</SelectItem>
                  <SelectItem value="planning">Sprint Planning</SelectItem>
                  <SelectItem value="review">Sprint Review</SelectItem>
                  <SelectItem value="retro">Retrospective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              {pastMeetings.map(meeting => (
                <Card key={meeting.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">{meeting.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{meeting.date} at {meeting.time}</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{meeting.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {meeting.type}
                          </span>
                          <div className="flex items-center gap-1">
                            <div className="flex -space-x-2">
                              {Array.from({ length: Math.min(3, meeting.participants) }).map((_, i) => (
                                <div key={i} className="h-6 w-6 rounded-full bg-brand-100 border border-white" />
                              ))}
                              {meeting.participants > 3 && (
                                <div className="h-6 w-6 rounded-full bg-brand-100 border border-white flex items-center justify-center text-xs text-brand-800">
                                  +{meeting.participants - 3}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground ml-1">{meeting.participants} attended</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col gap-2 justify-end">
                        {meeting.recording ? (
                          <Button variant="outline" className="flex-1 md:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Download Recording
                          </Button>
                        ) : (
                          <Button variant="outline" disabled className="flex-1 md:w-auto">
                            No Recording
                          </Button>
                        )}
                        <Button variant="ghost" className="flex-1 md:w-auto">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Meetings;
