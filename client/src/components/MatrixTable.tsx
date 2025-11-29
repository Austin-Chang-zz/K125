import React, { useState, useMemo, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent } from "@/components/ui/context-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, TrendingUp, TrendingDown, LineChart, Bell, FolderPlus, ArrowUp, ArrowDown, Edit2, Save, X, MoreVertical, Maximize, Trash2, RotateCcw, Plus } from "lucide-react";
import type { StockData, EggPhase } from "@/lib/mockData";

interface MatrixTableProps {
  title: string;
  data: StockData[];
  onStockClick?: (stock: StockData) => void;
  onAddToTargetList?: (stock: StockData, listName: string) => void;
  isTargetList?: boolean;
  onRemoveStock?: (stock: StockData) => void;
  targetListNames?: string[];
  onClearAll?: () => void;
  onTitleChange?: (newTitle: string) => void;
  onDataReorder?: (newData: StockData[]) => void;
}

type SortState = 'asc' | 'desc' | null;

type ColumnId = 'code' | 'price' | 'change' | 'volume' | 'volumeValue' | 'phase' | 'd2Pvcnt' | 'w2Pvcnt' | 'w2' | 'w10' | 'w26' | 'indicators';

const defaultColumnOrder: ColumnId[] = ['code', 'price', 'change', 'volume', 'volumeValue', 'phase', 'd2Pvcnt', 'w2Pvcnt', 'w2', 'w10', 'w26', 'indicators'];
const allColumns: ColumnId[] = ['code', 'price', 'change', 'volume', 'volumeValue', 'phase', 'd2Pvcnt', 'w2Pvcnt', 'w2', 'w10', 'w26', 'indicators'];

