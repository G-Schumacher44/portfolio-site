import type { ServiceData } from '../types';

export const services: ServiceData[] = [
  {
    title: 'Analysis & Reporting',
    icon: 'BarChart3',
    description:
      "Your data has the answers — I find them. I dig into your numbers, surface the patterns that actually matter, and deliver clear, actionable insights your team can run with.",
    includes: [
      'Revenue & operations diagnostics',
      'Customer retention & churn analysis',
      'Inventory & supply chain audits',
      'KPI dashboards (Looker, Tableau)',
    ],
    proofLabel: 'Case Studies',
    proofHref: '#sql-stories',
  },
  {
    title: 'Dashboards & Visualization',
    icon: 'LayoutDashboard',
    description:
      "Dashboards that actually get used. Live data, clean design, self-serve filters — built so your team gets answers without waiting on a report.",
    includes: [
      'Looker Studio & Tableau builds',
      'Automated refresh from live data',
      'Executive and team-level views',
      'Self-service filtering & drill-downs',
    ],
    proofLabel: 'Live Dashboard',
    proofHref: 'https://lookerstudio.google.com/reporting/e5f1454c-c8e4-481f-9ac8-375a3bdd289c',
    proofExternal: true,
  },
  {
    title: 'Pipelines & Automation',
    icon: 'Workflow',
    description:
      "Data you can trust, delivered automatically. I build the pipelines that clean, validate, and route your data so your team focuses on decisions — not on fixing broken spreadsheets.",
    includes: [
      'ETL/ELT pipeline development',
      'Data quality gates & validation',
      'Cloud data warehouse setup (BigQuery)',
      'Workflow orchestration & scheduling',
    ],
    proofLabel: 'Datalake Pipelines',
    proofHref: '#technical-showcase-cta',
  },
  {
    title: 'AI & Automation',
    icon: 'Bot',
    description:
      "Practical AI where it actually helps. I help teams work smarter with tools they already use — from training staff on LLMs to connecting your data with Google Workspace.",
    includes: [
      'Staff LLM training & adoption',
      'Data integrations with Google Workspace',
      'AI for automation and analytics',
    ],
    proofLabel: 'Model Evaluation Suite',
    proofHref: '#technical-showcase-cta',
    proofLinks: [
      { label: 'Model Evaluation Suite', href: '#technical-showcase-cta' },
      { label: 'Fridai Core', href: '#technical-showcase-cta' },
    ],
  },
];

export const servicesHighlight =
  "I've managed $5M+ territories and led teams of 50+ in hospitality and small business operations. I understand the problems your data should be solving because I've lived them.";
