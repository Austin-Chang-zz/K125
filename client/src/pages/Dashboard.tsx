import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import MatrixTable from "@/components/MatrixTable";
import TargetListCard from "@/components/TargetListCard";
import ChartModal from "@/components/ChartModal";
import AlertBuilder from "@/components/AlertBuilder";
import TargetListModal from "@/components/TargetListModal";
import { generateMainMatrix, generatePreviousMatrix, mockTargetLists, type StockData } from "@/lib/mockData";

export default function Dashboard() {
  const [mainData] = useState<StockData[]>(generateMainMatrix());
  const [previousData] = useState<StockData[]>(generatePreviousMatrix());
  const [targetLists, setTargetLists] = useState(mockTargetLists);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isAlertBuilderOpen, setIsAlertBuilderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("main");
  const [expandedList, setExpandedList] = useState<{ id: string; name: string; stocks: StockData[] } | null>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [selectedTargetListId, setSelectedTargetListId] = useState<string | null>(null);

  const handleStockClick = (stock: StockData) => {
    setSelectedStock(stock);
    setIsChartOpen(true);
  };

  const handleAddToTargetList = (stock: StockData, listName: string) => {
    console.log(`Adding ${stock.code} to ${listName}`);
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  const handleUpdateTargetListName = (listId: string, newName: string) => {
    setTargetLists(targetLists.map(list => 
      list.id === listId ? { ...list, name: newName } : list
    ));
  };

  const handleRemoveStockFromList = (listId: string, stockCode: string) => {
    setTargetLists(targetLists.map(list => 
      list.id === listId 
        ? { ...list, stocks: list.stocks.filter(s => s.code !== stockCode) }
        : list
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {!isHeaderCollapsed && (
        <div className="flex items-center justify-between px-6 py-3 border-b bg-muted/10">
          <div>
            <h1 className="text-xl font-semibold tracking-tight" data-testid="heading-dashboard">K125 Trading System</h1>
            <p className="text-xs text-muted-foreground">
              Kostolany Egg Theory • Real-time VV100 Analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              size="sm"
              onClick={() => setIsAlertBuilderOpen(true)}
              data-testid="button-create-alert"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Alert
            </Button>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-3 border-b bg-muted/5 flex items-center justify-between">
          <TabsList className="h-9" data-testid="tabs-view">
            <TabsTrigger value="main" className="text-xs" data-testid="tab-main">Main Matrix</TabsTrigger>
            <TabsTrigger value="previous" className="text-xs" data-testid="tab-previous">Previous Matrix</TabsTrigger>
            <TabsTrigger value="targets" className="text-xs" data-testid="tab-targets">Target Cards</TabsTrigger>
            {targetLists.map((list) => (
              <TabsTrigger 
                key={list.id} 
                value={`target-${list.id}`} 
                className="text-xs" 
                data-testid={`tab-target-${list.id}`}
              >
                {list.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
              data-testid="button-toggle-header"
            >
              {isHeaderCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <TabsContent value="main" className="flex-1 overflow-auto px-6 py-4 mt-0">
          <MatrixTable 
            title="Main 100 - Today's Volume value Leaders"
            data={mainData}
            onStockClick={handleStockClick}
            onAddToTargetList={handleAddToTargetList}
            targetListNames={targetLists.map(list => list.name)}
          />
        </TabsContent>

        <TabsContent value="previous" className="flex-1 overflow-auto px-6 py-4 mt-0">
          <MatrixTable 
            title="Previous 100 - Yesterday's Volume value Leaders"
            data={previousData}
            onStockClick={handleStockClick}
            onAddToTargetList={handleAddToTargetList}
            targetListNames={targetLists.map(list => list.name)}
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
                onClearAll={() => setTargetLists(targetLists.map(l => 
                  l.id === list.id ? { ...l, stocks: [] } : l
                ))}
              />
            ))}
          </div>
        </TabsContent>

        {targetLists.map((list) => (
          <TabsContent key={`target-${list.id}`} value={`target-${list.id}`} className="flex-1 overflow-auto px-6 py-4 mt-0">
            <MatrixTable 
              title={list.name}
              data={list.stocks}
              onStockClick={handleStockClick}
              onAddToTargetList={handleAddToTargetList}
              isTargetList={true}
              onRemoveStock={(stock) => handleRemoveStockFromList(list.id, stock.code)}
              targetListNames={targetLists.map(l => l.name)}
            />
          </TabsContent>
        ))}
      </Tabs>

      {selectedStock && (
        <ChartModal 
          isOpen={isChartOpen}
          onClose={() => setIsChartOpen(false)}
          stockCode={selectedStock.code}
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
