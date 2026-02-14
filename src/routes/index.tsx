import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { getFeaturedArtworks, getCurrentExhibitions, getUpcomingEvents } from '@/data';
import { ArtworkCard } from '@/components/artwork-card';
import { formatDate } from '@/lib/utils';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => {
    return {
      artworks: getFeaturedArtworks(),
      exhibitions: getCurrentExhibitions(),
      events: getUpcomingEvents(),
    };
  },
});

function HomePage() {
  const { artworks, exhibitions, events } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[90vh] bg-[var(--color-gallery-950)] grain overflow-hidden flex items-center">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.07]">
          <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-gold-500)] to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-gold-500)]/30 to-transparent" />

        <div className="mx-auto max-w-7xl px-6 py-32 w-full">
          <div className="max-w-3xl">
            <div className="animate-fade-up">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-8">
                Оряхово &middot; от 1994
              </p>
            </div>

            <h1 className="animate-fade-up delay-100">
              <span className="block font-serif text-5xl md:text-7xl lg:text-8xl font-light text-[var(--color-gallery-100)] leading-[0.95]">
                Галерия
              </span>
              <span className="block font-serif text-5xl md:text-7xl lg:text-8xl font-medium text-[var(--color-gold-400)] leading-[0.95] mt-2">
                Савчеви
              </span>
            </h1>

            <div className="animate-gold-line delay-300 mt-10 mb-8 w-24 h-px bg-[var(--color-gold-500)]" />

            <p className="animate-fade-up delay-400 text-lg md:text-xl text-[var(--color-gallery-400)] leading-relaxed max-w-xl font-light">
              Трето десетилетие изкуство и култура. Пространство, където
              традицията среща съвременността в сърцето на Северозападна България.
            </p>

            <div className="animate-fade-up delay-500 flex flex-wrap gap-4 mt-12">
              <Button asChild variant="gold" size="lg">
                <Link to="/collection">Разгледай колекцията</Link>
              </Button>
              <Button asChild variant="outline-light" size="lg">
                <Link to="/exhibitions">Текущи изложби</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      {artworks.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-3">
                  Избрано
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-[var(--color-gallery-900)]">
                  Представени произведения
                </h2>
              </div>
              <Link
                to="/collection"
                className="hidden md:flex items-center gap-2 text-sm text-[var(--color-gallery-500)] hover:text-[var(--color-gold-500)] transition-colors duration-300 group"
              >
                <span>Виж всички</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {artworks.slice(0, 4).map((artwork, i) => (
                <Link
                  key={artwork.id}
                  to="/artwork/$artworkId"
                  params={{ artworkId: artwork.id }}
                  className={`animate-fade-up delay-${(i + 1) * 100}`}
                >
                  <ArtworkCard artwork={artwork} variant="featured" />
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Button asChild variant="outline">
                <Link to="/collection">Виж всички произведения</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Exhibitions Banner */}
      {exhibitions.length > 0 && (
        <section className="relative bg-[var(--color-gallery-900)] grain overflow-hidden">
          <div className="gold-line-center" />
          <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-3">
                  Текуща изложба
                </p>
                <h2 className="font-serif text-3xl md:text-5xl font-light text-[var(--color-gallery-100)] leading-tight mb-6">
                  {exhibitions[0].title}
                </h2>
                <p className="text-[var(--color-gallery-400)] leading-relaxed mb-4 max-w-lg">
                  {exhibitions[0].description}
                </p>
                <div className="flex flex-wrap gap-6 text-sm text-[var(--color-gallery-500)] mb-10">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[var(--color-gold-500)]" />
                    <span>{formatDate(exhibitions[0].startDate)} — {formatDate(exhibitions[0].endDate)}</span>
                  </div>
                  {exhibitions[0].location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[var(--color-gold-500)]" />
                      <span>{exhibitions[0].location}</span>
                    </div>
                  )}
                </div>
                <Button asChild variant="gold">
                  <Link to="/exhibitions">Научи повече</Link>
                </Button>
              </div>

              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={exhibitions[0].coverImage}
                    alt={exhibitions[0].title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-[var(--color-gold-500)]/20" />
                <div className="absolute -top-4 -right-4 w-24 h-24 border border-[var(--color-gold-500)]/20" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-3">
                  Календар
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-[var(--color-gallery-900)]">
                  Предстоящи събития
                </h2>
              </div>
              <Link
                to="/events"
                className="hidden md:flex items-center gap-2 text-sm text-[var(--color-gallery-500)] hover:text-[var(--color-gold-500)] transition-colors duration-300 group"
              >
                <span>Всички събития</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-gallery-200)]">
              {events.slice(0, 3).map((event) => (
                <Link
                  key={event.id}
                  to="/events"
                  className="group bg-[var(--color-ivory)] p-8 hover:bg-[var(--color-cream)] transition-colors duration-500"
                >
                  <div className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[var(--color-gold-500)] mb-4">
                    <Calendar size={12} />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[var(--color-gallery-900)] mb-3 group-hover:text-[var(--color-gold-500)] transition-colors duration-300">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[var(--color-gallery-500)] leading-relaxed line-clamp-2">
                    {event.description}
                  </p>
                  {event.location && (
                    <div className="flex items-center gap-2 mt-4 text-xs text-[var(--color-gallery-400)]">
                      <MapPin size={12} />
                      <span>{event.location}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA / Visit */}
      <section className="relative bg-[var(--color-gallery-950)] grain overflow-hidden">
        <div className="gold-line-center" />
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-6">
            Заповядайте
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-light text-[var(--color-gallery-100)] mb-6 max-w-2xl mx-auto leading-tight">
            Очакваме ви в галерията
          </h2>
          <p className="text-[var(--color-gallery-500)] mb-4">
            ул. Дунавска 10, Оряхово
          </p>
          <p className="text-sm text-[var(--color-gallery-600)] mb-12">
            Вторник – Неделя: 10:00 – 18:00
          </p>
          <Button asChild variant="gold" size="lg">
            <Link to="/contact">Свържете се с нас</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
