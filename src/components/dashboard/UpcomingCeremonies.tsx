
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ceremonies = [
  {
    id: 1,
    type: 'Daily Standup',
    time: 'Today, 10:00 AM',
    icon: <Clock className="h-4 w-4 text-orange-500" />,
    color: 'bg-orange-50 text-orange-700 border-orange-100'
  },
  {
    id: 2,
    type: 'Sprint Review',
    time: 'Apr 14, 2025, 2:00 PM',
    icon: <Users className="h-4 w-4 text-purple-500" />,
    color: 'bg-purple-50 text-purple-700 border-purple-100'
  },
  {
    id: 3,
    type: 'Sprint Retrospective',
    time: 'Apr 14, 2025, 4:00 PM',
    icon: <MessageSquare className="h-4 w-4 text-green-500" />,
    color: 'bg-green-50 text-green-700 border-green-100'
  },
  {
    id: 4,
    type: 'Sprint Planning',
    time: 'Apr 15, 2025, 10:00 AM',
    icon: <Calendar className="h-4 w-4 text-blue-500" />,
    color: 'bg-blue-50 text-blue-700 border-blue-100'
  }
];

const UpcomingCeremonies: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Upcoming Ceremonies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ceremonies.map(ceremony => (
            <div key={ceremony.id} className="flex items-center justify-between p-3 rounded-md border bg-card">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${ceremony.color}`}>
                  {ceremony.icon}
                </div>
                <div>
                  <h4 className="text-sm font-medium">{ceremony.type}</h4>
                  <p className="text-xs text-muted-foreground">{ceremony.time}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-brand-600 hover:text-brand-800 hover:bg-brand-50">
                Join
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingCeremonies;
