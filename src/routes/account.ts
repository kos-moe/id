import db from '../db';
import { handleSession } from '../session';
import { HTTPException } from 'hono/http-exception';
import { createRouter } from '../router';

const app = createRouter();

app.get('/', handleSession(), async(ctx) => {
  const account = await db.account.findUnique({
    where: {
      id: ctx.get('accountId')
    }
  });
  if(!account) throw new HTTPException(404);
  return ctx.json({
    id: account.id,
    name: account.name
  });
});

export default app;
