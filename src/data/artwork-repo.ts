import type { Artwork, ArtCategory } from '../types';
import { api } from '../lib/api';

interface ArtworkApiRow {
  id: string;
  title: string;
  artistId: string;
  category: string;
  medium: string;
  dimensions: { width: number; height: number; depth?: number; unit: string };
  year: number;
  imageUrl: string;
  description: string | null;
  isFeatured: boolean;
  isAvailable: boolean;
  artist: { id: string; name: string; bio: string | null; nationality: string | null };
}

function toArtwork(row: ArtworkApiRow): Artwork {
  return {
    id: row.id,
    title: row.title,
    artist: {
      id: row.artist.id,
      name: row.artist.name,
      bio: row.artist.bio ?? undefined,
      nationality: row.artist.nationality ?? undefined,
    },
    category: row.category as ArtCategory,
    medium: row.medium,
    dimensions: row.dimensions as Artwork['dimensions'],
    year: row.year,
    imageUrl: row.imageUrl,
    description: row.description ?? undefined,
    isFeatured: row.isFeatured,
    isAvailable: row.isAvailable,
  };
}

export async function getAllArtworks(): Promise<Artwork[]> {
  const rows = await api<ArtworkApiRow[]>('/artworks');
  return rows.map(toArtwork);
}

export async function getArtworkById(id: string): Promise<Artwork | undefined> {
  try {
    const row = await api<ArtworkApiRow>(`/artworks/${id}`);
    return toArtwork(row);
  } catch {
    return undefined;
  }
}

export async function getArtworksByCategory(category: ArtCategory): Promise<Artwork[]> {
  const rows = await api<ArtworkApiRow[]>(`/artworks?category=${category}`);
  return rows.map(toArtwork);
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  const rows = await api<ArtworkApiRow[]>('/artworks?featured=true');
  return rows.map(toArtwork);
}
