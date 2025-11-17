import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import TopBar from "@/components/TopBar";
import Dashboard from "@/pages/Dashboard";
import Messages from "@/pages/Messages";
import NotFound from "@/pages/not-found";
import { mockTargetLists } from "@/lib/mockData";

function Router({ onNavigateToTarget }: { onNavigateToTarget?: (index: number) => void }) {
  return (
    <Switch>
      <Route path="/">
        {() => <Dashboard onNavigateToTarget={onNavigateToTarget} />}
      </Route>
      <Route path="/main-matrix">
        {() => <Dashboard onNavigateToTarget={onNavigateToTarget} />}
      </Route>
      <Route path="/previous-matrix">
        {() => <Dashboard onNavigateToTarget={onNavigateToTarget} />}
      </Route>
      <Route path="/target/:id">
        {() => <Dashboard onNavigateToTarget={onNavigateToTarget} />}
      </Route>
      <Route path="/charts">
        {() => <Dashboard onNavigateToTarget={onNavigateToTarget} />}
      </Route>
      <Route path="/messages" component={Messages} />
      <Route path="/alerts">
        {() => <Dashboard onNavigateToTarget={onNavigateToTarget} />}
      </Route>
      <Route path="/settings">
        {() => <Dashboard onNavigateToTarget={onNavigateToTarget} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [targetListNames, setTargetListNames] = useState(mockTargetLists.map(list => list.name));
  const [targetNavigationTrigger, setTargetNavigationTrigger] = useState<number | null>(null);

  const style = {
    "--sidebar-width": "16rem",
  };

  const handleTargetListClick = (index: number) => {
    setTargetNavigationTrigger(index);
  };

  const handleTargetListNamesUpdate = (names: string[]) => {
    setTargetListNames(names);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar 
              targetListNames={targetListNames}
              onTargetListClick={handleTargetListClick}
            />
            <div className="flex flex-col flex-1 overflow-hidden">
              <TopBar notificationCount={3} />
              <main className="flex-1 overflow-y-auto">
                <Router onNavigateToTarget={(index) => {
                  setTargetNavigationTrigger(index);
                }} />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;