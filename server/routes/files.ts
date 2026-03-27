import { Hono } from 'hono';
import { S3Client } from 'bun';
import { config } from '../config';

const filesRouter = new Hono();

const s3 = new S3Client({
  accessKeyId: config.s3AccessKeyId,
  secretAccessKey: config.s3SecretAccessKey,
  bucket: config.s3Bucket,
  endpoint: config.s3Endpoint,
  region: config.s3Region,
});

filesRouter.get('/:key{.+}', async (c) => {
  const key = c.req.param('key');

  try {
    const url = s3.presign(key, {
      expiresIn: 3600, // 1 hour
      method: 'GET',
    });

    return c.redirect(url, 302);
  } catch (error) {
    console.error('S3 presign failed:', error);
    return c.json({ error: 'Файлът не е намерен' }, 404);
  }
});

export default filesRouter;
