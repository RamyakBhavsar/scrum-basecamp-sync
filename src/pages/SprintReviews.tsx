
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Plus, Video } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Meeting } from '@/models/Meeting';
import { ScheduleMeetingDialog } from '@/components/meetings/ScheduleMeetingDialog';

const SprintReviews = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get all meetings
  const { data: allMeetings = [], isLoading, refetch } = 
    useQuery({
      queryKey: ['meetings'],
      queryFn: api.meetings.getAll
    });
    
  // Filter meetings for reviews only
  const upcomingReviews = allMeetings
    .filter((meeting: Meeting) => 
      meeting.type === 'review' && new Date(meeting.date) >= new Date()
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  const pastReviews = allMeetings
    .filter((meeting: Meeting) => 
      meeting.type === 'review' && new Date(meeting.date) < new Date()
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  // Handle meeting scheduling
  const handleMeetingScheduled = () => {
    refetch();
  };
  
  // Open dialog with review type pre-selected
  const handleScheduleReview = () => {
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sprint Reviews</h1>
            <p className="text-muted-foreground mt-1">
              Schedule, conduct, and review sprint demos with your team and stakeholders.
            </p>
          </div>
          <Button onClick={handleScheduleReview}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Review
          </Button>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                <div className="col-span-2 text-center py-10">Loading reviews...</div>
              ) : upcomingReviews.length === 0 ? (
                <div className="col-span-2 text-center py-10 text-muted-foreground">
                  No upcoming reviews found.
                </div>
              ) : (
                upcomingReviews.map(review => (
                  <Card key={review.id} className="card-hover">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle>{review.title}</CardTitle>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          Sprint Review
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(review.date).toLocaleDateString()} at {review.time} ({review.duration})</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex -space-x-2">
                            {Array.from({ length: Math.min(3, review.participants) }).map((_, i) => (
                              <div key={i} className="h-6 w-6 rounded-full bg-brand-100 border border-white" />
                            ))}
                            {review.participants > 3 && (
                              <div className="h-6 w-6 rounded-full bg-brand-100 border border-white flex items-center justify-center text-xs text-brand-800">
                                +{review.participants - 3}
                              </div>
                            )}
                          </div>
                          <span>{review.participants} participants</span>
                        </div>
                        
                        <div className="pt-2 flex gap-2">
                          <Button className="flex-1" onClick={() => window.open(review.meetingLink, '_blank')}>
                            <Video className="mr-2 h-4 w-4" />
                            Join Meeting
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              
              <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 bg-muted/30">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">Schedule a Review</h3>
                <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
                  Plan your next sprint review or demo
                </p>
                <Button variant="outline" onClick={handleScheduleReview}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="past" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-3 text-center py-10">Loading past reviews...</div>
              ) : pastReviews.length === 0 ? (
                <div className="col-span-3 text-center py-10 text-muted-foreground">
                  No past reviews found.
                </div>
              ) : (
                pastReviews.map(review => (
                  <Card key={review.id} className="card-hover">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle>{review.title}</CardTitle>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          Sprint Review
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(review.date).toLocaleDateString()} at {review.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex -space-x-2">
                            {Array.from({ length: Math.min(3, review.participants) }).map((_, i) => (
                              <div key={i} className="h-6 w-6 rounded-full bg-brand-100 border border-white" />
                            ))}
                            {review.participants > 3 && (
                              <div className="h-6 w-6 rounded-full bg-brand-100 border border-white flex items-center justify-center text-xs text-brand-800">
                                +{review.participants - 3}
                              </div>
                            )}
                          </div>
                          <span>{review.participants} participated</span>
                        </div>
                        
                        {review.recording && (
                          <div className="pt-2">
                            <Button variant="outline" className="w-full" onClick={() => window.open(review.recordingUrl, '_blank')}>
                              <Download className="mr-2 h-4 w-4" />
                              View Recording
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <ScheduleMeetingDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onMeetingScheduled={handleMeetingScheduled}
      />
    </MainLayout>
  );
};

export default SprintReviews;
