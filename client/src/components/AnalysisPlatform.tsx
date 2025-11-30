import { useState, useEffect } from "react";
import { X, Minimize2, Maximize2, ChevronDown, ChevronUp, MoreVertical, Save } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface FloatingWindowProps {
  title: string;
  defaultX: number;
  defaultY: number;
  defaultWidth: number;
  defaultHeight: number;
  minY: number;
  chartType: "daily" | "weekly";
  onClose: () => void;
}

function FloatingChartWindow({
  title,
  defaultX,
  defaultY,
  defaultWidth,
  defaultHeight,
  minY,
  chartType,
  onClose,
}: FloatingWindowProps) {
  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<false | 'se' | 'sw' | 'ne' | 'nw'>(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });
  const isLeftChart = chartType === "weekly";

  // Update position when minY changes (table collapse/expand)
  useEffect(() => {
    setPosition(prev => ({ ...prev, y: Math.max(minY, prev.y) }));
  }, [minY]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, corner: 'se' | 'sw' | 'ne' | 'nw') => {
    e.stopPropagation();
    setIsResizing(corner);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = Math.max(minY, e.clientY - dragOffset.y);

        // Snap to edges
        const snapThreshold = 20;
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;

        let finalX = newX;
        let finalY = newY;

        // Snap to left, right, top, bottom
        if (Math.abs(newX) < snapThreshold) finalX = 0;
        if (Math.abs(newX - maxX) < snapThreshold) finalX = maxX;
        if (Math.abs(newY - minY) < snapThreshold) finalY = minY;
        if (Math.abs(newY - maxY) < snapThreshold) finalY = maxY;

        setPosition({ x: finalX, y: finalY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const minWidth = 400;
        const minHeight = 300;

        switch (isResizing) {
          case 'se': {
            // Bottom-right: resize from right and bottom
            const newWidth = Math.max(minWidth, resizeStart.width + deltaX);
            const newHeight = Math.max(minHeight, resizeStart.height + deltaY);
            setSize({ width: newWidth, height: newHeight });
            break;
          }
          case 'sw': {
            // Bottom-left: resize from left and bottom, move x position
            const newWidth = Math.max(minWidth, resizeStart.width - deltaX);
            const newHeight = Math.max(minHeight, resizeStart.height + deltaY);
            const newX = resizeStart.posX + (resizeStart.width - newWidth);
            setSize({ width: newWidth, height: newHeight });
            setPosition(prev => ({ ...prev, x: newX }));
            break;
          }
          case 'ne': {
            // Top-right: resize from right and top, move y position
            const newWidth = Math.max(minWidth, resizeStart.width + deltaX);
            const newHeight = Math.max(minHeight, resizeStart.height - deltaY);
            const newY = Math.max(minY, resizeStart.posY + (resizeStart.height - newHeight));
            setSize({ width: newWidth, height: newHeight });
            setPosition(prev => ({ ...prev, y: newY }));
            break;
          }
          case 'nw': {
            // Top-left: resize from left and top, move both x and y position
            const newWidth = Math.max(minWidth, resizeStart.width - deltaX);
            const newHeight = Math.max(minHeight, resizeStart.height - deltaY);
            const newX = resizeStart.posX + (resizeStart.width - newWidth);
            const newY = Math.max(minY, resizeStart.posY + (resizeStart.height - newHeight));
            setSize({ width: newWidth, height: newHeight });
            setPosition({ x: newX, y: newY });
            break;
          }
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
        // Save chart location when drag or resize ends
        const event = new CustomEvent('chartLocationChanged', {
          detail: {
            chartType,
            position,
            size
          }
        });
        window.dispatchEvent(event);
      }
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, size, minY, chartType]);

  // Position minimized windows at bottom left or right based on chart type
  if (isMinimized) {
    return (
      <div
        className="fixed bg-background border rounded-lg shadow-lg p-2 cursor-pointer z-50"
        style={{ [isLeftChart ? 'left' : 'right']: 20, bottom: 20 }}
        onClick={() => setIsMinimized(false)}
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
      className="fixed bg-background border border-border rounded-lg shadow-lg flex flex-col z-40"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
      onMouseDown={handleMouseDown}
    >
        <div className="window-header flex items-center justify-between p-2 border-b cursor-move bg-muted/30">
          <span className="text-sm font-medium">{title}</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">TradingView Chart</p>
              <p className="text-xs text-muted-foreground mt-1">({chartType} view)</p>
            </div>
          </div>
        </div>

        {/* Resize handles for all four corners */}
        <div
          className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
          onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
        >
          <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-muted-foreground/50" />
        </div>
        <div
          className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize"
          onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
        >
          <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-muted-foreground/50" />
        </div>
        <div
          className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
          onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
        >
          <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-muted-foreground/50" />
        </div>
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground/50" />
        </div>
    </div>
  );
}

interface FloatingTableWindowProps {
  title: string;
  children: React.ReactNode;
  defaultX: number;
  defaultY: number;
  defaultWidth: number;
  defaultHeight: number;
  onLocationChange?: (location: { x: number; y: number; width: number; height: number }) => void;
}

function FloatingAnalysisTableWindow({
  title,
  children,
  defaultX,
  defaultY,
  defaultWidth,
  defaultHeight,
  onLocationChange,
}: FloatingTableWindowProps) {
  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<false | 'se' | 'sw' | 'ne' | 'nw'>(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, corner: 'se' | 'sw' | 'ne' | 'nw') => {
    e.stopPropagation();
    setIsResizing(corner);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, e.clientX - dragOffset.x);
        const newY = Math.max(0, e.clientY - dragOffset.y);
        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const minWidth = 300;
        const minHeight = 100;

        switch (isResizing) {
          case 'se': {
            const newWidth = Math.max(minWidth, resizeStart.width + deltaX);
            const newHeight = Math.max(minHeight, resizeStart.height + deltaY);
            setSize({ width: newWidth, height: newHeight });
            break;
          }
          case 'sw': {
            const newWidth = Math.max(minWidth, resizeStart.width - deltaX);
            const newHeight = Math.max(minHeight, resizeStart.height + deltaY);
            const newX = resizeStart.posX + (resizeStart.width - newWidth);
            setSize({ width: newWidth, height: newHeight });
            setPosition(prev => ({ ...prev, x: newX }));
            break;
          }
          case 'ne': {
            const newWidth = Math.max(minWidth, resizeStart.width + deltaX);
            const newHeight = Math.max(minHeight, resizeStart.height - deltaY);
            const newY = Math.max(0, resizeStart.posY + (resizeStart.height - newHeight));
            setSize({ width: newWidth, height: newHeight });
            setPosition(prev => ({ ...prev, y: newY }));
            break;
          }
          case 'nw': {
            const newWidth = Math.max(minWidth, resizeStart.width - deltaX);
            const newHeight = Math.max(minHeight, resizeStart.height - deltaY);
            const newX = resizeStart.posX + (resizeStart.width - newWidth);
            const newY = Math.max(0, resizeStart.posY + (resizeStart.height - newHeight));
            setSize({ width: newWidth, height: newHeight });
            setPosition({ x: newX, y: newY });
            break;
          }
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
        onLocationChange?.({ x: position.x, y: position.y, width: size.width, height: size.height });
      }
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, size, resizeStart, onLocationChange]);

  if (isMinimized) {
    return (
      <div
        className="fixed bg-background border rounded-lg shadow-lg p-2 cursor-pointer z-50"
        style={{ left: 20, top: 60 }}
        onClick={() => setIsMinimized(false)}
        data-testid="button-restore-analysis-table"
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
      className="fixed bg-background border border-border rounded-lg shadow-lg flex flex-col z-40"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
      onMouseDown={handleMouseDown}
      data-testid="window-analysis-table"
    >
      <div className="window-header flex items-center justify-between px-2 py-1 border-b cursor-move bg-muted/30">
        <span className="text-sm font-medium" data-testid="text-analysis-table-title">{title}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setIsMinimized(true)}
          data-testid="button-minimize-analysis-table"
        >
          <Minimize2 className="w-3 h-3" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {children}
      </div>

      {/* Resize handles for all four corners */}
      <div
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
      >
        <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-muted-foreground/50" />
      </div>
      <div
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
      >
        <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-muted-foreground/50" />
      </div>
      <div
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
      >
        <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-muted-foreground/50" />
      </div>
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground/50" />
      </div>
    </div>
  );
}

