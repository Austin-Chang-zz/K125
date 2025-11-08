import MatrixTable, { StockData } from '../MatrixTable';

const mockData: StockData[] = [
  {
    code: '2330',
    name: 'TSMC',
    price: 595.00,
    change: 12.50,
    changePercent: 2.15,
    volume: 45230000,
    volumeValue: 26912000000,
    phase: 'A2',
    ma2: 590.25,
    ma10: 578.50,
    ma50: 545.30,
    maCross: 'XO',
    slope: 'up',
    sarCount: 5
  },
  {
    code: '2454',
    name: 'MediaTek',
    price: 1125.00,
    change: -15.00,
    changePercent: -1.32,
    volume: 12450000,
    volumeValue: 14006250000,
    phase: 'B1',
    ma2: 1135.50,
    ma10: 1148.20,
    ma50: 1165.80,
    maCross: 'XU',
    slope: 'down'
  },
  {
    code: '2317',
    name: 'Hon Hai',
    price: 185.50,
    change: 3.50,
    changePercent: 1.92,
    volume: 78920000,
    volumeValue: 14640020000,
    phase: 'Y',
    ma2: 183.75,
    ma10: 180.40,
    ma50: 175.20,
    slope: 'up',
    sarCount: 3
  }
];

export default function MatrixTableExample() {
  return (
    <MatrixTable 
      title="Main 100 (VV100)"
      data={mockData}
      onStockClick={(stock) => console.log('Stock clicked:', stock.code)}
      onAddToTargetList={(stock, listIndex) => console.log(`Add ${stock.code} to list ${listIndex}`)}
    />
  );
}
