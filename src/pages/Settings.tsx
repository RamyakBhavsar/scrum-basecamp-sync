
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasecampConnect from '@/components/BasecampConnect';

const Settings = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and application preferences.
          </p>
        </div>
        
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Product Owner" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team">Team</Label>
                    <Input id="team" defaultValue="Product Development" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="mt-6 space-y-6">
            <BasecampConnect />
            
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Sync Projects Automatically</h3>
                      <p className="text-sm text-muted-foreground">Automatically sync new Basecamp projects</p>
                    </div>
                    <Switch defaultChecked id="sync-projects" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Way Sync</h3>
                      <p className="text-sm text-muted-foreground">Update Basecamp when changes are made here</p>
                    </div>
                    <Switch id="two-way-sync" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Sync Team Members</h3>
                      <p className="text-sm text-muted-foreground">Automatically import team members from Basecamp</p>
                    </div>
                    <Switch defaultChecked id="sync-team" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Save Integration Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-standup" className="flex-1">Daily Standup Reminders</Label>
                      <Switch defaultChecked id="email-standup" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-meetings" className="flex-1">Upcoming Meeting Reminders</Label>
                      <Switch defaultChecked id="email-meetings" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-sprint" className="flex-1">Sprint Start/End Notifications</Label>
                      <Switch defaultChecked id="email-sprint" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-mentions" className="flex-1">Mentions and Comments</Label>
                      <Switch id="email-mentions" />
                    </div>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <h3 className="text-sm font-medium">In-App Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="app-standup" className="flex-1">Daily Standup Reminders</Label>
                      <Switch defaultChecked id="app-standup" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="app-meetings" className="flex-1">Upcoming Meeting Reminders</Label>
                      <Switch defaultChecked id="app-meetings" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="app-sprint" className="flex-1">Sprint Start/End Notifications</Label>
                      <Switch defaultChecked id="app-sprint" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="app-mentions" className="flex-1">Mentions and Comments</Label>
                      <Switch defaultChecked id="app-mentions" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="app-updates" className="flex-1">Team Activity Updates</Label>
                      <Switch defaultChecked id="app-updates" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Save Notification Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
