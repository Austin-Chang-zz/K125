import { Badge } from "@/components/ui/badge";

type Phase = 'Y' | 'A1' | 'A2' | 'A3' | 'X' | 'B1' | 'B2' | 'B3';

interface PhaseBadgeProps {
  phase: Phase;
  className?: string;
}

const phaseColors: Record<Phase, string> = {
  'Y': 'bg-green-600 text-white hover:bg-green-700',
  'A1': 'bg-green-500 text-white hover:bg-green-600',
  'A2': 'bg-green-400 text-white hover:bg-green-500',
  'A3': 'bg-green-300 text-green-900 hover:bg-green-400',
  'X': 'bg-red-600 text-white hover:bg-red-700',
  'B1': 'bg-red-500 text-white hover:bg-red-600',
  'B2': 'bg-red-400 text-white hover:bg-red-500',
  'B3': 'bg-red-300 text-red-900 hover:bg-red-400',
};

export default function PhaseBadge({ phase, className = "" }: PhaseBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={`${phaseColors[phase]} border-0 font-mono font-medium ${className}`}
      data-testid={`badge-phase-${phase}`}
    >
      {phase}
    </Badge>
  );
}
