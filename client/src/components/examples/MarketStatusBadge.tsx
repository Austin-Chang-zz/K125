import MarketStatusBadge from '../MarketStatusBadge';

export default function MarketStatusBadgeExample() {
  return (
    <div className="p-4 flex flex-wrap gap-2">
      <MarketStatusBadge status="trading" />
      <MarketStatusBadge status="pre-market" />
      <MarketStatusBadge status="closed" />
    </div>
  );
}
