
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Plus, ArrowRight } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseApi } from '@/services/supabaseApi';

// Sample backlog items (in a real app, this would come from a database)
const backlogItems = [
  { id: 1, title: 'Implement user authentication', points: 5, status: 'To Do' },
  { id: 2, title: 'Create dashboard layout', points: 3, status: 'To Do' },
  { id: 3, title: 'Add API integration with Basecamp', points: 8, status: 'To Do' },
  { id: 4, title: 'Design sprint retrospective UI', points: 3, status: 'To Do' },
  { id: 5, title: 'Implement daily standup form', points: 5, status: 'To Do' },
  { id: 6, title: 'Create meeting recording functionality', points: 13, status: 'To Do' },
  { id: 7, title: 'Add email notifications', points: 5, status: 'To Do' },
  { id: 8, title: 'Implement user profile page', points: 3, status: 'To Do' },
];

const teamMembers = [
  { id: 1, name: 'John Doe', initials: 'JD', avatar: '' },
  { id: 2, name: 'Sarah Johnson', initials: 'SJ', avatar: '' },
  { id: 3, name: 'Mike Chen', initials: 'MC', avatar: '' },
  { id: 4, name: 'Emily Davis', initials: 'ED', avatar: '' },
];

const SprintPlanning = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sprintName, setSprintName] = useState('');
  const [duration, setDuration] = useState('2w');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  const queryClient = useQueryClient();
  
  // Calculate end date based on duration
  const calculateEndDate = () => {
    const start = new Date(startDate);
    const durationWeeks = parseInt(duration.replace('w', ''));
    const end = new Date(start);
    end.setDate(start.getDate() + durationWeeks * 7);
    return end.toISOString().split('T')[0];
  };
  
  // Get all sprints
  const { data: sprints = [], isLoading } = useQuery({
    queryKey: ['sprints'],
    queryFn: supabaseApi.sprints.getAll
  });
  
  // Create a new sprint
  const createSprintMutation = useMutation({
    mutationFn: supabaseApi.sprints.create,
    onSuccess: () => {
      // Invalidate sprints query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      // Reset form
      setSelectedItems([]);
      setSprintName('');
      toast.success('Sprint created successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to create sprint:', error);
      toast.error('Failed to create sprint');
    }
  });
  
  const handleToggleItem = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };
  
  const totalPoints = backlogItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.points, 0);
  
  const handleCreateSprint = () => {
    if (!sprintName) {
      toast.error('Please enter a sprint name');
      return;
    }
    
    if (selectedItems.length === 0) {
      toast.error('Please select at least one backlog item');
      return;
    }
    
    const selectedTasks = backlogItems
      .filter(item => selectedItems.includes(item.id))
      .map(item => item.title);
    
    createSprintMutation.mutate({
      title: sprintName,
      startDate: startDate,
      endDate: calculateEndDate(),
      tasks: selectedTasks
    });
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sprint Planning</h1>
            <p className="text-muted-foreground mt-1">
              Plan your sprint by selecting items from the backlog and assigning them to team members.
            </p>
          </div>
          <Button onClick={handleCreateSprint} disabled={createSprintMutation.isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Create Sprint
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Product Backlog</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4 gap-2">
                  <Input placeholder="Search backlog items..." className="max-w-sm" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-md">
                  {backlogItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleToggleItem(item.id)}
                        />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium px-2 py-1 bg-brand-50 text-brand-700 rounded-full">
                          {item.points} pts
                        </span>
                        <Select defaultValue="">
                          <SelectTrigger className="w-[130px] h-8">
                            <SelectValue placeholder="Assign" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamMembers.map(member => (
                              <SelectItem key={member.id} value={String(member.id)}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {member.initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{member.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>New Sprint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sprint Name</label>
                  <Input 
                    placeholder="e.g. Sprint 23" 
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1w">1 Week</SelectItem>
                      <SelectItem value="2w">2 Weeks</SelectItem>
                      <SelectItem value="3w">3 Weeks</SelectItem>
                      <SelectItem value="4w">4 Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="date" 
                      className="pl-10"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Selected Items</h3>
                  <div className="p-3 border rounded-md bg-muted/30">
                    {selectedItems.length > 0 ? (
                      <div className="space-y-3">
                        {backlogItems
                          .filter(item => selectedItems.includes(item.id))
                          .map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.title}</span>
                              <span className="font-medium">{item.points} pts</span>
                            </div>
                          ))}
                        <div className="flex justify-between pt-2 border-t text-sm font-medium">
                          <span>Total Points</span>
                          <span>{totalPoints} pts</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No items selected
                      </p>
                    )}
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleCreateSprint} 
                  disabled={selectedItems.length === 0 || !sprintName || createSprintMutation.isPending}
                >
                  {createSprintMutation.isPending ? 'Creating...' : 'Create Sprint'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            {!isLoading && sprints.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Recent Sprints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sprints.slice(0, 3).map(sprint => (
                      <div key={sprint.id} className="p-3 border rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{sprint.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {sprint.tasks.length} tasks
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SprintPlanning;
