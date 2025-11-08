import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface IndicatorBadgeProps {
  type: 'XO' | 'XU' | 'slope-up' | 'slope-down' | 'sar-high' | 'sar-low';
  value?: string | number;
  className?: string;
}

export default function IndicatorBadge({ type, value, className = "" }: IndicatorBadgeProps) {
  const getConfig = () => {
    switch (type) {
      case 'XO':
        return { label: 'XO', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
      case 'XU':
        return { label: 'XU', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
      case 'slope-up':
        return { label: <TrendingUp className="w-3 h-3" />, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
      case 'slope-down':
        return { label: <TrendingDown className="w-3 h-3" />, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
      case 'sar-high':
        return { label: 'SAR↑', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
      case 'sar-low':
        return { label: 'SAR↓', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' };
    }
  };

  const config = getConfig();

  return (
    <Badge 
      variant="outline" 
      className={`${config.color} border-0 font-mono text-xs px-2 ${className}`}
      data-testid={`badge-indicator-${type}`}
    >
      <span className="flex items-center gap-1">
        {config.label}
        {value !== undefined && <span>{value}</span>}
      </span>
    </Badge>
  );
}
