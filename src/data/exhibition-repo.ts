import type { Exhibition } from '../types';
import { exhibitions } from './hardcoded-data';

export function getAllExhibitions(): Exhibition[] {
  return [...exhibitions];
}

export function getExhibitionBySlug(slug: string): Exhibition | undefined {
  return exhibitions.find(e => e.slug === slug);
}

export function getCurrentExhibitions(): Exhibition[] {
  return exhibitions.filter(e => e.status === 'current');
}