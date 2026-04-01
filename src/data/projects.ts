import type { ProjectData } from '../types';

export const projects: ProjectData[] = [
  {
    title: 'Analyst Toolkit',
    image: '/img/projects/analyst_toolkit_thumbnail.png',
    imageAlt: 'Analyst Toolkit Preview',
    description:
      'A modular data QA and preprocessing toolkit — run as a Jupyter pipeline, CLI, or MCP server. v0.5.0 adds a full MCP platform: durable sessions, artifact dashboards, Docker + GCS support, and a 0–100 Data Health Score.',
    techStack: 'Python \u2022 YAML \u2022 MCP Server \u2022 Docker \u2022 CLI',
    modalSrc: 'files/modals/analyst_toolkit_summary.html',
    links: [
      { label: 'View on GitHub', href: 'https://github.com/G-Schumacher44/analyst_toolkit', external: true },
    ],
  },
  {
    title: 'Model Evaluation Suite',
    image: '/img/projects/model_eval_logo_thumb.png',
    imageAlt: 'Model Evaluation Suite Preview',
    description:
      'A comprehensive ML model validation framework with automated reporting. Generates diagnostic plots, performance metrics, and stakeholder-ready evaluation summaries.',
    techStack: 'Python \u2022 scikit-learn \u2022 MLflow \u2022 Pydantic',
    modalSrc: 'files/modals/model_eval_suite_summary.html',
    links: [
      { label: 'View on GitHub', href: 'https://github.com/G-Schumacher44/model_evaluation_suite', external: true },
    ],
  },
  {
    title: 'Ecom Datalake Pipelines',
    image: '/img/projects/pipeline_flow_diagram_dark.png',
    imageAlt: 'Medallion Pipeline Architecture',
    description:
      'A medallion-architecture data lake using dbt, DuckDB, and BigQuery. Bronze\u2192Silver\u2192Gold layers with 147 automated data quality tests and Airflow orchestration.',
    techStack: 'dbt \u2022 DuckDB \u2022 BigQuery \u2022 Airflow',
    modalSrc: 'files/modals/ecom_pipelines_summary.html',
    links: [
      { label: 'View on GitHub', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines', external: true },
      { label: 'See the Pipeline Journey', href: '#pipeline-journey' },
    ],
  },
];
