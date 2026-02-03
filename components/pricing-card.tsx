import { AppConfig } from '@/lib/config';

export function PricingCard() {
  return (
    <div className="rounded-3xl bg-canvas p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-ink">Pricing</h3>
      <p className="mt-2 text-3xl font-semibold text-ink">
        ${AppConfig.basePriceMonthly}/mo
      </p>
      <p className="mt-1 text-sm text-slate">
        Includes {AppConfig.includedChildren} children + {AppConfig.trialDays}-day trial
      </p>
      <p className="mt-3 text-xs text-slate">
        Additional children are ${AppConfig.extraChildPrice}/mo each.
      </p>
      <button className="mt-4 w-full rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-canvas">
        Start trial
      </button>
    </div>
  );
}
