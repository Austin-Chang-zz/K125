import IndicatorBadge from '../IndicatorBadge';

export default function IndicatorBadgeExample() {
  return (
    <div className="p-4 flex flex-wrap gap-2">
      <IndicatorBadge type="XO" />
      <IndicatorBadge type="XU" />
      <IndicatorBadge type="slope-up" />
      <IndicatorBadge type="slope-down" />
      <IndicatorBadge type="sar-high" value="5" />
      <IndicatorBadge type="sar-low" value="3" />
    </div>
  );
}
