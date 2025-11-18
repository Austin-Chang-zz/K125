import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, X, Edit2, Check, Maximize2, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import StockBadge from "./StockBadge";
import PhaseBadge from "./PhaseBadge";

interface Stock {
  code: string;
  name: string;
  phase: 'Y' | 'A1' | 'A2' | 'A3' | 'X' | 'B1' | 'B2' | 'B3';
}

interface TargetListCardProps {
  listNumber: number;
  title?: string;
  stocks?: Stock[];
  onTitleChange?: (title: string) => void;
  onAddStock?: () => void;
  onRemoveStock?: (code: string) => void;
  onStockClick?: (stock: Stock) => void;
  onExpand?: () => void;
  onClearAll?: () => void;
}

export default function TargetListCard({ 
  listNumber, 
  title: initialTitle, 
  stocks = [],
  onTitleChange,
  onAddStock,
  onRemoveStock,
  onStockClick,
  onExpand,
  onClearAll
}: TargetListCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(initialTitle || `Target List ${listNumber}`);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    if (onTitleChange && title !== initialTitle) {
      onTitleChange(title);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    
    // Here you would reorder the stocks array
    // Since we don't have direct control, we'll just log this for now
    console.log(`Move stock from ${draggedIndex} to ${dropIndex}`);
    setDraggedIndex(null);
  };

  return (
    <Card className="h-full flex flex-col" data-testid={`card-targetlist-${listNumber}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        {isEditingTitle ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              data-testid={`input-title-${listNumber}`}
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8"
              onClick={handleTitleSave}
              data-testid={`button-savetitle-${listNumber}`}
            >
              <Check className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 flex-1">
              <h3 className="font-medium" data-testid={`text-title-${listNumber}`}>{title}</h3>
              <span className="text-xs text-muted-foreground" data-testid={`text-count-${listNumber}`}>
                ({stocks.length})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8" data-testid={`button-menu-${listNumber}`}>
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onExpand} data-testid={`menu-expand-${listNumber}`}>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Full Screen
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditingTitle(true)} data-testid={`menu-edittitle-${listNumber}`}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Title
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onClearAll} data-testid={`menu-clearall-${listNumber}`}>
                    Clear All
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pt-0">
        <div className="space-y-2">
          {stocks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm" data-testid={`text-empty-${listNumber}`}>
              No stocks in this list
            </div>
          ) : (
            stocks.map((stock, index) => (
              <ContextMenu key={stock.code}>
                <ContextMenuTrigger asChild>
                  <div 
                    className="flex items-center justify-between p-2 rounded-md hover-elevate active-elevate-2 cursor-pointer border"
                    onClick={() => onStockClick?.(stock)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    data-testid={`item-stock-${listNumber}-${stock.code}`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <StockBadge code={stock.code} name={stock.name} />
                    </div>
                    <div className="flex items-center gap-2">
                      <PhaseBadge phase={stock.phase} />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveStock?.(stock.code);
                        }}
                        data-testid={`button-remove-${listNumber}-${stock.code}`}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem 
                    onClick={() => onRemoveStock?.(stock.code)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete from List
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
