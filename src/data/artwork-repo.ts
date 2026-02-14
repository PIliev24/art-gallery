import type { Artwork, ArtCategory } from '../types';
import { artworks } from './hardcoded-data';

export function getAllArtworks(): Artwork[] {
  return [...artworks];
}

export function getArtworkById(id: string): Artwork | undefined {
  return artworks.find(a => a.id === id);
}

export function getArtworksByCategory(category: ArtCategory): Artwork[] {
  return artworks.filter(a => a.category === category);
}

export function getFeaturedArtworks(): Artwork[] {
  return artworks.filter(a => a.isFeatured);
}