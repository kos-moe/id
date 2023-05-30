import db from './db';
import { ulid } from 'ulid';
import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

const SESSION_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 30;

export async function makeSession(accountId: string): Promise<string> {
  const sessionId = ulid();
  const session = await db.session.create({
    data: {
      id: sessionId,
      accountId,
      expiresAt: new Date(Date.now() + SESSION_EXPIRE_TIME)
    }
  });
  return session.id;
}

export function handleSession(requireLogin = true) {
  return async(ctx: Context, next: Next) => {
    function noLogin() {
      if(requireLogin) {
        throw new HTTPException(401);
      }
      else {
        return next();
      }
    }
    const sessionId = ctx.req.header('Authorization')?.split(' ')[1];
    if(!sessionId) return noLogin();
    const session = await db.session.findUnique({where: {
        id: sessionId
      }
    });
    if(!session) return noLogin();
    ctx.set('session', sessionId);
    ctx.set('accountId', session.accountId);
    db.session.update({
      where: {
        id: sessionId
      },
      data: {
        expiresAt: new Date(Date.now() + SESSION_EXPIRE_TIME)
      }
    });
    return next();
  };
}
