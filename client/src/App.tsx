import { Route, Switch } from "wouter";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Dashboard from "@/pages/Dashboard";
import Messages from "@/pages/Messages";
import NotFound from "@/pages/not-found";
import StockScreener from "@/components/StockScreener";
import { mockTargetLists, generateMainMatrix, generatePreviousMatrix } from "@/lib/mockData";

function App() {
  const [targetLists, setTargetLists] = useState<Array<{ id: string; name: string }>>(
    mockTargetLists.map(list => ({ id: list.id, name: list.name }))
  );

  const [savedTargetLists, setSavedTargetLists] = useState<Array<{ id: string; name: string }> | null>(null);
  const [screenerListId, setScreenerListId] = useState<string | null>(null);
  const [mainMatrixData] = useState(generateMainMatrix());
  const [previousMatrixData] = useState(generatePreviousMatrix());


  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from same origin for security
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'TARGET_LIST_ORDER_UPDATE') {
        console.log('Received order update:', event.data.lists);
        setTargetLists(event.data.lists);
      } else if (event.data.type === 'TARGET_LIST_NAMES_UPDATE') {
        console.log('Received names update:', event.data.lists);
        setTargetLists(event.data.lists);
      } else if (event.data.type === 'RESET_TARGET_LISTS') {
        if (event.data.clearData) {
          // Save current state before clearing
          setSavedTargetLists(targetLists);
          // Reset to default and broadcast to Dashboard to clear stocks
          const resetLists = [
            { id: "1", name: "Target List 1" },
            { id: "2", name: "Target List 2" },
            { id: "3", name: "Target List 3" },
            { id: "4", name: "Target List 4" },
            { id: "5", name: "Target List 5" },
            { id: "6", name: "Target List 6" },
          ];
          setTargetLists(resetLists);
          // Notify Dashboard to clear stocks
          window.postMessage({
            type: 'CLEAR_ALL_TARGET_STOCKS',
            lists: resetLists
          }, window.location.origin);
        } else {
          // Recover saved state
          if (savedTargetLists) {
            setTargetLists(savedTargetLists);
            setSavedTargetLists(null);
            // Notify Dashboard to restore stocks
            window.postMessage({
              type: 'RESTORE_TARGET_LISTS',
              lists: savedTargetLists
            }, window.location.origin);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [targetLists, savedTargetLists]);

  const onNavigateToTarget = (index: number) => {
    console.log(`Navigate to target: ${index}`);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar
          targetLists={targetLists}
          onTargetListClick={(index) => {
            if (index === -1) {
              setScreenerListId('main-matrix');
            } else if (index === -2) {
              setScreenerListId('previous-matrix');
            } else {
              const list = mockTargetLists[index];
              if (list) {
                setScreenerListId(list.id);
              }
            }
          }}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto">
            {screenerListId ? (
              <StockScreener
                listName={
                  screenerListId === 'main-matrix' ? 'Main 100' :
                  screenerListId === 'previous-matrix' ? 'Previous 100' :
                  targetLists.find(l => l.id === screenerListId)?.name || 'Target List'
                }
                stocks={
                  screenerListId === 'main-matrix' ? mainMatrixData :
                  screenerListId === 'previous-matrix' ? previousMatrixData :
                  mockTargetLists.find(l => l.id === screenerListId)?.stocks || []
                }
                onClose={() => setScreenerListId(null)}
              />
            ) : (
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
            )}
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

export default App;