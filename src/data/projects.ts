import type { ProjectData } from '../types';

export const projects: ProjectData[] = [
  {
    title: 'Analyst Toolkit',
    image: '/img/projects/analyst_toolkit_thumbnail.png',
    imageAlt: 'Analyst Toolkit Preview',
    description:
      'A modular Python/YAML ETL framework that standardizes data ingestion, validation, and transformation workflows. Config-driven pipelines with built-in data quality checks.',
    techStack: 'Python \u2022 YAML \u2022 ETL \u2022 Data Quality',
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
