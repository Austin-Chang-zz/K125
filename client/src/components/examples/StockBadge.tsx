import StockBadge from '../StockBadge';

export default function StockBadgeExample() {
  return (
    <div className="p-4 space-y-4">
      <StockBadge code="2330" name="TSMC" />
      <StockBadge code="2454" name="MediaTek" />
      <StockBadge code="2317" />
    </div>
  );
}
