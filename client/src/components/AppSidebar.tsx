import { useState } from "react";
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
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
      window.postMessage({
        type: 'RESET_TARGET_LISTS',
        clearData: true
      }, window.location.origin);
      setTimeout(() => setResetClickCount(0), 3000);
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
              {toolItems.filter(item => item.title !== 'Settings').map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton data-testid="link-settings">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-56">
                    <DropdownMenuItem onClick={handleReset}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset {resetClickCount === 1 ? '(Click again to recover)' : ''}
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Maximize2 className="w-4 h-4 mr-2" />
                        App Size
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => handleAppSizeChange('small')}>
                          Small {appSize === 'small' && '✓'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAppSizeChange('medium')}>
                          Medium {appSize === 'medium' && '✓'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAppSizeChange('large')}>
                          Large {appSize === 'large' && '✓'}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}