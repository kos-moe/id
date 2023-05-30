import db from '../db';
import { handleSession } from '../session';
import { HTTPException } from 'hono/http-exception';
import { createRouter } from '../router';
import { ulid } from 'ulid';
import { parseBody } from '../router';

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

// app.post('/verify', parseBody, async(ctx) => {

// });

export default app;