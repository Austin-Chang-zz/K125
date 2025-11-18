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
  ChevronRight
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
];

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
}

export default function AppSidebar({ targetListNames, onTargetListClick }: AppSidebarProps) {
  const [location] = useLocation();
  const [isTargetListsOpen, setIsTargetListsOpen] = useState(false);

  const dynamicTargetLists = targetListNames ? targetListNames.map((name, i) => ({
    title: name,
    url: `/target/${i + 1}`,
    icon: Target
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
          <SidebarGroupLabel>Main</SidebarGroupLabel>
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
          <Collapsible open={isTargetListsOpen} onOpenChange={setIsTargetListsOpen}>
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="cursor-pointer hover:bg-accent flex items-center justify-between px-2 py-1 rounded-md">
                    <span>Target Lists</span>
                    {isTargetListsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem 
                  onClick={() => {
                    onTargetListClick?.(-1);
                    window.location.hash = 'targets';
                  }}
                >
                  Target Cards
                </ContextMenuItem>
                {dynamicTargetLists.map((item, i) => (
                  <ContextMenuItem 
                    key={i} 
                    onClick={() => {
                      onTargetListClick?.(i);
                      window.location.hash = `target-${i + 1}`;
                    }}
                  >
                    {item.title}
                  </ContextMenuItem>
                ))}
              </ContextMenuContent>
            </ContextMenu>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === '/targets'}>
                      <Link href="/targets" data-testid="link-target-cards">
                        <Target className="w-4 h-4" />
                        <span>Target Cards</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  );
}