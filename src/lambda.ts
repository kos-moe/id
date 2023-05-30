import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { serveStatic } from '@hono/node-server/serve-static';
import { init } from './route';

const app = new Hono();
const api = new Hono();

init(api);

app.route('/api', api);
app.get('*', 
serveStatic({root: './dist'}),
serveStatic({root: './dist', rewriteRequestPath: () => '/'})
);

export const handler = handle(app);