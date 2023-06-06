import db from '../db';
import { handleSession } from '../session';
import { HTTPException } from 'hono/http-exception';
import { createRouter } from '../router';
import { ulid } from 'ulid';
import { parseBody } from '../router';
import { verify } from '@node-rs/argon2';
import { makeSession } from '../session';

const app = createRouter();

app.post('/app/authorize', handleSession(), async(ctx) => {
  const token = ulid();
  await db.oAuthToken.create({
    data: {
      id: token,
      accountId: ctx.get('accountId')
    }
  });
  return ctx.json({token});
});

app.post('/token', parseBody, async(ctx) => {
  const { clientId, clientSecret, token } = ctx.get('body') as {clientId: string, clientSecret: string, token: string};
  const oAuthToken = await db.oAuthToken.findUnique({
    where: {
      id: token
    },
    include: {
      app: true
    }
  });
  if (!oAuthToken || !(oAuthToken.app.id === clientId && await verify(oAuthToken.app.secret, clientSecret))) throw new HTTPException(401);
  const session = await makeSession(oAuthToken.accountId, oAuthToken.app.id);
  await db.oAuthToken.delete({
    where: {
      id: oAuthToken.id
    }
  });
  return ctx.json({session});
});

export default app;