export default function MatrixTable({ title, data, onStockClick, onAddToTargetList, isTargetList = false, onRemoveStock, targetListNames, onClearAll, onTitleChange, onDataReorder }: MatrixTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortState>(null);
  const [columnOrder, setColumnOrder] = useState<ColumnId[]>(defaultColumnOrder);
  const [hiddenColumns, setHiddenColumns] = useState<ColumnId[]>([]);
  const [draggedColumn, setDraggedColumn] = useState<ColumnId | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);
  const [matrix1Order, setMatrix1Order] = useState<ColumnId[]>(defaultColumnOrder);
  const [matrix1Hidden, setMatrix1Hidden] = useState<ColumnId[]>([]);
  const [matrix2Order, setMatrix2Order] = useState<ColumnId[]>(defaultColumnOrder);
  const [matrix2Hidden, setMatrix2Hidden] = useState<ColumnId[]>([]);
  const [matrix1Name, setMatrix1Name] = useState("Matrix 1");
  const [matrix2Name, setMatrix2Name] = useState("Matrix 2");
  const [editingPresetDialog, setEditingPresetDialog] = useState<string | null>(null);
  const [tempPresetName, setTempPresetName] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [savedState, setSavedState] = useState<{
    columnOrder: ColumnId[];
    hiddenColumns: ColumnId[];
    data: StockData[];
  } | null>(null);
  const [historyStack, setHistoryStack] = useState<Array<{
    columnOrder: ColumnId[];
    hiddenColumns: ColumnId[];
  }>>([]);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [dragOverRowIndex, setDragOverRowIndex] = useState<number | null>(null);
  const [newStockCode, setNewStockCode] = useState('');
  const [columnWidths, setColumnWidths] = useState<Record<ColumnId, number>>({});
  const [resizingColumn, setResizingColumn] = useState<ColumnId | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);




  // Use data directly from props, don't maintain separate state
  const currentData = data;

  // Load saved state on mount
  useEffect(() => {
    const savedStateJson = localStorage.getItem(`matrix-state-${title}`);
    if (savedStateJson) {
      try {
        const saved = JSON.parse(savedStateJson);
        if (saved.columnOrder) {
          setColumnOrder(saved.columnOrder);
        }
        if (saved.hiddenColumns) {
          setHiddenColumns(saved.hiddenColumns);
        }
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
  }, [title]);

  // Track changes for undo
  const pushToHistory = () => {
    const newHistory = [
      ...historyStack,
      {
        columnOrder: [...columnOrder],
        hiddenColumns: [...hiddenColumns]
      }
    ].slice(-5); // Keep only last 5 states
    setHistoryStack(newHistory);
  };

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

  const handleDragStart = (e: React.DragEvent, columnId: ColumnId) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: ColumnId) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragEnd = () => {
    if (draggedColumn && dragOverColumn) {
      pushToHistory();
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedColumn);
      const targetIndex = newOrder.indexOf(dragOverColumn);

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumn);

      setColumnOrder(newOrder);
    }
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleHideColumn = (columnId: ColumnId) => {
    if (columnId === 'code') return; // Don't allow hiding the stock code column
    pushToHistory();
    setHiddenColumns([...hiddenColumns, columnId]);
  };

  const handleUnhideColumn = (columnId: ColumnId) => {
    pushToHistory();
    setHiddenColumns(hiddenColumns.filter(col => col !== columnId));
  };

  const handleUnhideAll = () => {
    setHiddenColumns([]);
  };

  const handleSaveMatrix1Fields = () => {
    setMatrix1Order([...columnOrder]);
  };

  const handleSaveMatrix1Hides = () => {
    const newHidden = [...hiddenColumns];
    setMatrix1Hidden(newHidden);
    // Store to localStorage for persistence
    localStorage.setItem(`matrix1-hidden-${title}`, JSON.stringify(newHidden));
  };

  const handleSaveMatrix2Fields = () => {
    setMatrix2Order([...columnOrder]);
  };

  const handleSaveMatrix2Hides = () => {
    const newHidden = [...hiddenColumns];
    setMatrix2Hidden(newHidden);
    // Store to localStorage for persistence
    localStorage.setItem(`matrix2-hidden-${title}`, JSON.stringify(newHidden));
  };

  const handleLoadMatrix1 = () => {
    setColumnOrder([...matrix1Order]);
    // Load hidden columns from saved state
    const savedHidden = localStorage.getItem(`matrix1-hidden-${title}`);
    const hiddenToLoad = savedHidden ? JSON.parse(savedHidden) : matrix1Hidden;
    setHiddenColumns([...hiddenToLoad]);
  };

  const handleLoadMatrix2 = () => {
    setColumnOrder([...matrix2Order]);
    // Load hidden columns from saved state
    const savedHidden = localStorage.getItem(`matrix2-hidden-${title}`);
    const hiddenToLoad = savedHidden ? JSON.parse(savedHidden) : matrix2Hidden;
    setHiddenColumns([...hiddenToLoad]);
  };

  const handleLoadDefault = () => {
    setColumnOrder([...defaultColumnOrder]);
    setHiddenColumns([]);
  };

  const handleEditPresetName = (presetName: string) => {
    setEditingPresetDialog(presetName);
    setTempPresetName(presetName === "Matrix 1" ? matrix1Name : matrix2Name);
  };

  const handleSavePresetName = () => {
    if (editingPresetDialog === "Matrix 1") {
      setMatrix1Name(tempPresetName);
    } else if (editingPresetDialog === "Matrix 2") {
      setMatrix2Name(tempPresetName);
    }
    setEditingPresetDialog(null);
  };

  const handleCancelEditPresetName = () => {
    setEditingPresetDialog(null);
    setTempPresetName("");
  };

  const handleClearAll = () => {
    pushToHistory();
    if (onClearAll) {
      onClearAll();
    }
    // Reset titles for target lists to "target list 1" to "target list 6"
    if (targetListNames) {
      targetListNames.forEach((_, index) => {
        const newTitle = `Target List ${index + 1}`;
        // This assumes there's a way to update the parent's state for titles
        // If not, this part might need adjustment based on how titles are managed.
        // For now, we'll log it as an example.
        console.log(`Resetting title for target list ${index + 1} to: ${newTitle}`);
      });
    }
  };

  const handleSaveState = () => {
    const stateToSave = {
      columnOrder: [...columnOrder],
      hiddenColumns: [...hiddenColumns],
      data: [...currentData]
    };
    setSavedState(stateToSave);
    // Save to localStorage for persistence
    localStorage.setItem(`matrix-state-${title}`, JSON.stringify({
      columnOrder: stateToSave.columnOrder,
      hiddenColumns: stateToSave.hiddenColumns,
      data: stateToSave.data
    }));
    // Notify parent component about the saved data order
    if (onDataReorder) {
      onDataReorder(currentData);
    }
    // Clear history after save
    setHistoryStack([]);
    console.log('State saved:', { columnOrder, hiddenColumns, data: currentData });
  };

  const handleRestoreDefault = () => {
    pushToHistory();
    setColumnOrder([...defaultColumnOrder]);
    setHiddenColumns([]);
    // Clear localStorage
    localStorage.removeItem(`matrix-state-${title}`);
  };

  const handleUndo = () => {
    if (historyStack.length > 0) {
      const previousState = historyStack[historyStack.length - 1];
      setColumnOrder([...previousState.columnOrder]);
      setHiddenColumns([...previousState.hiddenColumns]);
      setHistoryStack(historyStack.slice(0, -1));
    }
  };

  const handleRowDragStart = (e: React.DragEvent, index: number) => {
    setDraggedRowIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleRowDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedRowIndex !== null && draggedRowIndex !== index) {
      setDragOverRowIndex(index);
    }
  };

  const handleRowDragEnd = () => {
    if (draggedRowIndex !== null && dragOverRowIndex !== null && draggedRowIndex !== dragOverRowIndex) {
      const newData = [...currentData];
      const draggedItem = newData[draggedRowIndex];
      newData.splice(draggedRowIndex, 1);
      newData.splice(dragOverRowIndex, 0, draggedItem);
      // Notify parent component about the reordering if callback exists
      if (onDataReorder) {
        onDataReorder(newData);
      }
    }
    setDraggedRowIndex(null);
    setDragOverRowIndex(null);
  };

  const handleRowDragLeave = () => {
    setDragOverRowIndex(null);
  };

  const handleEditTitle = () => {
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (onTitleChange && editedTitle !== title) {
      onTitleChange(editedTitle);
    }
  };

  const handleToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleAddNewStock = () => {
    if (newStockCode.trim() === '') return;

    // Ideally, you'd fetch actual stock data based on newStockCode
    // For now, we'll create a placeholder stock object
    const newStock: StockData = {
      id: Date.now().toString(), // Simple unique ID
      code: newStockCode.trim().toUpperCase(),
      name: `New Stock ${newStockCode.trim().toUpperCase()}`,
      price: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      volumeValue: 0,
      eggPhase: 'X',
      d2Pvcnt: 0,
      w2Pvcnt: 0,
      w2: 0,
      w10: 0,
      w26: 0,
      sarLowCount: 0,
      sarHighCount: 0,
    };

    const updatedData = [...currentData, newStock];
    setNewStockCode(''); // Clear input after adding

    if (onDataReorder) {
      onDataReorder(updatedData);
    }
  };

  const handleResizeStart = (e: React.MouseEvent, columnId: ColumnId) => {
    e.stopPropagation();
    setResizingColumn(columnId);
    setResizeStartX(e.clientX);
    setResizeStartWidth(columnWidths[columnId] || 120);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn) {
        const diff = e.clientX - resizeStartX;
        const newWidth = Math.max(80, resizeStartWidth + diff);
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

  const visibleColumns = useMemo(() => {
    return columnOrder.filter(col => !hiddenColumns.includes(col));
  }, [columnOrder, hiddenColumns]);

  const sortedData = useMemo(() => {
    const dataToSort = currentData.length > 0 ? currentData : data;
    if (!sortColumn || !sortDirection) {
      // Return original order if no sort is applied
      return dataToSort;
    }

    return [...dataToSort].sort((a, b) => {
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
  }, [data, currentData, sortColumn, sortDirection]);

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

  const targetLists = targetListNames || ['Tech Leaders', 'Financial', 'Phase A Watch', 'Breakout Candidates', 'High Volume', 'Custom List'];

  return (
    <div className={`border rounded-md bg-card ${isFullScreen ? 'fixed inset-4 z-50 shadow-2xl' : ''}`}>
      <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="h-7 text-sm"
              autoFocus
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') {
                  setEditedTitle(title);
                  setIsEditingTitle(false);
                }
              }}
            />
          </div>
        ) : (
          <h2 className="text-sm font-semibold tracking-tight" data-testid={`heading-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {editedTitle}
          </h2>
        )}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                data-testid="button-kebab-menu"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleUndo}
                disabled={historyStack.length === 0}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Undo {historyStack.length > 0 && `(${historyStack.length})`}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleToggleFullScreen}>
                <Maximize className="w-4 h-4 mr-2" />
                {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditTitle}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Title
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSaveState}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRestoreDefault}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Default
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleClearAll}
                className="text-red-600"
                data-testid="menu-clearall"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20 hover:bg-muted/20">
              {/* Index Column Header */}
              <TableHead className="font-semibold text-xs h-9 w-10 text-center">
                #
              </TableHead>
              {visibleColumns.map((colId) => {
                const isDragging = draggedColumn === colId;
                const isDragOver = dragOverColumn === colId;

                const renderHeader = () => {
                  switch (colId) {
                    case 'code':
                      return (
                        <button
                          className="flex items-center gap-1 hover-elevate px-1 py-0.5 rounded"
                          onClick={() => handleSort('code')}
                          data-testid="button-sort-code"
                        >
                          Stock {sortColumn === 'code' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'code' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                        </button>
                      );
                    case 'price':
                      return (
                        <button
                          className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                          onClick={() => handleSort('price')}
                          data-testid="button-sort-price"
                        >
                          Price {sortColumn === 'price' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'price' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                        </button>
                      );
                    case 'change':
                      return (
                        <button
                          className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                          onClick={() => handleSort('change')}
                          data-testid="button-sort-change"
                        >
                          Change {sortColumn === 'change' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'change' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                        </button>
                      );
                    case 'volume':
                      return (
                        <button
                          className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                          onClick={() => handleSort('volume')}
                          data-testid="button-sort-volume"
                        >
                          Volume {sortColumn === 'volume' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'volume' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                        </button>
                      );
                    case 'volumeValue':
                      return (
                        <button
                          className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                          onClick={() => handleSort('volumeValue')}
                          data-testid="button-sort-volumevalue"
                        >
                          Vol Value {sortColumn === 'volumeValue' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'volumeValue' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                        </button>
                      );
                    case 'phase':
                      return (
                        <button
                          className="flex items-center gap-1 hover-elevate px-1 py-0.5 rounded"
                          onClick={() => handleSort('phase')}
                          data-testid="button-sort-phase"
                        >
                          Phase {sortColumn === 'phase' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'phase' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                        </button>
                      );
                    case 'd2Pvcnt':
                      return (
                        <button
                          className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                          onClick={() => handleSort('d2Pvcnt')}
                          data-testid="button-sort-d2pvcnt"
                        >
                          D2 Pvcnt {sortColumn === 'd2Pvcnt' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'd2Pvcnt' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                        </button>
                      );
                    case 'w2Pvcnt':
                      return (
                        <button
                          className="flex items-center gap-1 ml-auto hover-elevate px-1 py-0.5 rounded"
                          onClick={() => handleSort('w2Pvcnt')}
                          data-testid="button-sort-w2pvcnt"
                        >
                          W2 Pvcnt {sortColumn === 'w2Pvcnt' && sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortColumn === 'w2Pvcnt' && sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUpDown className="w-3 h-3" />}
                        </button>
                      );
                    case 'w2':
                      return 'W2';
                    case 'w10':
                      return 'W10';
                    case 'w26':
                      return 'W26';
                    case 'indicators':
                      return 'Weekly Indicators';
                    default:
                      return '';
                  }
                };

                const alignment = ['price', 'change', 'volume', 'volumeValue', 'd2Pvcnt', 'w2Pvcnt', 'w2', 'w10', 'w26'].includes(colId) ? 'text-right' : '';

                return (
                  <ContextMenu key={colId}>
                    <ContextMenuTrigger asChild>
                      <TableHead
                        className={`font-semibold text-xs h-9 ${alignment} ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-l-2 border-primary' : ''} cursor-move relative`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, colId)}
                        onDragOver={(e) => handleDragOver(e, colId)}
                        onDragEnd={handleDragEnd}
                        onDragLeave={handleDragLeave}
                        style={{ width: columnWidths[colId] || 'auto' }}
                      >
                        {renderHeader()}
                        <div
                          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 z-10"
                          onMouseDown={(e) => handleResizeStart(e, colId)}
                        />
                      </TableHead>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      {colId !== 'code' && (
                        <ContextMenuItem onClick={() => handleHideColumn(colId)}>
                          Hide Column
                        </ContextMenuItem>
                      )}
                      {hiddenColumns.length > 0 && (
                        <>
                          <ContextMenuSeparator />
                          <ContextMenuSub>
                            <ContextMenuSubTrigger>Unhide Columns</ContextMenuSubTrigger>
                            <ContextMenuSubContent>
                              {hiddenColumns.map((hiddenCol) => (
                                <ContextMenuItem key={hiddenCol} onClick={() => handleUnhideColumn(hiddenCol)}>
                                  {hiddenCol}
                                </ContextMenuItem>
                              ))}
                              <ContextMenuSeparator />
                              <ContextMenuItem onClick={handleUnhideAll}>Unhide All</ContextMenuItem>
                            </ContextMenuSubContent>
                          </ContextMenuSub>
                        </>
                      )}
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((stock, rowIndex) => {
              const renderCell = (colId: ColumnId) => {
                switch (colId) {
                  case 'code':
                    return (
                      <TableCell className="py-1.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-xs font-medium" data-testid={`text-code-${stock.code}`}>{stock.code}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[120px]">{stock.name}</span>
                        </div>
                      </TableCell>
                    );
                  case 'price':
                    return (
                      <TableCell className="text-right font-mono text-sm py-1.5" data-testid={`text-price-${stock.code}`}>
                        {stock.price.toFixed(2)}
                      </TableCell>
                    );
                  case 'change':
                    return (
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
                    );
                  case 'volume':
                    return (
                      <TableCell className="text-right font-mono text-sm py-1.5" data-testid={`text-volume-${stock.code}`}>
                        {formatNumber(stock.volume)}
                      </TableCell>
                    );
                  case 'volumeValue':
                    return (
                      <TableCell className="text-right font-mono text-sm py-1.5" data-testid={`text-volumevalue-${stock.code}`}>
                        {formatNumber(stock.volumeValue)}
                      </TableCell>
                    );
                  case 'phase':
                    return (
                      <TableCell className="py-1.5">
                        <Badge className={`${getPhaseBadgeColor(stock.eggPhase)} font-mono text-xs px-2 py-0`} data-testid={`badge-phase-${stock.code}`}>
                          {stock.eggPhase}
                        </Badge>
                      </TableCell>
                    );
                  case 'd2Pvcnt':
                    return (
                      <TableCell className={`text-right font-mono text-xs py-1.5 ${stock.d2Pvcnt > 0 ? 'text-red-600 dark:text-red-400' : stock.d2Pvcnt < 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
                        {stock.d2Pvcnt > 0 ? '+' : ''}{stock.d2Pvcnt}
                      </TableCell>
                    );
                  case 'w2Pvcnt':
                    return (
                      <TableCell className={`text-right font-mono text-xs py-1.5 ${stock.w2Pvcnt > 0 ? 'text-red-600 dark:text-red-400' : stock.w2Pvcnt < 0 ? 'text-green-600 dark:text-green-400' : ''}`}>
                        {stock.w2Pvcnt > 0 ? '+' : ''}{stock.w2Pvcnt}
                      </TableCell>
                    );
                  case 'w2':
                    return (
                      <TableCell className="text-right font-mono text-xs py-1.5">{stock.w2.toFixed(1)}</TableCell>
                    );
                  case 'w10':
                    return (
                      <TableCell className="text-right font-mono text-xs py-1.5">{stock.w10.toFixed(1)}</TableCell>
                    );
                  case 'w26':
                    return (
                      <TableCell className="text-right font-mono text-xs py-1.5">{stock.w26.toFixed(1)}</TableCell>
                    );
                  case 'indicators':
                    return (
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
                    );
                  default:
                    return null;
                }
              };

              const isDraggingRow = draggedRowIndex === rowIndex;
              const isDragOverRow = dragOverRowIndex === rowIndex;

              return (
                <ContextMenu key={stock.id}>
                  <ContextMenuTrigger asChild>
                    <TableRow
                      className={`hover-elevate cursor-pointer h-8 ${isDraggingRow ? 'opacity-50' : ''} ${isDragOverRow ? 'border-t-2 border-primary' : ''}`}
                      onClick={() => {
                        if (onStockClick) onStockClick(stock);
                      }}
                      data-testid={`row-stock-${stock.code}`}
                      draggable
                      onDragStart={(e) => handleRowDragStart(e, rowIndex)}
                      onDragOver={(e) => handleRowDragOver(e, rowIndex)}
                      onDragEnd={handleRowDragEnd}
                      onDragLeave={handleRowDragLeave}
                    >
                      {/* Index Cell */}
                      <TableCell className="text-center font-mono text-xs py-1.5 w-10">
                        {rowIndex + 1}
                      </TableCell>
                      {visibleColumns.map((colId) => (
                        <React.Fragment key={colId}>
                          {renderCell(colId)}
                        </React.Fragment>
                      ))}
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-56">
                    <ContextMenuItem onClick={() => {
                        if (onStockClick) onStockClick(stock);
                      }} data-testid={`menu-viewchart-${stock.code}`}>
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
                    {isTargetList && onRemoveStock && (
                      <>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          onClick={() => onRemoveStock(stock)}
                          className="text-red-600"
                          data-testid={`menu-delete-${stock.code}`}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Delete from List
                        </ContextMenuItem>
                      </>
                    )}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToTargetList?.(stock, listName);
                            }}
                            data-testid={`menu-addtarget-${i + 1}-${stock.code}`}
                          >
                            {listName}
                          </ContextMenuItem>
                        ))}
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
            {/* New Stock Input Row - Only show for Target Lists */}
            {isTargetList && (
              <TableRow className="hover:bg-transparent">
                <TableCell className="text-center font-mono text-xs py-1.5">
                  <Plus className="w-4 h-4 mx-auto text-muted-foreground" />
                </TableCell>
                <TableCell colSpan={visibleColumns.length} className="py-1.5">
                  <div className="flex items-center gap-2">
                    <Input
                      value={newStockCode}
                      onChange={(e) => setNewStockCode(e.target.value)}
                      placeholder="Enter Stock Code"
                      className="h-7 w-40 border-dashed text-sm text-muted-foreground"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddNewStock();
                        }
                      }}
                      data-testid="input-new-stock"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAddNewStock}
                      disabled={newStockCode.trim() === ''}
                      className="h-7"
                      data-testid="button-add-stock"
                    >
                      Add Stock
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editingPresetDialog !== null} onOpenChange={(open) => !open && handleCancelEditPresetName()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Preset Name</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={tempPresetName}
              onChange={(e) => setTempPresetName(e.target.value)}
              placeholder="Enter preset name"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEditPresetName}>
              Cancel
            </Button>
            <Button onClick={handleSavePresetName}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}