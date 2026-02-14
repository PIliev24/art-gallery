import { createFileRoute, Link } from '@tanstack/react-router';
import { getAllExhibitions } from '@/data';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import type { Exhibition } from '@/types';
import { ExhibitionStatus } from '@/types/enums';

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

export const Route = createFileRoute('/exhibitions')({
  component: ExhibitionsPage,
  loader: async () => {
    const exhibitions = await getAllExhibitions();
    const current = exhibitions.filter(e => e.status === ExhibitionStatus.CURRENT);
    const upcoming = exhibitions.filter(e => e.status === ExhibitionStatus.UPCOMING);
    const past = exhibitions.filter(e => e.status === ExhibitionStatus.PAST);
    return { current, upcoming, past };
  },
});

function ExhibitionCard({ exhibition }: { exhibition: Exhibition }) {
  return (
    <article className="group">
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
        {exhibition.artists.length > 0 && (
          <p className="mt-3 text-xs text-[var(--color-gallery-400)]">
            {exhibition.artists.map(a => a.name).join(', ')}
          </p>
        )}
        <div className="mt-4 h-px bg-gradient-to-r from-[var(--color-gold-500)]/40 to-transparent w-0 group-hover:w-full transition-all duration-700" />
      </div>
    </article>
  );
}

function ExhibitionsPage() {
  const { current, upcoming, past } = Route.useLoaderData();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[var(--color-gallery-950)] grain overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="animate-fade-up text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-4">
            Изложби
          </p>
          <h1 className="animate-fade-up delay-100 font-serif text-4xl md:text-6xl font-light text-[var(--color-gallery-100)] max-w-3xl leading-tight">
            Изложбена програма
          </h1>
          <p className="animate-fade-up delay-200 mt-6 text-[var(--color-gallery-500)] max-w-xl leading-relaxed">
            Текущи и предстоящи изложби в Галерия Савчеви — живопис, скулптура,
            фотография и съвременно изкуство.
          </p>
        </div>
        <div className="gold-line" />
      </section>

      {/* Current */}
      {current.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-2 h-2 rounded-full bg-[var(--color-gold-500)] animate-pulse" />
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)]">
                Текущи изложби
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {current.map((ex) => (
                <ExhibitionCard key={ex.id} exhibition={ex} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="py-20 md:py-28 bg-[var(--color-cream)]">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-3">
              Скоро
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[var(--color-gallery-900)] mb-12">
              Предстоящи изложби
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {upcoming.map((ex) => (
                <ExhibitionCard key={ex.id} exhibition={ex} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-3">
              Архив
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[var(--color-gallery-900)] mb-12">
              Минали изложби
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {past.map((ex) => (
                <ExhibitionCard key={ex.id} exhibition={ex} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[var(--color-gallery-950)] grain">
        <div className="gold-line-center" />
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="font-serif text-2xl text-[var(--color-gallery-200)] mb-6">
            Искате да организирате изложба в нашата галерия?
          </p>
          <Button asChild variant="gold">
            <Link to="/contact">Свържете се с нас</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
