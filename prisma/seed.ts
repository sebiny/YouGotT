import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { seedRestaurants } from "../src/lib/seed-data";

const prisma = new PrismaClient();
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000);
const token = () => randomBytes(12).toString("base64url");

async function main() {
  await prisma.restaurant.deleteMany();
  for (const r of seedRestaurants) {
    await prisma.restaurant.create({
      data: {
        slug: r.slug,
        name: r.name,
        address: r.address,
        pinHash: await bcrypt.hash(r.pin, 10),
        avgTurnMinutes: r.avgTurnMinutes,
        tables: {
          create: r.tables.map((t) => ({
            label: t.label,
            seats: t.seats,
            status: t.occupiedMinutesAgo === undefined ? "FREE" : "OCCUPIED",
            occupiedSince: t.occupiedMinutesAgo === undefined ? null : minutesAgo(t.occupiedMinutesAgo),
          })),
        },
        parties: {
          create: r.parties.map((p) => ({
            name: p.name,
            size: p.size,
            token: token(),
            joinedAt: minutesAgo(p.joinedMinutesAgo),
          })),
        },
      },
    });
    console.log(`Seeded ${r.name} (/r/${r.slug}, host PIN ${r.pin})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
