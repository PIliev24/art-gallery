import type { Artwork } from '@/types';

interface ArtworkCardProps {
  artwork: Artwork;
  variant?: 'default' | 'featured';
}

export function ArtworkCard({ artwork, variant = 'default' }: ArtworkCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <article className="group cursor-pointer">
      <div className={`img-zoom overflow-hidden ${isFeatured ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}>
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="pt-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-medium leading-tight text-[var(--color-gallery-900)] group-hover:text-[var(--color-gold-500)] transition-colors duration-300">
              {artwork.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-gallery-500)]">
              {artwork.artist.name}
            </p>
          </div>
          <span className="shrink-0 text-xs tracking-wider text-[var(--color-gallery-400)] uppercase mt-1">
            {artwork.year}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs tracking-wide text-[var(--color-gallery-400)]">
            {artwork.medium}
          </span>
          <span className="text-[var(--color-gallery-300)]">&middot;</span>
          <span className="text-xs text-[var(--color-gallery-400)]">
            {artwork.dimensions.width}&times;{artwork.dimensions.height} {artwork.dimensions.unit}
          </span>
        </div>
        <div className="mt-3 h-px bg-gradient-to-r from-[var(--color-gold-500)]/40 to-transparent w-0 group-hover:w-full transition-all duration-700" />
      </div>
    </article>
  );
}
