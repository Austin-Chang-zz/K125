
import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Maximize2, GripVertical, ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StockScreenerProps {
  listName: string;
  stocks: any[];
  onClose: () => void;
}

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function StockScreener({ listName, stocks, onClose }: StockScreenerProps) {
  const [selectedStock, setSelectedStock] = useState(stocks[0] || null);
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  
  // Positions for movable components
  const [matrixPos, setMatrixPos] = useState<Position>({ x: 20, y: 20, width: 300, height: 600 });
  const [tablePos, setTablePos] = useState<Position>({ x: 340, y: 20, width: 860, height: 200 });
  const [weeklyChartPos, setWeeklyChartPos] = useState<Position>({ x: 340, y: 240, width: 420, height: 400 });
  const [dailyChartPos, setDailyChartPos] = useState<Position>({ x: 780, y: 240, width: 420, height: 400 });

  const [weeklyMinimized, setWeeklyMinimized] = useState(false);
  const [dailyMinimized, setDailyMinimized] = useState(false);

  // Column order for analysis table
  const [tableColumns, setTableColumns] = useState([
    'Weekly', 'Daily', 'MA2 slope', 'MA10 slope', 'MA50 slope', 
    'MA132 slope', '2-10 XO count', 'SAR dot count'
  ]);

  const DraggableBox = ({ 
    position, 
    setPosition, 
    children, 
    title,
    minimized,
    onMinimize,
    onClose: onBoxClose,
    minWidth = 200,
    minHeight = 150
  }: any) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const dragRef = useRef<any>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.no-drag')) return;
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX - position.x,
        startY: e.clientY - position.y,
      };
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsResizing(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: position.width,
        startHeight: position.height,
      };
    };

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && dragRef.current) {
          setPosition({
            ...position,
            x: e.clientX - dragRef.current.startX,
            y: e.clientY - dragRef.current.startY,
          });
        } else if (isResizing && dragRef.current) {
          const newWidth = Math.max(minWidth, dragRef.current.startWidth + (e.clientX - dragRef.current.startX));
          const newHeight = Math.max(minHeight, dragRef.current.startHeight + (e.clientY - dragRef.current.startY));
          setPosition({
            ...position,
            width: newWidth,
            height: newHeight,
          });
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
      };

      if (isDragging || isResizing) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, isResizing, position]);

    if (minimized) {
      return (
        <div
          style={{
            position: 'absolute',
            left: position.x,
            bottom: 20,
            zIndex: 1000,
          }}
          className="bg-background border rounded p-2 cursor-pointer shadow-lg"
          onClick={onMinimize}
        >
          <span className="text-sm font-medium">{title}</span>
        </div>
      );
    }

    return (
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: position.width,
          height: position.height,
          zIndex: 100,
        }}
        className="bg-background border rounded shadow-lg flex flex-col"
      >
        <div
          className="flex items-center justify-between p-2 border-b cursor-move bg-muted/50"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-1 no-drag">
            {onMinimize && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMinimize}>
                <Minus className="h-3 w-3" />
              </Button>
            )}
            {onBoxClose && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onBoxClose}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto no-drag">
          {children}
        </div>
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onMouseDown={handleResizeMouseDown}
          style={{ background: 'linear-gradient(135deg, transparent 50%, currentColor 50%)' }}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <h1 className="text-xl font-semibold">{listName} - Stock Screener</h1>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-[calc(100vh-3.5rem)]">
        {/* Matrix List */}
        <DraggableBox
          position={matrixPos}
          setPosition={setMatrixPos}
          title={listName}
          minWidth={250}
        >
          <div className="p-2">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-xs font-medium p-2">Code</th>
                  <th className="text-left text-xs font-medium p-2">Name</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr
                    key={stock.code}
                    className={`border-b cursor-pointer hover:bg-muted/50 ${
                      selectedStock?.code === stock.code ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => setSelectedStock(stock)}
                  >
                    <td className="p-2 text-sm">{stock.code}</td>
                    <td className="p-2 text-sm">{stock.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DraggableBox>

        {/* Chart Analysis Table */}
        <DraggableBox
          position={tablePos}
          setPosition={setTablePos}
          title="Chart Analysis Table"
          minWidth={400}
          minHeight={150}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">
                {selectedStock?.code} {selectedStock?.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTableCollapsed(!isTableCollapsed)}
              >
                {isTableCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
            {!isTableCollapsed && (
              <table className="w-full border">
                <thead>
                  <tr className="bg-muted">
                    {tableColumns.map((col) => (
                      <th key={col} className="px-4 py-2 text-left text-xs font-medium relative group">
                        <div className="flex items-center justify-between">
                          <span>{col}</span>
                          <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/20" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {tableColumns.map((col) => (
                      <td key={col} className="px-4 py-2 text-sm text-center">
                        -
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </DraggableBox>

        {/* Weekly Chart */}
        <DraggableBox
          position={weeklyChartPos}
          setPosition={setWeeklyChartPos}
          title={`${selectedStock?.code} ${selectedStock?.name} - Weekly`}
          minimized={weeklyMinimized}
          onMinimize={() => setWeeklyMinimized(!weeklyMinimized)}
          minWidth={300}
          minHeight={250}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-muted-foreground">Weekly Chart Placeholder</div>
          </div>
        </DraggableBox>

        {/* Daily Chart */}
        <DraggableBox
          position={dailyChartPos}
          setPosition={setDailyChartPos}
          title={`${selectedStock?.code} ${selectedStock?.name} - Daily`}
          minimized={dailyMinimized}
          onMinimize={() => setDailyMinimized(!dailyMinimized)}
          minWidth={300}
          minHeight={250}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-muted-foreground">Daily Chart Placeholder</div>
          </div>
        </DraggableBox>
      </div>
    </div>
  );
}
