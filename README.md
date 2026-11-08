# Live Waitlist

A restaurant waitlist where guests see in real time whether they can sit down now or how many parties are ahead of them. They join the line from their phone and get pinged when their table is ready. Staff run everything from a simple host dashboard.

https://you-got-t.vercel.app

## Demo restaurants

| Restaurant | Guest page | Host PIN | State |
|---|---|---|---|
| Demo Bistro | `/r/demo-bistro` | 1234 | Full, 2 parties waiting |
| Sakura Sushi | `/r/sakura-sushi` | 2345 | Tables free, no wait |
| Taco Town | `/r/taco-town` | 3456 | Full, nobody waiting yet |

The host dashboard is at `/host/<slug>`. New restaurants can sign up at `/host/new`.

## How it works

- **Start screen:** `/` asks "I'm hungry" or "I run a restaurant" and remembers the answer in a `role` cookie. Later visits skip it: guests go to `/eat`, owners go to the dashboard they last logged into (or `/host` to pick one). **Switch role** in the header clears the choice.
- **Guests:** `/eat` lists restaurants with live "Seat now" / "~N min wait" badges. On a restaurant page they pick a party size, see the wait for that size, and join. Their private page `/r/<slug>/wait/<token>` shows their place in line and alerts them (notification, beep, vibration) when the host taps **Notify**.
- **Hosts:** tap tables to mark them free or taken. For each waiting party they can Notify, Seat it at a table, or Remove it.
- **Live updates:** every change publishes an event (`src/lib/events.ts`). Every open page holds a Server-Sent Events stream (`/api/r/<slug>/stream`, `/api/stream/all`) and gets the new numbers immediately, plus a refresh every 30s.
- **Wait estimate** (`src/lib/board.ts`): each occupied table is expected to free up `avgTurnMinutes` after it was seated. Queued parties are handed tables in order, and the result is what a newcomer of each size would wait.

## Code map

| Path | What it does |
|---|---|
| `prisma/schema.prisma` | Restaurant, Table, Party |
| `src/lib/board.ts` | Wait-time math (pure, unit tested) |
| `src/lib/queue.ts` | All database changes (join, seat, notify…) |
| `src/lib/snapshot.ts` | Builds what each screen is sent |
| `src/lib/events.ts` | In-process broadcaster |
| `src/lib/auth.ts` | Host PIN login cookie |
| `src/components/` | BoardStatus, JoinForm, QueueList, TableGrid and page views |

## Deploying

The live updates use an in-memory broadcaster, so run the app as **one** long-lived Node server (`npm run build && npm start` on Railway, Render, Fly, or a VPS). To run several instances or deploy on Vercel, replace `src/lib/events.ts` with Redis pub/sub and switch Prisma to Postgres.

## Tests

```bash
npm test
```
