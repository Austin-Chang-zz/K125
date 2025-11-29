import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  History,
  Target,
  LineChart,
  MessageSquare,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  Layers,
  Star,
  Bookmark,
  Heart,
  Flag,
  Zap,
  RotateCcw,
  Maximize2,
  Moon,
  Sun,
  User,
  Search,
  PanelLeft // Added for the new sidebar icon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const mainItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Main Matrix",
    url: "/main-matrix",
    icon: TrendingUp,
  },
  {
    title: "Previous Matrix",
    url: "/previous-matrix",
    icon: History,
  },
  {
    title: "Target Cards",
    url: "/targets",
    icon: Layers,
  },
];

const targetListIcons = [Star, Bookmark, Heart, Flag, Zap, Target];

const targetListItems = [
  { title: "Target List 1", url: "/target/1", icon: Target },
  { title: "Target List 2", url: "/target/2", icon: Target },
  { title: "Target List 3", url: "/target/3", icon: Target },
  { title: "Target List 4", url: "/target/4", icon: Target },
  { title: "Target List 5", url: "/target/5", icon: Target },
  { title: "Target List 6", url: "/target/6", icon: Target },
];

const toolItems = [
  { title: "Charts", url: "/charts", icon: LineChart },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface AppSidebarProps {
  targetListNames?: string[];
  onTargetListClick?: (index: number) => void;
  targetLists?: Array<{ id: string; name: string }>;
}

// Dummy MarketStatusBar component for demonstration
const MarketStatusBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState<'trading' | 'closed' | 'pre-market'>('closed');

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

  const getMarketStatusBadge = () => {
    const badges = {
      'trading': { label: 'Trading', color: 'bg-green-500 text-white animate-pulse' },
      'pre-market': { label: 'Pre-Market', color: 'bg-blue-500 text-white' },
      'closed': { label: 'Closed', color: 'bg-muted text-muted-foreground' },
    };
    return badges[marketStatus];
  };

  const statusBadge = getMarketStatusBadge();
  const timeStr = formatTime(currentTime);

  return (
    <div className="flex items-center gap-2" data-testid="market-status-bar">
      <span className="font-mono text-xs font-medium" data-testid="text-current-time">{timeStr}</span>
      <Badge className={`${statusBadge.color} px-2 py-0.5 text-xs flex-shrink-0`} data-testid="badge-market-status">
        {statusBadge.label}
      </Badge>
    </div>
  );
}

export default function AppSidebar({ targetListNames, onTargetListClick, targetLists }: AppSidebarProps) {
  const [location] = useLocation();
  const [isTargetListsOpen, setIsTargetListsOpen] = useState(false);
  const [resetClickCount, setResetClickCount] = useState(0);
  const [appSize, setAppSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

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

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const dynamicTargetLists = targetLists ? targetLists.map((list, i) => ({
    title: list.name,
    url: `/target/${list.id}`,
    icon: targetListIcons[i] || Target,
    id: list.id
  })) : targetListNames ? targetListNames.map((name, i) => ({
    title: name,
    url: `/target/${i + 1}`,
    icon: targetListIcons[i] || Target
  })) : targetListItems;

  return (
    <Sidebar>
      {/* Removed the original SidebarHeader which contained the header line */}
      <div className="flex flex-col">
        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div className="flex flex-col">
              <h2 className="font-bold text-lg leading-tight" data-testid="text-app-name">K125</h2>
              <span className="text-xs text-muted-foreground">Trading System</span>
            </div>
            <Bell className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground ml-auto" />
          </div>
          <div className="flex items-center justify-evenly gap-0 px-2">
            <SidebarTrigger className="h-7 w-7 flex-shrink-0" />
            <MarketStatusBar />
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search stocks..." 
              className="pl-8 h-8 text-sm"
              data-testid="input-search"
            />
          </div>
        </div>
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link 
                      href={item.url} 
                      data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={(e) => {
                        if ((item.title === 'Main Matrix' || item.title === 'Previous Matrix') && onTargetListClick) {
                          e.preventDefault();
                          const listIndex = item.title === 'Main Matrix' ? -1 : -2;
                          onTargetListClick(listIndex);
                        }
                      }}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Target Lists</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dynamicTargetLists.map((item, i) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link 
                      href={item.url} 
                      data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={(e) => {
                        if (onTargetListClick) {
                          e.preventDefault();
                          onTargetListClick(i);
                        }
                      }}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => {
                if (item.title === "Settings") {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
                            data-testid="button-settings"
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start" side="right">
                          <DropdownMenuLabel>Account</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <User className="w-4 h-4 mr-2" />
                            Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User className="w-4 h-4 mr-2" />
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={toggleTheme}>
                            {theme === "light" ? (
                              <>
                                <Moon className="w-4 h-4 mr-2" />
                                Dark Mode
                              </>
                            ) : (
                              <>
                                <Sun className="w-4 h-4 mr-2" />
                                Light Mode
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger data-testid="menu-appsize">
                              <Maximize2 className="w-4 h-4 mr-2" />
                              App Size
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem 
                                onClick={() => handleAppSizeChange('small')} 
                                data-testid="menu-appsize-small"
                              >
                                Small {appSize === 'small' && '✓'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleAppSizeChange('medium')} 
                                data-testid="menu-appsize-medium"
                              >
                                Medium {appSize === 'medium' && '✓'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleAppSizeChange('large')} 
                                data-testid="menu-appsize-large"
                              >
                                Large {appSize === 'large' && '✓'}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={handleReset} 
                            data-testid="menu-reset"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset {resetClickCount === 1 ? '(Click again to recover)' : ''}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            Logout
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  );
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url}>
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}