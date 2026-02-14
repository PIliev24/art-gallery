import { pgTable, text, integer, boolean, timestamp, jsonb, primaryKey, uuid } from 'drizzle-orm/pg-core';

export const artists = pgTable('artists', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  bio: text('bio'),
  nationality: text('nationality'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const artworks = pgTable('artworks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  artistId: uuid('artist_id').notNull().references(() => artists.id),
  category: text('category').notNull(),
  medium: text('medium').notNull(),
  dimensions: jsonb('dimensions').notNull().$type<{ width: number; height: number; depth?: number; unit: string }>(),
  year: integer('year').notNull(),
  imageUrl: text('image_url').notNull(),
  description: text('description'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const exhibitions = pgTable('exhibitions', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: text('status').notNull(),
  coverImage: text('cover_image').notNull(),
  location: text('location'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const exhibitionArtists = pgTable('exhibition_artists', {
  exhibitionId: uuid('exhibition_id').notNull().references(() => exhibitions.id, { onDelete: 'cascade' }),
  artistId: uuid('artist_id').notNull().references(() => artists.id, { onDelete: 'cascade' }),
}, (t) => [
  primaryKey({ columns: [t.exhibitionId, t.artistId] }),
]);

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  status: text('status').notNull(),
  coverImage: text('cover_image'),
  location: text('location'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const adminUsers = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
