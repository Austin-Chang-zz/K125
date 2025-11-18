import { Route, Switch } from "wouter";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import TopBar from "@/components/TopBar";
import Dashboard from "@/pages/Dashboard";
import Messages from "@/pages/Messages";
import NotFound from "@/pages/not-found";

function App() {
  const [targetLists, setTargetLists] = useState<string[]>([
    "Target List 1",
    "Target List 2",
    "Target List 3",
    "Target List 4",
    "Target List 5",
    "Target List 6",
    "Target List 7",
  ]);

  const onNavigateToTarget = (index: number) => {
    console.log(`Navigate to target: ${index}`);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar targetListNames={targetLists} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/">
                <Dashboard onNavigateToTarget={onNavigateToTarget} />
              </Route>
              <Route path="/charts">
                <Dashboard onNavigateToTarget={onNavigateToTarget} />
              </Route>
              <Route path="/messages">
                <Messages />
              </Route>
              <Route path="/alerts">
                <Dashboard onNavigateToTarget={onNavigateToTarget} />
              </Route>
              <Route path="/settings">
                <Dashboard onNavigateToTarget={onNavigateToTarget} />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

export default App;