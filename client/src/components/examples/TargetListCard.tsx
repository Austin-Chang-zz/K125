import TargetListCard from '../TargetListCard';

const mockStocks = [
  { code: '2330', name: 'TSMC', phase: 'A2' as const },
  { code: '2454', name: 'MediaTek', phase: 'B1' as const },
  { code: '2317', name: 'Hon Hai', phase: 'Y' as const }
];

export default function TargetListCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <TargetListCard 
        listNumber={1}
        title="High Priority"
        stocks={mockStocks}
        onTitleChange={(title) => console.log('Title changed:', title)}
        onAddStock={() => console.log('Add stock clicked')}
        onRemoveStock={(code) => console.log('Remove stock:', code)}
        onStockClick={(stock) => console.log('Stock clicked:', stock.code)}
      />
    </div>
  );
}
