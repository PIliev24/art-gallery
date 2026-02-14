import { createFileRoute, Link } from '@tanstack/react-router';
import { getAllArtworks } from '@/data';
import { ArtworkCard } from '@/components/artwork-card';
import { ArtCategory } from '@/types/enums';
import { useState } from 'react';

const categoryLabels: Record<string, string> = {
  all: 'Всички',
  [ArtCategory.PAINTINGS]: 'Живопис',
  [ArtCategory.MODERN_ART]: 'Модерно изкуство',
  [ArtCategory.SCULPTURE]: 'Скулптура',
  [ArtCategory.PHOTOGRAPHY]: 'Фотография',
  [ArtCategory.GRAPHICS]: 'Графика',
};

export const Route = createFileRoute('/collection')({
  component: CollectionPage,
  loader: async () => {
    return {
      artworks: await getAllArtworks(),
    };
  },
});

function CollectionPage() {
  const { artworks } = Route.useLoaderData();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = activeCategory === 'all'
    ? artworks
    : artworks.filter(a => a.category === activeCategory);

  const availableCategories = ['all', ...new Set(artworks.map(a => a.category))];

  return (
    <div>
      {/* Header */}
      <section className="relative bg-[var(--color-gallery-950)] grain overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="animate-fade-up text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-4">
            Колекция
          </p>
          <h1 className="animate-fade-up delay-100 font-serif text-4xl md:text-6xl font-light text-[var(--color-gallery-100)] max-w-2xl leading-tight">
            Изкуство от фонда на галерията
          </h1>
          <p className="animate-fade-up delay-200 mt-6 text-[var(--color-gallery-500)] max-w-xl leading-relaxed">
            Разгледайте нашата колекция от живопис, скулптура, графика и фотография
            от утвърдени и млади български художници.
          </p>
        </div>
        <div className="gold-line" />
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-40 bg-[var(--color-ivory)]/95 backdrop-blur-md border-b border-[var(--color-gallery-200)]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-4">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-5 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[var(--color-gallery-900)] text-[var(--color-gallery-100)]'
                    : 'text-[var(--color-gallery-500)] hover:text-[var(--color-gallery-900)] hover:bg-[var(--color-gallery-100)]'
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-12">
            <p className="text-sm text-[var(--color-gallery-500)]">
              {filtered.length} {filtered.length === 1 ? 'произведение' : 'произведения'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {filtered.map((artwork, i) => (
              <Link
                key={artwork.id}
                to="/artwork/$artworkId"
                params={{ artworkId: artwork.id }}
                className={`animate-fade-up`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <ArtworkCard artwork={artwork} />
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-[var(--color-gallery-400)] font-serif text-xl">
                Няма произведения в тази категория
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
