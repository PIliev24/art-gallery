import { Hono } from 'hono';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { serialize } from 'cookie';
import { db } from '../db';
import { adminUsers } from '../db/schema';
import { config } from '../config';
import { requireAuth } from '../middleware/auth';

const auth = new Hono();

auth.post('/login', async (c) => {
  const body = await c.req.json<{ username: string; password: string }>();

  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, body.username)).limit(1);
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const valid = await compare(body.password, user.passwordHash);
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const token = jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, { expiresIn: '7d' });

  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  c.header('Set-Cookie', cookie);
  return c.json({ id: user.id, username: user.username });
});

auth.post('/logout', (c) => {
  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  c.header('Set-Cookie', cookie);
  return c.json({ ok: true });
});

auth.get('/me', requireAuth, (c) => {
  return c.json(c.get('user'));
});

export default auth;
