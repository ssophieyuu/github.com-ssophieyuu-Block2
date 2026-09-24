'use client';

import { useEffect, useMemo, useState } from 'react';

const categoryOrder = [
  'Marketing',
  'Finance',
  'Entrepreneurship',
  'Business Management',
  'Hospitality',
  'Personal Finance',
  'Undecided',
];

const confidenceColors = {
  high: 'bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30',
  medium: 'bg-amber-500/15 text-amber-200 ring-1 ring-inset ring-amber-400/30',
  low: 'bg-rose-500/15 text-rose-200 ring-1 ring-inset ring-rose-400/30',
};

export default function Home() {
  const [report, setReport] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await fetch('/api/deca');
        const data = await res.json();
        setReport(data);
      } catch (error) {
        console.error('Failed to load DECA report', error);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  const filteredCandidates = useMemo(() => {
    if (!report?.candidates) return [];

    if (activeCategory === 'All') return report.candidates;
    return report.candidates.filter(
      (candidate) => candidate.routingFolder === activeCategory || candidate.category === activeCategory
    );
  }, [activeCategory, report]);

  const totals = report?.summary ?? {
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    undecided: 0,
  };

  const categoryBreakdown = report?.categoryBreakdown ?? [];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[28px] border border-slate-800 bg-slate-900/80 px-4 py-4 shadow-[0_18px_55px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15 text-sm font-bold text-indigo-200 ring-1 ring-inset ring-indigo-400/30">
                DECA
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">VCS</p>
                <h1 className="text-xl font-semibold text-white">Category Report</h1>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
              {['All', ...categoryOrder].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveCategory(item)}
                  className={`rounded-full px-3 py-1.5 transition ${
                    activeCategory === item
                      ? 'bg-indigo-500 text-white shadow-[0_10px_25px_rgba(99,102,241,0.45)]'
                      : 'border border-slate-700 bg-slate-950/70 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <section className="grid gap-6 pb-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.35)] sm:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              Live classification engine
            </div>

            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              DECA business category review for every applicant.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              High-confidence matches are routed directly to the category folder. Medium and low confidence matches are copied to the audit queue in Undecided for human review.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Strict routing</p>
                <p className="mt-2 text-lg font-semibold text-white">High-confidence</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Audit path</p>
                <p className="mt-2 text-lg font-semibold text-white">Medium / Low</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Review folder</p>
                <p className="mt-2 text-lg font-semibold text-white">Undecided</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Review summary</p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
                <p className="text-sm text-slate-400">Total applicants</p>
                <p className="mt-2 text-3xl font-semibold text-white">{totals.total}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
                  <p className="text-sm text-slate-400">High confidence</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-300">{totals.high}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4">
                  <p className="text-sm text-slate-400">Audit needed</p>
                  <p className="mt-2 text-2xl font-semibold text-amber-300">{totals.medium + totals.low}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categoryBreakdown.map(({ category, count }) => (
            <div key={category} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_10px_25px_rgba(15,23,42,0.25)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{category}</p>
                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-200">{count}</span>
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{count}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.35)] sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Candidate list</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {activeCategory === 'All' ? 'All applicant classifications' : `${activeCategory} review queue`}
              </h3>
            </div>
            <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-300">
              {filteredCandidates.length} records
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-8 text-center text-slate-300">
                Loading DECA category report...
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-8 text-center text-slate-300">
                No candidates match this filter.
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <article
                  key={`${candidate.name}-${candidate.fileName}`}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 transition hover:border-slate-600 hover:bg-slate-950"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-semibold text-white">{candidate.name}</h4>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${confidenceColors[candidate.confidence] || confidenceColors.low}`}>
                          {candidate.confidence}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                        <span>{candidate.grade}</span>
                        <span>•</span>
                        <span>{candidate.fileName}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                      <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1">
                        {candidate.category || candidate.routingFolder}
                      </span>
                      <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1">
                        {candidate.routingFolder}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Applicant summary</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{candidate.summary}</p>
                    <div className="mt-4 border-t border-slate-800 pt-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Classification rationale</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{candidate.reason}</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
