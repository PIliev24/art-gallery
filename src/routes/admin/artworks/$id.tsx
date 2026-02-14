import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArtCategory } from '@/types/enums';

interface ArtistOption {
  id: string;
  name: string;
}

interface ArtworkDetail {
  id: string;
  title: string;
  artistId: string;
  category: string;
  medium: string;
  dimensions: { width: number; height: number; depth?: number; unit: string };
  year: number;
  imageUrl: string;
  description: string | null;
  isFeatured: boolean;
  isAvailable: boolean;
}

const categoryOptions = [
  { value: ArtCategory.PAINTINGS, label: 'Живопис' },
  { value: ArtCategory.MODERN_ART, label: 'Модерно изкуство' },
  { value: ArtCategory.SCULPTURE, label: 'Скулптура' },
  { value: ArtCategory.PHOTOGRAPHY, label: 'Фотография' },
  { value: ArtCategory.GRAPHICS, label: 'Графика' },
  { value: ArtCategory.OTHER, label: 'Друго' },
];

export const Route = createFileRoute('/admin/artworks/$id')({
  component: AdminArtworkEdit,
  loader: async ({ params }) => {
    const [artwork, artists] = await Promise.all([
      api<ArtworkDetail>(`/artworks/${params.id}`),
      api<ArtistOption[]>('/artists'),
    ]);
    return { artwork, artists };
  },
});

function AdminArtworkEdit() {
  const { artwork, artists } = Route.useLoaderData();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: artwork.title,
    artistId: artwork.artistId,
    category: artwork.category,
    medium: artwork.medium,
    width: String(artwork.dimensions.width),
    height: String(artwork.dimensions.height),
    depth: artwork.dimensions.depth ? String(artwork.dimensions.depth) : '',
    unit: artwork.dimensions.unit,
    year: String(artwork.year),
    imageUrl: artwork.imageUrl,
    description: artwork.description || '',
    isFeatured: artwork.isFeatured,
    isAvailable: artwork.isAvailable,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api(`/artworks/${artwork.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: form.title,
          artistId: form.artistId,
          category: form.category,
          medium: form.medium,
          dimensions: {
            width: Number(form.width),
            height: Number(form.height),
            ...(form.depth ? { depth: Number(form.depth) } : {}),
            unit: form.unit,
          },
          year: Number(form.year),
          imageUrl: form.imageUrl,
          description: form.description || undefined,
          isFeatured: form.isFeatured,
          isAvailable: form.isAvailable,
        }),
      });
      navigate({ to: '/admin/artworks' });
    } catch (err) {
      alert('Грешка при запис');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--color-gallery-100)] mb-8">Редактиране на произведение</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Field label="Заглавие">
          <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
        </Field>

        <Field label="Художник">
          <select value={form.artistId} onChange={e => setForm({ ...form, artistId: e.target.value })} className="w-full bg-transparent border-b border-[var(--color-gallery-700)] py-2 text-sm text-[var(--color-gallery-100)] focus:border-[var(--color-gold-500)] focus:outline-none">
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>

        <Field label="Категория">
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-transparent border-b border-[var(--color-gallery-700)] py-2 text-sm text-[var(--color-gallery-100)] focus:border-[var(--color-gold-500)] focus:outline-none">
            {categoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>

        <Field label="Техника">
          <Input value={form.medium} onChange={e => setForm({ ...form, medium: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
        </Field>

        <div className="grid grid-cols-4 gap-4">
          <Field label="Ширина">
            <Input type="number" value={form.width} onChange={e => setForm({ ...form, width: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
          </Field>
          <Field label="Височина">
            <Input type="number" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
          </Field>
          <Field label="Дълбочина">
            <Input type="number" value={form.depth} onChange={e => setForm({ ...form, depth: e.target.value })} className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
          </Field>
          <Field label="Мерна ед.">
            <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-full bg-transparent border-b border-[var(--color-gallery-700)] py-2 text-sm text-[var(--color-gallery-100)] focus:border-[var(--color-gold-500)] focus:outline-none">
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="mm">mm</option>
            </select>
          </Field>
        </div>

        <Field label="Година">
          <Input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
        </Field>

        <Field label="URL на изображение">
          <Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} required className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]" />
        </Field>

        <Field label="Описание">
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full min-h-[100px] border-b border-[var(--color-gallery-700)] bg-transparent py-2 text-sm text-[var(--color-gallery-100)] focus:border-[var(--color-gold-500)] focus:outline-none resize-none"
          />
        </Field>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-[var(--color-gallery-300)] cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="accent-[var(--color-gold-500)]" />
            Избрано
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--color-gallery-300)] cursor-pointer">
            <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} className="accent-[var(--color-gold-500)]" />
            Налично
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="gold" disabled={saving}>
            {saving ? 'Запазване...' : 'Запази'}
          </Button>
          <Button type="button" variant="outline-light" onClick={() => navigate({ to: '/admin/artworks' })}>
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
