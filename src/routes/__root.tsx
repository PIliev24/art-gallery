import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { AuthProvider } from '@/contexts/auth';

export const Route = createRootRoute({
  component: RootComponent,
});

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const router = useRouterState();
  const isActive = router.location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
        isActive
          ? 'text-[var(--color-gold-500)]'
          : 'text-[var(--color-gallery-400)] hover:text-[var(--color-gallery-100)]'
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--color-gold-500)]" />
      )}
    </Link>
  );
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--color-gallery-950)]">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 h-20">
          <Link to="/" onClick={onClose} className="font-serif text-xl text-[var(--color-gallery-100)]">
            Савчеви
          </Link>
          <button onClick={onClose} className="text-[var(--color-gallery-400)] hover:text-[var(--color-gallery-100)] transition-colors">
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center px-6 gap-1">
          {[
            { to: '/', label: 'Начало' },
            { to: '/collection', label: 'Колекция' },
            { to: '/exhibitions', label: 'Изложби' },
            { to: '/events', label: 'Събития' },
            { to: '/about', label: 'За нас' },
            { to: '/contact', label: 'Контакт' },
          ].map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="group flex items-center justify-between py-4 border-b border-[var(--color-gallery-800)]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="font-serif text-3xl text-[var(--color-gallery-200)] group-hover:text-[var(--color-gold-400)] transition-colors duration-300">
                {item.label}
              </span>
              <ArrowUpRight size={20} className="text-[var(--color-gallery-600)] group-hover:text-[var(--color-gold-400)] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          ))}
        </nav>
        <div className="px-6 py-8 border-t border-[var(--color-gallery-800)]">
          <p className="text-xs text-[var(--color-gallery-600)] tracking-wide">
            ул. Дунавска 10, Оряхово &middot; gallery@savchevi.bg
          </p>
        </div>
      </div>
    </div>
  );
}

function RootComponent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouterState();
  const isAdmin = router.location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[var(--color-ivory)]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[var(--color-gallery-950)]/95 backdrop-blur-md border-b border-[var(--color-gallery-800)]/50">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex h-20 items-center justify-between">
              <Link to="/" className="group flex items-center gap-3">
                <span className="font-serif text-xl font-light tracking-wide text-[var(--color-gallery-100)]">
                  Галерия
                </span>
                <span className="h-4 w-px bg-[var(--color-gold-500)]/60" />
                <span className="font-serif text-xl font-medium text-[var(--color-gold-400)]">
                  Савчеви
                </span>
              </Link>

              <nav className="hidden lg:flex items-center gap-8">
                <NavLink to="/">Начало</NavLink>
                <NavLink to="/collection">Колекция</NavLink>
                <NavLink to="/exhibitions">Изложби</NavLink>
                <NavLink to="/events">Събития</NavLink>
                <NavLink to="/about">За нас</NavLink>
                <NavLink to="/contact">Контакт</NavLink>
              </nav>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden text-[var(--color-gallery-400)] hover:text-[var(--color-gallery-100)] transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </header>

        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        <main>
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="relative bg-[var(--color-gallery-950)] grain">
          <div className="gold-line-center" />
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-5">
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-serif text-2xl font-light text-[var(--color-gallery-200)]">
                    Галерия
                  </span>
                  <span className="h-5 w-px bg-[var(--color-gold-500)]/60" />
                  <span className="font-serif text-2xl font-medium text-[var(--color-gold-400)]">
                    Савчеви
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-gallery-500)] max-w-sm">
                  Трето десетилетие изкуство и култура в Оряхово. Пространство за среща
                  между традицията и съвременността.
                </p>
              </div>

              <div className="md:col-span-3">
                <h4 className="text-xs tracking-[0.2em] uppercase text-[var(--color-gallery-400)] mb-6">
                  Навигация
                </h4>
                <nav className="flex flex-col gap-3">
                  {[
                    { to: '/collection', label: 'Колекция' },
                    { to: '/exhibitions', label: 'Изложби' },
                    { to: '/events', label: 'Събития' },
                    { to: '/about', label: 'За нас' },
                    { to: '/contact', label: 'Контакт' },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="text-sm text-[var(--color-gallery-500)] hover:text-[var(--color-gold-400)] transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="md:col-span-4">
                <h4 className="text-xs tracking-[0.2em] uppercase text-[var(--color-gallery-400)] mb-6">
                  Контакт
                </h4>
                <div className="space-y-3 text-sm text-[var(--color-gallery-500)]">
                  <p>ул. Дунавска 10</p>
                  <p>3300 Оряхово, България</p>
                  <p className="pt-2">gallery@savchevi.bg</p>
                  <p>+359 123 456 789</p>
                  <p className="pt-2 text-[var(--color-gallery-600)]">
                    Вторник – Неделя: 10:00 – 18:00
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-[var(--color-gallery-800)]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-[var(--color-gallery-600)]">
                &copy; {new Date().getFullYear()} Галерия Савчеви. Всички права запазени.
              </p>
              <p className="text-xs text-[var(--color-gallery-700)]">
                Оряхово, България
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
