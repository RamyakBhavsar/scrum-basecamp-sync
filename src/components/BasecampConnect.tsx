
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Check, X } from 'lucide-react';
import { supabaseApi } from '@/services/supabaseApi';

const BasecampConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Check connection status on component mount
    const checkConnection = async () => {
      const connected = await supabaseApi.basecamp.isConnected();
      setIsConnected(connected);
    };
    
    checkConnection();
  }, []);
  
  const handleConnect = async () => {
    setIsSubmitting(true);
    try {
      const success = await supabaseApi.basecamp.connect({ email, token });
      if (success) {
        setIsConnected(true);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to connect to Basecamp:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDisconnect = async () => {
    await supabaseApi.basecamp.disconnect();
    setIsConnected(false);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Basecamp Integration</CardTitle>
          <CardDescription>Connect with Basecamp to sync your projects and tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <div className="p-1.5 bg-green-100 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              ) : (
                <div className="p-1.5 bg-gray-100 rounded-full">
                  <X className="h-4 w-4 text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="font-medium">
                  {isConnected ? 'Connected to Basecamp' : 'Not connected'}
                </h4>
                {isConnected && <p className="text-sm text-muted-foreground">Last synced: Just now</p>}
              </div>
            </div>
            
            {isConnected ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Sync Now
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsDialogOpen(true)}>
                Connect
              </Button>
            )}
          </div>
        </CardContent>
        {isConnected && (
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              <p>Your Scrum ceremonies will automatically sync with Basecamp.</p>
            </div>
          </CardFooter>
        )}
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to Basecamp</DialogTitle>
            <DialogDescription>
              Enter your Basecamp credentials to sync your projects and tasks.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                placeholder="your@email.com"
                className="col-span-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="token" className="text-right">API Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="Your Basecamp API token"
                className="col-span-3"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            <div className="col-span-4 text-sm text-muted-foreground">
              <a href="https://basecamp.com/api" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                <ExternalLink className="h-3 w-3" /> How to get your API token
              </a>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConnect} disabled={!email || !token || isSubmitting}>
              {isSubmitting ? 'Connecting...' : 'Connect'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BasecampConnect;
