import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { exhibitions, exhibitionArtists, artists } from '../db/schema';
import { requireAuth } from '../middleware/auth';

const exhibitionsRouter = new Hono();

// Helper: fetch exhibition artists
async function getExhibitionArtists(exhibitionId: string) {
  const rows = await db.select({
    id: artists.id,
    name: artists.name,
    bio: artists.bio,
    nationality: artists.nationality,
  })
    .from(exhibitionArtists)
    .innerJoin(artists, eq(exhibitionArtists.artistId, artists.id))
    .where(eq(exhibitionArtists.exhibitionId, exhibitionId));
  return rows;
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

  // Attach artists to each exhibition
  const withArtists = await Promise.all(
    result.map(async (ex) => ({
      ...ex,
      artists: await getExhibitionArtists(ex.id),
    }))
  );

  return c.json(withArtists);
});

// Public: GET exhibition by slug
exhibitionsRouter.get('/slug/:slug', async (c) => {
  const slug = c.req.param('slug');
  const [exhibition] = await db.select().from(exhibitions).where(eq(exhibitions.slug, slug)).limit(1);

  if (!exhibition) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json({
    ...exhibition,
    artists: await getExhibitionArtists(exhibition.id),
  });
});

// Public: GET exhibition by ID
exhibitionsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const [exhibition] = await db.select().from(exhibitions).where(eq(exhibitions.id, id)).limit(1);

  if (!exhibition) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json({
    ...exhibition,
    artists: await getExhibitionArtists(exhibition.id),
  });
});

// Admin: Create exhibition
exhibitionsRouter.post('/', requireAuth, async (c) => {
  const body = await c.req.json();
  const [created] = await db.insert(exhibitions).values({
    title: body.title,
    slug: body.slug,
    description: body.description,
    startDate: new Date(body.startDate),
    endDate: new Date(body.endDate),
    status: body.status,
    coverImage: body.coverImage,
    location: body.location,
    isFeatured: body.isFeatured ?? false,
  }).returning();

  // Insert exhibition artists
  if (body.artistIds?.length) {
    await db.insert(exhibitionArtists).values(
      body.artistIds.map((artistId: string) => ({
        exhibitionId: created.id,
        artistId,
      }))
    );
  }

  return c.json({
    ...created,
    artists: await getExhibitionArtists(created.id),
  }, 201);
});

// Admin: Update exhibition
exhibitionsRouter.put('/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
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
      isFeatured: body.isFeatured,
      updatedAt: new Date(),
    })
    .where(eq(exhibitions.id, id))
    .returning();

  if (!updated) {
    return c.json({ error: 'Not found' }, 404);
  }

  // Replace exhibition artists
  await db.delete(exhibitionArtists).where(eq(exhibitionArtists.exhibitionId, id));
  if (body.artistIds?.length) {
    await db.insert(exhibitionArtists).values(
      body.artistIds.map((artistId: string) => ({
        exhibitionId: id,
        artistId,
      }))
    );
  }

  return c.json({
    ...updated,
    artists: await getExhibitionArtists(id),
  });
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
