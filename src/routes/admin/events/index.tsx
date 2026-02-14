import { createFileRoute, Link } from '@tanstack/react-router';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

interface EventRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  startDate: string;
  isFeatured: boolean;
  location: string | null;
}

const statusLabels: Record<string, string> = {
  upcoming: 'Предстоящо',
  ongoing: 'В момента',
  completed: 'Приключило',
};

export const Route = createFileRoute('/admin/events/')({
  component: AdminEventsList,
  loader: async () => {
    const events = await api<EventRow[]>('/events');
    return { events };
  },
});

function AdminEventsList() {
  const { events: initial } = Route.useLoaderData();
  const [events, setEvents] = useState(initial);

  async function handleDelete(id: string) {
    if (!confirm('Сигурни ли сте, че искате да изтриете това събитие?')) return;
    await api(`/events/${id}`, { method: 'DELETE' });
    setEvents(events.filter(e => e.id !== id));
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('bg-BG');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-[var(--color-gallery-100)]">Събития</h1>
        <Button asChild variant="gold" size="sm">
          <Link to="/admin/events/new">
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
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal">Статус</th>
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal">Дата</th>
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal">Локация</th>
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal">Избрано</th>
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-[var(--color-gallery-800)] hover:bg-[var(--color-gallery-800)]/30">
                <td className="py-3 px-4 text-[var(--color-gallery-200)]">{event.title}</td>
                <td className="py-3 px-4 text-[var(--color-gallery-400)]">{statusLabels[event.status] || event.status}</td>
                <td className="py-3 px-4 text-[var(--color-gallery-400)]">{formatDate(event.startDate)}</td>
                <td className="py-3 px-4 text-[var(--color-gallery-400)]">{event.location || '—'}</td>
                <td className="py-3 px-4 text-[var(--color-gallery-400)]">{event.isFeatured ? 'Да' : ''}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      to="/admin/events/$id"
                      params={{ id: event.id }}
                      className="p-1.5 text-[var(--color-gallery-400)] hover:text-[var(--color-gold-400)] transition-colors"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
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

      {events.length === 0 && (
        <p className="text-center text-[var(--color-gallery-500)] py-12">
          Няма добавени събития
        </p>
      )}
    </div>
  );
}
