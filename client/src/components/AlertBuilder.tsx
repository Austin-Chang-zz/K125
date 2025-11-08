import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AlertBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (alert: AlertConfig) => void;
}

interface AlertConfig {
  stockCode: string;
  indicator: string;
  operator: string;
  value: string;
  timeframe: string;
  soundEnabled: boolean;
}

export default function AlertBuilder({ isOpen, onClose, onSave }: AlertBuilderProps) {
  const [config, setConfig] = useState<AlertConfig>({
    stockCode: '',
    indicator: 'ma-cross',
    operator: 'crosses-above',
    value: '',
    timeframe: 'daily',
    soundEnabled: true
  });

  const handleSave = () => {
    onSave?.(config);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-alert-builder">
        <DialogHeader>
          <DialogTitle>Create Alert</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="stock-code">Stock Code</Label>
            <Input
              id="stock-code"
              placeholder="e.g., 2330"
              value={config.stockCode}
              onChange={(e) => setConfig({ ...config, stockCode: e.target.value })}
              data-testid="input-stock-code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select 
              value={config.timeframe} 
              onValueChange={(v) => setConfig({ ...config, timeframe: v })}
            >
              <SelectTrigger id="timeframe" data-testid="select-timeframe">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indicator">Indicator</Label>
            <Select 
              value={config.indicator} 
              onValueChange={(v) => setConfig({ ...config, indicator: v })}
            >
              <SelectTrigger id="indicator" data-testid="select-indicator">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ma-cross">MA Cross</SelectItem>
                <SelectItem value="slope">MA Slope</SelectItem>
                <SelectItem value="phase">Egg Phase</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="operator">Condition</Label>
            <Select 
              value={config.operator} 
              onValueChange={(v) => setConfig({ ...config, operator: v })}
            >
              <SelectTrigger id="operator" data-testid="select-operator">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crosses-above">Crosses Above</SelectItem>
                <SelectItem value="crosses-below">Crosses Below</SelectItem>
                <SelectItem value="greater-than">Greater Than</SelectItem>
                <SelectItem value="less-than">Less Than</SelectItem>
                <SelectItem value="equals">Equals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              placeholder="Enter threshold value"
              value={config.value}
              onChange={(e) => setConfig({ ...config, value: e.target.value })}
              data-testid="input-value"
            />
          </div>

          <div className="flex items-center justify-between col-span-2 pt-4 border-t">
            <Label htmlFor="sound">Enable Sound Alert</Label>
            <Switch
              id="sound"
              checked={config.soundEnabled}
              onCheckedChange={(checked) => setConfig({ ...config, soundEnabled: checked })}
              data-testid="switch-sound"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-alert">
            Create Alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
