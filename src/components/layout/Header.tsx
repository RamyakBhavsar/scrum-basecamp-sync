
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BellIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-background">
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full">
          <BellIcon className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">Product Owner</span>
          </div>
          
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-brand-100 text-brand-800">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

export default Header;
