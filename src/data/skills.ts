import type { SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages & Databases',
    skills: [
      { label: 'Python' },
      { label: 'SQL' },
      { label: 'HTML/CSS' },
      { label: 'JavaScript' },
      { label: 'Google Apps Script' },
      { label: 'YAML' },
      { label: 'SQLite' },
      { label: 'BigQuery' },
      { label: 'DuckDB' },
    ],
  },
  {
    title: 'Data Engineering',
    skills: [
      { label: 'dbt' },
      { label: 'Polars' },
      { label: 'Airflow' },
      { label: 'ETL/ELT Pipelines' },
      { label: 'Data Quality' },
      { label: 'Data Contracts' },
    ],
  },
  {
    title: 'Analysis & Visualization',
    skills: [
      { label: 'Data Storytelling' },
      { label: 'Data Visualization' },
      { label: 'Looker / Tableau' },
      { label: 'Cohort Analysis' },
    ],
  },
  {
    title: 'Machine Learning & MLOps',
    skills: [
      { label: 'Machine Learning' },
      { label: 'scikit-learn' },
      { label: 'Pydantic' },
      { label: 'MLflow' },
      { label: 'Jupyter / Colab' },
    ],
  },
  {
    title: 'Cloud, Tools & Business',
    skills: [
      { label: 'Google Cloud Platform' },
      { label: 'Google Workspace' },
      { label: 'Git / GitHub' },
      { label: 'Business Operations' },
      { label: 'Process Optimization' },
      { label: 'Stakeholder Engagement' },
    ],
  },
  {
    title: 'Certifications',
    skills: [
      { label: 'Google Data Analytics', href: '/pdf/Google_Data_Analytics_Cert..pdf' },
      { label: 'Google Advanced Data Analytics', href: '/pdf/Google_Advanced_Data_Analytics_Cert.pdf' },
    ],
  },
];
