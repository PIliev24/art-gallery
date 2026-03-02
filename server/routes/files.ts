import { Hono } from 'hono';
import { S3Client } from 'bun';

const filesRouter = new Hono();

const s3 = new S3Client();

filesRouter.get('/:key{.+}', async (c) => {
  const key = c.req.param('key');

  try {
    const url = s3.presign(key, {
      expiresIn: 3600, // 1 hour
      method: 'GET',
    });

    return c.redirect(url, 302);
  } catch {
    return c.json({ error: 'Файлът не е намерен' }, 404);
  }
});

export default filesRouter;
