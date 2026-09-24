export default function Home() {
  const stats = [
    { label: 'Students supported', value: '2.4K+' },
    { label: 'Avg. time saved', value: '8 hrs/week' },
    { label: 'Success rate', value: '96%' },
  ];

  const features = [
    {
      title: 'Career tracking',
      text: 'Keep student goals, milestones, and growth plans organized in one clean dashboard.',
    },
    {
      title: 'Smart recommendations',
      text: 'Surface learning paths, electives, and next steps based on student interests and performance.',
    },
    {
      title: 'Team coordination',
      text: 'Give staff and advisors a shared place to review progress and support each learner.',
    },
  ];

  const steps = [
    'Create a profile for each student',
    'Review interests, strengths, and goals',
    'Track outcomes and next steps',
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-10 rounded-[28px] border border-slate-800 bg-slate-900/80 px-4 py-4 shadow-[0_18px_55px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15 text-sm font-bold text-indigo-200 ring-1 ring-inset ring-indigo-400/30">
                VCS
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Student Center</p>
                <h1 className="text-lg font-semibold text-white">Future-ready planning</h1>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <a href="#features" className="hover:text-white">Features</a>
              <a href="#process" className="hover:text-white">Process</a>
              <a href="#results" className="hover:text-white">Results</a>
            </nav>
          </div>
        </header>

        <section className="rounded-[32px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),transparent_35%),rgba(15,23,42,0.9)] p-6 shadow-[0_18px_55px_rgba(15,23,42,0.38)] sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-5 inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-indigo-200">
                Built for student growth
              </div>
              <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                A smarter way to support every student journey.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                Help students plan goals, track progress, and connect the right opportunities with a streamlined, professional dashboard built for real growth.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button className="rounded-full bg-indigo-500 px-5 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(99,102,241,0.45)] transition hover:bg-indigo-400">
                  Get started
                </button>
                <button className="rounded-full border border-slate-700 bg-slate-950/70 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white">
                  Explore platform
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-800 bg-slate-950/70 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.4)]">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Performance overview</p>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-200">Live</span>
              </div>

              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="results" className="mt-10 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{stat.label}</p>
              <p className="mt-3 text-4xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </section>

        <section id="features" className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Why it works</p>
              <h3 className="mt-2 text-3xl font-semibold text-white">Everything students and staff need in one place.</h3>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[26px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_10px_25px_rgba(15,23,42,0.25)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-lg text-indigo-200 ring-1 ring-inset ring-indigo-400/30">
                  •
                </div>
                <h4 className="text-xl font-semibold text-white">{feature.title}</h4>
                <p className="mt-3 text-sm leading-6 text-slate-300">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="process" className="mt-12 rounded-[30px] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.3)] sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">How it works</p>
          <h3 className="mt-2 text-3xl font-semibold text-white">A simple process that creates better outcomes.</h3>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-800 bg-slate-950/75 p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-semibold text-indigo-200 ring-1 ring-inset ring-indigo-400/30">
                  {index + 1}
                </div>
                <p className="text-base leading-7 text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
