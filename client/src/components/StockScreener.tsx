import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import MatrixTable from '@/components/MatrixTable';
import AnalysisPlatform from '@/components/AnalysisPlatform';

interface StockScreenerProps {
  listName: string;
  stocks: any[];
  onClose: () => void;
}

export default function StockScreener({ listName, stocks, onClose }: StockScreenerProps) {
  const [selectedStock, setSelectedStock] = useState(stocks[0] || null);

  const handleStockClick = (stock: any) => {
    setSelectedStock(stock);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-7 w-7 flex-shrink-0" />
          <h1 className="text-xl font-semibold">{listName} - Stock Screener</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Matrix List */}
        <div className="w-[400px] border-r flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-4">
            <MatrixTable
              title={listName}
              data={stocks}
              onStockClick={handleStockClick}
              onAddToTargetList={(stock, listName) => console.log('Add to target list:', stock.code, listName)}
              targetListNames={['Target List 1', 'Target List 2', 'Target List 3', 'Target List 4', 'Target List 5', 'Target List 6']}
              onClearAll={() => console.log('Clear all')}
            />
          </div>
        </div>

        {/* Right Side - Analysis Platform */}
        <div className="flex-1 overflow-hidden">
          {selectedStock ? (
            <div className="h-full w-full">
              <AnalysisPlatform
                isOpen={true}
                onClose={() => {}}
                stockSymbol={selectedStock.code}
                stockName={selectedStock.name}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Select a stock to view analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}