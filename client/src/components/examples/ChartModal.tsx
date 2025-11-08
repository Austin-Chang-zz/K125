import { useState } from 'react';
import ChartModal from '../ChartModal';
import { Button } from '@/components/ui/button';

export default function ChartModalExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-chart">
        Open Chart
      </Button>
      <ChartModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        stockCode="2330"
        stockName="TSMC"
      />
    </div>
  );
}
