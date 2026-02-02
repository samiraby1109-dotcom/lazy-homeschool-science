import { cn } from '@/lib/ui';

export function Card({
  title,
  description,
  badge,
  className
}: {
  title: string;
  description: string;
  badge?: string;
  className?: string;
}) {
  return (
    <div className={cn('rounded-3xl bg-canvas p-5 shadow-sm', className)}>
      {badge && (
        <span className="inline-flex rounded-full bg-mint px-3 py-1 text-xs text-ink">
          {badge}
        </span>
      )}
      <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-slate">{description}</p>
    </div>
  );
}
