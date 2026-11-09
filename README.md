# Live Waitlist
Many people lining up on the street in Vancouver, they wait until they get inside not knowing when.
It’s not efficient for both customers and restaurants.
Using this, people can see if they’re not available to go or not and if not, how much time they need to wait based on how many people they have ahead of them.
Customer send name, how many, phone number and they can see the approximate time when they reserve it and then, when the store send the msg that they can come now but in 10min(otherwise, the reservation will be cancelled) they notice it and they can come.

https://you-got-t.vercel.app


<img width="400" height="250" alt="image" src="https://github.com/user-attachments/assets/8e7db998-66e1-4cad-ba89-1e5cec7f7eed" />
<img width="300" height="250" alt="image" src="https://github.com/user-attachments/assets/ef22b969-ea1d-4bf7-985f-3325e53c7265" />

## Demo restaurants

| Restaurant | Guest page | Host PIN | State |
|---|---|---|---|
| Demo Bistro | `/r/demo-bistro` | 1234 | Full, 2 parties waiting |
| Sakura Sushi | `/r/sakura-sushi` | 2345 | Tables free, no wait |
| Taco Town | `/r/taco-town` | 3456 | Full, nobody waiting yet |

The host dashboard is at `/host/<slug>`. New restaurants can sign up at `/host/new`.

## How it works

- **Start screen:** `/` asks "I'm hungry" or "I run a restaurant"
- **Guests:** `/eat` lists restaurants with live "Seat now" / "~N min wait" badges. On a restaurant page they pick a party size, see the wait for that size, and join. Their private page `/r/<slug>/wait/<token>` shows their place in line and alerts them (notification, beep, vibration) when the host taps **Notify**.
- **Hosts:** tap tables to mark them free or taken. For each waiting party they can Notify, Seat it at a table, or Remove it.
- **Live updates:** every change publishes an event (`src/lib/events.ts`). Every open page holds a Server-Sent Events stream (`/api/r/<slug>/stream`, `/api/stream/all`) and gets the new numbers immediately.
- **Wait estimate** (`src/lib/board.ts`): each occupied table is expected to free up `avgTurnMinutes` after it was seated. Queued parties are handed tables in order.

## Code map

| Path | What it does |
|---|---|
| `prisma/schema.prisma` | Restaurant, Table, Party |
| `src/lib/board.ts` | Wait-time math (pure, unit tested) |
| `src/lib/queue.ts` | All database changes (join, seat, notify…) |
| `src/lib/snapshot.ts` | Builds what each screen is sent |
| `src/lib/events.ts` | In-process broadcaster |
| `src/components/` | BoardStatus, JoinForm, QueueList, TableGrid and page views |
