import type { Event } from '../types';
import { events } from './hardcoded-data';

export function getAllEvents(): Event[] {
  return [...events];
}

export function getEventBySlug(slug: string): Event | undefined {
  return events.find(e => e.slug === slug);
}

export function getUpcomingEvents(): Event[] {
  return events.filter(e => e.status === 'upcoming');
}