
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const activities = [
  {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      avatar: '',
      initials: 'SJ'
    },
    action: 'completed',
    item: 'User Authentication Feature',
    time: '20 minutes ago'
  },
  {
    id: 2,
    user: {
      name: 'Mike Chen',
      avatar: '',
      initials: 'MC'
    },
    action: 'started',
    item: 'API Integration',
    time: '1 hour ago'
  },
  {
    id: 3,
    user: {
      name: 'Emily Davis',
      avatar: '',
      initials: 'ED'
    },
    action: 'commented on',
    item: 'Dashboard UI',
    time: '2 hours ago'
  },
  {
    id: 4,
    user: {
      name: 'John Doe',
      avatar: '',
      initials: 'JD'
    },
    action: 'created',
    item: 'New Sprint Planning Meeting',
    time: '3 hours ago'
  }
];

const TeamActivity: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Team Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map(activity => (
            <div key={activity.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="text-xs bg-brand-100 text-brand-800">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{' '}
                  <span className="text-muted-foreground">{activity.action}</span>{' '}
                  <span className="font-medium">{activity.item}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamActivity;
