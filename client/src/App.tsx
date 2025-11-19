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
  const [targetLists, setTargetLists] = useState<Array<{ id: string; name: string }>>([
    { id: "1", name: "Target List 1" },
    { id: "2", name: "Target List 2" },
    { id: "3", name: "Target List 3" },
    { id: "4", name: "Target List 4" },
    { id: "5", name: "Target List 5" },
    { id: "6", name: "Target List 6" },
  ]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TARGET_LIST_ORDER_UPDATE') {
        // Synchronize sidebar order with dashboard folder order
        setTargetLists(event.data.lists);
      } else if (event.data.type === 'TARGET_LIST_NAMES_UPDATE') {
        // Synchronize sidebar names with dashboard folder names
        setTargetLists(event.data.lists);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const onNavigateToTarget = (index: number) => {
    console.log(`Navigate to target: ${index}`);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar targetLists={targetLists} />
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