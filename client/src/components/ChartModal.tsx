import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Maximize2, Download } from "lucide-react";
import { useState } from "react";

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockCode: string;
  stockName: string;
}

export default function ChartModal({ isOpen, onClose, stockCode, stockName }: ChartModalProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly'>('daily');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh]" data-testid="modal-chart">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono font-bold text-lg" data-testid="text-chart-stock">
                {stockCode}
              </span>
              <span className="text-muted-foreground">{stockName}</span>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => console.log('Download chart')}
                data-testid="button-download-chart"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => console.log('Fullscreen')}
                data-testid="button-fullscreen-chart"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as 'daily' | 'weekly')} className="flex-1 flex flex-col">
          <TabsList className="w-fit" data-testid="tabs-timeframe">
            <TabsTrigger value="daily" data-testid="tab-daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly" data-testid="tab-weekly">Weekly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="flex-1 mt-4">
            <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center border" data-testid="chart-container-daily">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  TradingView Chart Widget
                </p>
                <p className="text-sm text-muted-foreground">
                  Daily K-bar chart for {stockCode}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  MA2, MA10, MA50, MA132 overlays
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="flex-1 mt-4">
            <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center border" data-testid="chart-container-weekly">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  TradingView Chart Widget
                </p>
                <p className="text-sm text-muted-foreground">
                  Weekly K-bar chart for {stockCode}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  MA2, MA10, MA26 overlays
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
