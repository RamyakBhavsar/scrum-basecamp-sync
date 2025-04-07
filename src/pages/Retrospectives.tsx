
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight, Plus, ThumbsDown, ThumbsUp, Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const currentRetro = {
  sprintName: "Sprint 22",
  startDate: "Apr 1, 2025",
  endDate: "Apr 14, 2025",
  status: "In Progress",
  progress: 65,
  actionItems: [
    { id: 1, description: "Improve documentation workflow", assignee: "John Doe", status: "In Progress" },
    { id: 2, description: "Set up automated testing", assignee: "Sarah Johnson", status: "Not Started" },
    { id: 3, description: "Create onboarding guide for new team members", assignee: "Mike Chen", status: "Completed" }
  ]
};

const pastRetros = [
  {
    id: 1,
    sprintName: "Sprint 21",
    date: "Mar 31, 2025",
    positives: 8,
    negatives: 3,
    actionItems: 4
  },
  {
    id: 2,
    sprintName: "Sprint 20",
    date: "Mar 17, 2025",
    positives: 7,
    negatives: 5,
    actionItems: 3
  }
];

const Retrospectives = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Retrospectives</h1>
            <p className="text-muted-foreground mt-1">
              Reflect on your team's performance and identify opportunities for improvement.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Start Retrospective
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Current Sprint: {currentRetro.sprintName}</CardTitle>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                    {currentRetro.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{currentRetro.startDate} - {currentRetro.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Sprint Progress:</span>
                    <span className="font-medium">{currentRetro.progress}%</span>
                  </div>
                </div>
                
                <Progress value={currentRetro.progress} className="h-2" />
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-3">Action Items from Last Retrospective</h3>
                  <div className="space-y-3">
                    {currentRetro.actionItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-xs text-muted-foreground">Assigned to: {item.assignee}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'Completed' 
                            ? 'bg-green-50 text-green-700 border border-green-100' 
                            : item.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border border-blue-100'
                              : 'bg-gray-50 text-gray-700 border border-gray-100'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <Button className="flex-1">
                    Start Retrospective Meeting
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Review Sprint Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>What Went Well?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="p-3 border rounded-md bg-green-50 border-green-100">
                    <p className="text-sm text-green-800">Team communication improved significantly.</p>
                  </div>
                  <div className="p-3 border rounded-md bg-green-50 border-green-100">
                    <p className="text-sm text-green-800">Completed all high-priority tasks.</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <ThumbsUp className="mr-2 h-4 w-4 text-green-600" />
                  Add Positive
                </Button>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle>What Could Be Improved?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="p-3 border rounded-md bg-red-50 border-red-100">
                    <p className="text-sm text-red-800">Testing process was rushed.</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <ThumbsDown className="mr-2 h-4 w-4 text-red-600" />
                  Add Improvement Area
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Past Retrospectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastRetros.map(retro => (
              <Card key={retro.id} className="card-hover">
                <CardHeader className="pb-3">
                  <CardTitle>{retro.sprintName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Completed: {retro.date}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="text-center space-y-1">
                        <div className="h-8 w-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto">
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-xs font-medium">{retro.positives} Positives</p>
                      </div>
                      
                      <div className="text-center space-y-1">
                        <div className="h-8 w-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
                          <ThumbsDown className="h-4 w-4 text-red-600" />
                        </div>
                        <p className="text-xs font-medium">{retro.negatives} Improvements</p>
                      </div>
                      
                      <div className="text-center space-y-1">
                        <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
                          <Timer className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-xs font-medium">{retro.actionItems} Actions</p>
                      </div>
                    </div>
                    
                    <Button variant="ghost" className="w-full">
                      View Details <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Retrospectives;