interface AnalysisPlatformProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol?: string;
  stockName?: string;
  embedded?: boolean;
}

export default function AnalysisPlatform({ isOpen, onClose, stockSymbol = "2330", stockName, embedded = false }: AnalysisPlatformProps) {
  const [showLeftChart, setShowLeftChart] = useState(true);
  const [showRightChart, setShowRightChart] = useState(true);
  const [showAnalysisTable, setShowAnalysisTable] = useState(true);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const defaultColumnOrder = ['phase', 'ma1', 'ma2', 'ma3', 'cross1', 'cross2', 'cross3', 'sar', 'pvcnt'];
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem(`analysis-table-order-${stockSymbol}`);
    return saved ? JSON.parse(saved) : defaultColumnOrder;
  });
  const [chartLocations, setChartLocations] = useState<{
    weekly?: { x: number; y: number; width: number; height: number };
    daily?: { x: number; y: number; width: number; height: number };
  }>(() => {
    const saved = localStorage.getItem(`chart-locations-${stockSymbol}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [analysisTableLocation, setAnalysisTableLocation] = useState<{
    x: number; y: number; width: number; height: number;
  }>(() => {
    const saved = localStorage.getItem(`analysis-table-location-${stockSymbol}`);
    return saved ? JSON.parse(saved) : { x: 20, y: 60, width: 700, height: 150 };
  });
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);

  // Check if we're embedded (explicitly set or no onClose handler)
  const isEmbedded = embedded;

  // Listen for chart location changes
  useEffect(() => {
    const handleChartLocationChanged = (e: CustomEvent) => {
      const { chartType, position, size } = e.detail;
      setChartLocations(prev => ({
        ...prev,
        [chartType]: { x: position.x, y: position.y, width: size.width, height: size.height }
      }));
    };

    window.addEventListener('chartLocationChanged', handleChartLocationChanged as EventListener);
    return () => {
      window.removeEventListener('chartLocationChanged', handleChartLocationChanged as EventListener);
    };
  }, []);

  // Use the stockName passed from props, fallback to stockSymbol if not provided
  const displayStockName = stockName || stockSymbol;

  const mockData = {
    phase: "B1",
    weekly: {
      w26: { value: 45.2, direction: "up" },
      w10: { value: 42.8, direction: "up" },
      w2: { value: 41.5, direction: "down" },
      w2xw10: 3,
      w2xw26: -2,
      w10xw26: 5,
      sarDotCount: 3,
      w2pvcnt: 5,
    },
    daily: {
      d132: { value: 44.8, direction: "up" },
      d50: { value: 43.2, direction: "down" },
      d10: { value: 42.1, direction: "up" },
      d10xd50: -4,
      d10xd132: 2,
      d50xd132: -3,
      sarDotCount: -5,
      d2pvcnt: 7,
    },
  };

  const formatMA = (data: { value: number; direction: string }) => {
    const sign = data.direction === "up" ? "+" : "-";
    const color = data.direction === "up" ? "text-red-600" : "text-green-600";
    const arrow = data.direction === "up" ? "↑" : "↓";
    return (
      <span className={color}>
        {sign}{Math.abs(data.value)}{arrow}
      </span>
    );
  };

  const formatCross = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    const color = value >= 0 ? "text-red-600" : "text-green-600";
    return <span className={color}>{sign}{value}</span>;
  };

  const handleSaveAnalysisTable = () => {
    localStorage.setItem(`analysis-table-order-${stockSymbol}`, JSON.stringify(columnOrder));
    console.log('Analysis Table order saved');
  };

  const handleSaveChartLocation = () => {
    localStorage.setItem(`chart-locations-${stockSymbol}`, JSON.stringify(chartLocations));
    console.log('Chart locations saved', chartLocations);
  };

  const handleSaveAll = () => {
    handleSaveAnalysisTable();
    handleSaveChartLocation();
    console.log('All settings saved');
  };

  const handleResetAnalysisTable = () => {
    setColumnOrder(defaultColumnOrder);
    localStorage.removeItem(`analysis-table-order-${stockSymbol}`);
    console.log('Analysis Table reset to default');
  };

  const handleResetChartLocation = () => {
    setChartLocations({});
    localStorage.removeItem(`chart-locations-${stockSymbol}`);
    // Force re-render by toggling charts
    setShowLeftChart(false);
    setShowRightChart(false);
    setTimeout(() => {
      setShowLeftChart(true);
      setShowRightChart(true);
    }, 0);
    console.log('Chart locations reset to default');
  };

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragEnd = () => {
    if (draggedColumn && dragOverColumn && draggedColumn !== dragOverColumn) {
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedColumn);
      const targetIndex = newOrder.indexOf(dragOverColumn);

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumn);

      setColumnOrder(newOrder);
      // Auto-save the new order
      localStorage.setItem(`analysis-table-order-${stockSymbol}`, JSON.stringify(newOrder));
    }
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleResizeStart = (e: React.MouseEvent, columnId: string) => {
    e.stopPropagation();
    setResizingColumn(columnId);
    setResizeStartX(e.clientX);
    setResizeStartWidth(columnWidths[columnId] || 100);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn) {
        const diff = e.clientX - resizeStartX;
        const newWidth = Math.max(60, resizeStartWidth + diff);
        setColumnWidths(prev => ({ ...prev, [resizingColumn]: newWidth }));
      }
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    if (resizingColumn) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, resizeStartX, resizeStartWidth]);

  const tableHeaderHeight = 48; // Fixed header height since analysis table is now floating

  const content = (
    <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={handleSaveAnalysisTable}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Analysis Table
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleResetAnalysisTable}>
                    <Save className="w-4 h-4 mr-2" />
                    Analysis Table Default
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSaveChartLocation}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Chart Location
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleResetChartLocation}>
                    <Save className="w-4 h-4 mr-2" />
                    Chart Default Location
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSaveAll}>
                    <Save className="w-4 h-4 mr-2" />
                    Save All
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <h2 className="text-lg font-bold">{stockSymbol} {displayStockName}</h2>
            </div>
            {!isEmbedded && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Floating Analysis Table Window */}
          {showAnalysisTable && (
            <FloatingAnalysisTableWindow
              title={`${stockSymbol} ${displayStockName} Analysis Table`}
              defaultX={analysisTableLocation.x}
              defaultY={analysisTableLocation.y}
              defaultWidth={analysisTableLocation.width}
              defaultHeight={analysisTableLocation.height}
              onLocationChange={(loc) => {
                setAnalysisTableLocation(loc);
                localStorage.setItem(`analysis-table-location-${stockSymbol}`, JSON.stringify(loc));
              }}
            >
              <table className="w-full border-collapse border text-xs">
                <thead>
                  <tr className="bg-muted">
                    {columnOrder.map((colId) => {
                      if (colId === 'phase') {
                        return (
                          <th key={colId} className="border p-1 font-medium relative" rowSpan={2} style={{ width: columnWidths[colId] || 'auto' }}>
                            {mockData.phase}
                            <div
                              className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 z-10"
                              onMouseDown={(e) => handleResizeStart(e, colId)}
                            />
                          </th>
                        );
                      }
                      if (colId === 'sar') {
                        const isDragging = draggedColumn === colId;
                        const isDragOver = dragOverColumn === colId;
                        return (
                          <th
                            key={colId}
                            className={`border p-1 font-medium cursor-move relative ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-l-2 border-primary' : ''}`}
                            rowSpan={2}
                            draggable
                            onDragStart={(e) => handleDragStart(e, colId)}
                            onDragOver={(e) => handleDragOver(e, colId)}
                            onDragEnd={handleDragEnd}
                            onDragLeave={handleDragLeave}
                            style={{ width: columnWidths[colId] || 'auto' }}
                          >
                            SAR dot count
                            <div
                              className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 z-10"
                              onMouseDown={(e) => handleResizeStart(e, colId)}
                            />
                          </th>
                        );
                      }
                      const isDragging = draggedColumn === colId;
                      const isDragOver = dragOverColumn === colId;
                      const headers: Record<string, { w: string; d: string }> = {
                        ma1: { w: 'W26', d: 'D132' },
                        ma2: { w: 'W10', d: 'D50' },
                        ma3: { w: 'W2', d: 'D10' },
                        cross1: { w: 'W2×W10', d: 'D10×D50' },
                        cross2: { w: 'W2×W26', d: 'D10×D132' },
                        cross3: { w: 'W10×W26', d: 'D50×D132' },
                        pvcnt: { w: 'W2 pvcnt', d: 'D2 pvcnt' }
                      };
                      return (
                        <th
                          key={colId}
                          className={`border p-1 font-medium cursor-move relative ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-l-2 border-primary' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, colId)}
                          onDragOver={(e) => handleDragOver(e, colId)}
                          onDragEnd={handleDragEnd}
                          onDragLeave={handleDragLeave}
                          style={{ width: columnWidths[colId] || 'auto' }}
                        >
                          <div>{headers[colId].w}</div>
                          <div>{headers[colId].d}</div>
                          <div
                            className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-primary/50 z-10"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleResizeStart(e, colId);
                            }}
                            draggable={false}
                          />
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-1 font-medium bg-muted/50 text-center">Weekly</td>
                    {columnOrder.filter(c => c !== 'phase').map((colId) => {
                      if (colId === 'sar') {
                        return (
                          <td key={colId} className="border p-1 text-center" rowSpan={2}>
                            <div>{formatCross(mockData.weekly.sarDotCount)}</div>
                            <div className="mt-1">{formatCross(mockData.daily.sarDotCount)}</div>
                          </td>
                        );
                      }
                      const data: Record<string, any> = {
                        ma1: formatMA(mockData.weekly.w26),
                        ma2: formatMA(mockData.weekly.w10),
                        ma3: formatMA(mockData.weekly.w2),
                        cross1: formatCross(mockData.weekly.w2xw10),
                        cross2: formatCross(mockData.weekly.w2xw26),
                        cross3: formatCross(mockData.weekly.w10xw26),
                        pvcnt: formatCross(mockData.weekly.w2pvcnt)
                      };
                      return <td key={colId} className="border p-1 text-center">{data[colId]}</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="border p-1 font-medium bg-muted/50 text-center">Daily</td>
                    {columnOrder.filter(c => c !== 'phase' && c !== 'sar').map((colId) => {
                      const data: Record<string, any> = {
                        ma1: formatMA(mockData.daily.d132),
                        ma2: formatMA(mockData.daily.d50),
                        ma3: formatMA(mockData.daily.d10),
                        cross1: formatCross(mockData.daily.d10xd50),
                        cross2: formatCross(mockData.daily.d10xd132),
                        cross3: formatCross(mockData.daily.d50xd132),
                        pvcnt: formatCross(mockData.daily.d2pvcnt)
                      };
                      return <td key={colId} className="border p-1 text-center">{data[colId]}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </FloatingAnalysisTableWindow>
          )}

          {/* Chart Canvas Area */}
          <div className="flex-1 relative bg-background">
            {/* Weekly Chart */}
            {showLeftChart && (
              <FloatingChartWindow
                key={`weekly-${tableHeaderHeight}`}
                title={`Weekly - ${stockSymbol} ${displayStockName}`}
                defaultX={chartLocations.weekly?.x ?? 20}
                defaultY={chartLocations.weekly?.y ?? (tableHeaderHeight + 25)}
                defaultWidth={chartLocations.weekly?.width ?? 600}
                defaultHeight={chartLocations.weekly?.height ?? 400}
                minY={tableHeaderHeight + 25}
                chartType="weekly"
                onClose={() => setShowLeftChart(false)}
              />
            )}

            {/* Daily Chart */}
            {showRightChart && (
              <FloatingChartWindow
                key={`daily-${tableHeaderHeight}`}
                title={`Daily - ${stockSymbol} ${displayStockName}`}
                defaultX={chartLocations.daily?.x ?? 640}
                defaultY={chartLocations.daily?.y ?? (tableHeaderHeight + 25)}
                defaultWidth={chartLocations.daily?.width ?? 600}
                defaultHeight={chartLocations.daily?.height ?? 400}
                minY={tableHeaderHeight + 25}
                chartType="daily"
                onClose={() => setShowRightChart(true)}
              />
            )}

            {!showLeftChart && !showRightChart && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">All charts closed</p>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => setShowLeftChart(true)}>Show Weekly Chart</Button>
                    <Button onClick={() => setShowRightChart(true)}>Show Daily Chart</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
  );

  // Return embedded view or dialog-wrapped view
  if (isEmbedded) {
    return content;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-screen h-screen p-0 gap-0 [&>button]:hidden">
        {content}
      </DialogContent>
    </Dialog>
  );
}