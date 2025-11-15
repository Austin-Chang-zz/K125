import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import MatrixTable from "@/components/MatrixTable";
import TargetListCard from "@/components/TargetListCard";
import ChartModal from "@/components/ChartModal";
import AlertBuilder from "@/components/AlertBuilder";
import MarketStatusBar from "@/components/MarketStatusBar";
import { generateMainMatrix, generatePreviousMatrix, mockTargetLists, type StockData } from "@/lib/mockData";

export default function Dashboard() {
  const [mainData] = useState<StockData[]>(generateMainMatrix());
  const [previousData] = useState<StockData[]>(generatePreviousMatrix());
  const [targetLists] = useState(mockTargetLists);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isAlertBuilderOpen, setIsAlertBuilderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("main");

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

  return (
    <div className="h-full flex flex-col">
      <MarketStatusBar />
      
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-3 border-b bg-muted/5">
          <TabsList className="h-9" data-testid="tabs-view">
            <TabsTrigger value="main" className="text-xs" data-testid="tab-main">Main Matrix</TabsTrigger>
            <TabsTrigger value="previous" className="text-xs" data-testid="tab-previous">Previous Matrix</TabsTrigger>
            <TabsTrigger value="targets" className="text-xs" data-testid="tab-targets">Target Lists</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="main" className="flex-1 overflow-auto px-6 py-4 mt-0">
          <MatrixTable 
            title="Main 100 (VV100) - Today's Volume Leaders"
            data={mainData}
            onStockClick={handleStockClick}
            onAddToTargetList={handleAddToTargetList}
          />
        </TabsContent>

        <TabsContent value="previous" className="flex-1 overflow-auto px-6 py-4 mt-0">
          <MatrixTable 
            title="Previous 100 - Yesterday's Volume Leaders"
            data={previousData}
            onStockClick={handleStockClick}
            onAddToTargetList={handleAddToTargetList}
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
                onRemoveStock={(code) => console.log('Remove', code)}
                onAddStock={() => console.log('Add to list', list.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedStock && (
        <ChartModal 
          isOpen={isChartOpen}
          onClose={() => setIsChartOpen(false)}
          stockCode={selectedStock.code}
          stockName={selectedStock.name}
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
