"use client";

import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const devBypass = useMemo(
    () => process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true",
    []
  );

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "done">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      if (devBypass) {
        // Instant login via Credentials Provider
        const res = await signIn("credentials", {
          email,
          callbackUrl: "/app/home",
          redirect: true,
        });

        // signIn with redirect=true won't return much; this is fallback
        if ((res as any)?.error) {
          setStatus("error");
          setError((res as any)?.error || "Dev login failed.");
          return;
        }

        setStatus("done");
        return;
      }

      // Normal email magic link login
      const res = await signIn("email", {
        email,
        callbackUrl: "/app/home",
        redirect: false,
      });

      if (res?.error) {
        setStatus("error");
        setError(res.error);
        return;
      }

      setStatus("done");
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-black/5">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-black/60 mt-1">
          {devBypass
            ? "Dev bypass is ON — this will log you in instantly (no email)."
            : "Use a magic link to sign in to Lazy Homeschool Science."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="mt-2 flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-black text-white py-3 font-medium disabled:opacity-60"
            disabled={status === "sending"}
          >
            {status === "sending"
              ? devBypass
                ? "Logging in..."
                : "Sending link..."
              : devBypass
              ? "Dev Login"
              : "Send magic link"}
          </button>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="text-xs text-black/50">
            <a href="/" className="underline">
              ← Back to landing
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
