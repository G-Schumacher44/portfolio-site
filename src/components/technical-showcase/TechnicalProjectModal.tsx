import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import type { TechnicalProject } from '../../data/technicalProjects';
import DocumentViewer from '../shared/DocumentViewer';
import { trackFridaiDeckOpen, trackGenerateLead } from '../../utils/analytics';

type DocLink = { label: string; href: string };
const DOC_EXTENSIONS = ['.md', '.py', '.txt', '.csv'];
const DOC_LINK_CLASS =
  'rounded-full border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-1 text-[10px] uppercase tracking-widest text-[#2b2a27]';

function isDocAsset(href: string) {
  const lower = href.toLowerCase();
  return href.startsWith('/files/') && DOC_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function renderDocLink(link: DocLink, onDocOpen: (link: DocLink) => void) {
  if (isDocAsset(link.href)) {
    return (
      <button key={link.label} onClick={() => onDocOpen(link)} className={DOC_LINK_CLASS}>
        {link.label}
      </button>
    );
  }

  return (
    <a
      key={link.label}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={DOC_LINK_CLASS}
    >
      {link.label}
    </a>
  );
}

export default function TechnicalProjectModal({
  project,
  onClose,
}: {
  project: TechnicalProject | null;
  onClose: () => void;
}) {
  const [activePlot, setActivePlot] = useState<{ src: string; alt: string } | null>(null);
  const [storyboardOpen, setStoryboardOpen] = useState(false);
  const [deckOpen, setDeckOpen] = useState(false);
  const [companionOpen, setCompanionOpen] = useState<
    'starter' | 'deploy' | 'datalake-exten' | 'datalake-pipelines' | 'backfill-bear' | 'ecom-generator' | null
  >(null);
  const [docOpen, setDocOpen] = useState<DocLink | null>(null);
  const slug = project?.slug ?? '';
  const isSpotlight = slug === 'fridai-core';
  const isAnalystToolkit = slug === 'analyst-toolkit';
  const isModelEval = slug === 'regression-model-eval';
  const isDatalakes = slug === 'ecommerce-datalakes';
  const isDirtyBirds = slug === 'dirty-birds-generator';
  const analystToolkitPanels = [
    {
      src: '/img/tech_showcase/analyst_toolkit/jupyter_panel_01.png',
      alt: 'Jupyter notebook panel 01 — config and raw data ingestion',
      label: 'Stage 1 — Load & Configure',
      annotation: 'The toolkit reads a YAML config to wire up source paths, column mappings, and pipeline flags. Raw data is ingested and a quick schema snapshot is emitted before any transforms run — so you always know what came in.',
    },
    {
      src: '/img/tech_showcase/analyst_toolkit/jupyter_panel_02.png',
      alt: 'Jupyter notebook panel 02 — diagnostics and profiling',
      label: 'Stage 2 — Diagnose & Profile',
      annotation: 'Every configured check runs in sequence: missingness rates, correlation structure, duplicate fingerprinting, and outlier flagging. Each stage logs its findings and flags columns that need attention before the data moves forward.',
    },
    {
      src: '/img/tech_showcase/analyst_toolkit/jupyter_panel_03.png',
      alt: 'Jupyter notebook panel 03 — clean exports and outputs',
      label: 'Stage 3 — Clean & Export',
      annotation: 'Imputation strategies are applied, edge cases are resolved, and the clean dataset is written to a timestamped CSV. A rendered HTML report is generated alongside it — ready to hand off to a stakeholder or feed into the next pipeline stage.',
    },
  ];
  const analystToolkitArtifacts = [
    {
      src: '/img/tech_showcase/analyst_toolkit/missingness_summary.png',
      alt: 'Missingness summary chart',
    },
    {
      src: '/img/tech_showcase/analyst_toolkit/correlation_heatmap.png',
      alt: 'Correlation heatmap',
    },
    {
      src: '/img/tech_showcase/analyst_toolkit/outliers_body_mass_violin.png',
      alt: 'Outlier violin plot',
    },
    {
      src: '/img/tech_showcase/analyst_toolkit/imputation_body_mass_comp.png',
      alt: 'Imputation comparison plot',
    },
  ];
  const modelEvalPanels = [
    {
      src: '/img/tech_showcase/model_eval/story_panel_01.png',
      alt: 'Model evaluation dashboard overview',
      label: 'Stage 1 — Evaluation Dashboard',
      annotation: 'The suite opens with a full evaluation dashboard — metrics adapt to the model type. Regressors surface R², RMSE, and MAE; classifiers surface accuracy, precision, recall, F1, and AUC-ROC. Config-driven runs mean every model gets the same diagnostic pass — no manual checks, no skipped steps.',
    },
    {
      src: '/img/tech_showcase/model_eval/story_panel_03.png',
      alt: 'Plot viewer and diagnostics',
      label: 'Stage 2 — Plot Viewer & Diagnostics',
      annotation: 'SHAP beeswarm, permutation importance, outlier boxplots, and correlation matrices are rendered and saved. Each plot is interactive and exportable — giving engineers the full diagnostic picture before any model advances.',
    },
    {
      src: '/img/tech_showcase/model_eval/story_panel_02.png',
      alt: 'Champion model validation output',
      label: 'Stage 3 — Champion Model Validation',
      annotation: "The final stage surfaces the champion model's validation output: CV scores, bias diagnostics, and stability checks all logged in one view. This is the pass/fail gate — what ships is what passed here.",
    },
  ];
  const modelEvalArtifacts = [
    {
      src: '/img/tech_showcase/model_eval/plot_correlation_matrix.png',
      alt: 'Correlation matrix diagnostic',
    },
    {
      src: '/img/tech_showcase/model_eval/plot_outlier_boxplots.png',
      alt: 'Outlier boxplots',
    },
    {
      src: '/img/tech_showcase/model_eval/plot_learning_curve.png',
      alt: 'Learning curve evaluation',
    },
    {
      src: '/img/tech_showcase/model_eval/plot_shap_beeswarm.png',
      alt: 'SHAP beeswarm feature impact',
    },
    {
      src: '/img/tech_showcase/model_eval/plot_permutation_importance.png',
      alt: 'Permutation importance ranking',
    },
  ];
  const storyboardPanels = isAnalystToolkit
    ? analystToolkitPanels
    : isModelEval
      ? modelEvalPanels
      : [];
  const plotArtifacts = isAnalystToolkit
    ? analystToolkitArtifacts
    : isModelEval
      ? modelEvalArtifacts
      : [];
  const hasStoryboard = storyboardPanels.length > 0;
  const hasArtifacts = plotArtifacts.length > 0;
  const storyboardTitle = isModelEval ? 'Evaluation Storyboard' : 'Notebook Walkthrough';
  const storyboardDescription = isModelEval
    ? 'Click to open the evaluation storyboard and dashboards.'
    : 'Three panels — click any to expand, or open the full sequence.';
  const storyboardModalTitle = isModelEval ? 'Model Eval Storyboard' : 'Analyst Toolkit — Notebook Walkthrough';
  const storyboardModalSubtitle = isModelEval
    ? 'Dashboards and evaluation checkpoints.'
    : 'From raw data to clean exports — a stage-by-stage look at the toolkit in action.';
  const storyboardModalFooter = isModelEval
    ? 'Diagnostics, validation dashboards, and plot viewer snapshots.'
    : 'Panels show the toolkit running against a real dataset: missingness flagging, correlation analysis, duplication checks, outlier detection, and imputation — each stage config-driven and repeatable.';
  const artifactDescription = isModelEval
    ? 'Diagnostics, feature importance, and performance curves — click any plot to zoom.'
    : 'Diagnostics, outliers, duplicates, and imputation — click any plot to zoom.';
  const companionDetails = {
    starter: {
      title: 'Starter Kit',
      subtitle: 'Pre-bundled Toolkit modules + configs',
      image: '/img/projects/comic_analyst_starterkit_large.png',
      comicStrip: {
        src: '/img/tech_showcase/comic_strips/analyst_toolkit/starter_kit_strip.png',
        alt: 'Starter kit comic strip',
        label: 'Starter Kit',
      },
      description:
        'A pre-packaged, deployable bundle of the Analyst Toolkit with configs and sample data for instant setup.',
      tools: ['Python', 'YAML', 'CLI'],
      artifacts: ['Deployable .zip package', 'Starter configs', 'Sample data'],
      links: [
        {
          label: 'Repository',
          href: 'https://github.com/G-Schumacher44/analyst_toolkit_starter_kit',
        },
      ],
    },
    deploy: {
      title: 'Deployment Utility',
      subtitle: 'Toolkit pipelines shipped to prod',
      image: '/img/projects/comic_analyst_deploy_large.png',
      comicStrip: {
        src: '/img/tech_showcase/comic_strips/analyst_toolkit/deploy_2.png',
        alt: 'Deployment utility comic strip',
        label: 'Deployment Utility',
      },
      description:
        'A lightweight companion that packages Toolkit pipelines for quick deployment, moving workflows from dev to production.',
      tools: ['Python', 'YAML'],
      artifacts: ['Ready-to-run builds', 'Config management', 'Packaging utilities'],
      links: [
        {
          label: 'Repository',
          href: 'https://github.com/G-Schumacher44/analyst_toolkit_deployment_utility',
        },
      ],
    },
    'datalake-exten': {
      title: 'Datalake Extension',
      subtitle: 'Generator wrapper — partitioning, Parquet, manifests',
      image: '/img/projects/comic_datalakes.png',
      callout: 'Raw CSV doesn\'t belong in a lakehouse. This layer makes sure it never gets there.',
      comicStrip: {
        src: '/img/tech_showcase/comic_strips/datalakes/bronze_hydration.png',
        alt: 'Bronze hydration comic strip',
        label: 'Bronze Hydration',
      },
      description:
        'Wraps the ecom generator and adds everything needed to land a real Bronze layer: Hive-style date partitioning, Parquet conversion, Hadoop-style per-batch manifests, and GCS upload hooks. Backlog Bear lives here as a configurable multi-date hydration workflow.',
      tools: ['Python', 'Parquet', 'GCS', 'YAML', 'CLI'],
      artifacts: ['Partitioned Parquet exports', 'Per-batch lineage manifests', 'GCS upload hooks', 'Backfill playbooks'],
      links: [
        { label: 'Repository', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten' },
        { label: 'Config Guide', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/datalakes_extention/CONFIG_GUIDE.md' },
        { label: 'CLI Reference', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/datalakes_extention/CLI_REFERENCE.md' },
        { label: 'Testing Guide', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/datalakes_extention/TESTING_GUIDE.md' },
        { label: 'Backlog Bear', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/datalakes_extention/workflows/BACKLOG_BEAR.md' },
        { label: 'Generator Overview', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/ecom_generator/README.md' },
        { label: 'Schema Reference', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/ecom_generator/database_schema_reference.md' },
      ],
    },
    'datalake-pipelines': {
      title: 'Datalake Pipelines',
      subtitle: 'Bronze → Silver → Gold — dbt, DuckDB, Polars, BigQuery, Airflow',
      image: '/img/projects/comic_pipelines.png',
      callout: 'Bronze lands clean. Silver validates and enriches. Gold aggregates for the mart. Airflow keeps it all moving.',
      comicStrip: {
        src: '/img/tech_showcase/comic_strips/datalakes/silver_gold.png',
        alt: 'Silver to gold comic strip',
        label: 'Silver → Gold',
      },
      images: [
        { src: '/files/pipeline_project/airflow_ui_01.png', alt: 'Airflow DAG overview', label: 'DAG Overview' },
        { src: '/files/pipeline_project/airflow_ui_02.png', alt: 'Airflow task detail', label: 'Task Detail' },
      ],
      description:
        'Full-stack ingest, transform, and load pipeline spanning two dbt projects and a Polars → BigQuery Gold layer. dbt + DuckDB handle Silver transforms with schema contracts and quality gates; Polars + BigQuery aggregate for Gold marts; Airflow DAGs orchestrate the full run end-to-end. Three-layer validation framework (Bronze profiling, Silver enrichment checks, Gold SLA thresholds) throughout.',
      tools: ['dbt', 'DuckDB', 'BigQuery', 'Polars', 'Airflow', 'Python'],
      artifacts: ['dbt Silver models + tests', 'BigQuery Gold aggregations', 'Airflow DAGs', 'Bronze profile reports', 'Silver quality reports', 'Observability dashboards'],
      links: [
        { label: 'Repository', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines' },
        { label: 'Architecture', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/ARCHITECTURE.md' },
        { label: 'Spec Overview', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/SPEC_OVERVIEW.md' },
        { label: 'Runbook', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/RUNBOOK.md' },
        { label: 'SLA & Quality', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/SLA_AND_QUALITY.md' },
        { label: 'Observability', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/OBSERVABILITY_STRATEGY.md' },
        { label: 'Transformation Summary', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/TRANSFORMATION_SUMMARY.md' },
        { label: 'Validation Guide', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/VALIDATION_GUIDE.md' },
      ],
    },
    'backfill-bear': {
      title: 'Backlog Bear',
      subtitle: 'Configurable historical hydration workflow',
      image: '/img/projects/comic_backlog_bear.png',
      callout: 'You can\'t build a 5-year trend report on 3 days of data. Backlog Bear fixes that.',
      comicStrip: {
        src: '/img/tech_showcase/comic_strips/datalakes/backlog_bear_origins.png',
        alt: 'Backlog Bear origins comic strip',
        label: 'Backlog Bear Origins',
      },
      description:
        'A workflow inside the Datalake Extension for running configurable multi-date historical backfills. Specify a date range, and Backlog Bear generates Bronze data for each partition, locks in consistent Hive-style paths, and produces a per-batch Hadoop-style manifest — making historical hydration repeatable and auditable.',
      tools: ['CLI', 'YAML', 'Parquet', 'Python'],
      artifacts: ['Multi-date partitioned Parquet', 'Per-batch manifests', 'Hydration logs'],
      links: [
        { label: 'Backfill Playbook', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/datalakes_extention/workflows/BACKLOG_BEAR.md' },
        { label: 'Extension CLI', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/datalakes_extention/CLI_REFERENCE.md' },
        { label: 'Config Guide', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/datalakes_extention/CONFIG_GUIDE.md' },
        { label: 'Schema Reference', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/ecom_generator/database_schema_reference.md' },
      ],
    },
    'ecom-generator': {
      title: 'Ecom Sales Generator',
      subtitle: 'Synthetic relational ecommerce data — the lakehouse data source',
      image: '/img/projects/ecom_generator.png',
      callout: 'Every table in this lakehouse started here — configurable, relational, and realistic enough to actually stress-test a pipeline.',
      comicStrip: {
        src: '/img/tech_showcase/comic_strips/datalakes/datalakes_origin.png',
        alt: 'Datalakes origin comic strip',
        label: 'Datalakes Origin',
      },
      description:
        'Generates synthetic relational ecommerce databases — customers, orders, products, carts, returns — with configurable volume, faker-driven realism, messiness tiers, and a built-in QA framework that validates referential integrity automatically. The upstream data source for the entire lakehouse stack.',
      tools: ['Python', 'Pandas', 'YAML', 'CLI', 'Faker', 'Pytest'],
      artifacts: ['CSV exports per table', 'SQL loader scripts', 'QA validation reports', 'Referential integrity checks'],
      links: [
        { label: 'Repository', href: 'https://github.com/G-Schumacher44/ecom_sales_data_generator' },
        { label: 'Config Guide', href: 'https://github.com/G-Schumacher44/ecom_sales_data_generator/blob/main/CONFIG_GUIDE.md' },
        { label: 'Schema Reference', href: 'https://github.com/G-Schumacher44/ecom_sales_data_generator/blob/main/database_schema_reference.md' },
        { label: 'Testing Guide', href: 'https://github.com/G-Schumacher44/ecom_sales_data_generator/blob/main/TESTING_GUIDE.md' },
      ],
    },
  };

  const companionContent = companionOpen ? companionDetails[companionOpen] : null;
  const projectComicStrips = project?.comicStrips ?? (project?.comicStrip ? [project.comicStrip] : []);
  const isAnyNestedModalOpen = Boolean(activePlot || storyboardOpen || deckOpen || companionOpen || docOpen);

  const handleCloseAll = () => {
    setActivePlot(null);
    setStoryboardOpen(false);
    setDeckOpen(false);
    setCompanionOpen(null);
    setDocOpen(null);
    onClose();
  };

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (docOpen) {
        setDocOpen(null);
        return;
      }
      if (activePlot) {
        setActivePlot(null);
        return;
      }
      if (deckOpen) {
        setDeckOpen(false);
        return;
      }
      if (storyboardOpen) {
        setStoryboardOpen(false);
        return;
      }
      if (companionOpen) {
        setCompanionOpen(null);
        return;
      }
      setActivePlot(null);
      setStoryboardOpen(false);
      setDeckOpen(false);
      setCompanionOpen(null);
      setDocOpen(null);
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [project, docOpen, activePlot, deckOpen, storyboardOpen, companionOpen, onClose]);

  useEffect(() => {
    if (!project) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [project, isAnyNestedModalOpen]);

  if (!project) return null;

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {project && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/50"
                onClick={handleCloseAll}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.div
                className="relative h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl border-[3px] border-[#2b2a27] bg-[#fffef7] shadow-[10px_10px_0_#2b2a27]"
                initial={{ opacity: 0, y: 220, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 220, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                role="dialog"
                aria-modal="true"
                aria-label={`${project.title} technical panel`}
              >
                <div className="flex items-center justify-between border-b-[3px] border-[#2b2a27] bg-[#fff3d6] px-6 py-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-[11px] uppercase tracking-[0.4em] text-[#2b2a27]">
                        Technical Panel
                      </div>
                      {isSpotlight && (
                        <span className="rounded-full border-2 border-[#2b2a27] bg-[#2b2a27] px-2 py-0.5 text-[9px] uppercase tracking-widest text-[#fff7e6]">
                          Dev Preview · Mar 2026
                        </span>
                      )}
                    </div>
                    <h2
                      className="mt-1 text-2xl font-black text-[#2b2a27]"
                      style={{ textShadow: '1px 1px 0 #000' }}
                    >
                      {project.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#2b2a27]">{project.subtitle}</p>
                  </div>
                  <button
                    onClick={handleCloseAll}
                    className="rounded-full border-2 border-[#2b2a27] bg-white p-2"
                    aria-label="Close panel"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="h-[calc(92vh-72px)] overflow-y-auto p-6">
                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                      <div className="mt-2 rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-4">
                        <img
                          src={project.image}
                          alt={project.imageAlt}
                          className="h-80 w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      {project.relatedImages && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {project.relatedImages.map((img) => (
                            <img
                              key={img.src}
                              src={img.src}
                              alt={img.alt}
                              className="w-full rounded-2xl border-[3px] border-[#2b2a27] object-cover"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      )}
                      {projectComicStrips.length > 0 && (
                        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                          <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                            Comic Strip
                          </div>
                          <p className="mt-1 text-xs text-[#2b2a27]">
                            Click any panel to expand.
                          </p>
                          <div
                            className={`mt-3 grid gap-3 ${
                              projectComicStrips.length > 1 ? 'sm:grid-cols-3' : ''
                            }`}
                          >
                            {projectComicStrips.map((strip) => (
                              <button
                                key={strip.src}
                                onClick={() =>
                                  setActivePlot({
                                    src: strip.src,
                                    alt: strip.alt,
                                  })
                                }
                                className="rounded-xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-2 text-left"
                              >
                                {strip.label && (
                                  <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#2b2a27]">
                                    {strip.label}
                                  </div>
                                )}
                                <img
                                  src={strip.src}
                                  alt={strip.alt}
                                  className="h-32 w-full object-contain"
                                  loading="lazy"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {isSpotlight && (
                        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                          <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">Project Overview</div>
                          <p className="mt-1 text-xs text-[#2b2a27]">
                            Slide deck — architecture, design decisions, and roadmap.
                          </p>
                          <button
                            onClick={() => {
                              trackFridaiDeckOpen('technical_showcase_modal');
                              setDeckOpen(true);
                            }}
                            className="mt-3 rounded-xl border-[3px] border-[#2b2a27] bg-[#fff7e6] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#2b2a27] transition-colors hover:bg-[#2b2a27] hover:text-[#fff7e6]"
                          >
                            Open Deck →
                          </button>
                        </div>
                      )}
                      {isDatalakes && (
                        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                          <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                            Included Modules
                          </div>
                          <div className="mt-3 space-y-3">
                            {[
                              { name: 'Ecom Generator', tag: 'Data source', desc: 'Synthetic relational ecommerce data — customers, orders, products, returns — with configurable volume, messiness tiers, and built-in QA.' },
                              { name: 'Datalake Extension', tag: 'Bronze + hydration', desc: 'Wraps the generator with Hive-style partitioning, Parquet conversion, and Hadoop-style manifests to land a clean, structured Bronze layer in GCS.' },
                              { name: 'Backlog Bear', tag: 'Historical backfill', desc: 'Workflow inside the Extension for configurable multi-date hydration — generates historical Bronze partitions with per-batch manifests for full lineage.' },
                              { name: 'Datalake Pipelines', tag: 'Silver → Gold', desc: 'Full-stack medallion pipeline — dbt + DuckDB for Silver transforms, Polars + BigQuery for Gold aggregations, Airflow DAGs for orchestration.' },
                            ].map((mod) => (
                              <div key={mod.name} className="flex gap-3 text-sm text-[#2b2a27]">
                                <div className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#2b2a27]" />
                                <div>
                                  <span className="font-semibold">{mod.name}</span>
                                  <span className="ml-1.5 rounded-full border border-[#2b2a27]/30 bg-[#fff7e6] px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-[#2b2a27]/60">{mod.tag}</span>
                                  <p className="mt-0.5 text-[12px] text-[#2b2a27]/70">{mod.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff2d9] px-4 py-3">
                        <p className="text-sm text-[#2b2a27]">{project.summary}</p>
                      </div>
                      {hasStoryboard && (
                        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                          <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                            {storyboardTitle}
                          </div>
                          <p className="mt-1 text-xs text-[#2b2a27]">
                            {storyboardDescription}
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            {storyboardPanels.map((panel) => (
                              <button
                                key={panel.src}
                                onClick={() => setActivePlot({ src: panel.src, alt: panel.alt })}
                                className="rounded-xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-2 text-left transition-transform hover:-translate-y-0.5"
                              >
                                <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#2b2a27]">
                                  {panel.label}
                                </div>
                                <img
                                  src={panel.src}
                                  alt={panel.alt}
                                  className="h-24 w-full object-contain"
                                  loading="lazy"
                                />
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setStoryboardOpen(true)}
                            className="mt-3 inline-flex rounded-full border-2 border-[#2b2a27] bg-[#fff0c2] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#2b2a27]"
                          >
                            Open Storyboard
                          </button>
                        </div>
                      )}
                      {isSpotlight && (
                        <div className="space-y-4">
                          {/* TLDR + dev preview badge */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff2d9] p-4 shadow-[4px_4px_0_#2b2a27]">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">Project Summary</div>
                              <span className="rounded-full border border-[#2b2a27] bg-white px-2 py-0.5 text-[9px] uppercase tracking-widest text-[#2b2a27]">Dev Preview · v0.1.0</span>
                            </div>
                            <p className="text-sm text-[#2b2a27]">
                              FridAI is an open-source platform for governed AI execution at scale. Point any MCP-compatible AI at the hub and it routes tools, enforces approval gates, runs workloads in Docker sandboxes, and stores results in vector memory.
                            </p>
                            <p className="mt-2 text-xs text-[#2b2a27]/70">
                              Solo dev project in active development. Core architecture is stable and tested. APIs may change before public release.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
                              {['MCP', 'Agents', 'Memory', 'Automation', 'Governance'].map((tag) => (
                                <span key={tag} className="rounded-full border border-[#2b2a27] bg-white px-2 py-1 text-[#2b2a27]">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Three problems solved */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">Three Problems Solved</div>
                            <div className="mt-3 space-y-3 text-sm text-[#2b2a27]">
                              <div>
                                <div className="font-semibold">1. Tool Bloat → MCP Aggregation Hub</div>
                                <p className="mt-1 text-xs text-[#2b2a27]/70">Single connection point instead of N servers. Profile-based tool filtering ensures each user/role sees only their allowed tools. One API key for all backend services.</p>
                              </div>
                              <div>
                                <div className="font-semibold">2. Context Fatigue → Vector Memory Service</div>
                                <p className="mt-1 text-xs text-[#2b2a27]/70">Semantic search for specs by intent. Memory cards store context across sessions. Assistants discover available automations without re-explaining every time.</p>
                              </div>
                              <div>
                                <div className="font-semibold">3. Unsafe Automation → Approval + Sandbox Engine</div>
                                <p className="mt-1 text-xs text-[#2b2a27]/70">Pre-approve classes of operations. Untrusted code runs in Docker with network isolation, dropped capabilities, and seccomp filters. Every run emits a full audit trail.</p>
                              </div>
                            </div>
                          </div>

                          {/* Spec example */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#1a1a1a] p-4">
                            <div className="mb-2 text-[11px] uppercase tracking-[0.3em] text-[#fff7e6]/70">Example Spec (YAML)</div>
                            <pre className="overflow-x-auto text-[10px] leading-relaxed text-green-300/90">{`spec:
  id: spec.data_pipeline
  intent: "Clean CSV data and generate report"

  tasks:
    - id: clean-data
      handler: csv_cleaner
      params:
        input: data/input.csv
        output: data/cleaned.csv
      sandbox:
        required: true  # Runs in Docker

    - id: generate-report
      handler: markdown_report
      requires_approval: false`}</pre>
                            <div className="mt-2 text-[10px] text-[#fff7e6]/40">fridai exec --spec spec.data_pipeline</div>
                          </div>

                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {!isSpotlight && (
                        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff0c2] p-4 text-sm font-semibold text-[#2b2a27]">
                          {project.callout}
                        </div>
                      )}
                      {!isSpotlight && (
                        <div className="space-y-2 text-sm text-[#2b2a27]">
                          <p>{project.summary}</p>
                          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-[#2b2a27]">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-[#2b2a27] bg-[#fff7e6] px-2 py-1 text-[#2b2a27]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {isAnalystToolkit && (
                        <>
                          {/* Origin story — anchors the whole section */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff3d6] p-4 text-sm text-[#2b2a27]">
                            Grew from scattered snippets into a package that enforces hygiene and repeatability — now the foundation for every analytics project I ship.
                          </div>

                          {/* How it works + what it ships */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              How It Works
                            </div>
                            <p className="mt-2 text-sm text-[#2b2a27]">
                              Centralizes reusable ETL, schema checks, duplicate/outlier detection, and
                              clean exports into a configurable toolkit. Run interactively in Jupyter or
                              as automated pipelines to enforce hygiene across projects.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
                              {['Python', 'Pandas', 'YAML', 'Jupyter', 'CLI', 'Gemini', 'ChatGPT‑4o'].map(
                                (tool) => (
                                  <span
                                    key={tool}
                                    className="rounded-full border border-[#2b2a27] bg-[#fff7e6] px-2 py-1 text-[#2b2a27]"
                                  >
                                    {tool}
                                  </span>
                                )
                              )}
                            </div>
                            <div className="mt-4 border-t border-[#2b2a27]/10 pt-3">
                              <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]/60">Ships With</div>
                              <ul className="space-y-1 text-xs text-[#2b2a27]">
                                <li>Config‑driven ETL modules and pipelines</li>
                                <li>Validation, profiling, and QA reports</li>
                                <li>Duplicate/outlier detection utilities</li>
                                <li>Clean CSV exports and rendered HTML notebooks</li>
                              </ul>
                            </div>
                          </div>

                          {/* Problems solved */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Problems &amp; Solutions
                            </div>
                            <ul className="mt-2 space-y-2 text-sm text-[#2b2a27]">
                              <li>Teams re‑build cleaning steps → config‑driven ETL and reusable modules.</li>
                              <li>Ad hoc diagnostics → standardized validation and profiling.</li>
                              <li>Fragile hand‑offs → clean exports with logs for repeatability.</li>
                            </ul>
                          </div>

                          {/* Companion tools */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Companion Tools
                            </div>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <button
                                onClick={() => setCompanionOpen('starter')}
                                className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-3 text-left transition-transform hover:-translate-y-0.5"
                              >
                                <img
                                  src="/img/projects/comic_analyst_starterkit.png"
                                  alt="Analyst Toolkit Starter Kit"
                                  className="h-16 w-full object-contain"
                                  loading="lazy"
                                />
                                <div className="mt-2 text-xs font-semibold text-[#2b2a27]">Starter Kit</div>
                                <div className="text-[11px] text-[#2b2a27]">
                                  Pre‑bundled Toolkit modules + configs.
                                </div>
                              </button>
                              <button
                                onClick={() => setCompanionOpen('deploy')}
                                className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-3 text-left transition-transform hover:-translate-y-0.5"
                              >
                                <img
                                  src="/img/projects/comic_analyst_deploy.png"
                                  alt="Analyst Toolkit Deployment Utility"
                                  className="h-16 w-full object-contain"
                                  loading="lazy"
                                />
                                <div className="mt-2 text-xs font-semibold text-[#2b2a27]">Deployment Utility</div>
                                <div className="text-[11px] text-[#2b2a27]">
                                  Packages toolkit pipelines for production.
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Future state with status signals */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Roadmap
                            </div>
                            <ul className="mt-3 space-y-2 text-xs text-[#2b2a27]">
                              {[
                                { label: 'Cloud DB integrations (BigQuery, Snowflake)', status: 'planned' },
                                { label: 'Expanded profiling (bias checks, drift detection)', status: 'planned' },
                                { label: 'Stakeholder‑ready report builders', status: 'in progress' },
                                { label: 'CLI wizard for new project scaffolds', status: 'planned' },
                              ].map((item) => (
                                <li key={item.label} className="flex items-start gap-2">
                                  <span className={`mt-0.5 shrink-0 rounded-full px-1.5 py-0.5 text-[8px] uppercase tracking-widest ${
                                    item.status === 'in progress'
                                      ? 'bg-[#fff0c2] text-[#2b2a27]'
                                      : 'border border-[#2b2a27]/20 bg-transparent text-[#2b2a27]/50'
                                  }`}>{item.status}</span>
                                  <span>{item.label}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Demos elevated + GitHub links tiered */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Docs &amp; Demos
                            </div>
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                              <a
                                href="/files/analyst_toolkit/00_analyst_toolkit_modular_demo.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border-[3px] border-[#2b2a27] bg-[#fff0c2] p-3 text-left text-black transition-transform hover:-translate-y-0.5"
                              >
                                <div className="text-[10px] font-bold uppercase tracking-widest">Modular Demo</div>
                                <div className="mt-1 text-[11px]">Rendered notebook — module-by-module walkthrough</div>
                              </a>
                              <a
                                href="/files/analyst_toolkit/01_analyst_toolkit_pipeline_demo.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border-[3px] border-[#2b2a27] bg-[#fff0c2] p-3 text-left text-black transition-transform hover:-translate-y-0.5"
                              >
                                <div className="text-[10px] font-bold uppercase tracking-widest">Pipeline Demo</div>
                                <div className="mt-1 text-[11px]">Rendered notebook — full end-to-end pipeline run</div>
                              </a>
                            </div>
                            <div className="mt-3 border-t border-[#2b2a27]/10 pt-3">
                              <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]/60">Reference Docs</div>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {[
                                  { label: 'Config Guide', href: 'https://github.com/G-Schumacher44/analyst_toolkit/blob/main/resource_hub/config_guide.md' },
                                  { label: 'Usage Guide', href: 'https://github.com/G-Schumacher44/analyst_toolkit/blob/main/resource_hub/usage_guide.md' },
                                  { label: 'Notebook Guide', href: 'https://github.com/G-Schumacher44/analyst_toolkit/blob/main/resource_hub/notebook_usage_guide.md' },
                                ].map((link) => renderDocLink(link, setDocOpen))}
                              </div>
                              <div className="mt-3 mb-2 text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]/60">Repositories</div>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {[
                                  { label: 'Core Toolkit', href: 'https://github.com/G-Schumacher44/analyst_toolkit' },
                                  { label: 'Starter Kit', href: 'https://github.com/G-Schumacher44/analyst_toolkit_starter_kit' },
                                  { label: 'Deployment Utility', href: 'https://github.com/G-Schumacher44/analyst_toolkit_deployment_utility' },
                                ].map((link) => renderDocLink(link, setDocOpen))}
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {isSpotlight && (
                        <>
<div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">Monorepo Packages</div>
                            <div className="mt-3 space-y-2">
                              {[
                                { pkg: 'system', desc: 'Spec validation, execution loop, CLI', port: '8000' },
                                { pkg: 'mcp', desc: 'FastMCP hub — tool/resource gateway', port: '3921' },
                                { pkg: 'memory', desc: 'Spec discovery + context retrieval (Pinecone/GCS)', port: '3922' },
                                { pkg: 'common', desc: 'Shared utilities — secrets, notifications', port: '—' },
                                { pkg: 'llm', desc: 'Self-hosted LLM handlers via Ollama', port: '—' },
                              ].map((row) => (
                                <div key={row.pkg} className="flex items-start gap-2 text-xs text-[#2b2a27]">
                                  <code className="min-w-[72px] rounded border border-[#2b2a27] bg-[#fff7e6] px-1.5 py-0.5 font-mono text-[10px]">{row.pkg}</code>
                                  <span className="flex-1 text-[#2b2a27]/80">{row.desc}</span>
                                  <span className="min-w-[36px] text-right font-mono text-[10px] text-[#2b2a27]/50">{row.port}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">Component Status</div>
                            <div className="mt-3 space-y-1.5">
                              {[
                                { label: 'Validation Engine', status: 'stable' },
                                { label: 'Approval System', status: 'stable' },
                                { label: 'Sandbox Runtime', status: 'stable' },
                                { label: 'MCP Hub', status: 'stable' },
                                { label: 'Memory Service', status: 'stable' },
                                { label: 'Base Handlers (5/5)', status: 'stable' },
                                { label: 'LLM Handlers', status: 'progress' },
                                { label: 'VSCode Extension', status: 'progress' },
                                { label: 'Scheduler', status: 'planned' },
                              ].map((row) => (
                                <div key={row.label} className="flex items-center justify-between text-xs text-[#2b2a27]">
                                  <span>{row.label}</span>
                                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                                    row.status === 'stable' ? 'bg-emerald-100 text-emerald-800' :
                                    row.status === 'progress' ? 'bg-amber-100 text-amber-800' :
                                    'bg-[#f0e8d6] text-[#2b2a27]/60'
                                  }`}>
                                    {row.status === 'stable' ? '✅ Stable' : row.status === 'progress' ? '🚧 In progress' : '⬚ Planned'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Technical Docs
                            </div>
                            <p className="mt-1 text-[10px] text-[#2b2a27]/60">Dev preview docs — selected highlights from the live repo.</p>
                            <div className="mt-3 space-y-2">
                              <div className="text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]">Architecture</div>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { label: 'System Flow', href: '/files/fridai_core_docs/SYSTEM_FLOW.md' },
                                  { label: 'System Overview', href: '/files/fridai_core_docs/system_overview.md' },
                                  { label: 'MCP Overview', href: '/files/fridai_core_docs/mcp_overview.md' },
                                  { label: 'Memory Overview', href: '/files/fridai_core_docs/memory_overview.md' },
                                  { label: 'MCP Services', href: '/files/fridai_core_docs/MCP_SERVICES_GUIDE.md' },
                                ].map((link) => renderDocLink(link, setDocOpen))}
                              </div>
                              <div className="mt-2 text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]">Reference</div>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { label: 'Schema Guide', href: '/files/fridai_core_docs/SCHEMA_GUIDE.md' },
                                  { label: 'CLI Reference', href: '/files/fridai_core_docs/CLI_REFERENCE.md' },
                                  { label: 'System Runbook', href: '/files/fridai_core_docs/SYSTEM_RUNBOOK.md' },
                                ].map((link) => renderDocLink(link, setDocOpen))}
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {isModelEval && (
                        <>
                          {/* Origin story callout — up top for immediate context */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff3d6] px-4 py-3 text-sm text-[#2b2a27]">
                            Built because shipping a model without diagnostics is a haunted house. Every run now gets the same standardized pass — metrics, stability, interpretability, and a report that non-engineers can actually read.
                          </div>

                          {/* How It Works — summary + tech stack */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              How It Works
                            </div>
                            <p className="mt-2 text-sm text-[#2b2a27]">
                              A config-driven evaluation harness for regression and classification models. Point it at a trained model and dataset, run one command, and get type-appropriate metrics (R²/RMSE for regressors, F1/AUC-ROC for classifiers), CV scores, SHAP breakdowns, bias checks, and a stakeholder HTML report — all in one pass.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
                              {['Python', 'Scikit‑learn', 'MLflow', 'SHAP', 'Jupyter', 'CLI'].map(
                                (tool) => (
                                  <span
                                    key={tool}
                                    className="rounded-full border border-[#2b2a27] bg-[#fff7e6] px-2 py-1 text-[#2b2a27]"
                                  >
                                    {tool}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          {/* Problems & Solutions */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Problems &amp; Solutions
                            </div>
                            <ul className="mt-2 space-y-2 text-sm text-[#2b2a27]">
                              <li>Manual, inconsistent metric checks → config-driven evaluation pipelines that run the same diagnostic pass every time.</li>
                              <li>Hidden overfitting and fragile models → learning curves + cross-validation diagnostics catch it before anything ships.</li>
                              <li>Black-box model decisions → SHAP beeswarm and permutation importance surface exactly what's driving predictions.</li>
                              <li>No production audit trail → champion model validation runs a full holdout check and logs results to MLflow.</li>
                              <li>Stakeholder confusion → exportable HTML reports translate metrics and diagnostics into plain language anyone can read.</li>
                            </ul>
                          </div>

                          {/* Roadmap with status badges */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Roadmap
                            </div>
                            <ul className="mt-2 space-y-2 text-sm text-[#2b2a27]">
                              {[
                                { label: 'Model registry + CI gating', status: 'planned' },
                                { label: 'Automated drift monitoring', status: 'planned' },
                                { label: 'More templated report packs', status: 'in progress' },
                                { label: 'Model comparison dashboards', status: 'planned' },
                              ].map((item) => (
                                <li key={item.label} className="flex items-center gap-2">
                                  <span
                                    className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-widest ${
                                      item.status === 'in progress'
                                        ? 'border-[#2b7a2b] bg-[#e8f5e8] text-[#2b7a2b]'
                                        : 'border-[#2b2a27] bg-[#f6f1e7] text-[#2b2a27]'
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                  {item.label}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Docs & Demos — unified card matching analyst toolkit template */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Docs &amp; Demos
                            </div>
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                              <a
                                href="/files/model_eval_demo_notebook.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border-[3px] border-[#2b2a27] bg-[#fff0c2] p-3 text-left text-black transition-transform hover:-translate-y-0.5"
                              >
                                <div className="text-[10px] font-bold uppercase tracking-widest">Demo Notebook</div>
                                <div className="mt-1 text-[11px]">Rendered notebook — full evaluation run from config to report</div>
                              </a>
                            </div>
                            <div className="mt-3 border-t border-[#2b2a27]/10 pt-3">
                              <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]/60">Reference Docs</div>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {[
                                  { label: 'Hub Index', href: 'https://github.com/G-Schumacher44/model_evaluation_suite/blob/main/resource_hub/hub_index.md' },
                                  { label: 'Usage Guide', href: 'https://github.com/G-Schumacher44/model_evaluation_suite/blob/main/resource_hub/usage_guide.md' },
                                  { label: 'CLI Guide', href: 'https://github.com/G-Schumacher44/model_evaluation_suite/blob/main/resource_hub/CLI_resources/cli_usage_guide.md' },
                                  { label: 'Notebook Walkthrough', href: 'https://github.com/G-Schumacher44/model_evaluation_suite/blob/main/resource_hub/notebook_resources/notebook_walkthrough.md' },
                                  { label: 'Config Guide', href: 'https://github.com/G-Schumacher44/model_evaluation_suite/blob/main/resource_hub/config_resources/config_guide.md' },
                                  { label: 'MLflow Notes', href: 'https://github.com/G-Schumacher44/model_evaluation_suite/blob/main/resource_hub/modeling_resources/MLFlow.md' },
                                  { label: 'Feature Engineering', href: 'https://github.com/G-Schumacher44/model_evaluation_suite/blob/main/resource_hub/modeling_resources/feature_engineering.md' },
                                ].map((link) => renderDocLink(link, setDocOpen))}
                              </div>
                              <div className="mt-3 mb-2 text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]/60">Repository</div>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {[
                                  { label: 'GitHub', href: 'https://github.com/G-Schumacher44/model_evaluation_suite' },
                                ].map((link) => renderDocLink(link, setDocOpen))}
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {isDatalakes && (
                        <>
                          {/* Origin story callout */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff3d6] px-4 py-3 text-sm text-[#2b2a27]">
                            Built to prove the full stack — from synthetic data generation through Bronze hydration, Silver transforms, Gold aggregations, and Airflow orchestration. Every layer production-grade, every step observable.
                          </div>

                          {/* Ecosystem context */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Part of a Larger Ecosystem
                            </div>
                            <p className="mt-2 text-sm text-[#2b2a27]">
                              This project is the functional data engineering extension of the SQL Stories — Analytics &amp; Data Modeling Ecosystem. The same synthetic ecommerce data that powers this lakehouse feeds into the SQL Stories analytics lab, where it becomes the dataset behind case studies, dashboard work, and data modeling exercises.
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                              {[
                                { label: 'Ecom Generator', desc: 'Data source' },
                                { label: 'Datalake Extension', desc: 'Bronze layer' },
                                { label: 'Backlog Bear', desc: 'History' },
                                { label: 'Pipelines', desc: 'Silver → Gold' },
                                { label: 'SQL Stories', desc: 'Analytics lab' },
                              ].map((node, i, arr) => (
                                <div key={node.label} className="flex items-center gap-1.5">
                                  <div className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-2 py-1.5 text-center">
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]">{node.label}</div>
                                    <div className="text-[9px] text-[#2b2a27]/60">{node.desc}</div>
                                  </div>
                                  {i < arr.length - 1 && (
                                    <span className="text-[10px] text-[#2b2a27]/40">→</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* How It Works */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              How It Works
                            </div>
                            <p className="mt-2 text-sm text-[#2b2a27]">
                              A full-stack medallion lakehouse built across three connected repos. The generator produces synthetic relational ecommerce data; the extension wraps it with partitioning, Parquet conversion, and Hadoop-style manifests to land a clean Bronze layer; the pipelines repo runs dbt + DuckDB for Silver transforms, Polars + BigQuery for Gold aggregations, and Airflow DAGs for end-to-end orchestration — with a three-layer validation framework throughout.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
                              {['Python', 'Parquet', 'dbt', 'DuckDB', 'Polars', 'BigQuery', 'Airflow', 'GCS', 'CLI'].map(
                                (tool) => (
                                  <span
                                    key={tool}
                                    className="rounded-full border border-[#2b2a27] bg-[#fff7e6] px-2 py-1 text-[#2b2a27]"
                                  >
                                    {tool}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          {/* Problems & Solutions */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Problems &amp; Solutions
                            </div>
                            <ul className="mt-2 space-y-2 text-sm text-[#2b2a27]">
                              <li>No realistic test data → configurable synthetic generator with referential integrity, messiness tiers, and built-in QA.</li>
                              <li>Raw CSV chaos → extension adds partitioning, Parquet conversion, and Hadoop-style manifests for a structured Bronze layer.</li>
                              <li>Manual multi-date backfills → Backlog Bear runs configurable historical hydration with consistent partitions and per-batch manifests.</li>
                              <li>Inconsistent transforms → spec-driven dbt models enforce schema contracts and quality gates at every medallion layer.</li>
                              <li>No visibility into pipeline health → Airflow DAGs + observability strategy surface run status, SLA tracking, and failure alerts.</li>
                            </ul>
                          </div>

                          {/* Companion Tracks */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Companion Tracks
                            </div>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <button
                                onClick={() => setCompanionOpen('ecom-generator')}
                                className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-3 text-left transition-transform hover:-translate-y-0.5"
                              >
                                <img
                                  src="/img/projects/ecom_generator.png"
                                  alt="Ecom Sales Generator"
                                  className="h-14 w-full object-contain"
                                  loading="lazy"
                                />
                                <div className="mt-2 text-xs font-semibold text-[#2b2a27]">Ecom Generator</div>
                                <div className="text-[11px] text-[#2b2a27]">Synthetic relational ecommerce data.</div>
                              </button>
                              <button
                                onClick={() => setCompanionOpen('datalake-exten')}
                                className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-3 text-left transition-transform hover:-translate-y-0.5"
                              >
                                <img
                                  src="/img/projects/comic_datalakes.png"
                                  alt="Datalake Extension"
                                  className="h-14 w-full object-contain"
                                  loading="lazy"
                                />
                                <div className="mt-2 text-xs font-semibold text-[#2b2a27]">Datalake Extension</div>
                                <div className="text-[11px] text-[#2b2a27]">Partitioning, Parquet + manifests → Bronze.</div>
                              </button>
                              <button
                                onClick={() => setCompanionOpen('datalake-pipelines')}
                                className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-3 text-left transition-transform hover:-translate-y-0.5"
                              >
                                <img
                                  src="/img/projects/comic_pipelines.png"
                                  alt="Datalake Pipelines"
                                  className="h-14 w-full object-contain"
                                  loading="lazy"
                                />
                                <div className="mt-2 text-xs font-semibold text-[#2b2a27]">Pipelines</div>
                                <div className="text-[11px] text-[#2b2a27]">dbt + DuckDB → Silver, Polars + BQ → Gold.</div>
                              </button>
                              <button
                                onClick={() => setCompanionOpen('backfill-bear')}
                                className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-3 text-left transition-transform hover:-translate-y-0.5"
                              >
                                <img
                                  src="/img/projects/comic_backlog_bear.png"
                                  alt="Backlog Bear"
                                  className="h-14 w-full object-contain"
                                  loading="lazy"
                                />
                                <div className="mt-2 text-xs font-semibold text-[#2b2a27]">Backlog Bear</div>
                                <div className="text-[11px] text-[#2b2a27]">Configurable historical backfills.</div>
                              </button>
                            </div>
                          </div>

                          {/* Docs & Demos */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Docs &amp; Demos
                            </div>
                            {/* Live pipeline HTML reports */}
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                              {[
                                { label: 'dbt Docs Site', desc: 'Live dbt project docs — models, tests, lineage', href: '/files/pipeline_project/dbt_duckdb_docs/index.html' },
                                { label: 'Silver Quality Report', desc: 'Enriched Silver validation report from a live run', href: '/files/pipeline_project/silver_quality_report.html' },
                                { label: 'Airflow Observability', desc: 'Airflow run metrics and pipeline observability', href: '/files/pipeline_project/airflow_observability.html' },
                                { label: 'Metrics Snapshot', desc: 'Pipeline metrics snapshot from a production run', href: '/files/pipeline_project/metrics_snapshot.html' },
                              ].map((tile) => (
                                <a
                                  key={tile.href}
                                  href={tile.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-xl border-[3px] border-[#2b2a27] bg-[#fff0c2] p-3 text-left text-black transition-transform hover:-translate-y-0.5"
                                >
                                  <div className="text-[10px] font-bold uppercase tracking-widest">{tile.label}</div>
                                  <div className="mt-1 text-[11px]">{tile.desc}</div>
                                </a>
                              ))}
                            </div>
                            <div className="mt-3 border-t border-[#2b2a27]/10 pt-3">
                              <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]/60">Generator Docs</div>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {[
                                  { label: 'Config Guide', href: 'https://github.com/G-Schumacher44/ecom_sales_data_generator/blob/main/CONFIG_GUIDE.md' },
                                  { label: 'Schema Reference', href: 'https://github.com/G-Schumacher44/ecom_sales_data_generator/blob/main/database_schema_reference.md' },
                                  { label: 'Testing Guide', href: 'https://github.com/G-Schumacher44/ecom_sales_data_generator/blob/main/TESTING_GUIDE.md' },
                                ].map((link) => renderDocLink(link, setDocOpen))}
                              </div>
                              <div className="mt-3 mb-2 text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]/60">Extension Docs</div>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {[
                                  { label: 'Config Guide', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/datalakes_extention/CONFIG_GUIDE.md' },
                                  { label: 'CLI Reference', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/datalakes_extention/CLI_REFERENCE.md' },
                                  { label: 'Testing Guide', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/datalakes_extention/TESTING_GUIDE.md' },
                                  { label: 'Backlog Bear', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten/blob/main/docs/resource_hub/datalakes_extention/workflows/BACKLOG_BEAR.md' },
                                ].map((link) => renderDocLink(link, setDocOpen))}
                              </div>
                              <div className="mt-3 mb-2 text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]/60">Pipelines Docs</div>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {[
                                  { label: 'Architecture', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/ARCHITECTURE.md' },
                                  { label: 'Spec Overview', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/SPEC_OVERVIEW.md' },
                                  { label: 'Runbook', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/RUNBOOK.md' },
                                  { label: 'SLA & Quality', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/SLA_AND_QUALITY.md' },
                                  { label: 'Observability', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/OBSERVABILITY_STRATEGY.md' },
                                  { label: 'Transformation Summary', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines/blob/main/docs/resources/TRANSFORMATION_SUMMARY.md' },
                                ].map((link) => renderDocLink(link, setDocOpen))}
                              </div>
                              <div className="mt-3 mb-2 text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]/60">Repositories</div>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {[
                                  { label: 'Generator', href: 'https://github.com/G-Schumacher44/ecom_sales_data_generator' },
                                  { label: 'Datalake Extension', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten' },
                                  { label: 'Pipelines', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines' },
                                ].map((link) => renderDocLink(link, setDocOpen))}
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {isDirtyBirds && (
                        <>
                          {/* Origin callout */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff3d6] p-4 text-sm text-[#2b2a27]">
                            Inspired by the Palmer Penguins dataset — reimagined for modern workflows.
                            Built to fill the gap between clean demo datasets and the messy, complex
                            data typical in real ecological fieldwork.
                          </div>

                          {/* How It Works */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              How It Works
                            </div>
                            <p className="mt-2 text-sm text-[#2b2a27]">
                              A CLI‑driven synthetic data generator that simulates penguin tagging
                              and monitoring programs with species‑aware morphometrics, longitudinal
                              resight windows, and configurable messiness tiers — built for QA
                              pipelines, ML prototyping, and analytics demos.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
                              {['Python', 'Pandas', 'CLI', 'Pytest', 'Simulation'].map((tool) => (
                                <span
                                  key={tool}
                                  className="rounded-full border border-[#2b2a27] bg-[#fff7e6] px-2 py-1 text-[#2b2a27]"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Problems & Solutions */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Problems &amp; Solutions
                            </div>
                            <ul className="mt-2 space-y-2 text-sm text-[#2b2a27]">
                              <li className="flex gap-2"><span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#2b2a27]" /><span>Clean toy datasets lacked ecological realism → biologically‑informed species morphometrics from peer‑reviewed sources.</span></li>
                              <li className="flex gap-2"><span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#2b2a27]" /><span>No longitudinal structure in existing datasets → tagging + resight windows that mirror real field study timelines.</span></li>
                              <li className="flex gap-2"><span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#2b2a27]" /><span>Too‑perfect data couldn't stress‑test pipelines → tiered messiness system with controlled NaN injection and field‑style anomalies.</span></li>
                              <li className="flex gap-2"><span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#2b2a27]" /><span>No QA validation layer → pytest suite checks output structure, missingness rates, and column integrity automatically.</span></li>
                            </ul>
                          </div>

                          {/* Scientific Grounding */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Scientific Grounding
                            </div>
                            <p className="mt-2 text-sm text-[#2b2a27]">
                              Colony sizes, species morphometrics, temporal field windows, and messiness
                              patterns are all grounded in peer‑reviewed literature and public datasets.
                            </p>
                            <div className="mt-3 space-y-2">
                              {[
                                {
                                  label: 'Palmer Penguins Extended (Kaggle)',
                                  desc: 'Baseline structure and values for key features',
                                  href: 'https://www.kaggle.com/datasets/samybaladram/palmers-penguin-dataset-extended',
                                },
                                {
                                  label: 'Original Palmer Penguins R Package',
                                  desc: 'Foundational variable definitions and column semantics',
                                  href: 'https://github.com/allisonhorst/palmerpenguins',
                                },
                                {
                                  label: 'USAP Continental Field Manual (2024)',
                                  desc: 'Tag/resight timing and field logistics modeling',
                                  href: 'https://www.usap.gov/usapgov/travelAndDeployment/documents/Continental-Field-Manual-2024.pdf',
                                },
                                {
                                  label: 'Adélie Penguin Breeding Census – AADC #154',
                                  desc: 'Colony size distributions and clutch timing patterns',
                                  href: 'https://data.aad.gov.au/aadc/biodiversity/display_collection.cfm?collection_id=154',
                                },
                                {
                                  label: 'Ropert‑Coudert et al. (2018)',
                                  desc: 'Temporal breeding variability and extreme event scenarios',
                                  href: 'https://doi.org/10.3389/fmars.2018.00264',
                                },
                                {
                                  label: 'Schmidt et al. (2021)',
                                  desc: 'Habitat‑scale effects on nest success rates',
                                  href: 'https://doi.org/10.1038/s41598-021-94861-7',
                                },
                                {
                                  label: 'Palmer Station Morphometric Dataset (EDI)',
                                  desc: 'Species‑specific bill, flipper, and body mass distributions',
                                  href: 'https://data.key2stats.com/data-set/view/1299',
                                },
                                {
                                  label: 'Tyler et al. (2020)',
                                  desc: 'Gentoo body size, bill morphology, and subspecies variation',
                                  href: 'https://doi.org/10.1002/ece3.6973',
                                },
                                {
                                  label: 'Fattorini &amp; Olmastroni (2021)',
                                  desc: 'Sex‑based morphometric differences in Adélie penguins',
                                  href: 'https://doi.org/10.1007/s00300-021-02893-6',
                                },
                              ].map((src) => (
                                <a
                                  key={src.label}
                                  href={src.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-start gap-2 rounded-lg border border-[#2b2a27]/20 bg-[#fff7e6] px-3 py-2 transition-colors hover:bg-[#fff3d6]"
                                >
                                  <span className="mt-0.5 flex-shrink-0 text-[10px]">↗</span>
                                  <span className="flex flex-col">
                                    <span className="text-[11px] font-semibold text-[#2b2a27]">{src.label}</span>
                                    <span className="text-[10px] text-[#2b2a27]/70">{src.desc}</span>
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* Roadmap */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Roadmap
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {[
                                'YAML scenario configs',
                                'Additional species & habitats',
                                'Automated QA reports',
                                'Dataset presets',
                              ].map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full border border-dashed border-[#2b2a27]/40 px-3 py-1 text-[11px] text-[#2b2a27]/70"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Docs & Demos */}
                          <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                            <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                              Docs &amp; Demos
                            </div>
                            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                              <a
                                href="/files/dirty_birds_docs/penguin_synthetic_generator_v0.4.0.py"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border-[3px] border-[#2b2a27] bg-[#fff0c2] p-3 text-left text-black transition-transform hover:-translate-y-0.5"
                              >
                                <div className="text-[10px] font-bold uppercase tracking-widest">Generator Script</div>
                                <div className="mt-1 text-[11px]">CLI-driven synthetic data generator</div>
                              </a>
                              <a
                                href="/files/dirty_birds_docs/synthetic_penguins_v0.4.0_clean.csv"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border-[3px] border-[#2b2a27] bg-[#fff0c2] p-3 text-left text-black transition-transform hover:-translate-y-0.5"
                              >
                                <div className="text-[10px] font-bold uppercase tracking-widest">Clean Sample CSV</div>
                                <div className="mt-1 text-[11px]">Analysis-ready output — no injected messiness</div>
                              </a>
                              <a
                                href="/files/dirty_birds_docs/synthetic_penguins_v0.4.0.csv"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border-[3px] border-[#2b2a27] bg-[#fff0c2] p-3 text-left text-black transition-transform hover:-translate-y-0.5"
                              >
                                <div className="text-[10px] font-bold uppercase tracking-widest">Messy Sample CSV</div>
                                <div className="mt-1 text-[11px]">Field-style dataset with controlled anomalies</div>
                              </a>
                            </div>
                            <div className="mt-3 border-t border-[#2b2a27]/10 pt-3">
                              <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]/60">Repository</div>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {[
                                  { label: 'GitHub', href: 'https://github.com/G-Schumacher44/dirty_birds_data_generator' },
                                ].map((link) => renderDocLink(link, setDocOpen))}
                              </div>
                            </div>
                          </div>
                        </>
                      )}


                  {isSpotlight && (
                  <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff3d6] p-4 text-sm text-[#2b2a27]">
                      <div className="space-y-3">
                        <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">Interested in this project?</div>
                        <p className="text-sm text-[#2b2a27]">
                          FridAI Core is in active development — public dev preview planned for March 15, 2026. Repo is currently private.
                        </p>
                        <p className="text-xs text-[#2b2a27]/60">
                          Want to talk through the architecture or be notified at release? Reach out directly.
                        </p>
                        <a
                          href="mailto:me@garrettschumacher.com"
                          onClick={() => trackGenerateLead('email', `technical_showcase_modal_${slug}`)}
                          className="inline-flex items-center gap-2 rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition-all hover:border-brand/60 hover:bg-brand/20"
                        >
                          Get in touch
                        </a>
                      </div>
                  </div>
                  )}
                </div>
              </div>
              {hasArtifacts && (
                <div className="mt-6 rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                    Artifact Gallery
                  </div>
                  <p className="mt-1 text-xs text-[#2b2a27]">
                    {artifactDescription}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {plotArtifacts.map((artifact) => (
                      <button
                        key={artifact.src}
                        onClick={() => setActivePlot(artifact)}
                        className="rounded-xl border-[2px] border-[#2b2a27] bg-[#fff7e6] p-2"
                      >
                        <img
                          src={artifact.src}
                          alt={artifact.alt}
                          className="h-28 w-full object-contain"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )}
      <StoryboardModal
        open={storyboardOpen}
        panels={storyboardPanels}
        title={storyboardModalTitle}
        subtitle={storyboardModalSubtitle}
        footer={storyboardModalFooter}
        onClose={() => setStoryboardOpen(false)}
      />
      <PlotViewerModal plot={activePlot} onClose={() => setActivePlot(null)} />
      <CompanionModal
        content={companionContent}
        onDocOpen={setDocOpen}
        onMediaOpen={setActivePlot}
        onClose={() => setCompanionOpen(null)}
      />
      <DocModal doc={docOpen} onDocOpen={setDocOpen} onClose={() => setDocOpen(null)} />
      <DocumentViewer
        isOpen={deckOpen}
        onClose={() => setDeckOpen(false)}
        src="/files/modals/fridai-overview.html"
        title="FridAI Core — Project Overview"
      />
    </>
  );
}

function StoryboardModal({
  open,
  panels,
  title,
  subtitle,
  onClose,
}: {
  open: boolean;
  panels: { src: string; alt: string; label: string; annotation?: string }[];
  title: string;
  subtitle: string;
  footer?: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative h-[90vh] w-[92vw] max-w-4xl overflow-hidden rounded-3xl border-[3px] border-[#2b2a27] bg-[#fffef7] shadow-[10px_10px_0_#2b2a27]"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Analyst Toolkit notebook walkthrough"
          >
            <div className="flex items-center justify-between border-b-[3px] border-[#2b2a27] bg-[#fff3d6] px-6 py-2">
              <div>
                <div className="text-[11px] uppercase tracking-[0.4em] text-[#2b2a27]">
                  Notebook Walkthrough
                </div>
                <h3
                  className="mt-1 text-xl font-black text-[#2b2a27]"
                  style={{ textShadow: '1px 1px 0 #000' }}
                >
                  {title}
                </h3>
                <p className="mt-1 text-xs text-[#2b2a27]">{subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full border-2 border-[#2b2a27] bg-white p-2"
                aria-label="Close storyboard"
              >
                <X size={18} />
              </button>
            </div>
            <div className="h-[calc(90vh-76px)] overflow-y-auto p-6">
              <div className="space-y-10">
                {panels.map((panel, i) => (
                  <div key={panel.src} className="space-y-3">
                    {/* Stage label + connector line */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[3px] border-[#2b2a27] bg-[#fff0c2] text-[11px] font-black text-[#2b2a27]">
                        {i + 1}
                      </div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#2b2a27]">
                        {panel.label}
                      </div>
                    </div>
                    {/* Image — full width, tall */}
                    <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-3">
                      <img
                        src={panel.src}
                        alt={panel.alt}
                        className="w-full rounded-xl object-contain"
                        style={{ maxHeight: '420px' }}
                        loading="lazy"
                      />
                    </div>
                    {/* Annotation */}
                    {panel.annotation && (
                      <div className="rounded-xl border-2 border-[#2b2a27]/20 bg-white px-4 py-3 text-sm text-[#2b2a27]">
                        {panel.annotation}
                      </div>
                    )}
                    {/* Connector arrow between panels */}
                    {i < panels.length - 1 && (
                      <div className="flex justify-center pt-2 text-[#2b2a27]/30 text-xl">↓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function PlotViewerModal({
  plot,
  onClose,
}: {
  plot: { src: string; alt: string } | null;
  onClose: () => void;
}) {
  if (!plot) return null;

  return createPortal(
    <AnimatePresence>
      {plot && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative h-[80vh] w-[90vw] max-w-5xl overflow-hidden rounded-3xl border-[3px] border-[#2b2a27] bg-white shadow-[10px_10px_0_#2b2a27]"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label={plot.alt}
          >
            <div className="flex items-center justify-between border-b-[3px] border-[#2b2a27] bg-[#fff3d6] px-6 py-2">
              <div className="text-[11px] uppercase tracking-[0.4em] text-[#2b2a27]">
                Plot Viewer
              </div>
              <button
                onClick={onClose}
                className="rounded-full border-2 border-[#2b2a27] bg-white p-2"
                aria-label="Close plot viewer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex h-[calc(80vh-64px)] items-center justify-center p-6">
              <img src={plot.src} alt={plot.alt} className="max-h-full w-full object-contain"
              loading="lazy"
                        />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function CompanionModal({
  content,
  onDocOpen,
  onMediaOpen,
  onClose,
}: {
  content:
    | {
        title: string;
        subtitle: string;
        image: string;
        callout?: string;
        comicStrip?: { src: string; alt: string; label?: string };
        images?: { src: string; alt: string; label?: string }[];
        description: string;
        tools: string[];
        artifacts: string[];
        links: DocLink[];
      }
    | null;
  onDocOpen: (link: DocLink) => void;
  onMediaOpen: (media: { src: string; alt: string }) => void;
  onClose: () => void;
}) {
  if (!content) return null;

  return createPortal(
    <AnimatePresence>
      {content && (
        <motion.div
          className="fixed inset-0 z-[65] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative h-[78vh] w-[90vw] max-w-4xl overflow-hidden rounded-3xl border-[3px] border-[#2b2a27] bg-[#fffef7] shadow-[10px_10px_0_#2b2a27]"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label={`${content.title} companion tool`}
          >
            <div className="flex items-center justify-between border-b-[3px] border-[#2b2a27] bg-[#fff3d6] px-6 py-2">
              <div>
                <div className="text-[11px] uppercase tracking-[0.4em] text-[#2b2a27]">
                  Companion Tool
                </div>
                <h3
                  className="mt-1 text-xl font-black text-[#2b2a27]"
                  style={{ textShadow: '1px 1px 0 #000' }}
                >
                  {content.title}
                </h3>
                <p className="mt-1 text-xs text-[#2b2a27]">{content.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full border-2 border-[#2b2a27] bg-white p-2"
                aria-label="Close companion tool"
              >
                <X size={18} />
              </button>
            </div>
            <div className="h-[calc(78vh-72px)] overflow-y-auto p-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-4">
                    <img src={content.image} alt={content.title} className="h-56 w-full object-contain"
                    loading="lazy"
                        />
                  </div>
                  {content.comicStrip && (
                    <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                      <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                        Comic Strip
                      </div>
                      <button
                        onClick={() =>
                          onMediaOpen({
                            src: content.comicStrip!.src,
                            alt: content.comicStrip!.alt,
                          })
                        }
                        className="mt-3 rounded-xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-2 text-left"
                      >
                        {content.comicStrip.label && (
                          <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#2b2a27]">
                            {content.comicStrip.label}
                          </div>
                        )}
                        <img
                          src={content.comicStrip.src}
                          alt={content.comicStrip.alt}
                          className="h-32 w-full object-contain"
                          loading="lazy"
                        />
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {content.callout && (
                    <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff3d6] px-4 py-3 text-sm text-[#2b2a27]">
                      {content.callout}
                    </div>
                  )}
                  <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4 text-sm text-[#2b2a27]">
                    {content.description}
                  </div>
                  <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                    <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                      Core Tools
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
                      {content.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full border border-[#2b2a27] bg-[#fff7e6] px-2 py-1 text-[#2b2a27]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                    <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                      Artifacts
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-[#2b2a27]">
                      {content.artifacts.map((artifact) => (
                        <li key={artifact}>• {artifact}</li>
                      ))}
                    </ul>
                  </div>
                  {content.images && content.images.length > 0 && (
                    <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
                      <div className="text-[11px] uppercase tracking-[0.3em] text-[#2b2a27]">
                        Screenshots
                      </div>
                      <p className="mt-1 text-[10px] text-[#2b2a27]/60">Click to expand.</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {content.images.map((img) => (
                          <button
                            key={img.src}
                            onClick={() => onMediaOpen({ src: img.src, alt: img.alt })}
                            className="rounded-xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-2 text-left transition-transform hover:-translate-y-0.5"
                          >
                            {img.label && (
                              <div className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-[#2b2a27]/60">{img.label}</div>
                            )}
                            <img src={img.src} alt={img.alt} className="w-full rounded-lg object-cover"
                            loading="lazy"
                        />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff0c2] p-4 text-xs">
                    <div className="flex flex-wrap gap-2">
                      {content.links.map((link) => renderDocLink(link, onDocOpen))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function DocModal({
  doc,
  onDocOpen,
  onClose,
}: {
  doc: DocLink | null;
  onDocOpen: (link: DocLink) => void;
  onClose: () => void;
}) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [docViewMode, setDocViewMode] = useState<'preview' | 'full'>('preview');

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'neutral',
      themeVariables: {
        primaryColor: '#fff7e6',
        primaryTextColor: '#2b2a27',
        primaryBorderColor: '#2b2a27',
        lineColor: '#2b2a27',
        fontFamily: 'ui-sans-serif, system-ui',
      },
    });
  }, []);

  const docPath = doc?.href ?? '';
  const basePath = useMemo(() => {
    if (!docPath) return '';
    const withoutQuery = docPath.split('?')[0];
    return withoutQuery.replace(/[^/]+$/, '');
  }, [docPath]);

  const markdownContent = useMemo(() => {
    const normalized = normalizeMarkdown(content);
    return rewriteHtmlUrls(normalized, basePath);
  }, [content, basePath]);

  useEffect(() => {
    if (!docPath) return;
    let active = true;
    setLoading(true);
    setError(null);
    fetch(docPath)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load document.');
        return res.text();
      })
      .then((text) => {
        if (!active) return;
        setContent(text);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message || 'This doc is not published in the preview yet.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [docPath]);

  const isMarkdown = docPath.toLowerCase().endsWith('.md');
  const isSystemFlowDoc =
    docPath.includes('SYSTEM_FLOW.md') && docPath.includes('fridai_core_docs');
  const isSystemRunbookDoc =
    docPath.includes('fridai_core_docs') && docPath.includes('SYSTEM_RUNBOOK.md');
  const isRunbookDoc =
    docPath.includes('fridai_core_docs') &&
    (isSystemRunbookDoc ||
      docPath.includes('HUB_MCP_RUNBOOK.md') ||
      docPath.includes('MEMORY_RUNBOOK.md'));
  const isOverviewDoc =
    docPath.includes('fridai_core_docs') &&
    (docPath.includes('system_overview.md') ||
      docPath.includes('mcp_overview.md') ||
      docPath.includes('memory_overview.md'));
  const isMcpServicesDoc =
    docPath.includes('fridai_core_docs') && docPath.includes('MCP_SERVICES_GUIDE.md');
  const isPreviewDoc = isSystemFlowDoc || isOverviewDoc || isMcpServicesDoc || isRunbookDoc;

  useEffect(() => {
    if (isPreviewDoc) {
      setDocViewMode('preview');
    }
  }, [isPreviewDoc, docPath]);

  const shouldShowMarkdown = isMarkdown && (!isPreviewDoc || docViewMode === 'full');
  const shouldShowPreview = isPreviewDoc && docViewMode === 'preview';

  if (!doc) return null;

  return createPortal(
    <AnimatePresence>
      {doc && (
            <motion.div
              className="fixed inset-0 z-[80] flex items-center justify-end p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative h-[90vh] w-[90vw] max-w-[90vw] overflow-hidden rounded-3xl border-[3px] border-[#2b2a27] bg-[#fffef7] shadow-[10px_10px_0_#2b2a27]"
            initial={{ opacity: 0, x: 120, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 120, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label={doc.label}
          >
            <div className="flex items-center justify-between border-b-[3px] border-[#2b2a27] bg-[#fff3d6] px-6 py-2">
              <div>
                <div className="text-[11px] uppercase tracking-[0.4em] text-[#2b2a27]">Doc Viewer</div>
                <h3
                  className="mt-1 text-xl font-black text-[#2b2a27]"
                  style={{ textShadow: '1px 1px 0 #000' }}
                >
                  {doc.label}
                </h3>
                <p className="mt-1 text-xs text-[#2b2a27]">{doc.href}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="rounded-full border-2 border-[#2b2a27] bg-white p-2"
                  aria-label="Close document"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="h-[calc(82vh-72px)] overflow-y-auto p-6">
              {loading && <p className="text-sm text-[#2b2a27]">Loading…</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
              {!loading && !error && (
                <div className="space-y-4 text-sm text-[#2b2a27]">
                  <div className="mx-auto max-w-6xl space-y-4">
                  {isPreviewDoc && (
                    <div className="flex flex-wrap items-center gap-2 rounded-2xl border-[2px] border-[#2b2a27] bg-white p-2">
                      <button
                        onClick={() => setDocViewMode('preview')}
                        className={`rounded-full border-2 px-3 py-1 text-[10px] uppercase tracking-widest ${
                          docViewMode === 'preview'
                            ? 'border-[#2b2a27] bg-[#fff7e6]'
                            : 'border-[#d7c7ad] bg-white text-[#2b2a27]'
                        }`}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setDocViewMode('full')}
                        className={`rounded-full border-2 px-3 py-1 text-[10px] uppercase tracking-widest ${
                          docViewMode === 'full'
                            ? 'border-[#2b2a27] bg-[#fff7e6]'
                            : 'border-[#d7c7ad] bg-white text-[#2b2a27]'
                        }`}
                      >
                        Full Doc
                      </button>
                    </div>
                  )}
                  {shouldShowPreview ? (
                    <div
                      style={{
                        transform: 'scale(0.72)',
                        transformOrigin: 'top left',
                        width: '138.9%',
                        marginBottom: '-28%',
                      }}
                    >
                    {isSystemFlowDoc ? (
                      <SystemFlowPreview onDocOpen={onDocOpen} />
                    ) : isRunbookDoc ? (
                      <RunbookPreview
                        title={doc.label}
                        markdown={markdownContent}
                        basePath={basePath}
                        variant={isSystemRunbookDoc ? 'system' : 'default'}
                      />
                    ) : isMcpServicesDoc ? (
                      <McpServicesPreview onDocOpen={onDocOpen} />
                    ) : docPath.includes('system_overview.md') ? (
                      <SystemOverviewPreview onDocOpen={onDocOpen} />
                    ) : docPath.includes('mcp_overview.md') ? (
                      <McpOverviewPreview onDocOpen={onDocOpen} />
                    ) : docPath.includes('memory_overview.md') ? (
                      <MemoryOverviewPreview onDocOpen={onDocOpen} />
                    ) : null}
                    </div>
                  ) : shouldShowMarkdown ? (
                    <MarkdownBody
                      markdown={markdownContent}
                      basePath={basePath}
                      variant={isRunbookDoc ? 'runbook' : 'default'}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4 text-xs">
                      {content}
                    </pre>
                  )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}


function resolveDocUrl(url: string, basePath: string) {
  if (!url) return url;
  if (url.startsWith('http') || url.startsWith('https')) return url;
  const docRoot = getDocRoot(basePath);
  if (url.startsWith('/')) {
    if (docRoot && url.startsWith('/docs/')) {
      return `${docRoot}${url.slice(1)}`;
    }
    return url;
  }
  if (!docRoot) {
    if (!basePath) return url;
    return `${basePath}${url}`;
  }

  let cleaned = url;
  if (cleaned.startsWith('./')) {
    cleaned = cleaned.slice(2);
  }
  while (cleaned.startsWith('../')) {
    cleaned = cleaned.slice(3);
  }
  const mapped = mapDocAlias(cleaned, docRoot);
  return mapped ?? `${docRoot}${cleaned}`;
}

function rewriteHtmlUrls(html: string, basePath: string) {
  return html.replace(/(src|href)=\"(.*?)\"/g, (match, attr, url) => {
    if (!url || url.startsWith('http') || url.startsWith('https') || url.startsWith('/') || url.startsWith('#')) {
      return match;
    }
    return `${attr}=\"${resolveDocUrl(url, basePath)}\"`;
  });
}

function normalizeMarkdown(text: string) {
  if (!text) return text;
  return text
    .replace(/<details[^>]*>/gi, '\n')
    .replace(/<\/details>/gi, '\n')
    .replace(/<summary[^>]*>(.*?)<\/summary>/gi, (_, title) => `\n**${title.trim()}**\n`)
    .replace(/<br\s*\/?>/gi, '\n');
}

function getDocRoot(basePath: string) {
  const roots = [
    '/files/fridai_core_docs/',
    '/files/model_eval_docs/',
    '/files/datalake_exten_docs/',
    '/files/datalake_pipelines_docs/',
    '/files/dirty_birds_docs/',
  ];
  return roots.find((root) => basePath.includes(root)) ?? '';
}

function mapDocAlias(path: string, docRoot: string) {
  if (!docRoot.includes('/files/fridai_core_docs/')) return null;
  let key = path;
  if (key.startsWith('docs/')) key = key.slice(5);
  if (key.startsWith('guides/')) key = key.slice(7);
  if (key.startsWith('runbooks/')) key = key.slice(9);
  const map: Record<string, string> = {
    'README.md': 'README.md',
    'START_HERE.md': 'START_HERE.md',
    'NAVIGATION.md': 'NAVIGATION.md',
    'SYSTEM_FLOW.md': 'SYSTEM_FLOW.md',
    'SCHEMA_GUIDE.md': 'SCHEMA_GUIDE.md',
    'CLI_REFERENCE.md': 'CLI_REFERENCE.md',
    'MCP-SERVICES-GUIDE.md': 'MCP_SERVICES_GUIDE.md',
    'SYSTEM_RUNBOOK.md': 'SYSTEM_RUNBOOK.md',
    'TESTING.md': 'TESTING.md',
    'packages/system/overview.md': 'system_overview.md',
    'packages/mcp/overview.md': 'mcp_overview.md',
    'packages/memory/overview.md': 'memory_overview.md',
    'docs/assets/fridai_hero_banner.png': 'docs/assets/fridai_hero_banner.png',
  };
  const mapped = map[key] ?? map[path];
  return mapped ? `${docRoot}${mapped}` : null;
}

function MermaidBlock({ code }: { code: string }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    const id = `mermaid-${Math.random().toString(36).slice(2)}`;
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (!active) return;
        setSvg(svg);
        setStatus('ready');
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message);
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [code]);

  if (error) {
    return (
      <pre className="whitespace-pre-wrap rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4 text-xs">
        {code}
      </pre>
    );
  }

  if (status === 'loading') {
    return (
      <div className="rounded-2xl border-[2px] border-[#2b2a27] bg-[#fff7e6] p-4 text-xs text-[#2b2a27]">
        Rendering diagram…
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border-[2px] border-[#2b2a27] bg-white p-3"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function MarkdownBody({
  markdown,
  basePath,
  variant = 'default',
}: {
  markdown: string;
  basePath: string;
  variant?: 'default' | 'runbook';
}) {
  const isRunbook = variant === 'runbook';
  const rootClassName = isRunbook
    ? 'space-y-4 text-[#2b2a27] leading-relaxed'
    : 'space-y-4 text-[#2b2a27] leading-relaxed';
  const inlineCodeClass = isRunbook
    ? 'rounded bg-[#fff7e6] px-1 py-0.5 font-mono text-[11px] text-[#2b2a27]'
    : 'font-mono text-xs text-[#2b2a27]';

  return (
    <div className={rootClassName}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        urlTransform={(uri) => resolveDocUrl(uri, basePath)}
        components={{
        h1: ({ children }) =>
          isRunbook ? (
            <div className="rounded-[26px] border-[3px] border-[#2b2a27] bg-[#fff2d9] p-6 shadow-[6px_6px_0_#2b2a27]">
              <div className="text-[11px] uppercase tracking-[0.35em] text-[#2b2a27]">
                Runbook
              </div>
              <h1 className="mt-2 text-3xl font-black text-[#2b2a27]">{children}</h1>
            </div>
          ) : (
            <h1 className="text-2xl font-black text-[#2b2a27]">{children}</h1>
          ),
        h2: ({ children }) => (
          <h2
            className={`${
              isRunbook ? 'text-lg font-black border-b-2 border-[#2b2a27]/40 pb-1' : 'text-xl font-black'
            } text-[#2b2a27]`}
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className={`${isRunbook ? 'text-base font-semibold' : 'text-lg font-black'} text-[#2b2a27]`}>
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className={`${isRunbook ? 'text-sm font-semibold uppercase tracking-wider' : 'text-base font-black'} text-[#2b2a27]`}>
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="text-sm leading-relaxed text-[#2b2a27]">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className={`list-disc ${isRunbook ? 'space-y-2' : 'space-y-1'} pl-5 text-sm`}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className={`list-decimal ${isRunbook ? 'space-y-2' : 'space-y-1'} pl-5 text-sm`}>
            {children}
          </ol>
        ),
        blockquote: ({ children }) =>
          isRunbook ? (
            <blockquote className="rounded-xl border-l-4 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-sm italic">
              {children}
            </blockquote>
          ) : (
            <blockquote className="rounded-2xl border-[2px] border-[#2b2a27] bg-[#fff7e6] p-3 text-sm italic">
              {children}
            </blockquote>
          ),
        hr: () => <hr className="border-[#2b2a27]" />,
        pre: ({ children }) => <>{children}</>,
        code: ({ className, children }) => {
          const languageMatch = /language-(\w+)/.exec(className || '');
          const code = String(children).replace(/\n$/, '');
          const isInline = !className && !code.includes('\n');
          if (!isInline && languageMatch?.[1] === 'mermaid') {
            if (isRunbook) return null;
            return <MermaidBlock code={code} />;
          }
          if (isInline) {
            return <code className={inlineCodeClass}>{children}</code>;
          }
          const lines = code.split('\n');
          if (isRunbook && (lines.length <= 2 || !code.includes('\n'))) {
            return (
              <p className="text-sm">
                <code className={inlineCodeClass}>{code}</code>
              </p>
            );
          }
          if (isRunbook) {
            return (
              <pre className="whitespace-pre-wrap rounded-xl border-[2px] border-[#2b2a27] bg-[#fff7e6] p-3 text-xs">
                <code className="font-mono text-[#2b2a27]">{code}</code>
              </pre>
            );
          }
          return (
            <pre className="whitespace-pre-wrap rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4 text-xs">
              <code>{code}</code>
            </pre>
          );
        },
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
            {children}
          </a>
        ),
        img: ({ src, alt }) => (
          <img src={src} alt={alt} className="my-2 max-w-full rounded-xl border-[2px] border-[#2b2a27]"
          loading="lazy"
                        />
        ),
        div: ({ className, children }) => {
          if (className?.includes('doc-tile')) {
            return (
              <div className="space-y-2 rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff2d9] p-4 shadow-[4px_4px_0_#2b2a27]">
                {children}
              </div>
            );
          }
          if (className?.includes('runbook-subtile')) {
            return (
              <div className="space-y-2 rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff2d9] p-4 shadow-[4px_4px_0_#2b2a27]">
                {children}
              </div>
            );
          }
          return <div className={className}>{children}</div>;
        },
        table: ({ children }) => (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border-b-2 border-[#2b2a27] px-2 py-1 text-left">{children}</th>
        ),
        td: ({ children }) => (
          <td className="border-b border-[#d7c7ad] px-2 py-1">{children}</td>
        ),
        details: ({ children }) =>
          isRunbook ? (
            <details className="rounded-xl border-2 border-[#2b2a27] bg-white px-3 py-2">
              {children}
            </details>
          ) : (
            <details className="rounded-2xl border-[2px] border-[#2b2a27] bg-white p-3">
              {children}
            </details>
          ),
        summary: ({ children }) => (
          <summary className="cursor-pointer font-semibold text-[#2b2a27]">{children}</summary>
        ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

function extractRunbookMeta(markdown: string) {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const updatedMatch = markdown.match(/\*\*Last Updated:\*\*\s*([^\n]+)/i);
  const taglineMatch = markdown.match(/^>\s*(.+)$/m);
  return {
    title: titleMatch?.[1]?.trim() ?? '',
    updated: updatedMatch?.[1]?.trim() ?? '',
    tagline: taglineMatch?.[1]?.trim() ?? '',
  };
}

function stripRunbookMeta(text: string) {
  if (!text) return text;
  return text
    .replace(/^>\s*.*$/m, '')
    .replace(/\*\*Last Updated:\*\*.*$/im, '')
    .replace(/^\s*---\s*$/m, '')
    .trim();
}

function wrapRunbookSubtile(markdown: string, heading: string) {
  if (!markdown) return markdown;
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(^###\\s+${escaped}[\\s\\S]*?)(?=^###\\s+|\\Z)`, 'm');
  if (!regex.test(markdown)) return markdown;
  return markdown.replace(regex, (match) => `\n<div class="runbook-subtile">\n${match}\n</div>\n`);
}

function RunbookPreview({
  title: _title,
  markdown,
  basePath,
  variant,
}: {
  title: string;
  markdown: string;
  basePath: string;
  variant: 'default' | 'system';
}) {
  const sections = useMemo(() => splitRunbookSections(markdown), [markdown]);
  const meta = useMemo(() => extractRunbookMeta(markdown), [markdown]);
  const intro = useMemo(() => stripRunbookMeta(sections.intro), [sections.intro]);

  if (variant === 'system') {
    const getSection = (pattern: RegExp) =>
      sections.items.find((item) => pattern.test(item.title));
    const execSummary = getSection(/Executive Summary/i);
    const systemAtGlance = getSection(/System At A Glance/i);
    const executionLifecycle = getSection(/Execution Lifecycle/i);
    const authNotes = getSection(/Authentication\s*&\s*Security/i);
    const localDockerRaw = getSection(/Local Docker|Sandbox Images/i);
    const approvalFlow = getSection(/Approval Decision Flow/i);
    const localDockerBody = localDockerRaw
      ? wrapRunbookSubtile(localDockerRaw.body, 'Adversarial CI Policy')
      : '';
    const executionBodyParts = [
      executionLifecycle?.body,
      authNotes ? `### ${authNotes.title}\n\n${authNotes.body}` : '',
    ].filter(Boolean);
    const executionBody = executionBodyParts.join('\n\n---\n\n');
    const executionTitle = executionLifecycle?.title || authNotes?.title || 'Execution Lifecycle';
    const tiles = [
      execSummary
        ? { key: execSummary.title, title: execSummary.title, body: execSummary.body }
        : null,
      systemAtGlance
        ? {
            key: systemAtGlance.title,
            title: systemAtGlance.title,
            body: systemAtGlance.body,
            compact: true,
          }
        : null,
      executionBody
        ? { key: executionTitle, title: executionTitle, body: executionBody }
        : null,
      localDockerRaw
        ? {
            key: localDockerRaw.title,
            title: localDockerRaw.title,
            body: localDockerBody || localDockerRaw.body,
          }
        : null,
      approvalFlow
        ? {
            key: approvalFlow.title,
            title: approvalFlow.title,
            body: approvalFlow.body,
            forceLeft: true,
          }
        : null,
    ].filter(Boolean) as Array<{
      key: string;
      title: string;
      body: string;
      compact?: boolean;
      forceLeft?: boolean;
    }>;

    return (
      <div className="space-y-4 text-[#2b2a27]">
        {intro && (
          <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] uppercase tracking-[0.3em]">Runbook Preview</div>
            </div>
            {meta.tagline && <p className="mt-2 text-sm italic">{meta.tagline}</p>}
            <div className="mt-3 space-y-3">
              <MarkdownBody markdown={intro} basePath={basePath} variant="runbook" />
            </div>
          </section>
        )}

        <section className="grid gap-4 lg:grid-cols-2">
          {tiles.map((item) => (
            <div
              key={item.key}
              className={`rounded-2xl border-[3px] border-[#2b2a27] bg-white ${
                item.compact ? 'p-3' : 'p-4'
              } ${item.forceLeft ? 'lg:col-start-1' : ''}`}
            >
              <div
                className={`uppercase tracking-[0.3em] ${
                  item.compact ? 'text-[10px]' : 'text-[11px]'
                }`}
              >
                {item.title}
              </div>
              <div className={`${item.compact ? 'mt-2' : 'mt-3'} space-y-3`}>
                <MarkdownBody markdown={item.body} basePath={basePath} variant="runbook" />
              </div>
            </div>
          ))}
        </section>

      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#2b2a27]">
      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] uppercase tracking-[0.3em]">Runbook Preview</div>
        </div>
        {meta.tagline && <p className="mt-2 text-sm italic">{meta.tagline}</p>}
        <div className="mt-4 space-y-4">
          <MarkdownBody markdown={markdown} basePath={basePath} variant="runbook" />
        </div>
      </section>
    </div>
  );
}

function splitRunbookSections(markdown: string) {
  const matches = [...markdown.matchAll(/^##\s+(.+)$/gm)];
  if (matches.length === 0) {
    return { intro: markdown.trim(), items: [] as { title: string; body: string }[] };
  }
  const intro = markdown.slice(0, matches[0].index).trim();
  const items = matches.map((match, idx) => {
    const title = match[1].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = idx + 1 < matches.length ? matches[idx + 1].index ?? markdown.length : markdown.length;
    const body = markdown.slice(start, end).trim();
    return { title, body };
  });
  return { intro, items };
}

function SystemFlowPreview({ onDocOpen }: { onDocOpen: (link: DocLink) => void }) {
  return (
    <div className="space-y-8 text-[#2b2a27]">
      <section className="rounded-[28px] border-[3px] border-[#2b2a27] bg-[#fff2d9] p-6 shadow-[8px_8px_0_#2b2a27]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.4em] text-[#2b2a27]">
              FridAI Core Preview
            </div>
            <h1 className="mt-2 text-3xl font-black text-[#2b2a27]">
              System Flow: From Intent to Trusted Automation
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#2b2a27]">
              A governance‑first execution engine that turns specs into auditable outcomes.
              This pre‑release preview highlights the stable path that powers the core.
            </p>
          </div>
          <div className="rounded-full border-2 border-[#2b2a27] bg-white px-4 py-2 text-[10px] uppercase tracking-widest">
            Preview Release · March 15, 2026
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border-[3px] border-[#2b2a27] bg-white p-6">
        <div className="text-[11px] uppercase tracking-[0.35em] text-[#2b2a27]">
          System Map (High-Level Architecture)
        </div>
        <p className="mt-3 text-sm text-[#2b2a27]">
          This is the most complete view of the FridAI Core runtime: clients flow into the
          MCP Hub, specs route through the System Service, and execution is governed by
          approvals, sandboxing, and memory services.
        </p>
        <div className="mt-4">
          <div className="origin-top-left scale-[0.9]">
            <SystemFlowDiagramSVG />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[26px] border-[3px] border-[#2b2a27] bg-[#fffef7] p-6">
          <div className="text-[11px] uppercase tracking-[0.35em] text-[#2b2a27]">
            Core Promise
          </div>
          <p className="mt-3 text-sm text-[#2b2a27]">
            FridAI Core exists to make multi‑tool automation safe, repeatable, and
            inspectable. Specs become the contract, presets set the guardrails, and the
            system enforces a traceable path from ask → action → proof.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#2b2a27]">
            <li>Unify tools + remotes behind the MCP hub with policy‑aware routing.</li>
            <li>Preserve context and learnings via memory‑indexed execution trails.</li>
            <li>Make risky operations explicit through approvals and sandbox gates.</li>
          </ul>
        </div>
        <div className="rounded-[26px] border-[3px] border-[#2b2a27] bg-[#fffef7] p-6">
          <div className="text-[11px] uppercase tracking-[0.35em] text-[#2b2a27]">
            Design Rules
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#2b2a27]">
            <li>Specs are the interface — humans and agents speak the same contract.</li>
            <li>Every run emits artifacts, provenance, and policy outcomes.</li>
            <li>Profiles define what the system can do, not just what it should do.</li>
            <li>Security is layered: IAM, RBAC, approvals, then sandbox isolation.</li>
          </ul>
          <div className="mt-4 rounded-2xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-xs text-[#2b2a27]">
            This preview focuses on execution flow. APIs, handlers, and UI surfaces may
            shift before release.
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border-[3px] border-[#2b2a27] bg-white p-6">
        <div className="text-[11px] uppercase tracking-[0.35em] text-[#2b2a27]">
          Spec Execution Flow Schematic
        </div>
        <div className="mt-4 overflow-x-auto">
          <div className="origin-top-left scale-[0.9]">
            <svg
              viewBox="0 0 920 210"
              className="min-w-[820px]"
              role="img"
              aria-label="FridAI Core system flow schematic"
            >
              <defs>
                <marker
                  id="arrow"
                markerWidth="10"
                markerHeight="10"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6" fill="#2b2a27" />
              </marker>
            </defs>
            <rect x="20" y="60" width="120" height="70" rx="14" fill="#fff2d9" stroke="#2b2a27" strokeWidth="3" />
            <text x="80" y="98" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b2a27">Intent</text>

            <rect x="170" y="60" width="140" height="70" rx="14" fill="#fff7e6" stroke="#2b2a27" strokeWidth="3" />
            <text x="240" y="90" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b2a27">Spec + Plan</text>
            <text x="240" y="108" textAnchor="middle" fontSize="10" fill="#2b2a27">schema + tasks</text>

            <rect x="340" y="60" width="140" height="70" rx="14" fill="#fffef7" stroke="#2b2a27" strokeWidth="3" />
            <text x="410" y="90" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b2a27">Validate</text>
            <text x="410" y="108" textAnchor="middle" fontSize="10" fill="#2b2a27">guardrails</text>

            <rect x="510" y="60" width="140" height="70" rx="14" fill="#fff7e6" stroke="#2b2a27" strokeWidth="3" />
            <text x="580" y="90" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b2a27">Approval</text>
            <text x="580" y="108" textAnchor="middle" fontSize="10" fill="#2b2a27">policy gates</text>

            <rect x="680" y="60" width="140" height="70" rx="14" fill="#fff2d9" stroke="#2b2a27" strokeWidth="3" />
            <text x="750" y="90" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b2a27">Execute</text>
            <text x="750" y="108" textAnchor="middle" fontSize="10" fill="#2b2a27">sandboxed</text>

            <rect x="830" y="60" width="70" height="70" rx="14" fill="#fffef7" stroke="#2b2a27" strokeWidth="3" />
            <text x="865" y="90" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b2a27">Audit</text>
            <text x="865" y="108" textAnchor="middle" fontSize="10" fill="#2b2a27">+ memory</text>

            <line x1="140" y1="95" x2="170" y2="95" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#arrow)" />
            <line x1="310" y1="95" x2="340" y2="95" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#arrow)" />
            <line x1="480" y1="95" x2="510" y2="95" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#arrow)" />
            <line x1="650" y1="95" x2="680" y2="95" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#arrow)" />
            <line x1="820" y1="95" x2="830" y2="95" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#arrow)" />
            </svg>
          </div>
        </div>
        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {[
            {
              title: '1. Intent Capture',
              desc: 'Specs describe the ask, constraints, and success criteria.',
            },
            {
              title: '2. Plan + Tasks',
              desc: 'Plans break work into guarded steps with handler selection.',
            },
            {
              title: '3. Validation',
              desc: 'Schemas, profiles, and safety rules are enforced before action.',
            },
            {
              title: '4. Approval Gate',
              desc: 'Sensitive paths pause for explicit authorization.',
            },
            {
              title: '5. Sandbox Execute',
              desc: 'Handlers run in isolated environments with strict limits.',
            },
            {
              title: '6. Audit + Memory',
              desc: 'Artifacts and outcomes are logged, indexed, and searchable.',
            },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border-2 border-[#2b2a27] bg-[#fffef7] p-4"
            >
              <div className="text-sm font-semibold text-[#2b2a27]">{step.title}</div>
              <p className="mt-1 text-xs text-[#2b2a27]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[26px] border-[3px] border-[#2b2a27] bg-[#fff7e6] p-6">
        <div className="text-[11px] uppercase tracking-[0.35em] text-[#2b2a27]">
          Deep Dives
        </div>
        <p className="mt-2 text-xs text-[#2b2a27]/60">
          Click any doc to open it here as a readable preview.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Schema Guide', desc: 'Spec + plan + task field reference', href: '/files/fridai_core_docs/SCHEMA_GUIDE.md' },
            { label: 'CLI Reference', desc: 'Commands, flags, and usage examples', href: '/files/fridai_core_docs/CLI_REFERENCE.md' },
            { label: 'System Runbook', desc: 'Startup, health checks, and ops notes', href: '/files/fridai_core_docs/SYSTEM_RUNBOOK.md' },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => onDocOpen(link)}
              className="rounded-2xl border-2 border-[#2b2a27] bg-white p-3 text-left transition-shadow hover:shadow-[3px_3px_0_#2b2a27]"
            >
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#2b2a27]">{link.label}</div>
              <div className="mt-1 text-[10px] text-[#2b2a27]/60">{link.desc}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SystemOverviewPreview({ onDocOpen }: { onDocOpen: (link: DocLink) => void }) {
  return (
    <div className="space-y-6 text-[#2b2a27]">
      <section className="rounded-[26px] border-[3px] border-[#2b2a27] bg-[#fff2d9] p-6 shadow-[6px_6px_0_#2b2a27]">
        <div className="text-[11px] uppercase tracking-[0.35em]">System Overview</div>
        <h2 className="mt-2 text-3xl font-black">FridAI Core Runtime</h2>
        <p className="mt-2 text-sm">
          A unified execution layer that turns specs into audited work across tools, memory,
          and governance controls.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Primary Services</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>System Service (FastAPI): validation, planning, execution.</li>
            <li>MCP Hub: tool/resource gateway with profile governance.</li>
            <li>Memory MCP: search, write, publish, and retrieval.</li>
          </ul>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Execution Guarantees</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>Specs are canonical and validated before any work runs.</li>
            <li>Approvals gate sensitive operations.</li>
            <li>Run history + artifacts are captured by default.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Service Map</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { title: 'System Service', desc: 'Validates specs, builds task plans, executes handlers.' },
            { title: 'MCP Hub', desc: 'JSON‑RPC gateway with allowlists + API key auth.' },
            { title: 'Memory MCP', desc: 'Search, write, and publish context cards.' },
            { title: 'Handlers', desc: 'Execution units with approval classes + sandbox flags.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-xs">
              <div className="font-semibold">{item.title}</div>
              <div className="mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Governance &amp; Security</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>Approval workflows for sensitive handlers.</li>
            <li>Sandbox isolation with resource limits + no network by default.</li>
            <li>IAM + RBAC policies layered with profile allowlists.</li>
            <li>Secrets rotation and audit logging by default.</li>
          </ul>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Operational Signals</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              'run_history.json',
              'approval ledger',
              'handler audit logs',
              'artifact manifests',
              'notification events',
              'memory cards',
            ].map((item) => (
              <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-xs">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Config Surface</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`config/presets/*.yaml
FRIDAI_PROFILE
execution.approvals
execution.sandbox
execution.notifications`}
          </pre>
          <div className="mt-2 text-xs">
            Presets are canonical. Legacy profiles exist only for backwards compatibility.
          </div>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Artifact Outputs</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>Run history (JSON) + audit logs.</li>
            <li>Artifacts stored to /app/artifacts and optional GCS.</li>
            <li>Memory cards published for discovery.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Runtime States</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {['Queued', 'Validating', 'Awaiting Approval', 'Executing', 'Completed', 'Failed'].map(
            (item) => (
              <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-xs">
                {item}
              </div>
            )
          )}
        </div>
        <div className="mt-3 text-xs">
          States are persisted in run history for replay, audit, and incident response.
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Example Spec Skeleton</div>
        <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`intent:
  summary: \"Sync analytics dashboard\"
plan:
  - step: \"Validate sources\"
tasks:
  - id: \"refresh_dashboard\"
    handler: \"looker.refresh\"
guardrails:
  approvals_required: true`}
        </pre>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">CLI Surface (Preview)</div>
        <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`fridai spec validate ./spec.yaml
fridai spec exec ./spec.yaml
fridai approvals list
fridai history --tail 50
fridai memory search "spec_id:phase_3"`}
        </pre>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Handler Catalog (By Domain)</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { title: 'Git Ops', items: ['git_pull', 'git_status', 'git_commit', 'git_push'] },
            { title: 'Cloud', items: ['gcs_read', 'gcs_write', 'dataflow_submit'] },
            { title: 'BigQuery', items: ['bq_query', 'bq_execute', 'bq_forecast'] },
            { title: 'Approvals', items: ['spec_approval_request', 'spec_approval_record'] },
            { title: 'Workflows', items: ['spec_exec', 'spec_run_status', 'spec_validate'] },
            { title: 'Memory', items: ['memory.search', 'memory.write', 'memory.recent'] },
          ].map((group) => (
            <div key={group.title} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-xs">
              <div className="font-semibold">{group.title}</div>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Approval + Policy Workflow</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {[
            'spec_exec requested',
            'policy check',
            'approval required?',
            'approval record',
            'exec resume',
            'audit + notify',
          ].map((item) => (
            <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-xs">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs">
          Approval gate is mandatory for sensitive handlers; denials are recorded and returned to the caller.
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Memory Flow (Write + Publish)</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`spec_exec → artifacts
memory.write(card)
memory.publish(gcs://bucket/cards)
memory.search("spec_id:phase_3")`}
          </pre>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Memory Card Shape</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`{
  "spec_id": "PHASE_3_EXECUTION_NOTES",
  "summary": "Execution completed",
  "tags": ["approval", "artifact"],
  "artifact_uri": "gcs://.../report.md"
}`}
          </pre>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">CLI Surface (Expanded)</div>
        <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`fridai spec validate ./spec.yaml --profile default
fridai spec exec ./spec.yaml --dry-run
fridai approvals list --state pending
fridai approvals approve --id 123
fridai history --tail 50 --json
fridai memory search "tags:approval"
fridai mcp status
fridai mcp install`}
        </pre>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Handler Taxonomy</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              'read_only',
              'sensitive',
              'infrastructure',
              'financial',
              'dataflow',
              'git_ops',
            ].map((item) => (
              <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-xs">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs">
            Each handler declares class + sandbox requirements; approvals are enforced per profile.
          </div>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Sandbox Policy Matrix</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              'network: default none',
              'fs: /app/artifacts only',
              'uid: non-root',
              'caps: dropped',
              'seccomp: default',
              'tmpfs: /tmp',
            ].map((item) => (
              <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-xs">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Approval Record Schema</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`{
  "handler_id": "git_push",
  "handler_class": "infrastructure",
  "requested_by": "user|agent",
  "summary": "Push release tag",
  "run_id": "run_2026_02_11_001",
  "decision": "approve|deny",
  "approver": "ops_lead"
}`}
          </pre>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Memory Store Config</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`FRIDAI_MEMORY_STORE=hybrid
FRIDAI_MEMORY_GCS_BUCKET=fridai-memory
FRIDAI_MEMORY_PINECONE_INDEX=spec-cards
FRIDAI_MEMORY_MCP_URL=http://localhost:8899`}
          </pre>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Run History Entry (Preview)</div>
        <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`{
  "run_id": "run_2026_02_11_001",
  "spec_id": "PHASE_3_EXECUTION_NOTES",
  "status": "success",
  "started_at": "2026-02-11T19:06:12Z",
  "ended_at": "2026-02-11T19:07:58Z",
  "artifacts": ["report.md", "diff.patch"],
  "notifications": ["slack", "email"]
}`}
        </pre>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Dive Deeper</div>
        <p className="mt-2 text-xs text-[#2b2a27]/60">
          Click any doc to open it here as a readable preview.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Schema Guide', desc: 'Spec + plan + task field reference', href: '/files/fridai_core_docs/SCHEMA_GUIDE.md' },
            { label: 'System Runbook', desc: 'Startup, health checks, and ops notes', href: '/files/fridai_core_docs/SYSTEM_RUNBOOK.md' },
            { label: 'MCP Overview', desc: 'Tool gateway, routing, and auth', href: '/files/fridai_core_docs/mcp_overview.md' },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => onDocOpen(link)}
              className="rounded-2xl border-2 border-[#2b2a27] bg-white p-3 text-left transition-shadow hover:shadow-[3px_3px_0_#2b2a27]"
            >
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#2b2a27]">{link.label}</div>
              <div className="mt-1 text-[10px] text-[#2b2a27]/60">{link.desc}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function McpOverviewPreview({ onDocOpen }: { onDocOpen: (link: DocLink) => void }) {
  return (
    <div className="space-y-6 text-[#2b2a27]">
      <section className="rounded-[26px] border-[3px] border-[#2b2a27] bg-[#fff2d9] p-6 shadow-[6px_6px_0_#2b2a27]">
        <div className="text-[11px] uppercase tracking-[0.35em]">MCP Overview</div>
        <h2 className="mt-2 text-3xl font-black">Tool + Resource Gateway</h2>
        <p className="mt-2 text-sm">
          The MCP hub brokers every tool call through auth, allowlists, and profile governance.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">What It Does</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>Receives JSON‑RPC from assistants, CLI, and IDE clients.</li>
            <li>Applies tool/resource allowlists per active profile.</li>
            <li>Routes to System Service or Memory MCP.</li>
          </ul>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Key Interfaces</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>Spec tools: validate, exec, version, help.</li>
            <li>Approval tools: request, record, callbacks.</li>
            <li>Memory tools: search, write, recent.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Request Params (Common)</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { tool: 'spec_validate', params: 'spec_id | profile' },
            { tool: 'spec_exec', params: 'spec_id | profile | dry_run?' },
            { tool: 'spec_find', params: 'query | profile | limit?' },
            { tool: 'spec_approval_request', params: 'handler_id | handler_class | summary' },
            { tool: 'spec_callbacks_register', params: 'run_id | callback_url' },
            { tool: 'memory.search', params: 'query | top_k | filters?' },
          ].map((row) => (
            <div key={row.tool} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-xs">
              <div className="font-semibold">{row.tool}</div>
              <div className="mt-1">{row.params}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Stack Callout</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {['FastAPI hub', 'FastMCP runtime', 'JSON‑RPC gateway'].map((item) => (
            <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-xs">
              {item}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs">
          Aggregates and filters MCP servers/tools, with profile guardrails enforcing
          permissions, allowlists, and tool exposure.
        </p>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">MCP Gateway Diagram</div>
        <div className="mt-3">
          <svg viewBox="0 0 860 260" className="w-full" role="img" aria-label="MCP gateway flow">
            <defs>
              <marker id="mcp-arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#2b2a27" />
              </marker>
            </defs>
            <rect x="20" y="90" width="120" height="60" rx="12" fill="#fff2d9" stroke="#2b2a27" strokeWidth="3" />
            <text x="80" y="124" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2b2a27">Clients</text>

            <rect x="170" y="70" width="170" height="100" rx="14" fill="#fff7e6" stroke="#2b2a27" strokeWidth="3" />
            <text x="255" y="100" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2b2a27">MCP Hub</text>
            <text x="255" y="118" textAnchor="middle" fontSize="9" fill="#2b2a27">Auth + Allowlist</text>
            <text x="255" y="136" textAnchor="middle" fontSize="9" fill="#2b2a27">Dispatch</text>

            <rect x="370" y="20" width="180" height="80" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="3" />
            <text x="460" y="52" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2b2a27">System Service</text>
            <text x="460" y="70" textAnchor="middle" fontSize="9" fill="#2b2a27">spec_* tools</text>

            <rect x="370" y="140" width="180" height="80" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="3" />
            <text x="460" y="172" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2b2a27">Memory MCP</text>
            <text x="460" y="190" textAnchor="middle" fontSize="9" fill="#2b2a27">memory.* tools</text>

            <rect x="590" y="40" width="120" height="60" rx="12" fill="#fff7e6" stroke="#2b2a27" strokeWidth="3" />
            <text x="650" y="74" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2b2a27">Remotes</text>

            <rect x="590" y="150" width="120" height="60" rx="12" fill="#fff7e6" stroke="#2b2a27" strokeWidth="3" />
            <text x="650" y="184" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2b2a27">Artifacts</text>

            <line x1="140" y1="120" x2="170" y2="120" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#mcp-arrow)" />
            <line x1="340" y1="110" x2="370" y2="80" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#mcp-arrow)" />
            <line x1="340" y1="130" x2="370" y2="160" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#mcp-arrow)" />
            <line x1="550" y1="60" x2="590" y2="70" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#mcp-arrow)" />
            <line x1="550" y1="180" x2="590" y2="180" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#mcp-arrow)" />
          </svg>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Gateway Path</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {[
            'Client → JSON‑RPC',
            'API Key Auth',
            'Profile Allowlist',
            'System Bridge',
            'Memory Proxy',
            'Run History',
            'Notifications',
            'Artifacts',
          ].map((item) => (
            <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-xs">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Callback Lifecycle</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {[
            'spec_exec pauses',
            'callbacks_register',
            'external approval',
            'callbacks_resume',
            'spec_run_status',
            'audit + notify',
          ].map((item) => (
            <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-xs">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fffef7] p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Governance Hooks</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {['API key auth', 'Profile allowlists', 'Remote adapters', 'Audit trail', 'Rate controls', 'CLI orchestration'].map(
            (item) => (
              <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-white px-3 py-2 text-xs">
                {item}
              </div>
            )
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Config Surface</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`FRIDAI_PROFILE=default
config/presets/*.yaml
ProfileConfig.mcp.enabled_tools
ProfileConfig.mcp.enabled_resources
mcp.remotes[*]`}
          </pre>
          <div className="mt-2 text-xs">Presets define what MCP can expose per environment.</div>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Remote Adapters</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {['HTTP remotes', 'stdio remotes', 'adapter registry', 'TLS support', 'secrets injection', 'allowlist validation'].map(
              (item) => (
                <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-xs">
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Profile Allowlist (Sample)</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`mcp:
  enabled_tools:
    - spec_validate
    - spec_exec
    - spec_find
    - memory.search
  enabled_resources:
    - gcs_read
    - github_get_commit`}
          </pre>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Remote Registry (Sample)</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`mcp:
  remotes:
    - name: "github"
      transport: "http"
      url: "https://mcp.github.local"
      api_key_env: "GITHUB_MCP_KEY"`}
          </pre>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Enabled Tools (Sample Profile)</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            'spec_validate',
            'spec_exec',
            'spec_find',
            'spec_help',
            'spec_version_check',
            'spec_approval_request',
            'spec_approval_record',
            'spec_callbacks_register',
            'spec_callbacks_resume',
            'memory.search',
            'memory.write',
            'memory.recent',
          ].map((item) => (
            <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-xs">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Auth Headers</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`POST /mcp
X-API-Key: $FRIDAI_MCP_API_KEY
Content-Type: application/json`}
          </pre>
          <div className="mt-2 text-xs">API keys are validated before any allowlist checks.</div>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Rate Limits (Example)</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`mcp:
  rate_limits:
    default: 60/min
    spec_exec: 10/min
    memory.search: 120/min`}
          </pre>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Example Responses</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <pre className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`{"jsonrpc":"2.0","id":"req-7","result":{"valid":true}}`}
          </pre>
          <pre className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`{"jsonrpc":"2.0","id":"req-7","error":{"code":403,"message":"Tool not allowlisted"}}`}
          </pre>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Example Request</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`{
  "jsonrpc": "2.0",
  "id": "req-7",
  "method": "spec_validate",
  "params": { "spec_id": "PHASE_3_EXECUTION_NOTES" }
}`}
          </pre>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Error Modes</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>Unauthorized → invalid API key.</li>
            <li>Forbidden → tool/resource not in allowlist.</li>
            <li>Validation error → guardrail failure.</li>
            <li>Remote failure → adapter or remote error.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Validation Error (Example)</div>
        <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`{"jsonrpc":"2.0","id":"req-7","error":{"code":422,"message":"Guardrail violation","details":["approval required"]}}`}
        </pre>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Dive Deeper</div>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
          {[
            { label: 'CLI Reference', href: '/files/fridai_core_docs/CLI_REFERENCE.md' },
            { label: 'MCP Services', href: '/files/fridai_core_docs/MCP_SERVICES_GUIDE.md' },
            { label: 'System Overview', href: '/files/fridai_core_docs/system_overview.md' },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => onDocOpen(link)}
              className="rounded-full border-2 border-[#2b2a27] bg-white px-3 py-1 text-[10px] uppercase tracking-widest text-[#2b2a27]"
            >
              {link.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function MemoryOverviewPreview({ onDocOpen }: { onDocOpen: (link: DocLink) => void }) {
  return (
    <div className="space-y-6 text-[#2b2a27]">
      <section className="rounded-[26px] border-[3px] border-[#2b2a27] bg-[#fff2d9] p-6 shadow-[6px_6px_0_#2b2a27]">
        <div className="text-[11px] uppercase tracking-[0.35em]">Memory Overview</div>
        <h2 className="mt-2 text-3xl font-black">Vector Memory + Artifacts</h2>
        <p className="mt-2 text-sm">
          Memory MCP stores specs, runs, and cards so the system can discover, reuse, and audit context.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Core Capabilities</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>Search + retrieval for specs, runs, and insights.</li>
            <li>Publish cards to GCS and vector stores.</li>
            <li>Hybrid mode for metadata + embeddings.</li>
            <li>Vectorized indices with durable artifact storage.</li>
            <li>Enables RAG capabilities across specs and run history.</li>
          </ul>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Storage Targets</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>Local store for development.</li>
            <li>GCS for durable artifacts.</li>
            <li>Pinecone for vector search.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fffef7] p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Why It Matters</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            'Spec discovery',
            'Reusable workflows',
            'Searchable audit trail',
            'Cross‑run context',
            'Publishable cards',
            'Team memory',
          ].map((item) => (
            <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-white px-3 py-2 text-xs">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Memory API Surface</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>memory.search → vector search across cards/specs.</li>
            <li>memory.write → persist cards + metadata.</li>
            <li>memory.recent → pull latest context updates.</li>
            <li>memory.publish → store artifacts to GCS.</li>
          </ul>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Storage Matrix</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              'local (dev)',
              'GCS (artifacts)',
              'Pinecone (vectors)',
              'hybrid (vector + gcs)',
              'vector_gcs (split)',
              'metadata index',
            ].map((item) => (
              <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-xs">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Memory Flow (Write)</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`spec_exec → artifacts
memory.write(card)
memory.publish(gcs://bucket/cards)
memory.search("spec_id:phase_3")`}
          </pre>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Memory Card Schema</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`{
  "spec_id": "PHASE_3_EXECUTION_NOTES",
  "summary": "Execution completed",
  "tags": ["approval", "artifact"],
  "artifact_uri": "gcs://.../report.md",
  "vector_id": "mem_123"
}`}
          </pre>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Config Surface</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`FRIDAI_MEMORY_STORE=hybrid
FRIDAI_MEMORY_GCS_BUCKET=fridai-memory
FRIDAI_MEMORY_PINECONE_INDEX=spec-cards
FRIDAI_MEMORY_MCP_URL=http://localhost:8899`}
          </pre>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">CLI Surface (Memory)</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`fridai memory search "spec_id:phase_3"
fridai memory recent --tail 25
fridai memory publish ./artifact.md`}
          </pre>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Dive Deeper</div>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
          {[
            { label: 'Memory Overview', href: '/files/fridai_core_docs/memory_overview.md' },
            { label: 'Schema Guide', href: '/files/fridai_core_docs/SCHEMA_GUIDE.md' },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => onDocOpen(link)}
              className="rounded-full border-2 border-[#2b2a27] bg-white px-3 py-1 text-[10px] uppercase tracking-widest text-[#2b2a27]"
            >
              {link.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function McpServicesPreview({ onDocOpen }: { onDocOpen: (link: DocLink) => void }) {
  return (
    <div className="space-y-6 text-[#2b2a27]">
      <section className="rounded-[26px] border-[3px] border-[#2b2a27] bg-[#fff2d9] p-6 shadow-[6px_6px_0_#2b2a27]">
        <div className="text-[11px] uppercase tracking-[0.35em]">MCP Services</div>
        <h2 className="mt-2 text-3xl font-black">The Tool Gateway Surface</h2>
        <p className="mt-2 text-sm">
          A curated API layer that exposes spec validation, execution, approvals, and memory
          discovery through the MCP hub.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Core Endpoints</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>spec_validate → schema + guardrail enforcement.</li>
            <li>spec_exec → execute handlers with approvals.</li>
            <li>spec_find → memory-backed spec discovery.</li>
            <li>spec_help → CLI/API surface reference.</li>
          </ul>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Governance Hooks</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>spec_approval_request + spec_approval_record.</li>
            <li>Callbacks for pause/resume workflows.</li>
            <li>Profile allowlists filter what’s exposed.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Request Params (Common)</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { tool: 'spec_validate', params: 'spec_id | profile' },
            { tool: 'spec_exec', params: 'spec_id | profile | dry_run?' },
            { tool: 'spec_find', params: 'query | profile | limit?' },
            { tool: 'spec_approval_request', params: 'handler_id | handler_class | summary' },
            { tool: 'spec_callbacks_register', params: 'run_id | callback_url' },
            { tool: 'memory.search', params: 'query | top_k | filters?' },
          ].map((row) => (
            <div key={row.tool} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-xs">
              <div className="font-semibold">{row.tool}</div>
              <div className="mt-1">{row.params}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Tool Directory</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { name: 'spec_validate', desc: 'Validate intent, plan, tasks, guardrails.' },
            { name: 'spec_exec', desc: 'Execute a spec via handlers + approvals.' },
            { name: 'spec_find', desc: 'Search memory for related specs and cards.' },
            { name: 'spec_help', desc: 'Surface CLI + tool usage.' },
            { name: 'spec_version_check', desc: 'Compare cached specs to repo state.' },
            { name: 'spec_approval_request', desc: 'Create approval records.' },
            { name: 'spec_approval_record', desc: 'Record approve/deny decisions.' },
            { name: 'spec_callbacks_register', desc: 'Register resume callbacks.' },
            { name: 'spec_callbacks_resume', desc: 'Resume paused runs via callback token.' },
            { name: 'memory.search', desc: 'Vector search across cards and specs.' },
            { name: 'memory.write', desc: 'Persist cards to memory + storage.' },
            { name: 'memory.recent', desc: 'Fetch recent activity for context.' },
          ].map((item) => (
            <div key={item.name} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-xs">
              <div className="font-semibold">{item.name}</div>
              <div className="mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Per‑Tool Deep Dive</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            { name: 'spec_validate', params: '{ spec_id, profile }', result: '{ valid, errors[] }' },
            { name: 'spec_exec', params: '{ spec_id, profile, dry_run? }', result: '{ run_id, status, next }' },
            { name: 'spec_find', params: '{ query, profile, limit? }', result: '{ matches[] }' },
            { name: 'spec_approval_request', params: '{ handler_id, handler_class, summary }', result: '{ approval_id, status }' },
            { name: 'spec_callbacks_register', params: '{ run_id, callback_url }', result: '{ token }' },
            { name: 'memory.search', params: '{ query, top_k, filters? }', result: '{ results[] }' },
          ].map((item) => (
            <div key={item.name} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
              <div className="font-semibold">{item.name}</div>
              <div className="mt-1"><span className="font-semibold">params:</span> {item.params}</div>
              <div className="mt-1"><span className="font-semibold">result:</span> {item.result}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fffef7] p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Execution Path (Condensed)</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {['Client → Hub', 'Auth + Allowlist', 'System Service', 'Artifacts + Memory'].map(
            (item) => (
              <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-white px-3 py-2 text-xs">
                {item}
              </div>
            )
          )}
        </div>
        <div className="mt-3 text-xs">
          JSON‑RPC → profile filters → spec validation → approval gate → handler execution →
          run history + notifications.
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Profile Allowlist (Sample)</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`mcp:
  enabled_tools:
    - spec_validate
    - spec_exec
    - spec_find
    - memory.search
  enabled_resources:
    - gcs_read
    - github_get_commit`}
          </pre>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Remote Registry (Sample)</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`mcp:
  remotes:
    - name: "github"
      transport: "http"
      url: "https://mcp.github.local"
      api_key_env: "GITHUB_MCP_KEY"`}
          </pre>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Auth + Headers</div>
          <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`POST /mcp
X-API-Key: $FRIDAI_MCP_API_KEY
Content-Type: application/json`}
          </pre>
          <div className="mt-2 text-xs">
            Allowlist and profile filters are enforced before dispatch.
          </div>
        </div>
        <div className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
          <div className="text-[11px] uppercase tracking-[0.3em]">Error Modes</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>Invalid spec → validation errors returned.</li>
            <li>Approval required → blocked with approval error.</li>
            <li>Handler not found → registry error.</li>
            <li>Sandbox denied → policy enforcement error.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Callback Lifecycle</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {[
            'spec_exec pauses',
            'callbacks_register',
            'external approval',
            'callbacks_resume',
            'spec_run_status',
            'audit + notify',
          ].map((item) => (
            <div key={item} className="rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] px-3 py-2 text-xs">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Example Payload (Preview)</div>
        <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`{
  "jsonrpc": "2.0",
  "id": "req-42",
  "method": "spec_exec",
  "params": {
    "spec_id": "PHASE_3_EXECUTION_NOTES",
    "profile": "default"
  }
}`}
        </pre>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Example Response (Preview)</div>
        <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`{
  "jsonrpc": "2.0",
  "id": "req-42",
  "result": {
    "run_id": "run_2026_02_11_001",
    "status": "queued",
    "next": "spec_run_status"
  }
}`}
        </pre>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-white p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Validation Error (Example)</div>
        <pre className="mt-3 rounded-xl border-2 border-[#2b2a27] bg-[#fff7e6] p-3 text-[11px]">
{`{"jsonrpc":"2.0","id":"req-42","error":{"code":422,"message":"Guardrail violation","details":["approval required"]}}`}
        </pre>
      </section>

      <section className="rounded-2xl border-[3px] border-[#2b2a27] bg-[#fff7e6] p-4">
        <div className="text-[11px] uppercase tracking-[0.3em]">Dive Deeper</div>
        <p className="mt-2 text-xs text-[#2b2a27]/60">
          Click any doc to open it here as a readable preview.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'CLI Reference', desc: 'Commands, flags, and usage examples', href: '/files/fridai_core_docs/CLI_REFERENCE.md' },
            { label: 'MCP Overview', desc: 'Tool gateway, routing, and auth', href: '/files/fridai_core_docs/mcp_overview.md' },
            { label: 'System Overview', desc: 'Runtime layers and service map', href: '/files/fridai_core_docs/system_overview.md' },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => onDocOpen(link)}
              className="rounded-2xl border-2 border-[#2b2a27] bg-white p-3 text-left transition-shadow hover:shadow-[3px_3px_0_#2b2a27]"
            >
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#2b2a27]">{link.label}</div>
              <div className="mt-1 text-[10px] text-[#2b2a27]/60">{link.desc}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SystemFlowDiagramSVG() {
  return (
    <svg
      viewBox="0 0 900 1020"
      className="w-full"
      role="img"
      aria-label="FridAI Core high-level architecture flow"
    >
      <defs>
        <marker
          id="flow-arrow"
          markerWidth="10"
          markerHeight="10"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6" fill="#2b2a27" />
        </marker>
      </defs>

      {/* Clients */}
      <rect x="160" y="20" width="380" height="150" rx="18" fill="#fff2d9" stroke="#2b2a27" strokeWidth="3" />
      <text x="350" y="44" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b2a27">
        Clients
      </text>
      <rect x="190" y="62" width="140" height="32" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="260" y="83" textAnchor="middle" fontSize="11" fill="#2b2a27">
        fridai CLI
      </text>
      <rect x="350" y="62" width="170" height="32" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="435" y="83" textAnchor="middle" fontSize="11" fill="#2b2a27">
        Gemini / Claude
      </text>
      <rect x="190" y="104" width="330" height="32" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="355" y="126" textAnchor="middle" fontSize="11" fill="#2b2a27">
        IDE Integration
      </text>

      {/* MCP Hub */}
      <rect x="140" y="200" width="420" height="210" rx="18" fill="#fff7e6" stroke="#2b2a27" strokeWidth="3" />
      <text x="350" y="224" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b2a27">
        MCP Hub
      </text>
      <rect x="170" y="240" width="360" height="30" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="350" y="260" textAnchor="middle" fontSize="11" fill="#2b2a27">
        JSON-RPC Server
      </text>
      <rect x="170" y="276" width="360" height="28" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="350" y="294" textAnchor="middle" fontSize="11" fill="#2b2a27">
        API Key Auth
      </text>
      <rect x="170" y="310" width="360" height="28" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="350" y="329" textAnchor="middle" fontSize="11" fill="#2b2a27">
        Tool / Resource Allowlist
      </text>
      <rect x="170" y="344" width="360" height="28" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="350" y="363" textAnchor="middle" fontSize="11" fill="#2b2a27">
        System Bridge
      </text>
      <rect x="170" y="378" width="360" height="28" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="350" y="397" textAnchor="middle" fontSize="11" fill="#2b2a27">
        Memory Proxy
      </text>

      {/* MCP Hub Callouts */}
      <line x1="560" y1="250" x2="590" y2="250" stroke="#2b2a27" strokeWidth="2" strokeDasharray="4 3" />
      <rect x="595" y="230" width="270" height="40" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="610" y="248" fontSize="10" fill="#2b2a27">Policy filters + auth enforcement</text>
      <text x="610" y="262" fontSize="9" fill="#2b2a27">allowlists + API key gating</text>

      <line x1="560" y1="305" x2="590" y2="305" stroke="#2b2a27" strokeWidth="2" strokeDasharray="4 3" />
      <rect x="595" y="288" width="270" height="40" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="610" y="306" fontSize="10" fill="#2b2a27">Bridge dispatch</text>
      <text x="610" y="320" fontSize="9" fill="#2b2a27">routes to System + Memory</text>

      {/* System Service */}
      <rect x="100" y="440" width="500" height="260" rx="18" fill="#fffef7" stroke="#2b2a27" strokeWidth="3" />
      <text x="350" y="464" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b2a27">
        System Service
      </text>
      <rect x="130" y="484" width="440" height="30" rx="10" fill="#fff7e6" stroke="#2b2a27" strokeWidth="2" />
      <text x="350" y="504" textAnchor="middle" fontSize="11" fill="#2b2a27">
        FastAPI Service
      </text>
      <rect x="130" y="520" width="440" height="26" rx="10" fill="#fff7e6" stroke="#2b2a27" strokeWidth="2" />
      <text x="350" y="538" textAnchor="middle" fontSize="11" fill="#2b2a27">
        Execution Loop
      </text>
      <rect x="130" y="552" width="210" height="26" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="235" y="570" textAnchor="middle" fontSize="10" fill="#2b2a27">
        Spec Validator
      </text>
      <rect x="360" y="552" width="210" height="26" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="465" y="570" textAnchor="middle" fontSize="10" fill="#2b2a27">
        Task Planner
      </text>
      <rect x="130" y="586" width="210" height="26" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="235" y="604" textAnchor="middle" fontSize="10" fill="#2b2a27">
        Handler Executor
      </text>
      <rect x="360" y="586" width="210" height="26" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="465" y="604" textAnchor="middle" fontSize="10" fill="#2b2a27">
        Approval Service
      </text>
      <rect x="130" y="620" width="210" height="26" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="235" y="638" textAnchor="middle" fontSize="10" fill="#2b2a27">
        Handler Registry
      </text>
      <rect x="360" y="620" width="210" height="26" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="465" y="638" textAnchor="middle" fontSize="10" fill="#2b2a27">
        Run History
      </text>
      <rect x="130" y="654" width="440" height="28" rx="10" fill="#fff7e6" stroke="#2b2a27" strokeWidth="2" />
      <text x="350" y="672" textAnchor="middle" fontSize="10" fill="#2b2a27">
        Notification Service
      </text>

      {/* System Service Callouts */}
      <line x1="600" y1="520" x2="630" y2="520" stroke="#2b2a27" strokeWidth="2" strokeDasharray="4 3" />
      <rect x="635" y="500" width="230" height="40" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="650" y="518" fontSize="10" fill="#2b2a27">Spec validation + planning</text>
      <text x="650" y="532" fontSize="9" fill="#2b2a27">guardrails, task graphing</text>

      <line x1="600" y1="590" x2="630" y2="590" stroke="#2b2a27" strokeWidth="2" strokeDasharray="4 3" />
      <rect x="635" y="572" width="230" height="40" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="650" y="590" fontSize="10" fill="#2b2a27">Approvals + registry</text>
      <text x="650" y="604" fontSize="9" fill="#2b2a27">policy classes, handlers</text>

      <line x1="600" y1="660" x2="630" y2="660" stroke="#2b2a27" strokeWidth="2" strokeDasharray="4 3" />
      <rect x="635" y="642" width="230" height="40" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="650" y="660" fontSize="10" fill="#2b2a27">Audit + notifications</text>
      <text x="650" y="674" fontSize="9" fill="#2b2a27">run history + alerts</text>

      {/* Memory MCP */}
      <rect x="120" y="720" width="460" height="190" rx="18" fill="#fff7e6" stroke="#2b2a27" strokeWidth="3" />
      <text x="350" y="744" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b2a27">
        Memory MCP
      </text>
      <rect x="150" y="764" width="400" height="30" rx="10" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="350" y="784" textAnchor="middle" fontSize="11" fill="#2b2a27">
        Memory API
      </text>
      <rect x="150" y="804" width="180" height="30" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="240" y="824" textAnchor="middle" fontSize="10" fill="#2b2a27">
        Local Store
      </text>
      <rect x="370" y="804" width="180" height="30" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="460" y="824" textAnchor="middle" fontSize="10" fill="#2b2a27">
        Pinecone
      </text>
      <rect x="150" y="842" width="180" height="30" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="240" y="862" textAnchor="middle" fontSize="10" fill="#2b2a27">
        GCS
      </text>
      <rect x="370" y="842" width="180" height="30" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="460" y="862" textAnchor="middle" fontSize="10" fill="#2b2a27">
        Hybrid
      </text>

      {/* Memory Callout */}
      <line x1="580" y1="790" x2="610" y2="790" stroke="#2b2a27" strokeWidth="2" strokeDasharray="4 3" />
      <rect x="615" y="770" width="250" height="44" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="630" y="790" fontSize="10" fill="#2b2a27">Pluggable vector + blob stores</text>
      <text x="630" y="806" fontSize="9" fill="#2b2a27">local, GCS, Pinecone, hybrid</text>

      {/* Sandbox */}
      <rect x="180" y="930" width="340" height="70" rx="18" fill="#fff2d9" stroke="#2b2a27" strokeWidth="3" />
      <text x="350" y="952" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2b2a27">
        Sandbox
      </text>
      <rect x="210" y="958" width="280" height="30" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="350" y="978" textAnchor="middle" fontSize="11" fill="#2b2a27">
        Docker Runtime
      </text>

      {/* Sandbox Callout */}
      <line x1="520" y1="964" x2="610" y2="964" stroke="#2b2a27" strokeWidth="2" strokeDasharray="4 3" />
      <rect x="615" y="944" width="250" height="44" rx="12" fill="#fffef7" stroke="#2b2a27" strokeWidth="2" />
      <text x="630" y="964" fontSize="10" fill="#2b2a27">Isolated execution</text>
      <text x="630" y="980" fontSize="9" fill="#2b2a27">no network by default, /app/artifacts</text>

      {/* Arrows */}
      <line x1="350" y1="170" x2="350" y2="200" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#flow-arrow)" />
      <line x1="350" y1="410" x2="350" y2="440" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#flow-arrow)" />
      <line x1="350" y1="700" x2="350" y2="720" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#flow-arrow)" />
      <line x1="350" y1="910" x2="350" y2="930" stroke="#2b2a27" strokeWidth="3" markerEnd="url(#flow-arrow)" />
      <line x1="520" y1="620" x2="520" y2="930" stroke="#2b2a27" strokeWidth="2" markerEnd="url(#flow-arrow)" />
    </svg>
  );
}
