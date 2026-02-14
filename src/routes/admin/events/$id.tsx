import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EventStatus } from '@/types/enums';

interface EventDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
  coverImage: string | null;
  location: string | null;
  isFeatured: boolean;
}

const statusOptions = [
  { value: EventStatus.UPCOMING, label: 'Предстоящо' },
  { value: EventStatus.ONGOING, label: 'В момента' },
  { value: EventStatus.COMPLETED, label: 'Приключило' },
];

function toDateTimeInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  // Format as YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const Route = createFileRoute('/admin/events/$id')({
  component: AdminEventEdit,
  loader: async ({ params }) => {
    const event = await api<EventDetail>(`/events/${params.id}`);
    return { event };
  },
});

function AdminEventEdit() {
  const { event } = Route.useLoaderData();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: event.title,
    slug: event.slug,
    description: event.description,
    startDate: toDateTimeInput(event.startDate),
    endDate: toDateTimeInput(event.endDate),
    status: event.status,
    coverImage: event.coverImage || '',
    location: event.location || '',
    isFeatured: event.isFeatured,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api(`/events/${event.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...form,
          endDate: form.endDate || undefined,
          coverImage: form.coverImage || undefined,
          location: form.location || undefined,
        }),
      });
      navigate({ to: '/admin/events' });
    } catch {
      alert('Грешка при запис');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--color-gallery-100)] mb-8">Редактиране на събитие</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Field label="Заглавие">
          <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
        </Field>

        <Field label="Slug (URL)">
          <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
        </Field>

        <Field label="Описание">
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
            className="w-full min-h-[100px] border-b border-[var(--color-gallery-700)] bg-transparent py-2 text-sm text-[var(--color-gallery-100)] focus:border-[var(--color-gold-500)] focus:outline-none resize-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Начална дата и час">
            <Input type="datetime-local" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
          </Field>
          <Field label="Крайна дата и час">
            <Input type="datetime-local" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
          </Field>
        </div>

        <Field label="Статус">
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-transparent border-b border-[var(--color-gallery-700)] py-2 text-sm text-[var(--color-gallery-100)] focus:border-[var(--color-gold-500)] focus:outline-none">
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>

        <Field label="URL на корица">
          <Input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
        </Field>

        <Field label="Локация">
          <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
        </Field>

        <label className="flex items-center gap-2 text-sm text-[var(--color-gallery-300)] cursor-pointer">
          <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="accent-[var(--color-gold-500)]" />
          Избрано
        </label>

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="gold" disabled={saving}>
            {saving ? 'Запазване...' : 'Запази'}
          </Button>
          <Button type="button" variant="outline-light" onClick={() => navigate({ to: '/admin/events' })}>
            Отказ
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
