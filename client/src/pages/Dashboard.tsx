import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Plus, RefreshCw, ChevronUp, ChevronDown, MoreVertical, Save } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import MatrixTable from "@/components/MatrixTable";
import TargetListCard from "@/components/TargetListCard";
import AnalysisPlatform from "@/components/AnalysisPlatform";
import AlertBuilder from "@/components/AlertBuilder";
import TargetListModal from "@/components/TargetListModal";
import { generateMainMatrix, generatePreviousMatrix, mockTargetLists, type StockData } from "@/lib/mockData";


interface DashboardProps {
  onNavigateToTarget?: (index: number) => void;
}

export default function Dashboard({ onNavigateToTarget }: DashboardProps) {
  const [mainData, setMainData] = useState<StockData[]>(generateMainMatrix());
  const [previousData, setPreviousData] = useState<StockData[]>(generatePreviousMatrix());
  const [targetLists, setTargetLists] = useState(mockTargetLists);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isAnalysisPlatformOpen, setIsAnalysisPlatformOpen] = useState(false); // Renamed from isChartOpen
  const [isAlertBuilderOpen, setIsAlertBuilderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("main");
  const [expandedList, setExpandedList] = useState<{ id: string; name: string; stocks: StockData[] } | null>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [selectedTargetListId, setSelectedTargetListId] = useState<string | null>(null);
  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null);
  const [dragOverTabIndex, setDragOverTabIndex] = useState<number | null>(null);
  const [pendingTabOrder, setPendingTabOrder] = useState<typeof targetLists | null>(null);
  const [matrixListLength, setMatrixListLength] = useState<number>(100);
  const [groupOrder, setGroupOrder] = useState<'main-first' | 'targets-first'>('main-first');
  const [isDraggingGroup, setIsDraggingGroup] = useState<'main' | 'targets' | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'CLEAR_ALL_TARGET_STOCKS') {
        // Clear all stocks from target lists but keep the names from reset
        const clearedLists = event.data.lists.map((list: { id: string; name: string }) => ({
          ...list,
          stocks: []
        }));
        setTargetLists(clearedLists);
      } else if (event.data.type === 'RESTORE_TARGET_LISTS') {
        // Restore the saved lists (this would need full data including stocks)
        // For now, just restore the names
        setTargetLists(event.data.lists);
      }
    };

    window.addEventListener('message', handleMessage);

    // Load saved group order from localStorage
    const savedGroupOrder = localStorage.getItem('dashboard-group-order');
    if (savedGroupOrder === 'targets-first' || savedGroupOrder === 'main-first') {
      setGroupOrder(savedGroupOrder);
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleStockClick = (stock: StockData) => {
    setSelectedStock(stock);
    setIsAnalysisPlatformOpen(true); // Changed to open AnalysisPlatform
  };

  const handleAddToTargetList = (stock: StockData, listName: string) => {
    console.log(`Adding ${stock.code} to ${listName}`);
    setTargetLists(targetLists.map(list => {
      if (list.name === listName) {
        // Check if stock already exists in the list
        const stockExists = list.stocks.some(s => s.code === stock.code);
        if (!stockExists) {
          return { ...list, stocks: [...list.stocks, stock] };
        }
      }
      return list;
    }));
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
    // Fetch new data
    setMainData(generateMainMatrix());
    setPreviousData(generatePreviousMatrix());
    setTargetLists(mockTargetLists); // Reset target lists for simplicity in mock
  };

  const handleUpdateTargetListName = (listId: string, newName: string) => {
    const updatedLists = targetLists.map(list => 
      list.id === listId ? { ...list, name: newName } : list
    );
    setTargetLists(updatedLists);

    // Also update pending order if it exists
    if (pendingTabOrder) {
      setPendingTabOrder(pendingTabOrder.map(list => 
        list.id === listId ? { ...list, name: newName } : list
      ));
    }

    // Notify App component about name changes for sidebar synchronization
    window.postMessage({
      type: 'TARGET_LIST_NAMES_UPDATE',
      lists: updatedLists.map(l => ({ id: l.id, name: l.name }))
    }, window.location.origin);
  };

  const handleRemoveStockFromList = (listId: string, stockCode: string) => {
    setTargetLists(targetLists.map(list => 
      list.id === listId 
        ? { ...list, stocks: list.stocks.filter(s => s.code !== stockCode) }
        : list
    ));
  };

  const handleClearTargetList = (listId: string) => {
    setTargetLists(targetLists.map(list => 
      list.id === listId ? { ...list, stocks: [] } : list
    ));
  };

  const handleClearMainMatrix = () => {
    console.log('Clearing main matrix');
    setMainData([]);
  };

  const handleClearPreviousMatrix = () => {
    console.log('Clearing previous matrix');
    setPreviousData([]);
  };

  const handleClearTargetMatrix = (listId: string) => {
    setTargetLists(targetLists.map(list => 
      list.id === listId ? { ...list, stocks: [] } : list
    ));
  };

  const handleTabDragStart = (e: React.DragEvent, index: number) => {
    setDraggedTabIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTabDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedTabIndex !== null && draggedTabIndex !== index) {
      setDragOverTabIndex(index);
    }
  };

  const handleTabDragEnd = () => {
    if (draggedTabIndex !== null && dragOverTabIndex !== null && draggedTabIndex !== dragOverTabIndex) {
      const newTargetLists = [...targetLists];
      const draggedItem = newTargetLists[draggedTabIndex];
      newTargetLists.splice(draggedTabIndex, 1);
      newTargetLists.splice(dragOverTabIndex, 0, draggedItem);
      setPendingTabOrder(newTargetLists);
    }
    setDraggedTabIndex(null);
    setDragOverTabIndex(null);
  };

  const handleGroupDragStart = (e: React.DragEvent, group: 'main' | 'targets') => {
    setIsDraggingGroup(group);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleGroupDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleGroupDrop = (e: React.DragEvent, dropGroup: 'main' | 'targets') => {
    e.preventDefault();
    if (isDraggingGroup && isDraggingGroup !== dropGroup) {
      // Swap the order
      const newOrder = groupOrder === 'main-first' ? 'targets-first' : 'main-first';
      setGroupOrder(newOrder);
      // Save to localStorage immediately
      localStorage.setItem('dashboard-group-order', newOrder);
      console.log('Group order updated and saved:', newOrder);
    }
    setIsDraggingGroup(null);
  };

  const handleGroupDragEnd = () => {
    setIsDraggingGroup(null);
  };

  const handleSaveTabOrder = () => {
    if (pendingTabOrder) {
      setTargetLists(pendingTabOrder);

      // Notify App component about order changes for sidebar synchronization
      window.postMessage({
        type: 'TARGET_LIST_ORDER_UPDATE',
        lists: pendingTabOrder.map(l => ({ id: l.id, name: l.name }))
      }, window.location.origin);

      console.log("Tab order saved:", pendingTabOrder.map(l => l.name));
      setPendingTabOrder(null);
    }
  };

  // Get current display order (pending or actual)
  const displayTargetLists = pendingTabOrder || targetLists;

  const handleSave = () => {
    console.log("Saving current state...");
    // In a real application, this would involve sending the current state 
    // (mainData, previousData, targetLists, etc.) to a backend API.
    // For this example, we'll just log it.
    const currentState = {
      mainData,
      previousData,
      targetLists,
      // ... other relevant states
    };
    console.log("Current state to save:", currentState);
    alert("Dashboard state saved!");
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-3 border-b bg-muted/5">
          <div className="flex items-center gap-2 mb-3">
            <SidebarTrigger className="h-7 w-7 flex-shrink-0" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-folder-menu">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem 
                  onClick={handleSave}
                  data-testid="menuitem-save-list"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save List
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSaveTabOrder}
                  disabled={!pendingTabOrder}
                  data-testid="menuitem-save-order"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Folder Order
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    // Save group order to localStorage
                    localStorage.setItem('dashboard-group-order', groupOrder);
                    console.log('Group order saved:', groupOrder);
                  }}
                  data-testid="menuitem-save-group"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Group Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-4 flex-1">
              {groupOrder === 'main-first' ? (
                <>
                  <div 
                    className={`px-4 cursor-move ${isDraggingGroup === 'main' ? 'opacity-50' : ''} ${isDraggingGroup === 'targets' ? 'border-2 border-dashed border-primary rounded-md' : ''}`}
                    draggable
                    onDragStart={(e) => handleGroupDragStart(e, 'main')}
                    onDragOver={handleGroupDragOver}
                    onDrop={(e) => handleGroupDrop(e, 'main')}
                    onDragEnd={handleGroupDragEnd}
                  >
                    <TabsList className="h-9 px-2" data-testid="tabs-view-main">
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <TabsTrigger value="main" className="text-xs" data-testid="tab-main">Main Matrix</TabsTrigger>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem onClick={() => setMatrixListLength(20)} data-testid="menu-length-20">
                            20 {matrixListLength === 20 && '✓'}
                          </ContextMenuItem>
                          <ContextMenuItem onClick={() => setMatrixListLength(30)} data-testid="menu-length-30">
                            30 {matrixListLength === 30 && '✓'}
                          </ContextMenuItem>
                          <ContextMenuItem onClick={() => setMatrixListLength(50)} data-testid="menu-length-50">
                            50 {matrixListLength === 50 && '✓'}
                          </ContextMenuItem>
                          <ContextMenuItem onClick={() => setMatrixListLength(100)} data-testid="menu-length-100">
                            100 {matrixListLength === 100 && '✓'}
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                      <TabsTrigger value="previous" className="text-xs cursor-default" data-testid="tab-previous">Previous Matrix</TabsTrigger>
                      <TabsTrigger value="targets" className="text-xs cursor-default" data-testid="tab-targets">Target Cards</TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="h-6 w-[3px] bg-primary/80 rounded-full"></div>
                  <div 
                    className={`px-4 cursor-move ${isDraggingGroup === 'targets' ? 'opacity-50' : ''} ${isDraggingGroup === 'main' && groupOrder === 'main-first' ? 'border-2 border-dashed border-primary rounded-md' : ''}`}
                    draggable
                    onDragStart={(e) => handleGroupDragStart(e, 'targets')}
                    onDragOver={handleGroupDragOver}
                    onDrop={(e) => handleGroupDrop(e, 'targets')}
                    onDragEnd={handleGroupDragEnd}
                  >
                    <TabsList className="h-9 px-2 gap-1" data-testid="tabs-view-targets">
                      {displayTargetLists.map((list, index) => {
                        const isDragging = draggedTabIndex === index;
                        const isDragOver = dragOverTabIndex === index;
                        return (
                          <div key={list.id} className="flex items-center gap-1">
                            {index > 0 && (
                              <div className="h-5 w-[2px] bg-primary/80 rounded-full" />
                            )}
                            <TabsTrigger 
                              value={`target-${list.id}`} 
                              className={`text-xs cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-l-2 border-primary' : ''}`}
                              data-testid={`tab-target-${list.id}`}
                              draggable
                              onDragStart={(e) => handleTabDragStart(e, index)}
                              onDragOver={(e) => handleTabDragOver(e, index)}
                              onDragEnd={handleTabDragEnd}
                            >
                              {list.name}
                            </TabsTrigger>
                          </div>
                        );
                      })}
                    </TabsList>
                  </div>
                </>
              ) : (
                <>
                  <div 
                    className={`px-4 cursor-move ${isDraggingGroup === 'targets' ? 'opacity-50' : ''} ${isDraggingGroup === 'main' ? 'border-2 border-dashed border-primary rounded-md' : ''}`}
                    draggable
                    onDragStart={(e) => handleGroupDragStart(e, 'targets')}
                    onDragOver={handleGroupDragOver}
                    onDrop={(e) => handleGroupDrop(e, 'targets')}
                    onDragEnd={handleGroupDragEnd}
                  >
                    <TabsList className="h-9 px-2 gap-1" data-testid="tabs-view-targets">
                      {displayTargetLists.map((list, index) => {
                        const isDragging = draggedTabIndex === index;
                        const isDragOver = dragOverTabIndex === index;
                        return (
                          <div key={list.id} className="flex items-center gap-1">
                            {index > 0 && (
                              <div className="h-5 w-[2px] bg-primary/80 rounded-full" />
                            )}
                            <TabsTrigger 
                              value={`target-${list.id}`} 
                              className={`text-xs cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-l-2 border-primary' : ''}`}
                              data-testid={`tab-target-${list.id}`}
                              draggable
                              onDragStart={(e) => handleTabDragStart(e, index)}
                              onDragOver={(e) => handleTabDragOver(e, index)}
                              onDragEnd={handleTabDragEnd}
                            >
                              {list.name}
                            </TabsTrigger>
                          </div>
                        );
                      })}
                    </TabsList>
                  </div>
                  <div className="h-6 w-[3px] bg-primary/80 rounded-full"></div>
                  <div 
                    className={`px-4 cursor-move ${isDraggingGroup === 'main' ? 'opacity-50' : ''} ${isDraggingGroup === 'targets' && groupOrder === 'targets-first' ? 'border-2 border-dashed border-primary rounded-md' : ''}`}
                    draggable
                    onDragStart={(e) => handleGroupDragStart(e, 'main')}
                    onDragOver={handleGroupDragOver}
                    onDrop={(e) => handleGroupDrop(e, 'main')}
                    onDragEnd={handleGroupDragEnd}
                  >
                    <TabsList className="h-9 px-2" data-testid="tabs-view-main">
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <TabsTrigger value="main" className="text-xs" data-testid="tab-main">Main Matrix</TabsTrigger>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem onClick={() => setMatrixListLength(20)} data-testid="menu-length-20">
                            20 {matrixListLength === 20 && '✓'}
                          </ContextMenuItem>
                          <ContextMenuItem onClick={() => setMatrixListLength(30)} data-testid="menu-length-30">
                            30 {matrixListLength === 30 && '✓'}
                          </ContextMenuItem>
                          <ContextMenuItem onClick={() => setMatrixListLength(50)} data-testid="menu-length-50">
                            50 {matrixListLength === 50 && '✓'}
                          </ContextMenuItem>
                          <ContextMenuItem onClick={() => setMatrixListLength(100)} data-testid="menu-length-100">
                            100 {matrixListLength === 100 && '✓'}
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                      <TabsTrigger value="previous" className="text-xs cursor-default" data-testid="tab-previous">Previous Matrix</TabsTrigger>
                      <TabsTrigger value="targets" className="text-xs cursor-default" data-testid="tab-targets">Target Cards</TabsTrigger>
                    </TabsList>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <TabsContent value="main" className="flex-1 overflow-auto px-6 py-4 mt-0">
          <MatrixTable 
            title={`Main ${matrixListLength} - Today's Volume value Leaders`}
            data={mainData.slice(0, matrixListLength)}
            onStockClick={handleStockClick}
            onAddToTargetList={handleAddToTargetList}
            targetListNames={targetLists.map(list => list.name)}
            onClearAll={handleClearMainMatrix}
            onDataReorder={(newData) => setMainData(newData)}
          />
        </TabsContent>

        <TabsContent value="previous" className="flex-1 overflow-auto px-6 py-4 mt-0">
          <MatrixTable 
            title={`Previous ${matrixListLength} - Yesterday's Volume value Leaders`}
            data={previousData.slice(0, matrixListLength)}
            onStockClick={handleStockClick}
            onAddToTargetList={handleAddToTargetList}
            targetListNames={targetLists.map(list => list.name)}
            onClearAll={handleClearPreviousMatrix}
            onDataReorder={(newData) => setPreviousData(newData)}
          />
        </TabsContent>

        <TabsContent value="targets" className="flex-1 overflow-auto px-6 py-4 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {targetLists.map((list) => (
              <TargetListCard 
                key={list.id}
                listNumber={parseInt(list.id)}
                title={list.name}
                stocks={list.stocks.map(s => ({
                  code: s.code,
                  name: s.name,
                  phase: s.eggPhase
                }))}
                onStockClick={(stock) => {
                  const fullStock = list.stocks.find(s => s.code === stock.code);
                  if (fullStock) handleStockClick(fullStock);
                }}
                onRemoveStock={(code) => handleRemoveStockFromList(list.id, code)}
                onAddStock={() => console.log('Add to list', list.id)}
                onExpand={() => setExpandedList(list)}
                onTitleChange={(newName) => handleUpdateTargetListName(list.id, newName)}
                onClearAll={() => handleClearTargetList(list.id)}
              />
            ))}
          </div>
        </TabsContent>

        {displayTargetLists.map((list) => (
          <TabsContent key={`target-${list.id}`} value={`target-${list.id}`} className="flex-1 overflow-auto px-6 py-4 mt-0">
            <MatrixTable 
              title={list.name}
              data={list.stocks}
              onStockClick={handleStockClick}
              onAddToTargetList={handleAddToTargetList}
              isTargetList={true}
              onRemoveStock={(stock) => handleRemoveStockFromList(list.id, stock.code)}
              targetListNames={displayTargetLists.map(l => l.name)}
              onClearAll={() => handleClearTargetMatrix(list.id)}
              onTitleChange={(newName) => handleUpdateTargetListName(list.id, newName)}
              onDataReorder={(newData) => {
                const currentLists = pendingTabOrder || targetLists;
                const updatedLists = currentLists.map(l => 
                  l.id === list.id ? { ...l, stocks: newData } : l
                );
                if (pendingTabOrder) {
                  setPendingTabOrder(updatedLists);
                } else {
                  setTargetLists(updatedLists);
                }
              }}
            />
          </TabsContent>
        ))}
      </Tabs>

      {selectedStock && (
        <AnalysisPlatform 
          isOpen={isAnalysisPlatformOpen}
          onClose={() => setIsAnalysisPlatformOpen(false)}
          stockSymbol={selectedStock.code}
          stockName={selectedStock.name}
        />
      )}

      {expandedList && (
        <TargetListModal
          isOpen={true}
          onClose={() => setExpandedList(null)}
          title={expandedList.name}
          stocks={expandedList.stocks}
          onStockClick={handleStockClick}
          onAddToTargetList={handleAddToTargetList}
          onRemoveStock={(stock) => {
            handleRemoveStockFromList(expandedList.id, stock.code);
            setExpandedList({
              ...expandedList,
              stocks: expandedList.stocks.filter(s => s.code !== stock.code)
            });
          }}
          onDataReorder={(newData) => {
            // Update the expanded list and the main target lists
            setExpandedList({
              ...expandedList,
              stocks: newData
            });
            setTargetLists(targetLists.map(l => 
              l.id === expandedList.id ? { ...l, stocks: newData } : l
            ));
          }}
          targetListNames={targetLists.map(list => list.name)}
        />
      )}

      <AlertBuilder 
        isOpen={isAlertBuilderOpen}
        onClose={() => setIsAlertBuilderOpen(false)}
        onSave={(alert) => console.log('Alert saved:', alert)}
      />
    </div>
  );
}