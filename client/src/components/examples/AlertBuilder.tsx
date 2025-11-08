import { useState } from 'react';
import AlertBuilder from '../AlertBuilder';
import { Button } from '@/components/ui/button';

export default function AlertBuilderExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-alert">
        Create Alert
      </Button>
      <AlertBuilder 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={(alert) => console.log('Alert created:', alert)}
      />
    </div>
  );
}
