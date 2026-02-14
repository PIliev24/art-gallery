import { createFileRoute, Link } from '@tanstack/react-router';
import { getAllEvents } from '@/data';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/types';
import { EventStatus } from '@/types/enums';

const statusLabels: Record<string, string> = {
  upcoming: 'Предстоящо',
  ongoing: 'В момента',
  completed: 'Приключило',
};

export const Route = createFileRoute('/events')({
  component: EventsPage,
  loader: async () => {
    const events = await getAllEvents();
    const upcoming = events.filter(e => e.status === EventStatus.UPCOMING || e.status === EventStatus.ONGOING);
    const past = events.filter(e => e.status === EventStatus.COMPLETED);
    return { upcoming, past };
  },
});

function EventCard({ event, variant = 'default' }: { event: Event; variant?: 'featured' | 'default' }) {
  const isFeatured = variant === 'featured';
  const isUpcoming = event.status === EventStatus.UPCOMING || event.status === EventStatus.ONGOING;

  return (
    <article className={`group ${isFeatured ? '' : ''}`}>
      {event.coverImage && (
        <div className="img-zoom aspect-[16/9] overflow-hidden relative mb-5">
          <img
            src={event.coverImage}
            alt={event.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {isUpcoming && (
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium bg-[var(--color-gold-500)] text-[var(--color-gallery-950)]">
                {statusLabels[event.status]}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-start gap-5">
        {/* Date block */}
        <div className="shrink-0 w-16 text-center border border-[var(--color-gallery-200)] py-3">
          <span className="block text-2xl font-serif text-[var(--color-gallery-900)]">
            {event.startDate.getDate()}
          </span>
          <span className="block text-[10px] tracking-[0.15em] uppercase text-[var(--color-gallery-500)]">
            {event.startDate.toLocaleDateString('bg-BG', { month: 'short' })}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-xl font-medium text-[var(--color-gallery-900)] mb-2 group-hover:text-[var(--color-gold-500)] transition-colors duration-300">
            {event.title}
          </h3>
          <p className="text-sm text-[var(--color-gallery-600)] leading-relaxed line-clamp-2 mb-3">
            {event.description}
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-[var(--color-gallery-400)]">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-[var(--color-gold-500)]" />
              {formatDate(event.startDate)}
              {event.startDate.getHours() > 0 && (
                <> &middot; {event.startDate.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}</>
              )}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-[var(--color-gold-500)]" />
                {event.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function EventsPage() {
  const { upcoming, past } = Route.useLoaderData();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[var(--color-gallery-950)] grain overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="animate-fade-up text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-4">
            Събития
          </p>
          <h1 className="animate-fade-up delay-100 font-serif text-4xl md:text-6xl font-light text-[var(--color-gallery-100)] max-w-3xl leading-tight">
            Културен календар
          </h1>
          <p className="animate-fade-up delay-200 mt-6 text-[var(--color-gallery-500)] max-w-xl leading-relaxed">
            Откривания, работилници, лекции и специални вечери —
            всичко, което се случва в Галерия Савчеви.
          </p>
        </div>
        <div className="gold-line" />
      </section>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-2 h-2 rounded-full bg-[var(--color-gold-500)] animate-pulse" />
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)]">
                Предстоящи събития
              </p>
            </div>

            {/* Featured event */}
            {upcoming.length > 0 && upcoming[0].coverImage && (
              <div className="mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="img-zoom aspect-[16/10] overflow-hidden relative">
                    <img
                      src={upcoming[0].coverImage}
                      alt={upcoming[0].title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium bg-[var(--color-gold-500)] text-[var(--color-gallery-950)]">
                        {statusLabels[upcoming[0].status]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-4">
                      {formatDate(upcoming[0].startDate)}
                    </p>
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-[var(--color-gallery-900)] leading-tight mb-4">
                      {upcoming[0].title}
                    </h3>
                    <p className="text-[var(--color-gallery-600)] leading-relaxed mb-6">
                      {upcoming[0].description}
                    </p>
                    {upcoming[0].location && (
                      <div className="flex items-center gap-2 text-sm text-[var(--color-gallery-500)]">
                        <MapPin size={14} className="text-[var(--color-gold-500)]" />
                        <span>{upcoming[0].location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-12 h-px bg-[var(--color-gallery-200)]" />
              </div>
            )}

            {/* Other upcoming events */}
            {upcoming.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {upcoming.slice(1).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Past events */}
      {past.length > 0 && (
        <section className="py-20 md:py-28 bg-[var(--color-cream)]">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-3">
              Архив
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[var(--color-gallery-900)] mb-12">
              Минали събития
            </h2>

            <div className="space-y-8">
              {past.map((event) => (
                <div key={event.id} className="flex items-start gap-6 py-6 border-b border-[var(--color-gallery-200)]">
                  <div className="shrink-0 w-16 text-center py-2">
                    <span className="block text-2xl font-serif text-[var(--color-gallery-500)]">
                      {event.startDate.getDate()}
                    </span>
                    <span className="block text-[10px] tracking-[0.15em] uppercase text-[var(--color-gallery-400)]">
                      {event.startDate.toLocaleDateString('bg-BG', { month: 'short' })}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[var(--color-gallery-700)] mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-[var(--color-gallery-500)]">
                      {event.description}
                    </p>
                    {event.location && (
                      <p className="text-xs text-[var(--color-gallery-400)] mt-2 flex items-center gap-1.5">
                        <MapPin size={11} />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {upcoming.length === 0 && past.length === 0 && (
        <section className="py-32 text-center">
          <p className="font-serif text-xl text-[var(--color-gallery-400)] mb-6">
            Скоро ще добавим нови събития
          </p>
          <Button asChild variant="outline">
            <Link to="/">Към началната страница</Link>
          </Button>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[var(--color-gallery-950)] grain">
        <div className="gold-line-center" />
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="font-serif text-2xl text-[var(--color-gallery-200)] mb-6">
            Искате да получавате покани за нашите събития?
          </p>
          <Button asChild variant="gold">
            <Link to="/contact">Свържете се с нас</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
