
import { useState, useEffect } from "react";
import { X, Minimize2, Maximize2, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  // Position minimized windows at bottom left
  if (isMinimized) {
    return (
      <div
        className="fixed bg-background border rounded-lg shadow-lg p-2 cursor-pointer z-50"
        style={{ left: 20, bottom: 20 }}
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
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onClose}
          >
            <X className="w-3 h-3" />
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

  // Mock stock name lookup
  const stockName = stockSymbol === "2330" ? "TSMC" : "Stock";

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

  const tableHeaderHeight = isTableCollapsed ? 40 : 140;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-screen h-screen p-0 gap-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h2 className="text-lg font-bold">{stockSymbol} {stockName}</h2>
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
                      <th className="border p-1 font-medium" rowSpan={2}>
                        {mockData.phase}
                      </th>
                      <th className="border p-1 font-medium">
                        <div>W26</div>
                        <div>D132</div>
                      </th>
                      <th className="border p-1 font-medium">
                        <div>W10</div>
                        <div>D50</div>
                      </th>
                      <th className="border p-1 font-medium">
                        <div>W2</div>
                        <div>D10</div>
                      </th>
                      <th className="border p-1 font-medium">
                        <div>W2×W10</div>
                        <div>D10×D50</div>
                      </th>
                      <th className="border p-1 font-medium">
                        <div>W2×W26</div>
                        <div>D10×D132</div>
                      </th>
                      <th className="border p-1 font-medium">
                        <div>W10×W26</div>
                        <div>D50×D132</div>
                      </th>
                      <th className="border p-1 font-medium" rowSpan={2}>
                        SAR dot count
                      </th>
                      <th className="border p-1 font-medium">
                        <div>W2 pvcnt</div>
                        <div>D2 pvcnt</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-1 font-medium bg-muted/50">Weekly</td>
                      <td className="border p-1 text-center">{formatMA(mockData.weekly.w26)}</td>
                      <td className="border p-1 text-center">{formatMA(mockData.weekly.w10)}</td>
                      <td className="border p-1 text-center">{formatMA(mockData.weekly.w2)}</td>
                      <td className="border p-1 text-center">{formatCross(mockData.weekly.w2xw10)}</td>
                      <td className="border p-1 text-center">{formatCross(mockData.weekly.w2xw26)}</td>
                      <td className="border p-1 text-center">{formatCross(mockData.weekly.w10xw26)}</td>
                      <td className="border p-1 text-center" rowSpan={2}>
                        <div>{formatCross(mockData.weekly.sarDotCount)}</div>
                        <div className="mt-1">{formatCross(mockData.daily.sarDotCount)}</div>
                      </td>
                      <td className="border p-1 text-center">{formatCross(mockData.weekly.w2pvcnt)}</td>
                    </tr>
                    <tr>
                      <td className="border p-1 font-medium bg-muted/50">Daily</td>
                      <td className="border p-1 text-center">{formatMA(mockData.daily.d132)}</td>
                      <td className="border p-1 text-center">{formatMA(mockData.daily.d50)}</td>
                      <td className="border p-1 text-center">{formatMA(mockData.daily.d10)}</td>
                      <td className="border p-1 text-center">{formatCross(mockData.daily.d10xd50)}</td>
                      <td className="border p-1 text-center">{formatCross(mockData.daily.d10xd132)}</td>
                      <td className="border p-1 text-center">{formatCross(mockData.daily.d50xd132)}</td>
                      <td className="border p-1 text-center">{formatCross(mockData.daily.d2pvcnt)}</td>
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
                defaultY={tableHeaderHeight + 2}
                defaultWidth={600}
                defaultHeight={400}
                minY={tableHeaderHeight + 2}
                chartType="weekly"
                onClose={() => setShowLeftChart(false)}
              />
            )}
            {showRightChart && (
              <FloatingChartWindow
                title={`Daily - ${stockSymbol} ${stockName}`}
                defaultX={640}
                defaultY={tableHeaderHeight + 2}
                defaultWidth={600}
                defaultHeight={400}
                minY={tableHeaderHeight + 2}
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
