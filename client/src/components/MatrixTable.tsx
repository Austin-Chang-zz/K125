
import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent } from "@/components/ui/context-menu";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, TrendingUp, TrendingDown, LineChart, Bell, FolderPlus, ArrowUp, ArrowDown } from "lucide-react";
import type { StockData, EggPhase } from "@/lib/mockData";

interface MatrixTableProps {
  title: string;
  data: StockData[];
  onStockClick?: (stock: StockData) => void;
  onAddToTargetList?: (stock: StockData, listName: string) => void;
}

type SortState = 'asc' | 'desc' | null;

export default function MatrixTable({ title, data, onStockClick, onAddToTargetList }: MatrixTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortState>(null);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Cycle through: desc -> asc -> null (original)
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else if (sortDirection === 'asc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      // Return original order
      return data;
    }

    return [...data].sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;
      
      switch (sortColumn) {
        case 'code':
          aVal = a.code;
          bVal = b.code;
          break;
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'change':
          aVal = a.changePercent;
          bVal = b.changePercent;
          break;
        case 'volume':
          aVal = a.volume;
          bVal = b.volume;
          break;
        case 'volumeValue':
          aVal = a.volumeValue;
          bVal = b.volumeValue;
          break;
        case 'phase':
          aVal = a.eggPhase;
          bVal = b.eggPhase;
          break;
        case 'd2Pvcnt':
          aVal = a.d2Pvcnt;
          bVal = b.d2Pvcnt;
          break;
        case 'w2Pvcnt':
          aVal = a.w2Pvcnt;
          bVal = b.w2Pvcnt;
          break;
        default:
          return 0;
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [data, sortColumn, sortDirection]);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const getPhaseBadgeColor = (phase: EggPhase) => {
    const colors = {
      'Y': 'bg-red-600 text-white',
      'A1': 'bg-red-500 text-white',
      'A2': 'bg-red-400 text-white',
      'A3': 'bg-red-300 text-red-900',
      'X': 'bg-green-600 text-white',
      'B1': 'bg-green-500 text-white',
      'B2': 'bg-green-400 text-white',
      'B3': 'bg-green-300 text-green-900',
    };
    return colors[phase];
  };

  const targetLists = ['Tech Leaders', 'Financial', 'Phase A Watch', 'Breakout Candidates', 'High Volume', 'Custom List'];

  return (
    <div className="border rounded-md bg-card">
      <div className="px-4 py-2.5 border-b bg-muted/30">
        <h2 className="text-sm font-semibold tracking-tight" data-testid={`heading-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20 hover:bg-muted/20">
              <TableHead className="font-semibold text-xs h-9">
                <button 
                  className="flex items-center gap-1 hover-elevate px-1 py-0.5 rounded"
                  onClick={() => handleSort('code')}
                  data-testid="button-sort-code"
                >
                  Stock {sortColumn === 'code' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'code' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                  onClick={() => handleSort('price')}
                  data-testid="button-sort-price"
                >
                  Price {sortColumn === 'price' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'price' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                  onClick={() => handleSort('change')}
                  data-testid="button-sort-change"
                >
                  Change {sortColumn === 'change' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'change' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                  onClick={() => handleSort('volume')}
                  data-testid="button-sort-volume"
                >
                  Volume {sortColumn === 'volume' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'volume' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                  onClick={() => handleSort('volumeValue')}
                  data-testid="button-sort-volumevalue"
                >
                  Vol Value {sortColumn === 'volumeValue' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'volumeValue' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9">
                <button 
                  className="flex items-center gap-1 hover-elevate px-1 py-0.5 rounded"
                  onClick={() => handleSort('phase')}
                  data-testid="button-sort-phase"
                >
                  Phase {sortColumn === 'phase' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'phase' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                  onClick={() => handleSort('d2Pvcnt')}
                  data-testid="button-sort-d2pvcnt"
                >
                  D2 Pvcnt {sortColumn === 'd2Pvcnt' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'd2Pvcnt' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                  onClick={() => handleSort('w2Pvcnt')}
                  data-testid="button-sort-w2pvcnt"
                >
                  W2 Pvcnt {sortColumn === 'w2Pvcnt' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'w2Pvcnt' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">W2</TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">W10</TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">W26</TableHead>
              <TableHead className="font-semibold text-xs h-9">Weekly Indicators</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((stock) => (
              <ContextMenu key={stock.id}>
                <ContextMenuTrigger asChild>
                  <TableRow 
                    className="hover-elevate cursor-pointer h-8"
                    onClick={() => onStockClick?.(stock)}
                    data-testid={`row-stock-${stock.code}`}
                  >
                    <TableCell className="py-1.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-xs font-medium" data-testid={`text-code-${stock.code}`}>{stock.code}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">{stock.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm py-1.5" data-testid={`text-price-${stock.code}`}>
                      {stock.price.toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-right font-mono text-sm py-1.5 ${stock.change >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-1">
                          {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span data-testid={`text-change-${stock.code}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-xs">{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm py-1.5" data-testid={`text-volume-${stock.code}`}>
                      {formatNumber(stock.volume)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm py-1.5" data-testid={`text-volumevalue-${stock.code}`}>
                      {formatNumber(stock.volumeValue)}
                    </TableCell>
                    <TableCell className="py-1.5">
                      <Badge className={`${getPhaseBadgeColor(stock.eggPhase)} font-mono text-xs px-2 py-0`} data-testid={`badge-phase-${stock.code}`}>
                        {stock.eggPhase}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-mono text-xs py-1.5 ${stock.d2Pvcnt > 0 ? 'text-red-600 dark:text-red-400' : stock.d2Pvcnt < 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
                      {stock.d2Pvcnt > 0 ? '+' : ''}{stock.d2Pvcnt}
                    </TableCell>
                    <TableCell className={`text-right font-mono text-xs py-1.5 ${stock.w2Pvcnt > 0 ? 'text-red-600 dark:text-red-400' : stock.w2Pvcnt < 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
                      {stock.w2Pvcnt > 0 ? '+' : ''}{stock.w2Pvcnt}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs py-1.5">{stock.w2.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono text-xs py-1.5">{stock.w10.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono text-xs py-1.5">{stock.w26.toFixed(1)}</TableCell>
                    <TableCell className="py-1.5">
                      <div className="flex flex-wrap gap-1">
                        {stock.sarLowCount > 0 ? (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 border-green-500 text-green-600 dark:text-green-400">
                            SAR ↓{stock.sarLowCount}
                          </Badge>
                        ) : stock.sarHighCount > 0 ? (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 border-red-500 text-red-600 dark:text-red-400">
                            SAR ↑{stock.sarHighCount}
                          </Badge>
                        ) : null}
                        
                        {stock.w02xo10 !== undefined ? (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 font-mono border-red-500 text-red-600 dark:text-red-400">
                            W02XO10 {stock.w02xo10}
                          </Badge>
                        ) : stock.w02xu10 !== undefined ? (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 font-mono border-green-500 text-green-600 dark:text-green-400">
                            W02XU10 {stock.w02xu10}
                          </Badge>
                        ) : null}
                        
                        {stock.w02xo26 !== undefined ? (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 font-mono border-red-500 text-red-600 dark:text-red-400">
                            W02XO26 {stock.w02xo26}
                          </Badge>
                        ) : stock.w02xu26 !== undefined ? (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 font-mono border-green-500 text-green-600 dark:text-green-400">
                            W02XU26 {stock.w02xu26}
                          </Badge>
                        ) : null}
                        
                        {stock.w10xo26 !== undefined ? (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 font-mono border-red-500 text-red-600 dark:text-red-400">
                            W10XO26 {stock.w10xo26}
                          </Badge>
                        ) : stock.w10xu26 !== undefined ? (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 font-mono border-green-500 text-green-600 dark:text-green-400">
                            W10XU26 {stock.w10xu26}
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-56">
                  <ContextMenuItem onClick={() => onStockClick?.(stock)} data-testid={`menu-viewchart-${stock.code}`}>
                    <LineChart className="w-4 h-4 mr-2" />
                    View Chart
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => console.log('Set Alert', stock.code)} data-testid={`menu-setalert-${stock.code}`}>
                    <Bell className="w-4 h-4 mr-2" />
                    Set Alert
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => console.log('Mark Ascent', stock.code)} data-testid={`menu-markascent-${stock.code}`}>
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Mark Ascent
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => console.log('Mark Descent', stock.code)} data-testid={`menu-markdescent-${stock.code}`}>
                    <ArrowDown className="w-4 h-4 mr-2" />
                    Mark Descent
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>
                      <FolderPlus className="w-4 h-4 mr-2" />
                      Add to Target List
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                      {targetLists.map((listName, i) => (
                        <ContextMenuItem 
                          key={i} 
                          onClick={() => onAddToTargetList?.(stock, listName)}
                          data-testid={`menu-addtarget-${i + 1}-${stock.code}`}
                        >
                          {listName}
                        </ContextMenuItem>
                      ))}
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
