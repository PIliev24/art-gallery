import { createMiddleware } from 'hono/factory';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export type AuthUser = { id: string; username: string };

export const requireAuth = createMiddleware<{ Variables: { user: AuthUser } }>(async (c, next) => {
  const cookies = c.req.header('cookie') || '';
  const token = parseCookie(cookies, 'token');

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthUser;
    c.set('user', payload);
    await next();
  } catch {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

function parseCookie(cookieHeader: string, name: string): string | undefined {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}
