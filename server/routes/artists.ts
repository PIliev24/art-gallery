import { Hono } from 'hono';
import { db } from '../db';
import { artists } from '../db/schema';
import { requireAuth } from '../middleware/auth';

const artistsRouter = new Hono();

// Public: GET all artists (for dropdowns)
artistsRouter.get('/', async (c) => {
  const allArtists = await db.select().from(artists).orderBy(artists.name);
  return c.json(allArtists);
});

// Admin: Create artist
artistsRouter.post('/', requireAuth, async (c) => {
  const body = await c.req.json();
  const [created] = await db.insert(artists).values({
    name: body.name,
    bio: body.bio,
    nationality: body.nationality,
  }).returning();

  return c.json(created, 201);
});

export default artistsRouter;
