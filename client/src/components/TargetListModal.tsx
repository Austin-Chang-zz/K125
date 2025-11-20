
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MatrixTable from "./MatrixTable";
import type { StockData } from "@/lib/mockData";

interface TargetListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  stocks: StockData[];
  onStockClick?: (stock: StockData) => void;
  onAddToTargetList?: (stock: StockData, listName: string) => void;
  onRemoveStock?: (stock: StockData) => void;
}

interface TargetListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  stocks: StockData[];
  onStockClick?: (stock: StockData) => void;
  onAddToTargetList?: (stock: StockData, listName: string) => void;
  onRemoveStock?: (stock: StockData) => void;
  onDataReorder?: (newData: StockData[]) => void;
  targetListNames?: string[];
}

export default function TargetListModal({
  isOpen,
  onClose,
  title,
  stocks,
  onStockClick,
  onAddToTargetList,
  onRemoveStock,
  onDataReorder,
  targetListNames
}: TargetListModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle data-testid="dialog-title-targetlist">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto px-6 py-4">
          <MatrixTable
            title={title}
            data={stocks}
            onStockClick={onStockClick}
            onAddToTargetList={onAddToTargetList}
            isTargetList={true}
            onRemoveStock={onRemoveStock}
            onDataReorder={onDataReorder}
            targetListNames={targetListNames}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
