import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useAuth } from '@/contexts/auth';
import { Image, CalendarDays, Calendar, LogOut } from 'lucide-react';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

const navItems = [
  { to: '/admin/artworks', label: 'Произведения', icon: Image },
  { to: '/admin/exhibitions', label: 'Изложби', icon: CalendarDays },
  { to: '/admin/events', label: 'Събития', icon: Calendar },
];

function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const router = useRouterState();
  const isLoginPage = router.location.pathname === '/admin/login';

  // Show login page without sidebar
  if (isLoginPage) {
    return <Outlet />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-gallery-950)] flex items-center justify-center">
        <p className="text-[var(--color-gallery-400)]">Зареждане...</p>
      </div>
    );
  }

  // Not authenticated — redirect to login
  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-gallery-950)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--color-gallery-400)] mb-4">Необходима е автентикация</p>
          <Link to="/admin/login" className="text-[var(--color-gold-500)] hover:text-[var(--color-gold-400)] text-sm">
            Към входа
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-gallery-900)] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[var(--color-gallery-950)] border-r border-[var(--color-gallery-800)] flex flex-col">
        <div className="p-5 border-b border-[var(--color-gallery-800)]">
          <Link to="/" className="font-serif text-lg text-[var(--color-gold-400)]">
            Савчеви
          </Link>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gallery-600)] mt-1">
            Администрация
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = router.location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-[var(--color-gallery-800)] text-[var(--color-gold-400)]'
                    : 'text-[var(--color-gallery-400)] hover:text-[var(--color-gallery-200)] hover:bg-[var(--color-gallery-800)]/50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--color-gallery-800)]">
          <div className="px-3 py-2 text-xs text-[var(--color-gallery-500)] mb-2">
            {user.username}
          </div>
          <button
            onClick={() => logout().then(() => window.location.href = '/admin/login')}
            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[var(--color-gallery-500)] hover:text-red-400 hover:bg-[var(--color-gallery-800)]/50 w-full transition-colors"
          >
            <LogOut size={16} />
            Изход
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
