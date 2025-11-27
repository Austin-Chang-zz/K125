
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
  const [isResizing, setIsResizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const isLeftChart = chartType === "weekly";

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
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
        const newWidth = Math.max(400, e.clientX - position.x);
        const newHeight = Math.max(300, e.clientY - position.y);
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
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
  }, [isDragging, isResizing, dragOffset, position, size, minY]);

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
      className="fixed bg-background border rounded-lg shadow-xl flex flex-col z-40"
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

      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeMouseDown}
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
}

export default function AnalysisPlatform({ isOpen, onClose, stockSymbol = "2330" }: AnalysisPlatformProps) {
  const [showLeftChart, setShowLeftChart] = useState(true);
  const [showRightChart, setShowRightChart] = useState(true);
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const defaultColumnOrder = ['phase', 'ma1', 'ma2', 'ma3', 'cross1', 'cross2', 'cross3', 'sar', 'pvcnt'];
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem(`analysis-table-order-${stockSymbol}`);
    return saved ? JSON.parse(saved) : defaultColumnOrder;
  });

  // Get stock name from mockData or use stockSymbol as fallback
  const getStockName = (code: string): string => {
    // This should match the stock from the actual data passed
    // For now, we'll import from mockData to get the real stock name
    const stockNameMap: Record<string, string> = {
      '2330': 'TSMC',
      '2317': 'Hon Hai',
      '2454': 'MediaTek',
      '2882': 'Cathay Financial',
      '2881': 'Fubon Financial',
      '2412': 'Chunghwa Telecom',
      '2303': 'United Microelectronics',
      '3711': 'ASE Technology',
      '2886': 'Mega Financial',
      '2891': 'CTBC Financial',
      '1301': 'Formosa Plastics',
      '1303': 'Nan Ya Plastics',
      '2002': 'China Steel',
      '2308': 'Delta Electronics',
      '2357': 'Asustek Computer',
      '2382': 'Quanta Computer',
      '2395': 'Advantech',
      '3008': 'LARGAN Precision',
      '2408': 'Nanya Technology',
      '2474': 'Catcher Technology',
    };
    return stockNameMap[code] || code;
  };
  const stockName = getStockName(stockSymbol);

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
    const chartLocations = {
      weekly: showLeftChart ? { x: 20, y: tableHeaderHeight + 25, width: 600, height: 400 } : null,
      daily: showRightChart ? { x: 640, y: tableHeaderHeight + 25, width: 600, height: 400 } : null,
    };
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

  const tableHeaderHeight = isTableCollapsed ? 40 : 140;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-screen h-screen p-0 gap-0 [&>button]:hidden">
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
                  <DropdownMenuItem onClick={handleSaveChartLocation}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Chart Location
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSaveAll}>
                    <Save className="w-4 h-4 mr-2" />
                    Save All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleResetAnalysisTable}>
                    <Save className="w-4 h-4 mr-2" />
                    Analysis Table Default
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <h2 className="text-lg font-bold">{stockSymbol} {stockName}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chart Analysis Table */}
          <div className={`border-b bg-muted/30 transition-all ${isTableCollapsed ? 'py-1' : 'py-2'}`}>
            <div className="px-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Chart Analysis Table</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsTableCollapsed(!isTableCollapsed)}
              >
                {isTableCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
            
            {!isTableCollapsed && (
              <div className="px-4 pb-1 overflow-x-auto">
                <table className="w-full border-collapse border text-xs">
                  <thead>
                    <tr className="bg-muted">
                      {columnOrder.map((colId) => {
                        if (colId === 'phase') {
                          return (
                            <th key={colId} className="border p-1 font-medium" rowSpan={2}>
                              {mockData.phase}
                            </th>
                          );
                        }
                        if (colId === 'sar') {
                          return (
                            <th key={colId} className="border p-1 font-medium" rowSpan={2}>
                              SAR dot count
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
                            className={`border p-1 font-medium cursor-move ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-l-2 border-primary' : ''}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, colId)}
                            onDragOver={(e) => handleDragOver(e, colId)}
                            onDragEnd={handleDragEnd}
                            onDragLeave={handleDragLeave}
                          >
                            <div>{headers[colId].w}</div>
                            <div>{headers[colId].d}</div>
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
              </div>
            )}
          </div>

          {/* Chart Canvas Area */}
          <div className="flex-1 relative bg-background">
            {showLeftChart && (
              <FloatingChartWindow
                title={`Weekly - ${stockSymbol} ${stockName}`}
                defaultX={20}
                defaultY={tableHeaderHeight + 25}
                defaultWidth={600}
                defaultHeight={400}
                minY={tableHeaderHeight + 25}
                chartType="weekly"
                onClose={() => setShowLeftChart(false)}
              />
            )}
            {showRightChart && (
              <FloatingChartWindow
                title={`Daily - ${stockSymbol} ${stockName}`}
                defaultX={640}
                defaultY={tableHeaderHeight + 25}
                defaultWidth={600}
                defaultHeight={400}
                minY={tableHeaderHeight + 25}
                chartType="daily"
                onClose={() => setShowRightChart(false)}
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
      </DialogContent>
    </Dialog>
  );
}
