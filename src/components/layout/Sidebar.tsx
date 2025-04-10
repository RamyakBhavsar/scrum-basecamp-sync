
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Calendar,
  CheckSquare,
  Clock,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
};

const NavItem = ({ icon, label, path, active }: NavItemProps) => (
  <Link to={path} className="w-full">
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 font-normal px-3",
        active 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  </Link>
);

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <CheckSquare size={20} />, label: 'Sprint Planning', path: '/planning' },
    { icon: <Clock size={20} />, label: 'Daily Standups', path: '/standups' },
    { icon: <Users size={20} />, label: 'Sprint Reviews', path: '/reviews' },
    { icon: <MessageSquare size={20} />, label: 'Retrospectives', path: '/retrospectives' },
    { icon: <Calendar size={20} />, label: 'Meetings', path: '/meetings' },
    { icon: <UserCircle size={20} />, label: 'Resource Pool', path: '/resource-pool' },
  ];

  return (
    <div className="h-screen w-64 bg-sidebar flex flex-col border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-2 border-b border-sidebar-border h-16">
        <div className="w-8 h-8 rounded bg-brand-700 flex items-center justify-center text-white font-bold">SC</div>
        <h1 className="text-lg font-bold text-sidebar-foreground">Scrum Connect</h1>
      </div>
      
      <div className="flex-1 py-4 px-2 space-y-1 overflow-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={currentPath === item.path}
          />
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <NavItem
          icon={<Settings size={20} />}
          label="Settings"
          path="/settings"
          active={currentPath === '/settings'}
        />
      </div>
    </div>
  );
}

export default Sidebar;
