import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { config } from './config';
import { galleryInfo } from '../src/data/hardcoded-data';
import authRoutes from './routes/auth';
import artworksRoutes from './routes/artworks';
import exhibitionsRoutes from './routes/exhibitions';
import eventsRoutes from './routes/events';
import uploadRoutes from './routes/upload';
import filesRoutes from './routes/files';

export const app = new Hono();

// CORS for development
if (config.nodeEnv === 'development') {
  app.use('/api/*', cors({
    origin: 'http://localhost:3001',
    credentials: true,
  }));
}

app.route('/api/auth', authRoutes);
app.route('/api/artworks', artworksRoutes);
app.route('/api/exhibitions', exhibitionsRoutes);
app.route('/api/events', eventsRoutes);
app.route('/api/upload', uploadRoutes);
app.route('/api/files', filesRoutes);

// Gallery info (hardcoded)
app.get('/api/gallery', (c) => c.json(galleryInfo));
