import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { artworks } from '../db/schema';
import { requireAuth } from '../middleware/auth';

const artworksRouter = new Hono();

// Public: GET all artworks (with optional filters)
artworksRouter.get('/', async (c) => {
  const category = c.req.query('category');
  const featured = c.req.query('featured');

  const allArtworks = await db.select().from(artworks).orderBy(artworks.createdAt);

  let result = allArtworks;

  if (category) {
    result = result.filter(a => a.category === category);
  }
  if (featured === 'true') {
    result = result.filter(a => a.isFeatured);
  }

  return c.json(result);
});

// Public: GET single artwork
artworksRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const [artwork] = await db.select().from(artworks).where(eq(artworks.id, id)).limit(1);

  if (!artwork) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(artwork);
});

// Admin: Create artwork
artworksRouter.post('/', requireAuth, async (c) => {
  const body = await c.req.json();
  const [created] = await db.insert(artworks).values({
    title: body.title,
    artistName: body.artistName,
    category: body.category,
    medium: body.medium,
    dimensions: body.dimensions,
    year: body.year,
    imageUrl: body.imageUrl,
    description: body.description,
    isFeatured: body.isFeatured ?? false,
    isAvailable: body.isAvailable ?? true,
  }).returning();

  return c.json(created, 201);
});

// Admin: Update artwork
artworksRouter.put('/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const [updated] = await db.update(artworks)
    .set({
      title: body.title,
      artistName: body.artistName,
      category: body.category,
      medium: body.medium,
      dimensions: body.dimensions,
      year: body.year,
      imageUrl: body.imageUrl,
      description: body.description,
      isFeatured: body.isFeatured,
      isAvailable: body.isAvailable,
      updatedAt: new Date(),
    })
    .where(eq(artworks.id, id))
    .returning();

  if (!updated) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(updated);
});

// Admin: Delete artwork
artworksRouter.delete('/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const [deleted] = await db.delete(artworks).where(eq(artworks.id, id)).returning();

  if (!deleted) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json({ ok: true });
});

export default artworksRouter;
