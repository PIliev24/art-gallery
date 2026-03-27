import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { exhibitions } from '../db/schema';
import { requireAuth } from '../middleware/auth';

const exhibitionsRouter = new Hono();

// Helper: parse artistNames JSON string to array
function parseArtistNames(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Helper: attach parsed artistNames to exhibition
function withArtistNames<T extends { artistNames: string | null }>(ex: T) {
  return { ...ex, artistNames: parseArtistNames(ex.artistNames) };
}

// Public: GET all exhibitions
exhibitionsRouter.get('/', async (c) => {
  const status = c.req.query('status');
  const featured = c.req.query('featured');

  const allExhibitions = await db.select().from(exhibitions).orderBy(exhibitions.startDate);

  let result = allExhibitions;
  if (status) {
    result = result.filter(e => e.status === status);
  }
  if (featured === 'true') {
    result = result.filter(e => e.isFeatured);
  }

  return c.json(result.map(withArtistNames));
});

// Public: GET exhibition by slug
exhibitionsRouter.get('/slug/:slug', async (c) => {
  const slug = c.req.param('slug');
  const [exhibition] = await db.select().from(exhibitions).where(eq(exhibitions.slug, slug)).limit(1);

  if (!exhibition) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(withArtistNames(exhibition));
});

// Public: GET exhibition by ID
exhibitionsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const [exhibition] = await db.select().from(exhibitions).where(eq(exhibitions.id, id)).limit(1);

  if (!exhibition) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(withArtistNames(exhibition));
});

// Admin: Create exhibition
exhibitionsRouter.post('/', requireAuth, async (c) => {
  const body = await c.req.json();
  const artistNames = Array.isArray(body.artistNames) ? JSON.stringify(body.artistNames) : null;

  const [created] = await db.insert(exhibitions).values({
    title: body.title,
    slug: body.slug,
    description: body.description,
    startDate: new Date(body.startDate),
    endDate: new Date(body.endDate),
    status: body.status,
    coverImage: body.coverImage,
    location: body.location,
    artistNames,
    isFeatured: body.isFeatured ?? false,
  }).returning();

  return c.json(withArtistNames(created), 201);
});

// Admin: Update exhibition
exhibitionsRouter.put('/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const artistNames = Array.isArray(body.artistNames) ? JSON.stringify(body.artistNames) : null;

  const [updated] = await db.update(exhibitions)
    .set({
      title: body.title,
      slug: body.slug,
      description: body.description,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      status: body.status,
      coverImage: body.coverImage,
      location: body.location,
      artistNames,
      isFeatured: body.isFeatured,
      updatedAt: new Date(),
    })
    .where(eq(exhibitions.id, id))
    .returning();

  if (!updated) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(withArtistNames(updated));
});

// Admin: Delete exhibition
exhibitionsRouter.delete('/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const [deleted] = await db.delete(exhibitions).where(eq(exhibitions.id, id)).returning();

  if (!deleted) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json({ ok: true });
});

export default exhibitionsRouter;
