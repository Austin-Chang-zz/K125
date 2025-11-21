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
  Maximize2
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
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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

export default function AppSidebar({ targetListNames, onTargetListClick, targetLists }: AppSidebarProps) {
  const [location] = useLocation();
  const [isTargetListsOpen, setIsTargetListsOpen] = useState(false);
  const [resetClickCount, setResetClickCount] = useState(0);
  const [appSize, setAppSize] = useState<'small' | 'medium' | 'large'>('medium');

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
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-base" data-testid="text-app-name">K125</h2>
            <p className="text-xs text-muted-foreground">Trading System</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
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
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <SidebarMenuButton isActive={location === item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2" align="start">
                          <div className="flex flex-col gap-1">
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start" 
                              onClick={handleReset} 
                              data-testid="menu-reset"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Reset {resetClickCount === 1 ? '(Click again to recover)' : ''}
                            </Button>
                            <div className="px-2 py-1.5 text-sm font-semibold">
                              App Size
                            </div>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start pl-6" 
                              onClick={() => handleAppSizeChange('small')} 
                              data-testid="menu-appsize-small"
                            >
                              Small {appSize === 'small' && '✓'}
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start pl-6" 
                              onClick={() => handleAppSizeChange('medium')} 
                              data-testid="menu-appsize-medium"
                            >
                              Medium {appSize === 'medium' && '✓'}
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start pl-6" 
                              onClick={() => handleAppSizeChange('large')} 
                              data-testid="menu-appsize-large"
                            >
                              Large {appSize === 'large' && '✓'}
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
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