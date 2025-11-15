import { useState } from "react";
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

export default function MatrixTable({ title, data, onStockClick, onAddToTargetList }: MatrixTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    
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
      default:
        return 0;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    
    return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const getPhaseBadgeColor = (phase: EggPhase) => {
    const colors = {
      'Y': 'bg-green-500 text-white',
      'A1': 'bg-blue-400 text-white',
      'A2': 'bg-blue-500 text-white',
      'A3': 'bg-blue-600 text-white',
      'X': 'bg-orange-500 text-white',
      'B1': 'bg-red-400 text-white',
      'B2': 'bg-red-500 text-white',
      'B3': 'bg-red-600 text-white',
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
                  Stock <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                  onClick={() => handleSort('price')}
                  data-testid="button-sort-price"
                >
                  Price <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                  onClick={() => handleSort('change')}
                  data-testid="button-sort-change"
                >
                  Change <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                  onClick={() => handleSort('volume')}
                  data-testid="button-sort-volume"
                >
                  Volume <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                  onClick={() => handleSort('volumeValue')}
                  data-testid="button-sort-volumevalue"
                >
                  Vol Value <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="font-semibold text-xs h-9">Phase</TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">MA2</TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">MA10</TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">MA50</TableHead>
              <TableHead className="font-semibold text-xs h-9 text-right">MA132</TableHead>
              <TableHead className="font-semibold text-xs h-9">Cross</TableHead>
              <TableHead className="font-semibold text-xs h-9">Slope</TableHead>
              <TableHead className="font-semibold text-xs h-9">Status</TableHead>
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
                    <TableCell className={`text-right font-mono text-sm py-1.5 ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
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
                    <TableCell className="text-right font-mono text-xs py-1.5">{stock.ma2.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono text-xs py-1.5">{stock.ma10.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono text-xs py-1.5">{stock.ma50.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono text-xs py-1.5">{stock.ma132.toFixed(1)}</TableCell>
                    <TableCell className="py-1.5">
                      {stock.crossSignal && (
                        <Badge variant="outline" className={`text-xs px-2 py-0 font-mono ${stock.crossSignal === 'XO' ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-red-500 text-red-600 dark:text-red-400'}`}>
                          {stock.crossSignal} {stock.crossCount}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-1.5">
                      <div className="flex items-center gap-1">
                        {stock.ma2Slope > 0.5 ? (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 border-green-500 text-green-600 dark:text-green-400">
                            <TrendingUp className="w-3 h-3" />
                          </Badge>
                        ) : stock.ma2Slope < -0.5 ? (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 border-red-500 text-red-600 dark:text-red-400">
                            <TrendingDown className="w-3 h-3" />
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5">
                      {stock.ascentDescent && (
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          {stock.ascentDescent === 'Ascent' ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
                          {stock.ascentDescent}
                        </Badge>
                      )}
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
