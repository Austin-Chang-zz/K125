import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import MatrixTable, { StockData } from "@/components/MatrixTable";
import TargetListCard from "@/components/TargetListCard";
import ChartModal from "@/components/ChartModal";
import AlertBuilder from "@/components/AlertBuilder";

const mockMainData: StockData[] = [
  {
    code: '2330',
    name: 'TSMC',
    price: 595.00,
    change: 12.50,
    changePercent: 2.15,
    volume: 45230000,
    volumeValue: 26912000000,
    phase: 'A2',
    ma2: 590.25,
    ma10: 578.50,
    ma50: 545.30,
    maCross: 'XO',
    slope: 'up',
    sarCount: 5
  },
  {
    code: '2454',
    name: 'MediaTek',
    price: 1125.00,
    change: -15.00,
    changePercent: -1.32,
    volume: 12450000,
    volumeValue: 14006250000,
    phase: 'B1',
    ma2: 1135.50,
    ma10: 1148.20,
    ma50: 1165.80,
    maCross: 'XU',
    slope: 'down'
  },
  {
    code: '2317',
    name: 'Hon Hai',
    price: 185.50,
    change: 3.50,
    changePercent: 1.92,
    volume: 78920000,
    volumeValue: 14640020000,
    phase: 'Y',
    ma2: 183.75,
    ma10: 180.40,
    ma50: 175.20,
    slope: 'up',
    sarCount: 3
  },
  {
    code: '2303',
    name: 'UMC',
    price: 48.75,
    change: 0.85,
    changePercent: 1.78,
    volume: 95430000,
    volumeValue: 4652212500,
    phase: 'A1',
    ma2: 48.20,
    ma10: 47.30,
    ma50: 45.80,
    maCross: 'XO',
    slope: 'up',
    sarCount: 2
  },
  {
    code: '2412',
    name: 'Chunghwa Telecom',
    price: 125.50,
    change: -0.50,
    changePercent: -0.40,
    volume: 8920000,
    volumeValue: 1119460000,
    phase: 'X',
    ma2: 126.00,
    ma10: 127.20,
    ma50: 128.50,
    maCross: 'XU',
    slope: 'down'
  }
];

const mockPreviousData: StockData[] = [
  {
    code: '2882',
    name: 'Cathay Financial',
    price: 62.30,
    change: 1.20,
    changePercent: 1.96,
    volume: 42180000,
    volumeValue: 2627874000,
    phase: 'A3',
    ma2: 61.80,
    ma10: 60.40,
    ma50: 58.20,
    slope: 'up',
    sarCount: 8
  },
  {
    code: '2308',
    name: 'Delta Electronics',
    price: 348.50,
    change: -5.00,
    changePercent: -1.41,
    volume: 15230000,
    volumeValue: 5307655000,
    phase: 'B2',
    ma2: 352.00,
    ma10: 358.30,
    ma50: 365.20,
    maCross: 'XU',
    slope: 'down'
  },
  {
    code: '2881',
    name: 'Fubon Financial',
    price: 78.90,
    change: 2.10,
    changePercent: 2.73,
    volume: 28450000,
    volumeValue: 2244705000,
    phase: 'Y',
    ma2: 77.50,
    ma10: 75.80,
    ma50: 72.40,
    maCross: 'XO',
    slope: 'up',
    sarCount: 1
  }
];

const mockTargetStocks = [
  { code: '2330', name: 'TSMC', phase: 'A2' as const },
  { code: '2317', name: 'Hon Hai', phase: 'Y' as const },
  { code: '2303', name: 'UMC', phase: 'A1' as const }
];

export default function Dashboard() {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isAlertBuilderOpen, setIsAlertBuilderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleStockClick = (stock: StockData) => {
    setSelectedStock(stock);
    setIsChartOpen(true);
  };

  const handleAddToTargetList = (stock: StockData, listIndex: number) => {
    console.log(`Adding ${stock.code} to Target List ${listIndex}`);
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="heading-dashboard">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time market analysis and tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={handleRefresh}
            data-testid="button-refresh"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => setIsAlertBuilderOpen(true)}
            data-testid="button-create-alert"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-6 pt-4">
          <TabsList data-testid="tabs-view">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="main" data-testid="tab-main">Main Matrix</TabsTrigger>
            <TabsTrigger value="previous" data-testid="tab-previous">Previous Matrix</TabsTrigger>
            <TabsTrigger value="targets" data-testid="tab-targets">Target Lists</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="flex-1 px-6 pb-6 mt-4 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <MatrixTable 
              title="Main 100 (Today)"
              data={mockMainData}
              onStockClick={handleStockClick}
              onAddToTargetList={handleAddToTargetList}
            />
            <MatrixTable 
              title="Previous 100 (Yesterday)"
              data={mockPreviousData}
              onStockClick={handleStockClick}
              onAddToTargetList={handleAddToTargetList}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Quick Access - Target Lists</h3>
            <div className="grid grid-cols-3 gap-4">
              <TargetListCard 
                listNumber={1}
                title="High Priority"
                stocks={mockTargetStocks}
                onStockClick={(stock) => handleStockClick(stock as any)}
                onRemoveStock={(code) => console.log('Remove', code)}
              />
              <TargetListCard 
                listNumber={2}
                title="Phase Y Stocks"
                stocks={mockTargetStocks.slice(0, 2)}
                onStockClick={(stock) => handleStockClick(stock as any)}
                onRemoveStock={(code) => console.log('Remove', code)}
              />
              <TargetListCard 
                listNumber={3}
                stocks={[]}
                onStockClick={(stock) => handleStockClick(stock as any)}
                onRemoveStock={(code) => console.log('Remove', code)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="main" className="flex-1 px-6 pb-6 mt-4">
          <MatrixTable 
            title="Main 100 (VV100) - Current Day"
            data={mockMainData}
            onStockClick={handleStockClick}
            onAddToTargetList={handleAddToTargetList}
          />
        </TabsContent>

        <TabsContent value="previous" className="flex-1 px-6 pb-6 mt-4">
          <MatrixTable 
            title="Previous 100 - Yesterday"
            data={mockPreviousData}
            onStockClick={handleStockClick}
            onAddToTargetList={handleAddToTargetList}
          />
        </TabsContent>

        <TabsContent value="targets" className="flex-1 px-6 pb-6 mt-4">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <TargetListCard 
                key={i}
                listNumber={i}
                stocks={i === 1 ? mockTargetStocks : i === 2 ? mockTargetStocks.slice(0, 2) : []}
                onStockClick={(stock) => handleStockClick(stock as any)}
                onRemoveStock={(code) => console.log('Remove', code)}
                onAddStock={() => console.log('Add to list', i)}
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
