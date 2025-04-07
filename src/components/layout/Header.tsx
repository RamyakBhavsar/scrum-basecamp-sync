
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BellIcon, SearchIcon, User, Settings, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import ProfileSettingsDialog from '../profile/ProfileSettingsDialog';
import PasswordChangeDialog from '../profile/PasswordChangeDialog';

export function Header() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const handleOpenProfile = () => {
    setProfileOpen(true);
  };

  const handleOpenPassword = () => {
    setPasswordOpen(true);
  };

  const handleNavigateToSettings = () => {
    navigate('/settings');
  };

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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-muted-foreground">Product Owner</span>
              </div>
              
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-brand-100 text-brand-800">JD</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-background">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleOpenProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenPassword}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Change Password</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("Logging out")}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProfileSettingsDialog 
        open={profileOpen} 
        onOpenChange={setProfileOpen} 
      />
      
      <PasswordChangeDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
      />
    </header>
  );
}

export default Header;
