
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Check, LogIn } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BasecampConnect: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate an API call to connect with Basecamp
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        title: "Connected to Basecamp",
        description: "Your Basecamp account has been successfully connected.",
        variant: "default",
      });
    }, 1500);
  };

  return (
    <Card className="p-6 border-dashed border-2 border-brand-100 bg-brand-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {isConnected ? 'Connected to Basecamp' : 'Connect to Basecamp'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isConnected 
              ? 'Your Basecamp account is connected. Projects and teams are in sync.' 
              : 'Connect your Basecamp account to sync projects and teams.'}
          </p>
        </div>
        
        <Button 
          variant={isConnected ? "outline" : "default"} 
          className={isConnected ? "bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200" : ""}
          onClick={handleConnect}
          disabled={isConnecting || isConnected}
        >
          {isConnected ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Connected
            </>
          ) : isConnecting ? (
            "Connecting..."
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Connect
            </>
          )}
        </Button>
      </div>
      
      {isConnected && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              3 Projects synced
            </span>
            <Button variant="ghost" size="sm" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-0">
              View details <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BasecampConnect;
