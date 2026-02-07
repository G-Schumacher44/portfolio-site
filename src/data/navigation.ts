import type { NavItem } from '../types';

export const navigation: NavItem[] = [
  { label: 'Services', href: '#services' },
  {
    label: 'Case Studies',
    href: '#case-studies',
    children: [
      { label: 'Jump to section', href: '#case-studies' },
      { label: 'VP Request (repo)', href: 'https://github.com/G-Schumacher44/VP-Request', external: true },
      { label: 'VP: Live Dashboard', href: 'https://lookerstudio.google.com/reporting/e5f1454c-c8e4-481f-9ac8-375a3bdd289c', external: true },
      { label: 'Inventory Audit (repo)', href: 'https://github.com/G-Schumacher44/sql_stories_portfolio_demo/tree/main', external: true },
      { label: 'Customer Retention (repo)', href: 'https://github.com/G-Schumacher44/sql_stories_portfolio_demo/tree/main', external: true },
      { label: 'Retention: HTML Notebook', href: 'files/media/Executive_Retention_Report.html', external: true },
    ],
  },
  {
    label: 'Projects',
    href: '#projects',
    children: [
      { label: 'Jump to section', href: '#projects' },
      { label: 'Analyst Toolkit (repo)', href: 'https://github.com/G-Schumacher44/analyst_toolkit', external: true },
      { label: 'Model Evaluation Suite (repo)', href: 'https://github.com/G-Schumacher44/model_evaluation_suite', external: true },
      { label: 'Datalake Pipelines (repo)', href: 'https://github.com/G-Schumacher44/ecom_datalake_pipelines', external: true },
    ],
  },
  {
    label: 'Pipeline Journey',
    href: '#pipeline-journey',
    children: [
      { label: 'Jump to section', href: '#pipeline-journey' },
      { label: 'Data Generator (repo)', href: 'https://github.com/G-Schumacher44/ecom_sales_data_generator', external: true },
      { label: 'Skills Builder (repo)', href: 'https://github.com/G-Schumacher44/sql_stories_skills_builder', external: true },
      { label: 'Data Lake Extension (repo)', href: 'https://github.com/G-Schumacher44/ecom-datalake-exten', external: true },
      { label: 'Portfolio Demo (repo)', href: 'https://github.com/G-Schumacher44/sql_stories_portfolio_demo', external: true },
    ],
  },
  { label: 'Contact', href: '#contact' },
];
