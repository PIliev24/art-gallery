import { createFileRoute, Link } from '@tanstack/react-router';
import { getEventBySlug, getAllEvents } from '@/data';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar, MapPin } from 'lucide-react';
import type { Event } from '@/types';

const statusLabels: Record<string, string> = {
  upcoming: 'Предстоящо',
  ongoing: 'В момента',
  completed: 'Приключило',
};

export const Route = createFileRoute('/event/$slug')({
  component: EventDetailPage,
  loader: async ({ params }) => {
    const event = await getEventBySlug(params.slug);
    const all = await getAllEvents();
    const related = all.filter(e => e.slug !== params.slug).slice(0, 3);
    return { event, related };
  },
});

function EventDetailPage() {
  const { event, related } = Route.useLoaderData();

  if (!event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="font-serif text-2xl text-gallery-400 mb-6">
          Събитието не е намерено
        </p>
        <Button asChild variant="outline">
          <Link to="/events">Към събитията</Link>
        </Button>
      </div>
    );
  }

  const isUpcoming = event.status === 'upcoming' || event.status === 'ongoing';

  const dateValue = (() => {
    let str = formatDate(event.startDate);
    if (event.startDate.getHours() > 0) {
      str += ` \u00B7 ${event.startDate.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return str;
  })();

  const details = [
    { label: 'Дата', value: dateValue },
    ...(event.endDate
      ? [{ label: 'Край', value: formatDate(event.endDate) }]
      : []),
    ...(event.location
      ? [{ label: 'Място', value: event.location }]
      : []),
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-[var(--color-gallery-950)]">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-500)] hover:text-[var(--color-gold-400)] transition-colors duration-300"
          >
            <ArrowLeft size={14} />
            <span>Назад към събитията</span>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[var(--color-gallery-950)]">
        <div className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
          <div className={`grid grid-cols-1 ${event.coverImage ? 'lg:grid-cols-12' : ''} gap-12 lg:gap-16`}>
            {/* Cover image */}
            {event.coverImage && (
              <div className="lg:col-span-7 animate-fade-in">
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-gallery-900)]">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  {isUpcoming && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-medium bg-[var(--color-gold-500)] text-[var(--color-gallery-950)]">
                        {statusLabels[event.status]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Details */}
            <div className={`${event.coverImage ? 'lg:col-span-5' : 'max-w-2xl'} flex flex-col justify-center`}>
              <div className="animate-fade-up">
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-4">
                  {statusLabels[event.status]}
                </p>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-[var(--color-gallery-100)] leading-tight mb-6">
                  {event.title}
                </h1>
              </div>

              <p className="animate-fade-up delay-100 text-sm text-[var(--color-gallery-500)] leading-relaxed mb-10">
                {event.description}
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
                    <span className="text-sm text-[var(--color-gallery-300)]">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="animate-fade-up delay-300 mt-10">
                <Button asChild variant="gold" size="lg" className="w-full sm:w-auto">
                  <Link to="/contact">Запитване за събитието</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      {related.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-3">
                  Разгледайте още
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-[var(--color-gallery-900)]">
                  Други събития
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
              {related.map((ev) => (
                <RelatedEventCard key={ev.id} event={ev} />
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

function RelatedEventCard({ event }: { event: Event }) {
  return (
    <Link
      to="/event/$slug"
      params={{ slug: event.slug }}
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
  );
}
