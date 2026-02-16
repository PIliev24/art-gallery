import { createFileRoute, Link } from '@tanstack/react-router';
import { getExhibitionBySlug, getAllExhibitions } from '@/data';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import type { Exhibition } from '@/types';

const statusLabels: Record<string, string> = {
  current: 'Текуща',
  upcoming: 'Предстояща',
  past: 'Приключила',
};

const statusColors: Record<string, string> = {
  current: 'bg-[var(--color-gold-500)] text-[var(--color-gallery-950)]',
  upcoming: 'bg-[var(--color-gallery-800)] text-[var(--color-gallery-300)]',
  past: 'bg-[var(--color-gallery-200)] text-[var(--color-gallery-600)]',
};

export const Route = createFileRoute('/exhibition/$slug')({
  component: ExhibitionDetailPage,
  loader: async ({ params }) => {
    const exhibition = await getExhibitionBySlug(params.slug);
    const all = await getAllExhibitions();
    const related = all.filter(e => e.slug !== params.slug).slice(0, 2);
    return { exhibition, related };
  },
});

function ExhibitionDetailPage() {
  const { exhibition, related } = Route.useLoaderData();

  if (!exhibition) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="font-serif text-2xl text-gallery-400 mb-6">
          Изложбата не е намерена
        </p>
        <Button asChild variant="outline">
          <Link to="/exhibitions">Към изложбите</Link>
        </Button>
      </div>
    );
  }

  const details = [
    {
      label: 'Период',
      value: `${formatDate(exhibition.startDate)} — ${formatDate(exhibition.endDate)}`,
    },
    ...(exhibition.location
      ? [{ label: 'Място', value: exhibition.location }]
      : []),
    ...(exhibition.artists.length > 0
      ? [{ label: 'Художници', value: exhibition.artists.map(a => a.name).join(', ') }]
      : []),
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-[var(--color-gallery-950)]">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link
            to="/exhibitions"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-500)] hover:text-[var(--color-gold-400)] transition-colors duration-300"
          >
            <ArrowLeft size={14} />
            <span>Назад към изложбите</span>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[var(--color-gallery-950)]">
        <div className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Cover image */}
            <div className="lg:col-span-7 animate-fade-in">
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-gallery-900)]">
                <img
                  src={exhibition.coverImage}
                  alt={exhibition.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-block px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium ${statusColors[exhibition.status]}`}>
                    {statusLabels[exhibition.status]}
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="animate-fade-up">
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-4">
                  {statusLabels[exhibition.status]} изложба
                </p>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-[var(--color-gallery-100)] leading-tight mb-6">
                  {exhibition.title}
                </h1>
              </div>

              <p className="animate-fade-up delay-100 text-sm text-[var(--color-gallery-500)] leading-relaxed mb-10">
                {exhibition.description}
              </p>

              <div className="animate-fade-up delay-200 space-y-0">
                {details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between py-3.5 border-b border-[var(--color-gallery-800)]/50"
                  >
                    <span className="text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-600)]">
                      {detail.label}
                    </span>
                    <span className="text-sm text-[var(--color-gallery-300)] text-right max-w-[60%]">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="animate-fade-up delay-300 mt-10">
                <Button asChild variant="gold" size="lg" className="w-full sm:w-auto">
                  <Link to="/contact">Запитване за изложбата</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artists */}
      {exhibition.artists.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center gap-3 mb-12">
              <Users size={16} className="text-[var(--color-gold-500)]" />
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)]">
                Участващи художници
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {exhibition.artists.map((artist) => (
                <div
                  key={artist.id}
                  className="p-6 border border-[var(--color-gallery-200)] hover:border-[var(--color-gold-500)]/30 transition-colors duration-300"
                >
                  <h3 className="font-serif text-xl text-[var(--color-gallery-900)] mb-2">
                    {artist.name}
                  </h3>
                  {artist.bio && (
                    <p className="text-sm text-[var(--color-gallery-500)] leading-relaxed">
                      {artist.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Exhibitions */}
      {related.length > 0 && (
        <section className="py-20 md:py-28 bg-[var(--color-cream)]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-3">
                  Разгледайте още
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-[var(--color-gallery-900)]">
                  Други изложби
                </h2>
              </div>
              <Link
                to="/exhibitions"
                className="hidden md:flex items-center gap-2 text-sm text-[var(--color-gallery-500)] hover:text-[var(--color-gold-500)] transition-colors duration-300 group"
              >
                <span>Всички изложби</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {related.map((ex) => (
                <RelatedExhibitionCard key={ex.id} exhibition={ex} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function RelatedExhibitionCard({ exhibition }: { exhibition: Exhibition }) {
  return (
    <Link
      to="/exhibition/$slug"
      params={{ slug: exhibition.slug }}
      className="group"
    >
      <article>
        <div className="img-zoom aspect-[16/10] overflow-hidden relative">
          <img
            src={exhibition.coverImage}
            alt={exhibition.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className={`inline-block px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium ${statusColors[exhibition.status]}`}>
              {statusLabels[exhibition.status]}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-serif text-2xl text-white mb-2 group-hover:text-[var(--color-gold-300)] transition-colors duration-300">
              {exhibition.title}
            </h3>
            <div className="flex flex-wrap gap-4 text-xs text-white/70">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                {formatDate(exhibition.startDate)} — {formatDate(exhibition.endDate)}
              </span>
              {exhibition.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} />
                  {exhibition.location}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="pt-5">
          <p className="text-sm text-[var(--color-gallery-600)] leading-relaxed line-clamp-2">
            {exhibition.description}
          </p>
          <div className="mt-4 h-px bg-gradient-to-r from-[var(--color-gold-500)]/40 to-transparent w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </article>
    </Link>
  );
}
