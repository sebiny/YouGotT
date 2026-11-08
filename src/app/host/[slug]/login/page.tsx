import { notFound } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { prisma } from "@/lib/db";
import { seedRestaurants } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = await prisma.restaurant.findUnique({
    where: { slug },
    select: { name: true },
  });
  if (!r) notFound();

  const restaurants = await prisma.restaurant.findMany({
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
    take: 3,
  });
  const seedPins = new Map(seedRestaurants.map(({ slug, pin }) => [slug, pin]));
  const showDemoPins = process.env.NODE_ENV !== "production";

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-start gap-3 sm:gap-5">
      <aside className="card min-w-0 w-full space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Top Restaurants</h2>
          <p className="text-sm text-stone-500">
            Choose a restaurant to open if you're the staff
          </p>
        </div>
        <ol className="space-y-2">
          {restaurants.map((restaurant, index) => (
            <li key={restaurant.slug}>
              <Link
                href={`/host/${restaurant.slug}/login`}
                aria-current={restaurant.slug === slug ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl border p-3 transition hover:border-stone-400 hover:bg-stone-50 ${
                  restaurant.slug === slug
                    ? "border-stone-400 bg-stone-50"
                    : "border-stone-200"
                }`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
                  {index + 1}
                </span>
                <span className="font-medium">{restaurant.name}</span>
              </Link>
              {showDemoPins && seedPins.has(restaurant.slug) && (
                <p className="px-3 pt-1 text-xs text-stone-500">
                  Demo PIN: <span className="font-mono">{seedPins.get(restaurant.slug)}</span>
                </p>
              )}
            </li>
          ))}
        </ol>
      </aside>
      <div className="min-w-0">
        <LoginForm slug={slug} name={r.name} />
      </div>
    </div>
  );
}
