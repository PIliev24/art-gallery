import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hash } from 'bcryptjs';
import { config } from '../config';
import * as schema from './schema';

import { artworks as seedArtworks, exhibitions as seedExhibitions, events as seedEvents } from '../../src/data/hardcoded-data';

async function seed() {
  const client = postgres(config.databaseUrl, { max: 1 });
  const db = drizzle(client, { schema });

  console.log('Seeding database...');

  // Create admin user
  const passwordHash = await hash(config.adminPassword, 10);
  await db.insert(schema.adminUsers).values({
    username: config.adminUsername,
    passwordHash,
  }).onConflictDoNothing();
  console.log(`Admin user "${config.adminUsername}" created.`);

  // Insert artworks
  for (const artwork of seedArtworks) {
    await db.insert(schema.artworks).values({
      title: artwork.title,
      artistName: artwork.artistName,
      category: artwork.category,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      year: artwork.year,
      imageUrl: artwork.imageUrl,
      description: artwork.description,
      isFeatured: artwork.isFeatured ?? false,
      isAvailable: artwork.isAvailable ?? true,
    });
  }
  console.log(`Inserted ${seedArtworks.length} artworks.`);

  // Insert exhibitions
  for (const exhibition of seedExhibitions) {
    await db.insert(schema.exhibitions).values({
      title: exhibition.title,
      slug: exhibition.slug,
      description: exhibition.description,
      startDate: exhibition.startDate,
      endDate: exhibition.endDate,
      status: exhibition.status,
      coverImage: exhibition.coverImage,
      location: exhibition.location,
      artistNames: JSON.stringify(exhibition.artistNames),
      isFeatured: exhibition.isFeatured ?? false,
    });
  }
  console.log(`Inserted ${seedExhibitions.length} exhibitions.`);

  // Insert events
  for (const event of seedEvents) {
    await db.insert(schema.events).values({
      title: event.title,
      slug: event.slug,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      status: event.status,
      coverImage: event.coverImage,
      location: event.location,
      isFeatured: event.isFeatured ?? false,
    });
  }
  console.log(`Inserted ${seedEvents.length} events.`);

  console.log('Seeding complete.');
  await client.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
