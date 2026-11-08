export type SeedTable = { label: string; seats: number; occupiedMinutesAgo?: number };
export type SeedParty = { name: string; size: number; joinedMinutesAgo: number };

export const seedRestaurants: {
  slug: string;
  name: string;
  address: string;
  pin: string;
  avgTurnMinutes: number;
  tables: SeedTable[];
  parties: SeedParty[];
}[] = [
  {
    slug: "demo-bistro",
    name: "Demo Bistro",
    address: "12 Market St",
    pin: "1234",
    avgTurnMinutes: 45,
    tables: [
      { label: "T1", seats: 2, occupiedMinutesAgo: 30 },
      { label: "T2", seats: 2, occupiedMinutesAgo: 10 },
      { label: "T3", seats: 4, occupiedMinutesAgo: 40 },
      { label: "T4", seats: 4, occupiedMinutesAgo: 5 },
      { label: "T5", seats: 6, occupiedMinutesAgo: 20 },
    ],
    parties: [
      { name: "Alex", size: 2, joinedMinutesAgo: 12 },
      { name: "Jordan", size: 4, joinedMinutesAgo: 6 },
    ],
  },
  {
    slug: "sakura-sushi",
    name: "Sakura Sushi",
    address: "88 River Rd",
    pin: "2345",
    avgTurnMinutes: 60,
    tables: [
      { label: "Bar 1", seats: 2 },
      { label: "Bar 2", seats: 2, occupiedMinutesAgo: 15 },
      { label: "Booth A", seats: 4 },
      { label: "Booth B", seats: 6, occupiedMinutesAgo: 25 },
    ],
    parties: [],
  },
  {
    slug: "taco-town",
    name: "Taco Town",
    address: "5 Sunset Ave",
    pin: "3456",
    avgTurnMinutes: 30,
    tables: [
      { label: "1", seats: 4, occupiedMinutesAgo: 20 },
      { label: "2", seats: 4, occupiedMinutesAgo: 8 },
      { label: "3", seats: 8, occupiedMinutesAgo: 15 },
    ],
    parties: [],
  },
];
