import { Context, Hono, Next } from 'hono';


export type HonoType = {
  Variables: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any,
    session: string,
    accountId: string
  }
}

export function createRouter() {
  return new Hono<HonoType>();
}

export async function parseBody(ctx: Context, next: Next) {
  ctx.set('body', await ctx.req.parseBody() || await ctx.req.json());
  return next();
}

