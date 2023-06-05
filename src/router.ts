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
  let body = await ctx.req.parseBody();
  if(Object.keys(body).length === 0) body = await ctx.req.json();
  ctx.set('body', body);
  return next();
}

