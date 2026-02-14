import type { Exhibition } from '../types';
import { api } from '../lib/api';

interface ExhibitionApiRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  coverImage: string;
  location: string | null;
  isFeatured: boolean;
  artists: { id: string; name: string; bio: string | null; nationality: string | null }[];
}

function toExhibition(row: ExhibitionApiRow): Exhibition {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    startDate: new Date(row.startDate),
    endDate: new Date(row.endDate),
    status: row.status as Exhibition['status'],
    coverImage: row.coverImage,
    artists: row.artists.map(a => ({
      id: a.id,
      name: a.name,
      bio: a.bio ?? undefined,
      nationality: a.nationality ?? undefined,
    })),
    location: row.location ?? undefined,
    isFeatured: row.isFeatured,
  };
}

export async function getAllExhibitions(): Promise<Exhibition[]> {
  const rows = await api<ExhibitionApiRow[]>('/exhibitions');
  return rows.map(toExhibition);
}

export async function getExhibitionBySlug(slug: string): Promise<Exhibition | undefined> {
  try {
    const row = await api<ExhibitionApiRow>(`/exhibitions/slug/${slug}`);
    return toExhibition(row);
  } catch {
    return undefined;
  }
}

export async function getCurrentExhibitions(): Promise<Exhibition[]> {
  const rows = await api<ExhibitionApiRow[]>('/exhibitions?status=current');
  return rows.map(toExhibition);
}
