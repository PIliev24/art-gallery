import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getGalleryInfo } from '@/data';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  loader: async () => {
    return { info: getGalleryInfo() };
  },
});

function ContactPage() {
  const { info } = Route.useLoaderData();

  const contactDetails = [
    {
      icon: MapPin,
      label: 'Адрес',
      lines: [info.address, `${info.postalCode} ${info.city}, ${info.country}`],
    },
    {
      icon: Phone,
      label: 'Телефон',
      lines: [info.phone],
    },
    {
      icon: Mail,
      label: 'Имейл',
      lines: [info.email],
    },
    {
      icon: Clock,
      label: 'Работно време',
      lines: [info.workingHours],
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[var(--color-gallery-950)] grain overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="animate-fade-up text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-4">
            Контакт
          </p>
          <h1 className="animate-fade-up delay-100 font-serif text-4xl md:text-6xl font-light text-[var(--color-gallery-100)] max-w-2xl leading-tight">
            Свържете се с нас
          </h1>
          <p className="animate-fade-up delay-200 mt-6 text-[var(--color-gallery-500)] max-w-lg">
            Имате въпрос за произведение, желаете да организирате посещение или
            искате да си партнираме? Очакваме ви.
          </p>
        </div>
        <div className="gold-line" />
      </section>

      {/* Content */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Form */}
            <div className="lg:col-span-7">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-8">
                Изпратете съобщение
              </p>

              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-500)] mb-3">
                      Име
                    </label>
                    <Input placeholder="Вашето име" required />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-500)] mb-3">
                      Имейл
                    </label>
                    <Input type="email" placeholder="email@example.com" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-500)] mb-3">
                    Тема
                  </label>
                  <Input placeholder="Относно..." />
                </div>

                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-500)] mb-3">
                    Съобщение
                  </label>
                  <textarea
                    className="w-full min-h-[160px] border-b border-[var(--color-gallery-300)] bg-transparent px-0 py-2 text-sm text-[var(--color-gallery-900)] placeholder:text-[var(--color-gallery-400)] focus:border-[var(--color-gold-500)] focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Вашето съобщение..."
                    required
                  />
                </div>

                <Button type="submit" variant="gold" size="lg">
                  Изпрати съобщение
                </Button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="lg:col-span-5">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-8">
                Информация
              </p>

              <div className="space-y-10">
                {contactDetails.map((detail) => (
                  <div key={detail.label} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-[var(--color-gallery-200)]">
                      <detail.icon size={16} className="text-[var(--color-gold-500)]" />
                    </div>
                    <div>
                      <h3 className="text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-500)] mb-2">
                        {detail.label}
                      </h3>
                      {detail.lines.map((line) => (
                        <p key={line} className="text-sm text-[var(--color-gallery-700)]">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-12 aspect-[4/3] bg-[var(--color-gallery-100)] flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={24} className="mx-auto text-[var(--color-gallery-300)] mb-3" />
                  <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-400)]">
                    {info.address}, {info.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
