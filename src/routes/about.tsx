import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[var(--color-gallery-950)] grain overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="animate-fade-up text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-4">
            За нас
          </p>
          <h1 className="animate-fade-up delay-100 font-serif text-4xl md:text-6xl font-light text-[var(--color-gallery-100)] max-w-3xl leading-tight">
            Три десетилетия изкуство и култура
          </h1>
        </div>
        <div className="gold-line" />
      </section>

      {/* Story */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-5">
              <div className="sticky top-28">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800"
                    alt="Интериор на галерията"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[var(--color-gold-500)]/30" />
                  <span className="text-xs tracking-[0.2em] uppercase text-[var(--color-gallery-400)]">
                    от 1994
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="max-w-lg">
                <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-8">
                  Нашата история
                </p>

                <div className="space-y-8">
                  <p className="text-lg text-[var(--color-gallery-700)] leading-relaxed font-light">
                    Галерия Савчеви се намира в китния крайдунавски град Оряхово.
                    Там вече трето десетилетие се развива културата под патронажа
                    на Нейчо Савчев — меценат, просветител и неуморен двигател на
                    изкуствата в региона.
                  </p>

                  <p className="text-[var(--color-gallery-600)] leading-relaxed">
                    Дядо Нейчо е отговорен за развитието на културното наследство
                    както на града, така и на целия северозападен регион и на
                    национално ниво. Благодарение на неговата всеотдайност,
                    Оряхово се превърна в място, където изкуството живее и диша.
                  </p>

                  <p className="text-[var(--color-gallery-600)] leading-relaxed">
                    През годините галерията е домакин на стотици изложби,
                    творчески работилници и културни събития. Тук се събират
                    художници от цяла България, за да споделят своето изкуство и
                    вдъхновение.
                  </p>
                </div>

                <div className="mt-16 h-px bg-[var(--color-gallery-200)]" />

                <div className="mt-16">
                  <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-8">
                    Нашата мисия
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl font-light text-[var(--color-gallery-900)] leading-tight mb-8">
                    Да съхраняваме и популяризираме българското изкуство
                  </h2>
                  <p className="text-[var(--color-gallery-600)] leading-relaxed">
                    Да подкрепяме талантливи художници и да създаваме пространство
                    за културен диалог. Да бъдем мост между поколенията — между
                    майсторите на миналото и творците на бъдещето.
                  </p>
                </div>

                <div className="mt-16 h-px bg-[var(--color-gallery-200)]" />

                {/* Stats */}
                <div className="mt-16 grid grid-cols-3 gap-8">
                  {[
                    { number: '30+', label: 'години' },
                    { number: '200+', label: 'изложби' },
                    { number: '50+', label: 'художници' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <span className="block font-serif text-3xl md:text-4xl font-light text-[var(--color-gold-500)]">
                        {stat.number}
                      </span>
                      <span className="text-xs tracking-[0.15em] uppercase text-[var(--color-gallery-500)] mt-1 block">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[var(--color-gallery-950)] grain py-24 md:py-32">
        <div className="gold-line-center" />
        <div className="mx-auto max-w-7xl px-6 pt-8">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)] mb-4">
              Ценности
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[var(--color-gallery-100)]">
              Какво ни води
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-gallery-800)]/30">
            {[
              {
                title: 'Традиция',
                description:
                  'Пазим и предаваме културното наследство на региона. Всяко произведение разказва история, която заслужава да бъде чута.',
              },
              {
                title: 'Съвременност',
                description:
                  'Отворени сме за нови идеи, форми и технологии в изкуството. Насърчаваме експериментирането и свободното творчество.',
              },
              {
                title: 'Общност',
                description:
                  'Галерията е повече от пространство — тя е общност от хора, обединени от любовта към красотата и изкуството.',
              },
            ].map((value, i) => (
              <div
                key={value.title}
                className="bg-[var(--color-gallery-950)] p-10 md:p-12"
              >
                <span className="text-xs text-[var(--color-gold-500)]/60 font-serif">
                  0{i + 1}
                </span>
                <h3 className="font-serif text-xl text-[var(--color-gallery-200)] mt-4 mb-4">
                  {value.title}
                </h3>
                <p className="text-sm text-[var(--color-gallery-500)] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
