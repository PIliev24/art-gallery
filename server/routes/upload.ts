import { Hono } from 'hono';
import { S3Client } from 'bun';
import { requireAuth } from '../middleware/auth';
import { config } from '../config';

const uploadRouter = new Hono();

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const s3 = new S3Client({
  accessKeyId: config.s3AccessKeyId,
  secretAccessKey: config.s3SecretAccessKey,
  bucket: config.s3Bucket,
  endpoint: config.s3Endpoint,
  region: config.s3Region,
});

uploadRouter.post('/', requireAuth, async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'];

  if (!file || !(file instanceof File)) {
    return c.json({ error: 'Не е изпратен файл' }, 400);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return c.json({ error: 'Невалиден формат. Позволени са: JPEG, PNG, WebP' }, 400);
  }

  if (file.size > MAX_SIZE) {
    return c.json({ error: 'Файлът е твърде голям. Максимум 10MB' }, 400);
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${crypto.randomUUID()}.${ext}`;
  const key = `uploads/${filename}`;

  try {
    const buffer = await file.arrayBuffer();
    await s3.write(key, buffer, { type: file.type });
  } catch (error) {
    console.error('S3 upload failed:', error);
    return c.json({ error: 'Грешка при качване на файла' }, 500);
  }

  return c.json({ url: `/api/files/${key}` });
});

export default uploadRouter;
