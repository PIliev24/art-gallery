import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth, ApiError } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate({ to: '/admin/artworks' });
    } catch (err) {
      if (err instanceof ApiError) {
        setError('Невалидно потребителско име или парола');
      } else {
        setError('Грешка при свързване със сървъра');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-gallery-950)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-[var(--color-gallery-100)] mb-2">
            Администрация
          </h1>
          <p className="text-sm text-[var(--color-gallery-500)]">
            Галерия Савчеви
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] mb-2">
              Потребител
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)] mb-2">
              Парола
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-[var(--color-gallery-100)] border-[var(--color-gallery-700)]"
            />
          </div>

          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? 'Влизане...' : 'Вход'}
          </Button>
        </form>
      </div>
    </div>
  );
}
