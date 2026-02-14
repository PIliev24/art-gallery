import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { events } from '../db/schema';
import { requireAuth } from '../middleware/auth';

const eventsRouter = new Hono();

// Public: GET all events
eventsRouter.get('/', async (c) => {
  const status = c.req.query('status');
  const featured = c.req.query('featured');

  const allEvents = await db.select().from(events).orderBy(events.startDate);

  let result = allEvents;
  if (status) {
    result = result.filter(e => e.status === status);
  }
  if (featured === 'true') {
    result = result.filter(e => e.isFeatured);
  }

  return c.json(result);
});

// Public: GET event by slug
eventsRouter.get('/slug/:slug', async (c) => {
  const slug = c.req.param('slug');
  const [event] = await db.select().from(events).where(eq(events.slug, slug)).limit(1);

  if (!event) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(event);
});

// Public: GET event by ID
eventsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);

  if (!event) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(event);
});

// Admin: Create event
eventsRouter.post('/', requireAuth, async (c) => {
  const body = await c.req.json();
  const [created] = await db.insert(events).values({
    title: body.title,
    slug: body.slug,
    description: body.description,
    startDate: new Date(body.startDate),
    endDate: body.endDate ? new Date(body.endDate) : null,
    status: body.status,
    coverImage: body.coverImage,
    location: body.location,
    isFeatured: body.isFeatured ?? false,
  }).returning();

  return c.json(created, 201);
});

// Admin: Update event
eventsRouter.put('/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const [updated] = await db.update(events)
    .set({
      title: body.title,
      slug: body.slug,
      description: body.description,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      status: body.status,
      coverImage: body.coverImage,
      location: body.location,
      isFeatured: body.isFeatured,
      updatedAt: new Date(),
    })
    .where(eq(events.id, id))
    .returning();

  if (!updated) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json(updated);
});

// Admin: Delete event
eventsRouter.delete('/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const [deleted] = await db.delete(events).where(eq(events.id, id)).returning();

  if (!deleted) {
    return c.json({ error: 'Not found' }, 404);
  }

  return c.json({ ok: true });
});

export default eventsRouter;
