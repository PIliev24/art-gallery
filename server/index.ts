import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';
import { config } from './config';
import { galleryInfo } from '../src/data/hardcoded-data';

// Auto-run migrations in production
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Routes
import authRoutes from './routes/auth';
import artworksRoutes from './routes/artworks';
import exhibitionsRoutes from './routes/exhibitions';
import eventsRoutes from './routes/events';
import artistsRoutes from './routes/artists';

const app = new Hono();

// CORS for development
if (config.nodeEnv === 'development') {
  app.use('/api/*', cors({
    origin: 'http://localhost:3001',
    credentials: true,
  }));
}

// API routes
app.route('/api/auth', authRoutes);
app.route('/api/artworks', artworksRoutes);
app.route('/api/exhibitions', exhibitionsRoutes);
app.route('/api/events', eventsRoutes);
app.route('/api/artists', artistsRoutes);

// Gallery info (hardcoded)
app.get('/api/gallery', (c) => c.json(galleryInfo));

// Serve static files in production
if (config.nodeEnv === 'production') {
  app.use('/*', serveStatic({ root: './dist' }));

  // SPA fallback — serve index.html for non-API, non-asset routes
  app.get('*', serveStatic({ root: './dist', path: 'index.html' }));
}

async function start() {
  // Auto-migrate in production
  if (config.nodeEnv === 'production') {
    try {
      const migrationClient = postgres(config.databaseUrl, { max: 1 });
      const migrationDb = drizzle(migrationClient);
      console.log('Running auto-migrations...');
      await migrate(migrationDb, { migrationsFolder: './drizzle' });
      console.log('Migrations complete.');
      await migrationClient.end();
    } catch (err) {
      console.error('Auto-migration failed:', err);
    }
  }

  serve({ fetch: app.fetch, port: config.port }, (info) => {
    console.log(`Server running on http://localhost:${info.port}`);
  });
}

start();
