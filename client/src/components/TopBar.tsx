import { useState, useEffect } from "react";
import { Bell, Search, User, RotateCcw, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MarketStatusBadge from "./MarketStatusBadge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  notificationCount?: number;
}

export default function TopBar({ notificationCount = 0 }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState<'trading' | 'closed' | 'pre-market'>('closed');
  const [resetClickCount, setResetClickCount] = useState(0);
  const [appSize, setAppSize] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const hour = now.getHours();
      const minute = now.getMinutes();
      const timeInMinutes = hour * 60 + minute;

      if (timeInMinutes >= 540 && timeInMinutes < 810) {
        setMarketStatus('trading');
      } else if (timeInMinutes >= 510 && timeInMinutes < 540) {
        setMarketStatus('pre-market');
      } else {
        setMarketStatus('closed');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const handleReset = () => {
    if (resetClickCount === 0) {
      setResetClickCount(1);
      console.log('First reset click - will clear all target lists');
      // Broadcast reset message
      window.postMessage({
        type: 'RESET_TARGET_LISTS',
        clearData: true
      }, window.location.origin);
      setTimeout(() => setResetClickCount(0), 3000); // Reset after 3 seconds
    } else {
      console.log('Second reset click - recovering data');
      window.postMessage({
        type: 'RESET_TARGET_LISTS',
        clearData: false
      }, window.location.origin);
      setResetClickCount(0);
    }
  };

  const handleAppSizeChange = (size: 'small' | 'medium' | 'large') => {
    setAppSize(size);
    console.log('App size changed to:', size);
    // Apply size changes via CSS classes or zoom
    const root = document.documentElement;
    switch(size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'medium':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-background h-16">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-medium" data-testid="text-current-time">
            {formatTime(currentTime)}
          </span>
          <MarketStatusBadge status={marketStatus} />
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search stocks..." 
            className="pl-9"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              data-testid="badge-notification-count"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </Badge>
          )}
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    </header>
  );
}