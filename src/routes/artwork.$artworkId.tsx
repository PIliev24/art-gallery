import { createFileRoute, Link } from '@tanstack/react-router';
import { getArtworkById, getAllArtworks } from '@/data';
import { Button } from '@/components/ui/button';
import { ArtworkCard } from '@/components/artwork-card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const categoryLabels: Record<string, string> = {
  paintings: 'Живопис',
  'modern-art': 'Модерно изкуство',
  sculpture: 'Скулптура',
  photography: 'Фотография',
  graphics: 'Графика',
  other: 'Друго',
};

export const Route = createFileRoute('/artwork/$artworkId')({
  component: ArtworkDetailPage,
  loader: async ({ params }) => {
    const artwork = await getArtworkById(params.artworkId);
    const all = await getAllArtworks();
    const related = all.filter(a => a.id !== params.artworkId).slice(0, 3);
    return { artwork, related };
  },
});

function ArtworkDetailPage() {
  const { artwork, related } = Route.useLoaderData();

  if (!artwork) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="font-serif text-2xl text-gallery-400 mb-6">
          Произведението не е намерено
        </p>
        <Button asChild variant="outline">
          <Link to="/collection">Към колекцията</Link>
        </Button>
      </div>
    );
  }

  const details = [
    { label: 'Художник', value: artwork.artist.name },
    { label: 'Година', value: String(artwork.year) },
    { label: 'Категория', value: categoryLabels[artwork.category] || artwork.category },
    { label: 'Техника', value: artwork.medium },
    {
      label: 'Размери',
      value: `${artwork.dimensions.width} × ${artwork.dimensions.height}${artwork.dimensions.depth ? ` × ${artwork.dimensions.depth}` : ''} ${artwork.dimensions.unit}`,
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gallery-950`">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-500)] hover:text-[var(--color-gold-400)] transition-colors duration-300"
          >
            <ArrowLeft size={14} />
            <span>Назад към колекцията</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="bg-gallery-950`">
        <div className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Image */}
            <div className="lg:col-span-7 animate-fade-in">
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-gallery-900)]">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="animate-fade-up">
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-4">
                  {categoryLabels[artwork.category] || artwork.category}
                </p>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-[var(--color-gallery-100)] leading-tight mb-3">
                  {artwork.title}
                </h1>
                <p className="text-lg text-[var(--color-gallery-400)] mb-8">
                  {artwork.artist.name}
                </p>
              </div>

              {artwork.description && (
                <p className="animate-fade-up delay-100 text-sm text-[var(--color-gallery-500)] leading-relaxed mb-10">
                  {artwork.description}
                </p>
              )}

              <div className="animate-fade-up delay-200 space-y-0">
                {details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between py-3.5 border-b border-[var(--color-gallery-800)]/50"
                  >
                    <span className="text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-600)]">
                      {detail.label}
                    </span>
                    <span className="text-sm text-[var(--color-gallery-300)]">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>

              {artwork.isAvailable && (
                <div className="animate-fade-up delay-300 mt-10">
                  <Button asChild variant="gold" size="lg" className="w-full sm:w-auto">
                    <Link to="/contact">Запитване за произведението</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-3">
                  Разгледайте още
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-[var(--color-gallery-900)]">
                  Други произведения
                </h2>
              </div>
              <Link
                to="/collection"
                className="hidden md:flex items-center gap-2 text-sm text-[var(--color-gallery-500)] hover:text-[var(--color-gold-500)] transition-colors duration-300 group"
              >
                <span>Цялата колекция</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((art, i) => (
                <Link
                  key={art.id}
                  to="/artwork/$artworkId"
                  params={{ artworkId: art.id }}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <ArtworkCard artwork={art} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
