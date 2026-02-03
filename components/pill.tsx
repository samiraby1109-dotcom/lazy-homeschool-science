import { cn } from '@/lib/ui';

export function Pill({
  label,
  color = 'bg-canvas',
  textColor = 'text-slate'
}: {
  label: string;
  color?: string;
  textColor?: string;
}) {
  return (
    <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', color, textColor)}>
      {label}
    </span>
  );
}
