import { Hono } from 'hono';
import authRoute from './routes/auth';
import accountRoute from './routes/account';
import oAuthRoute from './routes/oauth';

export function init(app: Hono) {
  app.route('/auth', authRoute);
  app.route('/account', accountRoute);
  app.route('/oauth', oAuthRoute)
}
