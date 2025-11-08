import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";

type MarketStatus = 'trading' | 'closed' | 'pre-market';

interface MarketStatusBadgeProps {
  status: MarketStatus;
  className?: string;
}

const statusConfig: Record<MarketStatus, { label: string; color: string; dotColor: string }> = {
  'trading': {
    label: 'Trading',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    dotColor: 'fill-green-600 dark:fill-green-400'
  },
  'closed': {
    label: 'Closed',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    dotColor: 'fill-gray-600 dark:fill-gray-400'
  },
  'pre-market': {
    label: 'Pre-Market',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    dotColor: 'fill-yellow-600 dark:fill-yellow-400'
  }
};

export default function MarketStatusBadge({ status, className = "" }: MarketStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge 
      variant="outline" 
      className={`${config.color} border-0 ${className}`}
      data-testid={`badge-market-status-${status}`}
    >
      <Circle className={`w-2 h-2 mr-1.5 ${config.dotColor}`} />
      {config.label}
    </Badge>
  );
}
