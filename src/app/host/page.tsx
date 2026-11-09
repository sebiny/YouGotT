import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Owner home when this browser hasn't logged into a restaurant yet.
export default async function OwnerHome() {
  const restaurants = await prisma.restaurant.findMany({
    select: { slug: true, name: true, address: true },
    orderBy: { name: "asc" },
  });
  return (
    <div className="mx-auto max-w-lg space-y-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Restaurant owners</h1>
        {/* <p className="text-stone-600">
          Log in to your dashboard, or add your restaurant.
        </p> */}
      </div>
      {/* 
      <Link href="/host/new" className="btn-primary w-full py-3 text-base">
        + Add your restaurant
      </Link> */}

      {restaurants.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-stone-500">
            It you're the owner, Pick yours:
          </h2>
          <ul className="space-y-2">
            {restaurants.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/host/${r.slug}/login`}
                  className="card flex items-center justify-between p-4 transition hover:border-stone-400"
                >
                  <span>
                    <span className="font-semibold">{r.name}</span>
                    {r.address && (
                      <span className="block text-sm text-stone-500">
                        {r.address}
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-stone-500">Log in →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
