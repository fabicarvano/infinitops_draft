import { Clock } from 'lucide-react';
import { differenceInMinutes } from 'date-fns';
import { Progress } from '@/components/ui/progress';

interface SlaRiskIndicatorProps {
  deadline: string; // ISO string for the SLA deadline
  totalDuration: number; // Total duration in minutes
}

export default function SlaRiskIndicator({ deadline, totalDuration }: SlaRiskIndicatorProps) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  
  // Calculate remaining time in minutes
  const remainingMinutes = differenceInMinutes(deadlineDate, now);
  
  // Calculate the percentage of time remaining
  const percentRemaining = Math.max(0, Math.min(100, (remainingMinutes / totalDuration) * 100));
  
  // Format the remaining time
  const formatRemainingTime = (minutes: number): string => {
    if (minutes <= 0) return 'Expirado';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  
  // Determine color based on percentage remaining
  const getColorClass = (percent: number): string => {
    if (percent <= 5) return 'bg-red-600'; // Critical (less than 5%)
    if (percent <= 10) return 'bg-red-500'; // Danger (5-10%)
    if (percent <= 25) return 'bg-amber-500'; // Warning (10-25%)
    return 'bg-green-500'; // Healthy (more than 25%)
  };

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center mb-1 text-sm font-medium">
        <Clock className="w-4 h-4 mr-1" />
        <span>SLA restante: <span className={remainingMinutes <= 0 ? 'text-red-600' : ''}>
          {formatRemainingTime(remainingMinutes)}
        </span></span>
      </div>
      <div className="w-40 h-2">
        <Progress 
          value={percentRemaining} 
          className={`h-2 ${getColorClass(percentRemaining)}`} 
        />
      </div>
    </div>
  );
}