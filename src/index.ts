import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { init } from './route';
import { readFile } from 'fs/promises';

const app = new Hono();
const api = new Hono();

init(api);

app.route('/api', api);
app.get('*', 
  serveStatic({root: './front/dist'}),
  async(ctx) => ctx.html(await readFile('./front/dist/index.html', 'utf-8'))
);

serve({
  fetch: app.fetch,
  port: 8000,
});
