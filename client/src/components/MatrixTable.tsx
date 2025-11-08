import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import StockBadge from "./StockBadge";
import PhaseBadge from "./PhaseBadge";
import IndicatorBadge from "./IndicatorBadge";
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";

export interface StockData {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  volumeValue: number;
  phase: 'Y' | 'A1' | 'A2' | 'A3' | 'X' | 'B1' | 'B2' | 'B3';
  ma2: number;
  ma10: number;
  ma50: number;
  maCross?: 'XO' | 'XU';
  slope?: 'up' | 'down';
  sarCount?: number;
}

interface MatrixTableProps {
  title: string;
  data: StockData[];
  onStockClick?: (stock: StockData) => void;
  onAddToTargetList?: (stock: StockData, listIndex: number) => void;
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

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  return (
    <div className="border rounded-md">
      <div className="px-4 py-3 border-b bg-muted/30">
        <h2 className="text-lg font-medium" data-testid={`heading-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20">
              <TableHead className="font-medium text-xs uppercase tracking-wide w-32">
                <button 
                  className="flex items-center gap-1 hover-elevate"
                  onClick={() => handleSort('code')}
                  data-testid="button-sort-code"
                >
                  Stock <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wide text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate"
                  onClick={() => handleSort('price')}
                  data-testid="button-sort-price"
                >
                  Price <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wide text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate"
                  onClick={() => handleSort('change')}
                  data-testid="button-sort-change"
                >
                  Change <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wide text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate"
                  onClick={() => handleSort('volume')}
                  data-testid="button-sort-volume"
                >
                  Volume <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wide text-right">
                <button 
                  className="flex items-center gap-1 ml-auto hover-elevate"
                  onClick={() => handleSort('volumeValue')}
                  data-testid="button-sort-volumevalue"
                >
                  Vol Value <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wide">Phase</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wide text-right">MA2</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wide text-right">MA10</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wide text-right">MA50</TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wide">Indicators</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((stock, index) => (
              <ContextMenu key={stock.code}>
                <ContextMenuTrigger asChild>
                  <TableRow 
                    className="hover-elevate cursor-pointer h-10"
                    onClick={() => onStockClick?.(stock)}
                    data-testid={`row-stock-${stock.code}`}
                  >
                    <TableCell>
                      <StockBadge code={stock.code} name={stock.name} />
                    </TableCell>
                    <TableCell className="text-right font-mono" data-testid={`text-price-${stock.code}`}>
                      {stock.price.toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-right font-mono ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span data-testid={`text-change-${stock.code}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono" data-testid={`text-volume-${stock.code}`}>
                      {formatNumber(stock.volume)}
                    </TableCell>
                    <TableCell className="text-right font-mono" data-testid={`text-volumevalue-${stock.code}`}>
                      {formatNumber(stock.volumeValue)}
                    </TableCell>
                    <TableCell>
                      <PhaseBadge phase={stock.phase} />
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">{stock.ma2.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{stock.ma10.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{stock.ma50.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {stock.maCross && <IndicatorBadge type={stock.maCross} />}
                        {stock.slope && <IndicatorBadge type={stock.slope === 'up' ? 'slope-up' : 'slope-down'} />}
                        {stock.sarCount !== undefined && <IndicatorBadge type="sar-high" value={stock.sarCount} />}
                      </div>
                    </TableCell>
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => onStockClick?.(stock)} data-testid={`menu-viewchart-${stock.code}`}>
                    View Chart
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => console.log('Mark Ascent', stock.code)} data-testid={`menu-markascent-${stock.code}`}>
                    Mark Ascent
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => console.log('Mark Descent', stock.code)} data-testid={`menu-markdescent-${stock.code}`}>
                    Mark Descent
                  </ContextMenuItem>
                  <ContextMenuItem disabled className="text-xs text-muted-foreground">
                    Add to Target List →
                  </ContextMenuItem>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <ContextMenuItem 
                      key={i} 
                      className="pl-6"
                      onClick={() => onAddToTargetList?.(stock, i)}
                      data-testid={`menu-addtarget-${i}-${stock.code}`}
                    >
                      Target List {i}
                    </ContextMenuItem>
                  ))}
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
