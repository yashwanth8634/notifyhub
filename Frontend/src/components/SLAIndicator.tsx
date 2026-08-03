import { differenceInHours, parseISO } from 'date-fns';

interface SLAIndicatorProps {
  createdAt: string;
  status: string;
}

export function SLAIndicator({ createdAt, status }: SLAIndicatorProps) {
  if (status === 'resolved') {
    return <span className="text-green-600 text-sm font-medium">Resolved</span>;
  }

  const hoursElapsed = differenceInHours(new Date(), parseISO(createdAt));
  const isBreached = hoursElapsed >= 6;
  const isWarning = hoursElapsed >= 4;

  let colorClass = 'text-green-600';
  let text = 'Within SLA';

  if (isBreached) {
    colorClass = 'text-red-600';
    text = 'SLA Breached (>6h)';
  } else if (isWarning) {
    colorClass = 'text-amber-600';
    text = 'Approaching SLA';
  }

  return (
    <div className={`flex items-center gap-1.5 text-sm font-medium ${colorClass}`}>
      <div className={`w-2 h-2 rounded-full ${isBreached ? 'bg-red-600' : isWarning ? 'bg-amber-600' : 'bg-green-600'}`} />
      {text}
    </div>
  );
}
