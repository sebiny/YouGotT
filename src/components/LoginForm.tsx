"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { postJson } from "@/lib/client";

export function LoginForm({
  slug,
  name,
  demoPin,
}: {
  slug: string;
  name: string;
  demoPin?: string;
}) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await postJson(`/api/host/${slug}/login`, { pin });
    if (error) {
      setError(error);
      setBusy(false);
      return;
    }
    router.replace(`/host/${slug}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-semibold">{name}: staff login</h1>
      <label className="block">
        <span className="mb-1 flex items-center justify-between gap-2 text-sm text-stone-600">
          <span>Host PIN</span>
          {demoPin && <span>Demo PIN: <span className="font-mono font-semibold">{demoPin}</span></span>}
        </span>
        <input
          className="input text-center text-2xl tracking-[0.5em]"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={20}
          autoFocus
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="btn-primary w-full py-3" disabled={busy || !pin}>
        {busy ? "Checking…" : "Open dashboard"}
      </button>
    </form>
  );
}
