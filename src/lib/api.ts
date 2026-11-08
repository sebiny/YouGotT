import { NextResponse } from "next/server";
import type { z } from "zod";
import { HttpError } from "./queue";
import { isHostOf } from "./auth";

/** Wraps a route handler: parses the JSON body with `schema`, turns errors into JSON responses. */
export function route<S extends z.ZodTypeAny, P>(
  schema: S,
  handler: (body: z.infer<S>, params: P) => Promise<unknown>,
  opts: { host?: boolean } = {},
)
//route(...): a wrapper for API endpoints
//It wraps a route handler and does 3 jobs
//Auth check: if user passes {host: true}, 
//Input validation
//Error handling
{
  return async (req: Request, ctx: { params: Promise<P> }) => {
    //ctx is short for context. It's the second argument Next.js passes to every API route handler, and its main job is to give you the dynamic parts of the URL. here, it's [slug]
    try {
      const params = await ctx.params;
      const slug = (params as { slug?: string }).slug;
      if (opts.host && !(slug && (await isHostOf(slug)))) {
        throw new HttpError(401, "Please log in as host");
      }
      //opts means options. It's the third parameter of the route function, and it lets you turn on extra behaviour for a specific endpoint.
      //Throw an error if it's not a host
      const parsed = schema.safeParse(await req.json().catch(() => ({})));
      //schema is the first parameter of route.
      //shemas are written with z.
      if (!parsed.success) {
        throw new HttpError(400, parsed.error.issues[0]?.message ?? "Invalid input");
      }
      const result = await handler(parsed.data, params);
      return NextResponse.json(result ?? { ok: true });
    } catch (e) {
      if (e instanceof HttpError) return NextResponse.json({ error: e.message }, { status: e.status });
      console.error(e);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  };
}

/** Builds a Server-Sent Events response that calls `push(send)` now, on every change, and every 30s. */
export function sseResponse(
  req: Request,
  push: (send: (event: string, data: unknown) => void) => Promise<void>,
  //send(event,data) writes one message to the browser
  onChange: (listener: () => void) => () => void,
  //It creates a stream that stays open ReadableStream and sends text in the SSE format(only server->client)
) {
  const encoder = new TextEncoder();
  let cleanup = () => {};
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const send = (event: string, data: unknown) => {
        if (!closed) controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };
      const refresh = () => push(send).catch((e) => console.error("stream refresh failed", e));
//refresh() calls your push function, which builds the latest queue data and sends it.

      await refresh();
      //when the connection opens, it sends data immediately
      const off = onChange(refresh);
      //onChange(refresh) subscribe to your in-memory event broadcaster(events.ts). Whenever someone joins, is seated or is removed, refresh runs and everyone connected gets the update instantly.
      // Periodic refresh keeps "minutes waited" fresh and doubles as a keep-alive.
      const timer = setInterval(refresh, 30_000);
      cleanup = () => {
        if (closed) return;
        closed = true;
        off();
        clearInterval(timer);
        try {
          controller.close();
        } catch {}
      };
      req.signal.addEventListener("abort", cleanup);
    },
    cancel() {
      cleanup();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
