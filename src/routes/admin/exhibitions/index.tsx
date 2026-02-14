import { createFileRoute, Link } from '@tanstack/react-router';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

interface ExhibitionRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  startDate: string;
  endDate: string;
  isFeatured: boolean;
}

const statusLabels: Record<string, string> = {
  current: 'Текуща',
  upcoming: 'Предстояща',
  past: 'Приключила',
};

export const Route = createFileRoute('/admin/exhibitions/')({
  component: AdminExhibitionsList,
  loader: async () => {
    const exhibitions = await api<ExhibitionRow[]>('/exhibitions');
    return { exhibitions };
  },
});

function AdminExhibitionsList() {
  const { exhibitions: initial } = Route.useLoaderData();
  const [exhibitions, setExhibitions] = useState(initial);

  async function handleDelete(id: string) {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази изложба?')) return;
    await api(`/exhibitions/${id}`, { method: 'DELETE' });
    setExhibitions(exhibitions.filter(e => e.id !== id));
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('bg-BG');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-[var(--color-gallery-100)]">Изложби</h1>
        <Button asChild variant="gold" size="sm">
          <Link to="/admin/exhibitions/new">
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
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal">Период</th>
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal">Избрана</th>
              <th className="py-3 px-4 text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {exhibitions.map((ex) => (
              <tr key={ex.id} className="border-b border-[var(--color-gallery-800)] hover:bg-[var(--color-gallery-800)]/30">
                <td className="py-3 px-4 text-[var(--color-gallery-200)]">{ex.title}</td>
                <td className="py-3 px-4 text-[var(--color-gallery-400)]">{statusLabels[ex.status] || ex.status}</td>
                <td className="py-3 px-4 text-[var(--color-gallery-400)]">{formatDate(ex.startDate)} — {formatDate(ex.endDate)}</td>
                <td className="py-3 px-4 text-[var(--color-gallery-400)]">{ex.isFeatured ? 'Да' : ''}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      to="/admin/exhibitions/$id"
                      params={{ id: ex.id }}
                      className="p-1.5 text-[var(--color-gallery-400)] hover:text-[var(--color-gold-400)] transition-colors"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(ex.id)}
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

      {exhibitions.length === 0 && (
        <p className="text-center text-[var(--color-gallery-500)] py-12">
          Няма добавени изложби
        </p>
      )}
    </div>
  );
}
