"use client";

import { useRouter } from "next/navigation";
import { ONE_YEAR_SECONDS, ROLE_COOKIE, homeFor, type Role } from "@/lib/role";

export function RolePicker({ lastRestaurant }: { lastRestaurant?: string }) {
  const router = useRouter();

  function choose(role: Role) {
    document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
    router.push(homeFor(role, lastRestaurant));
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 py-6 text-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome! Who are you?</h1>
        <p className="mt-2 text-stone-600">We&apos;ll remember your choice on this device.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => choose("guest")}
          className="card flex flex-col items-center gap-2 p-8 transition hover:border-stone-400 hover:shadow-md"
        >
          <span className="text-5xl">🍽️</span>
          <span className="text-xl font-semibold">I&apos;m hungry</span>
          <span className="text-sm text-stone-500">Find a table and join the line</span>
        </button>
        <button
          onClick={() => router.push("/host/")}
          className="card flex flex-col items-center gap-2 p-8 transition hover:border-stone-400 hover:shadow-md"
        >
          <span className="text-5xl">🧑‍🍳</span>
          <span className="text-xl font-semibold">I run a restaurant</span>
          <span className="text-sm text-stone-500">Manage tables and your waitlist</span>
        </button>
      </div>
    </div>
  );
}
