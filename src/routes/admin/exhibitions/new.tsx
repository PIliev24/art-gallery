import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExhibitionStatus } from '@/types/enums';

interface ArtistOption {
  id: string;
  name: string;
}

const statusOptions = [
  { value: ExhibitionStatus.UPCOMING, label: 'Предстояща' },
  { value: ExhibitionStatus.CURRENT, label: 'Текуща' },
  { value: ExhibitionStatus.PAST, label: 'Приключила' },
];

export const Route = createFileRoute('/admin/exhibitions/new')({
  component: AdminExhibitionNew,
  loader: async () => {
    const artists = await api<ArtistOption[]>('/artists');
    return { artists };
  },
});

function AdminExhibitionNew() {
  const { artists } = Route.useLoaderData();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    startDate: '',
    endDate: '',
    status: ExhibitionStatus.UPCOMING as string,
    coverImage: '',
    location: '',
    isFeatured: false,
    artistIds: [] as string[],
  });

  function handleArtistToggle(id: string) {
    setForm(f => ({
      ...f,
      artistIds: f.artistIds.includes(id)
        ? f.artistIds.filter(a => a !== id)
        : [...f.artistIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api('/exhibitions', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          location: form.location || undefined,
        }),
      });
      navigate({ to: '/admin/exhibitions' });
    } catch {
      alert('Грешка при запис');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--color-gallery-100)] mb-8">Нова изложба</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Field label="Заглавие">
          <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
        </Field>

        <Field label="Slug (URL)">
          <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required placeholder="primer-slug" className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
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
          <Field label="Начална дата">
            <Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
          </Field>
          <Field label="Крайна дата">
            <Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
          </Field>
        </div>

        <Field label="Статус">
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-transparent border-b border-[var(--color-gallery-700)] py-2 text-sm text-[var(--color-gallery-100)] focus:border-[var(--color-gold-500)] focus:outline-none">
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>

        <Field label="URL на корица">
          <Input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
        </Field>

        <Field label="Локация">
          <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
        </Field>

        <Field label="Художници">
          <div className="space-y-2 mt-1">
            {artists.map(a => (
              <label key={a.id} className="flex items-center gap-2 text-sm text-[var(--color-gallery-300)] cursor-pointer">
                <input type="checkbox" checked={form.artistIds.includes(a.id)} onChange={() => handleArtistToggle(a.id)} className="accent-[var(--color-gold-500)]" />
                {a.name}
              </label>
            ))}
          </div>
        </Field>

        <label className="flex items-center gap-2 text-sm text-[var(--color-gallery-300)] cursor-pointer">
          <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="accent-[var(--color-gold-500)]" />
          Избрана
        </label>

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="gold" disabled={saving}>
            {saving ? 'Запазване...' : 'Създай'}
          </Button>
          <Button type="button" variant="outline-light" onClick={() => navigate({ to: '/admin/exhibitions' })}>
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
