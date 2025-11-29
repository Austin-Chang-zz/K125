
import React, { useState } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import MatrixTable from '@/components/MatrixTable';
import AnalysisPlatform from '@/components/AnalysisPlatform';

interface StockScreenerProps {
  listName: string;
  stocks: any[];
  onClose: () => void;
}

interface FloatingWindowProps {
  title: string;
  children: React.ReactNode;
  defaultX: number;
  defaultY: number;
  defaultWidth: number;
  defaultHeight: number;
  onMinimize: () => void;
  isMinimized: boolean;
  onRestore: () => void;
  minWidth?: number;
  minHeight?: number;
  zIndex?: number;
}

function FloatingWindow({
  title,
  children,
  defaultX,
  defaultY,
  defaultWidth,
  defaultHeight,
  onMinimize,
  isMinimized,
  onRestore,
  minWidth = 400,
  minHeight = 300,
  zIndex = 40,
}: FloatingWindowProps) {
  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeEdge, setResizeEdge] = useState<string>('');

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, edge: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeEdge(edge);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - size.width));
        const newY = Math.max(60, Math.min(e.clientY - dragOffset.y, window.innerHeight - size.height));
        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        if (resizeEdge.includes('e')) {
          newWidth = Math.max(minWidth, e.clientX - position.x);
        }
        if (resizeEdge.includes('s')) {
          newHeight = Math.max(minHeight, e.clientY - position.y);
        }
        if (resizeEdge.includes('w')) {
          const delta = e.clientX - position.x;
          if (size.width - delta >= minWidth) {
            newWidth = size.width - delta;
            newX = position.x + delta;
          }
        }
        if (resizeEdge.includes('n')) {
          const delta = e.clientY - position.y;
          if (size.height - delta >= minHeight) {
            newHeight = size.height - delta;
            newY = position.y + delta;
          }
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeEdge('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, size, resizeEdge, minWidth, minHeight]);

  if (isMinimized) {
    return (
      <div
        className="fixed bg-background border rounded-lg shadow-lg p-2 cursor-pointer"
        style={{ left: position.x, bottom: 20, zIndex }}
        onClick={onRestore}
      >
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4" />
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bg-background border border-border rounded-lg shadow-lg flex flex-col"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="window-header flex items-center justify-between p-2 border-b cursor-move bg-muted/30">
        <span className="text-sm font-medium">{title}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onMinimize}
        >
          <Minimize2 className="w-3 h-3" />
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Resize handles */}
      <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
      <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
      <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
      <div className="absolute top-0 left-1/2 w-4 h-2 -translate-x-1/2 cursor-n-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
      <div className="absolute bottom-0 left-1/2 w-4 h-2 -translate-x-1/2 cursor-s-resize" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
      <div className="absolute left-0 top-1/2 w-2 h-4 -translate-y-1/2 cursor-w-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
      <div className="absolute right-0 top-1/2 w-2 h-4 -translate-y-1/2 cursor-e-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
    </div>
  );
}

export default function StockScreener({ listName, stocks, onClose }: StockScreenerProps) {
  const [selectedStock, setSelectedStock] = useState(stocks[0] || null);
  const [isMatrixMinimized, setIsMatrixMinimized] = useState(false);
  const [isAnalysisMinimized, setIsAnalysisMinimized] = useState(false);

  const handleStockClick = (stock: any) => {
    setSelectedStock(stock);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-7 w-7 flex-shrink-0" />
          <h1 className="text-xl font-semibold" data-testid="text-screener-title">{listName} Stock Screener</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-screener">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Canvas Area with Floating Windows */}
      <div className="flex-1 relative bg-muted/10 overflow-hidden">
        {/* MatrixTableWindow - Left Side */}
        <FloatingWindow
          title="MatrixTableWindow"
          defaultX={20}
          defaultY={80}
          defaultWidth={600}
          defaultHeight={600}
          onMinimize={() => setIsMatrixMinimized(true)}
          isMinimized={isMatrixMinimized}
          onRestore={() => setIsMatrixMinimized(false)}
          zIndex={40}
        >
          <div className="h-full overflow-auto">
            <MatrixTable
              title={listName}
              data={stocks}
              onStockClick={handleStockClick}
              onAddToTargetList={(stock, listName) => console.log('Add to target list:', stock.code, listName)}
              targetListNames={['Target List 1', 'Target List 2', 'Target List 3', 'Target List 4', 'Target List 5', 'Target List 6']}
              onClearAll={() => console.log('Clear all')}
            />
          </div>
        </FloatingWindow>

        {/* AnalysisPlatformWindow - Right Side */}
        <FloatingWindow
          title="AnalysisPlatformWindow"
          defaultX={640}
          defaultY={80}
          defaultWidth={700}
          defaultHeight={600}
          onMinimize={() => setIsAnalysisMinimized(true)}
          isMinimized={isAnalysisMinimized}
          onRestore={() => setIsAnalysisMinimized(false)}
          minWidth={600}
          minHeight={400}
          zIndex={41}
        >
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
        </FloatingWindow>
      </div>
    </div>
  );
}
