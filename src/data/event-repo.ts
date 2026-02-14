import type { Event } from '../types';
import { api } from '../lib/api';

interface EventApiRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
  coverImage: string | null;
  location: string | null;
  isFeatured: boolean;
}

function toEvent(row: EventApiRow): Event {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    startDate: new Date(row.startDate),
    endDate: row.endDate ? new Date(row.endDate) : undefined,
    status: row.status as Event['status'],
    coverImage: row.coverImage ?? undefined,
    location: row.location ?? undefined,
    isFeatured: row.isFeatured,
  };
}

export async function getAllEvents(): Promise<Event[]> {
  const rows = await api<EventApiRow[]>('/events');
  return rows.map(toEvent);
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  try {
    const row = await api<EventApiRow>(`/events/slug/${slug}`);
    return toEvent(row);
  } catch {
    return undefined;
  }
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const rows = await api<EventApiRow[]>('/events?status=upcoming');
  return rows.map(toEvent);
}
