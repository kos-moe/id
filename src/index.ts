import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { init } from './route';

const app = new Hono();
init(app);
serve({
  fetch: app.fetch,
  port: 3000,
});
