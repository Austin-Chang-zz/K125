import { Badge } from "@/components/ui/badge";

interface StockBadgeProps {
  code: string;
  name?: string;
  className?: string;
}

export default function StockBadge({ code, name, className = "" }: StockBadgeProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-mono font-medium text-sm uppercase" data-testid={`text-stock-${code}`}>
        {code}
      </span>
      {name && (
        <span className="text-sm text-muted-foreground" data-testid={`text-stockname-${code}`}>
          {name}
        </span>
      )}
    </div>
  );
}
