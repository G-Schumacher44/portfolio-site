import type { ServiceData } from '../types';

export const services: ServiceData[] = [
  {
    title: 'Analysis & Reporting',
    icon: 'BarChart3',
    description:
      'Turn raw data into executive-ready reports. I dig into your numbers, find the patterns that matter, and deliver insights your team can act on immediately.',
    includes: [
      'Revenue & operations diagnostics',
      'Customer retention & churn analysis',
      'Inventory & supply chain audits',
      'KPI dashboards (Looker, Tableau)',
    ],
    proofLabel: 'Case Studies',
    proofHref: '#case-studies',
  },
  {
    title: 'Dashboards & Visualization',
    icon: 'LayoutDashboard',
    description:
      "Interactive dashboards that update automatically and tell a clear story. No more spreadsheet chaos or stale reports sitting in someone's inbox.",
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
      'Automated data workflows that clean, validate, and deliver trusted data without manual effort. Systems that run reliably so your team can focus on decisions, not data wrangling.',
    includes: [
      'ETL/ELT pipeline development',
      'Data quality gates & validation',
      'Cloud data warehouse setup (BigQuery)',
      'Workflow orchestration & scheduling',
    ],
    proofLabel: 'Datalake Pipelines',
    proofHref: '#projects',
  },
];

export const servicesHighlight =
  "I've managed $5M+ territories and led teams of 50+ in hospitality and small business operations. I understand the problems your data should be solving because I've lived them.";
