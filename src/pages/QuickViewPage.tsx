import Navbar from '../components/layout/Navbar';
import { FileText, Linkedin, Calendar, ExternalLink } from 'lucide-react';

const skills = [
  'SQL', 'Python', 'dbt', 'BigQuery', 'PostgreSQL', 'Airflow',
  'MLflow', 'FastAPI', 'FastMCP',
  'Looker / Tableau', 'ETL/ELT Pipelines', 'Data Modeling',
  'scikit-learn', 'Google Cloud', 'Google Workspace', 'Git', 'DuckDB',
];

const pinned = [
  {
    title: 'Ecom Datalake Pipelines',
    outcome: 'Medallion architecture (Bronze→Silver→Gold) with 147 automated data quality tests and Airflow orchestration.',
    stack: 'dbt · DuckDB · BigQuery · Airflow',
    href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines',
  },
  {
    title: 'Analyst Toolkit',
    outcome: 'Config-driven Python/YAML ETL framework — standardized ingestion, validation, and transformation across projects.',
    stack: 'Python · YAML · ETL',
    href: 'https://github.com/G-Schumacher44/analyst_toolkit',
  },
  {
    title: 'ML Model Evaluation Suite',
    outcome: 'Repeatable evaluation harness for regression and classification models — diagnostics, benchmarks, and stakeholder-ready HTML reports.',
    stack: 'Python · scikit-learn · MLflow · Pydantic',
    href: 'https://github.com/G-Schumacher44/model_evaluation_suite',
  },
];

export default function QuickViewPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg text-text">
        <div className="mx-auto max-w-4xl px-4 pb-16 pt-20">

          {/* Header */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Quick View</p>
              <h1 className="mt-1 text-3xl font-bold text-text">Garrett Schumacher</h1>
              <p className="mt-1 text-base text-muted">Data Analyst · Analytics Engineer</p>
            </div>
            <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              Open to full-time · contract · freelance
            </span>
          </div>

          {/* Two-column snapshot */}
          <div className="mb-8 grid gap-6 md:grid-cols-[1fr_1.2fr]">

            {/* Skills */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Core Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-line bg-surface px-2.5 py-1 text-xs text-text"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Background</p>
              <p className="text-sm leading-relaxed text-muted">
                Started in operations — managed regional territories, directed teams, and made decisions
                that consistently needed better data behind them. Transitioned into analytics and engineering,
                building the pipelines and analysis systems I wished I'd had. Strong in SQL, Python, and
                the full data stack from ingestion to insight.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                I work well with non-technical stakeholders and write code that other engineers can
                actually read. Comfortable owning projects end-to-end or plugging into an existing team.
              </p>
            </div>
          </div>

          {/* Pinned Projects */}
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Pinned Projects</p>
            <div className="divide-y divide-line rounded-xl border border-line overflow-hidden">
              {pinned.map((p) => (
                <a
                  key={p.title}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-4 bg-card px-4 py-3.5 transition-colors hover:bg-surface group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text group-hover:text-brand transition-colors">{p.title}</span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{p.outcome}</p>
                    <p className="mt-1 text-[10px] font-mono text-brand/60">{p.stack}</p>
                  </div>
                  <ExternalLink size={14} className="mt-1 flex-shrink-0 text-muted/40 group-hover:text-brand transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* More work */}
          <div className="mb-8 flex flex-wrap gap-3 text-xs">
            <a href="/" className="text-brand hover:underline">Full portfolio →</a>
            <span className="text-line">|</span>
            <a href="/technical-showcase" className="text-brand hover:underline">Technical showcase →</a>
            <span className="text-line">|</span>
            <a
              href="https://github.com/G-Schumacher44"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              GitHub →
            </a>
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3 border-t border-line pt-6">
            <a
              href="/pdf/gschumacher_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <FileText size={13} />
              Resume (PDF)
            </a>
            <a
              href="https://linkedin.com/in/garrett-schumacher-243a5513a"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-xs font-semibold text-text transition-colors hover:border-brand/50 hover:text-brand"
            >
              <Linkedin size={13} />
              LinkedIn
            </a>
            <a
              href="https://calendar.app.google/49XfSdvBVQMz9Zni9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-xs font-semibold text-text transition-colors hover:border-brand/50 hover:text-brand"
            >
              <Calendar size={13} />
              Book a Call
            </a>
          </div>

        </div>
      </main>
    </>
  );
}
