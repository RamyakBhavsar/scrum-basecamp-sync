
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Send, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

const standupHistoryItems = [
  {
    id: 1,
    date: 'April 6, 2025',
    updates: [
      {
        id: 1,
        user: { name: 'John Doe', initials: 'JD', avatar: '' },
        yesterday: 'Implemented user authentication feature',
        today: 'Working on API integration',
        blockers: 'None',
        time: '10:03 AM'
      },
      {
        id: 2,
        user: { name: 'Sarah Johnson', initials: 'SJ', avatar: '' },
        yesterday: 'Designed sprint retrospective UI',
        today: 'Creating dashboard components',
        blockers: 'Waiting for API documentation',
        time: '10:05 AM'
      },
      {
        id: 3,
        user: { name: 'Mike Chen', initials: 'MC', avatar: '' },
        yesterday: 'Added email notification system',
        today: 'Testing user authentication',
        blockers: 'None',
        time: '10:08 AM'
      }
    ]
  },
  {
    id: 2,
    date: 'April 5, 2025',
    updates: [
      {
        id: 1,
        user: { name: 'John Doe', initials: 'JD', avatar: '' },
        yesterday: 'Set up project structure',
        today: 'Implementing user authentication feature',
        blockers: 'None',
        time: '10:01 AM'
      },
      {
        id: 2,
        user: { name: 'Sarah Johnson', initials: 'SJ', avatar: '' },
        yesterday: 'Created wireframes',
        today: 'Designing sprint retrospective UI',
        blockers: 'None',
        time: '10:03 AM'
      },
      {
        id: 3,
        user: { name: 'Mike Chen', initials: 'MC', avatar: '' },
        yesterday: 'Researched notification libraries',
        today: 'Adding email notification system',
        blockers: 'None',
        time: '10:06 AM'
      }
    ]
  }
];

const DailyStandups = () => {
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');
  const { toast } = useToast();
  
  const handleSubmitUpdate = () => {
    if (!yesterday || !today) {
      toast({
        title: "Missing information",
        description: "Please fill in what you did yesterday and what you're working on today.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock API submission
    toast({
      title: "Standup update submitted",
      description: "Your daily standup update has been recorded.",
      variant: "default",
    });
    
    // Clear form
    setYesterday('');
    setToday('');
    setBlockers('');
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Standups</h1>
            <p className="text-muted-foreground mt-1">
              Share your daily progress and discuss any blockers with your team.
            </p>
          </div>
          <Button>
            <Video className="mr-2 h-4 w-4" />
            Start Meeting
          </Button>
        </div>
        
        <Tabs defaultValue="submit">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="submit">Submit Update</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submit" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Today's Standup</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>April 7, 2025</span>
                    <Clock className="mx-2 h-4 w-4" />
                    <span>10:00 AM</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">What did you do yesterday?</label>
                  <Textarea 
                    placeholder="Share your accomplishments from yesterday..."
                    value={yesterday}
                    onChange={(e) => setYesterday(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">What are you working on today?</label>
                  <Textarea 
                    placeholder="What are your goals for today?"
                    value={today}
                    onChange={(e) => setToday(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Any blockers or challenges?</label>
                  <Textarea 
                    placeholder="Share any obstacles or challenges you're facing..."
                    value={blockers}
                    onChange={(e) => setBlockers(e.target.value)}
                    rows={2}
                  />
                </div>
                
                <Button 
                  className="w-full sm:w-auto"
                  onClick={handleSubmitUpdate}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Update
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <div className="space-y-6">
              {standupHistoryItems.map(item => (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md">{item.date}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {item.updates.map(update => (
                      <div key={update.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={update.user.avatar} />
                              <AvatarFallback className="text-xs bg-brand-100 text-brand-800">
                                {update.user.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{update.user.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{update.time}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                          <div>
                            <h4 className="text-xs uppercase font-medium text-muted-foreground mb-1">Yesterday</h4>
                            <p className="text-sm">{update.yesterday}</p>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase font-medium text-muted-foreground mb-1">Today</h4>
                            <p className="text-sm">{update.today}</p>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase font-medium text-muted-foreground mb-1">Blockers</h4>
                            <p className="text-sm">{update.blockers}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default DailyStandups;
