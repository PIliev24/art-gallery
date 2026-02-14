import { createFileRoute, Link } from '@tanstack/react-router';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

interface ArtworkRow {
  id: string;
  title: string;
  category: string;
  year: number;
  isFeatured: boolean;
  isAvailable: boolean;
  artist: { id: string; name: string };
}

export const Route = createFileRoute('/admin/artworks/')({
  component: AdminArtworksList,
  loader: async () => {
    const artworks = await api<ArtworkRow[]>('/artworks');
    return { artworks };
  },
});

const categoryLabels: Record<string, string> = {
  paintings: 'Живопис',
  'modern-art': 'Модерно изкуство',
  sculpture: 'Скулптура',
  photography: 'Фотография',
  graphics: 'Графика',
  other: 'Друго',
};

function AdminArtworksList() {
  const { artworks: initialArtworks } = Route.useLoaderData();
  const [artworks, setArtworks] = useState(initialArtworks);

  async function handleDelete(id: string) {
    if (!confirm('Сигурни ли сте, че искате да изтриете това произведение?')) return;
    await api(`/artworks/${id}`, { method: 'DELETE' });
    setArtworks(artworks.filter(a => a.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-[var(--color-gallery-100)]">Произведения</h1>
        <Button asChild variant="gold" size="sm">
          <Link to="/admin/artworks/new">
            <Plus size={16} className="mr-2" />
            Добави
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-gallery-700)] text-left">
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal">Заглавие</th>
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal">Художник</th>
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal">Категория</th>
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal">Година</th>
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal">Избрано</th>
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {artworks.map((artwork) => (
              <tr key={artwork.id} className="border-b border-[var(--color-gallery-800)] hover:bg-[var(--color-gallery-800)]/30">
                <td className="py-3 px-4 text-[var(--color-gallery-200)]">{artwork.title}</td>
                <td className="py-3 px-4 text-[var(--color-gallery-400)]">{artwork.artist.name}</td>
                <td className="py-3 px-4 text-[var(--color-gallery-400)]">{categoryLabels[artwork.category] || artwork.category}</td>
                <td className="py-3 px-4 text-[var(--color-gallery-400)]">{artwork.year}</td>
                <td className="py-3 px-4 text-[var(--color-gallery-400)]">{artwork.isFeatured ? 'Да' : ''}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      to="/admin/artworks/$id"
                      params={{ id: artwork.id }}
                      className="p-1.5 text-[var(--color-gallery-400)] hover:text-[var(--color-gold-400)] transition-colors"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(artwork.id)}
                      className="p-1.5 text-[var(--color-gallery-400)] hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {artworks.length === 0 && (
        <p className="text-center text-[var(--color-gallery-500)] py-12">
          Няма добавени произведения
        </p>
      )}
    </div>
  );
}
