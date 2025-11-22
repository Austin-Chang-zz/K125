
import { useState, useEffect } from "react";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface FloatingWindowProps {
  title: string;
  defaultX: number;
  defaultY: number;
  defaultWidth: number;
  defaultHeight: number;
  minY: number;
  selectedTab: "daily" | "weekly";
  onTabChange: (tab: "daily" | "weekly") => void;
  onClose: () => void;
}

function FloatingChartWindow({
  title,
  defaultX,
  defaultY,
  defaultWidth,
  defaultHeight,
  minY,
  selectedTab,
  onTabChange,
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

  if (isMinimized) {
    return (
      <div
        className="fixed bg-background border rounded-lg shadow-lg p-2 cursor-pointer"
        style={{ left: position.x, top: position.y }}
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
      className="fixed bg-background border rounded-lg shadow-xl flex flex-col"
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
      
      <div className="p-2 border-b">
        <Tabs value={selectedTab} onValueChange={(v) => onTabChange(v as "daily" | "weekly")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">TradingView Chart</p>
            <p className="text-xs text-muted-foreground mt-1">({selectedTab} view)</p>
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

export default function AnalysisPlatform({ isOpen, onClose, stockSymbol }: AnalysisPlatformProps) {
  const [leftTab, setLeftTab] = useState<"daily" | "weekly">("daily");
  const [rightTab, setRightTab] = useState<"daily" | "weekly">("weekly");
  const [showLeftChart, setShowLeftChart] = useState(true);
  const [showRightChart, setShowRightChart] = useState(true);

  const handleLeftTabChange = (tab: "daily" | "weekly") => {
    setLeftTab(tab);
    setRightTab(tab === "daily" ? "weekly" : "daily");
  };

  const handleRightTabChange = (tab: "daily" | "weekly") => {
    setRightTab(tab);
    setLeftTab(tab === "daily" ? "weekly" : "daily");
  };

  const mockData = {
    phase: "B1",
    weekly: {
      w26: 45.2,
      w10: 42.8,
      w2: 41.5,
      w2xw10: 0.97,
      w2xw26: 0.92,
      w10xw26: 0.95,
      sarDotCount: 3,
      w2pvcnt: 65,
    },
    daily: {
      d132: 44.8,
      d50: 43.2,
      d10: 42.1,
      d10xd50: 0.97,
      d10xd132: 0.94,
      d50xd132: 0.96,
      sarDotCount: 5,
      d2pvcnt: 72,
    },
  };

  const tableHeaderHeight = 180;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-screen h-screen p-0 gap-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h2 className="text-xl font-bold">Analysis Platform</h2>
              {stockSymbol && (
                <p className="text-sm text-muted-foreground">Symbol: {stockSymbol}</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chart Analysis Table */}
          <div className="p-4 border-b bg-muted/30">
            <h3 className="text-sm font-semibold mb-2">Chart Analysis Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-xs font-medium" rowSpan={2}>
                      {mockData.phase}
                    </th>
                    <th className="border p-2 text-xs font-medium" colSpan={2}>
                      W26 / D132
                    </th>
                    <th className="border p-2 text-xs font-medium" colSpan={2}>
                      W10 / D50
                    </th>
                    <th className="border p-2 text-xs font-medium" colSpan={2}>
                      W2 / D10
                    </th>
                    <th className="border p-2 text-xs font-medium" colSpan={2}>
                      W2×W10 / D10×D50
                    </th>
                    <th className="border p-2 text-xs font-medium" colSpan={2}>
                      W2×W26 / D10×D132
                    </th>
                    <th className="border p-2 text-xs font-medium" colSpan={2}>
                      W10×W26 / D50×D132
                    </th>
                    <th className="border p-2 text-xs font-medium" rowSpan={2}>
                      SAR dot count
                    </th>
                    <th className="border p-2 text-xs font-medium" colSpan={2}>
                      W2 pvcnt / D2 pvcnt
                    </th>
                  </tr>
                  <tr className="bg-muted">
                    <th className="border p-1 text-xs">W</th>
                    <th className="border p-1 text-xs">D</th>
                    <th className="border p-1 text-xs">W</th>
                    <th className="border p-1 text-xs">D</th>
                    <th className="border p-1 text-xs">W</th>
                    <th className="border p-1 text-xs">D</th>
                    <th className="border p-1 text-xs">W</th>
                    <th className="border p-1 text-xs">D</th>
                    <th className="border p-1 text-xs">W</th>
                    <th className="border p-1 text-xs">D</th>
                    <th className="border p-1 text-xs">W</th>
                    <th className="border p-1 text-xs">D</th>
                    <th className="border p-1 text-xs">W</th>
                    <th className="border p-1 text-xs">D</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 text-xs font-medium bg-muted/50">Period</td>
                    <td className="border p-2 text-xs text-center">{mockData.weekly.w26}</td>
                    <td className="border p-2 text-xs text-center">{mockData.daily.d132}</td>
                    <td className="border p-2 text-xs text-center">{mockData.weekly.w10}</td>
                    <td className="border p-2 text-xs text-center">{mockData.daily.d50}</td>
                    <td className="border p-2 text-xs text-center">{mockData.weekly.w2}</td>
                    <td className="border p-2 text-xs text-center">{mockData.daily.d10}</td>
                    <td className="border p-2 text-xs text-center">{mockData.weekly.w2xw10}</td>
                    <td className="border p-2 text-xs text-center">{mockData.daily.d10xd50}</td>
                    <td className="border p-2 text-xs text-center">{mockData.weekly.w2xw26}</td>
                    <td className="border p-2 text-xs text-center">{mockData.daily.d10xd132}</td>
                    <td className="border p-2 text-xs text-center">{mockData.weekly.w10xw26}</td>
                    <td className="border p-2 text-xs text-center">{mockData.daily.d50xd132}</td>
                    <td className="border p-2 text-xs text-center" rowSpan={1}>
                      W: {mockData.weekly.sarDotCount} / D: {mockData.daily.sarDotCount}
                    </td>
                    <td className="border p-2 text-xs text-center">{mockData.weekly.w2pvcnt}</td>
                    <td className="border p-2 text-xs text-center">{mockData.daily.d2pvcnt}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart Canvas Area */}
          <div className="flex-1 relative bg-background">
            {showLeftChart && (
              <FloatingChartWindow
                title="Chart 1"
                defaultX={20}
                defaultY={tableHeaderHeight + 80}
                defaultWidth={600}
                defaultHeight={400}
                minY={tableHeaderHeight + 80}
                selectedTab={leftTab}
                onTabChange={handleLeftTabChange}
                onClose={() => setShowLeftChart(false)}
              />
            )}
            {showRightChart && (
              <FloatingChartWindow
                title="Chart 2"
                defaultX={640}
                defaultY={tableHeaderHeight + 80}
                defaultWidth={600}
                defaultHeight={400}
                minY={tableHeaderHeight + 80}
                selectedTab={rightTab}
                onTabChange={handleRightTabChange}
                onClose={() => setShowRightChart(false)}
              />
            )}
            
            {!showLeftChart && !showRightChart && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">All charts closed</p>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => setShowLeftChart(true)}>Show Chart 1</Button>
                    <Button onClick={() => setShowRightChart(true)}>Show Chart 2</Button>
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
