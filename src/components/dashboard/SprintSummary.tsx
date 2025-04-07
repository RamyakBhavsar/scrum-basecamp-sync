
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const SprintSummary: React.FC = () => {
  // Mock data for current sprint
  const sprintData = {
    name: "Sprint 23",
    startDate: "Apr 1, 2025",
    endDate: "Apr 14, 2025",
    progress: 65,
    totalStories: 24,
    completedStories: 16,
    totalPoints: 42,
    completedPoints: 27
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{sprintData.name}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {sprintData.startDate} - {sprintData.endDate}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Sprint Progress</span>
              <span className="font-medium">{sprintData.progress}%</span>
            </div>
            <Progress value={sprintData.progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Stories</h4>
              <p className="text-2xl font-bold">
                {sprintData.completedStories}
                <span className="text-base text-muted-foreground">/{sprintData.totalStories}</span>
              </p>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Story Points</h4>
              <p className="text-2xl font-bold">
                {sprintData.completedPoints}
                <span className="text-base text-muted-foreground">/{sprintData.totalPoints}</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SprintSummary;
