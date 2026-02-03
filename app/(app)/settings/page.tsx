import { sampleChildren } from '@/lib/sample-data';

export default function SettingsPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Settings</h1>
        <p className="text-sm text-slate">Manage children, devices, and billing.</p>
      </section>

      <section className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Children</h2>
        <div className="mt-4 space-y-3">
          {sampleChildren.map((child) => (
            <div key={child.id} className="rounded-2xl bg-sand p-4">
              <p className="font-semibold text-ink">{child.name}</p>
              <p className="text-xs text-slate">Age {child.age}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 rounded-2xl bg-lime px-4 py-2 text-sm font-semibold">
          Add child
        </button>
      </section>

      <section className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Devices</h2>
        <p className="mt-2 text-sm text-slate">
          You can have up to 2 active devices. Revoke one to log out remotely.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="rounded-2xl bg-sand p-4 text-xs text-slate">
            Mom's iPhone · Active
          </div>
          <div className="rounded-2xl bg-sand p-4 text-xs text-slate">
            Kitchen iPad · Active
          </div>
        </div>
        <button className="mt-4 rounded-2xl border border-slate/20 px-4 py-2 text-sm">
          Log out other device
        </button>
      </section>
    </main>
  );
}
