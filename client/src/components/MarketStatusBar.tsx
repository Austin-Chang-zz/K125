import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

type MarketStatus = 'pre-market' | 'trading' | 'post-market' | 'closed';

interface ScheduledEvent {
  time: string;
  label: string;
  description: string;
}

const scheduledEvents: ScheduledEvent[] = [
  { time: '08:40', label: 'Clear & Reset', description: 'Move Main to Previous Matrix' },
  { time: '09:03', label: 'Market Open', description: 'Initialize VV100 display' },
  { time: '13:30', label: 'Market Close', description: 'Freeze live updates' },
  { time: '14:30', label: 'Data Sync', description: 'Auto-sync trading data' },
];

export default function MarketStatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState<MarketStatus>('closed');
  const [nextEvent, setNextEvent] = useState<ScheduledEvent | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    if (timeInMinutes >= 8 * 60 + 40 && timeInMinutes < 9 * 60) {
      setMarketStatus('pre-market');
    } else if (timeInMinutes >= 9 * 60 && timeInMinutes < 13 * 60 + 30) {
      setMarketStatus('trading');
    } else if (timeInMinutes >= 13 * 60 + 30 && timeInMinutes < 15 * 60) {
      setMarketStatus('post-market');
    } else {
      setMarketStatus('closed');
    }

    const currentTimeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    let upcoming: ScheduledEvent | null = null;

    for (const event of scheduledEvents) {
      if (event.time > currentTimeStr) {
        upcoming = event;
        break;
      }
    }

    if (!upcoming) {
      upcoming = scheduledEvents[0];
    }

    setNextEvent(upcoming);
  }, [currentTime]);

  const getStatusBadge = () => {
    const badges = {
      'pre-market': { label: 'Pre-Market', color: 'bg-blue-500 text-white' },
      'trading': { label: 'Trading', color: 'bg-green-500 text-white animate-pulse' },
      'post-market': { label: 'Post-Market', color: 'bg-orange-500 text-white' },
      'closed': { label: 'Closed', color: 'bg-muted text-muted-foreground' },
    };
    return badges[marketStatus];
  };

  const statusBadge = getStatusBadge();
  const timeStr = currentTime.toLocaleTimeString('en-US', { hour12: false });

  return (
    <div className="flex items-center gap-2 flex-1" data-testid="market-status-bar">
      <span className="font-mono text-xs font-medium" data-testid="text-current-time">{timeStr}</span>
      <Badge className={`${statusBadge.color} px-2 py-0.5 text-xs flex-shrink-0`} data-testid="badge-market-status">
        {statusBadge.label}
      </Badge>
    </div>
  );
}
