import { pgTable, text, integer, boolean, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

export const artworks = pgTable('artworks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  artistName: text('artist_name').notNull(),
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
  artistNames: text('artist_names'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

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
