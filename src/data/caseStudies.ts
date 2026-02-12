import type { CaseStudyData } from '../types';

export const caseStudies: CaseStudyData[] = [
  {
    title: 'Year-End Sales Diagnostic',
    image: '/img/case_study/vp_sales_dashboards_grid_3x2.png',
    imageAlt: 'Sales dashboards grid preview',
    heroMode: 'dashboard',
    problem:
      'A growing retailer saw refunds eroding 21.14% of gross sales with limited visibility into channel, region, and product‑level drivers.',
    delivered:
      'End-to-end SQL analysis, a live Looker Studio dashboard, and an executive report surfacing refund drivers by channel, shipping speed, region, and product quality signals.',
    impact:
      'Identified $10.61M in refunds on $50.18M sales, highlighted Phone (24.10%) and NewEgg (22.67%) as highest refund-rate channels, and defined a plan to push refunds below 20%.',
    techStack: 'SQL \u2022 Looker Studio \u2022 Executive Reporting',
    modalSrc: 'files/modals/case_vp_sales_summary.html',
    terminalLine: 'Year-End Returns Diagnostic',
    heroStat: '$10.61M',
    heroLabel: 'Refunds Identified',
    links: [],
  },
  {
    title: 'Inventory Efficiency Audit',
    image: '/img/case_study/story_01_dashboard_thumb.png',
    imageAlt: 'Inventory Audit Dashboard Preview',
    heroMode: 'inventory',
    problem:
      'Assesses catalog-wide utilization, SKU-level risk, and capital lock-up to prioritize corrective actions for the Fulfillment Team.',
    delivered:
      'A SQL audit view with tiered attention scoring, an interactive workbook for drill-down analysis, and an executive summary with prioritized recommendations.',
    impact:
      'Identified 562 under-utilized SKUs and $19.1M in tied-up capital; a 20% reduction frees ~$3.8M and lowers annual carrying costs by ~$0.8–$1.1M.',
    techStack: 'SQL \u2022 Python \u2022 Data Storytelling',
    modalSrc: 'files/modals/case_inventory_audit_summary.html',
    terminalLine: 'SKU Health & Attention Flag System',
    heroStat: '$19.1M',
    heroLabel: 'Capital Tied Up',
    links: [],
  },
  {
    title: 'Customer Retention Strategy',
    image: '/img/case_study/stk_bar_channel_thumb.png',
    imageAlt: 'Customer Retention Chart Preview',
    heroMode: 'retention',
    problem:
      'The Marketing Team requested a retention snapshot to guide strategy and identify early churn, loyalty gaps, and channel‑level CLV performance.',
    delivered:
      'Cohort retention heatmaps, first-to-second conversion analysis, loyalty tier diagnostics, and channel CLV segmentation with a shareable executive report.',
    impact:
      'Revealed an 11‑point drop from Month 1→3, 0% repeat in Bronze, and Phone driving 58% of high‑CLV customers — guiding targeted retention actions.',
    techStack: 'SQL \u2022 Python \u2022 Cohort Analysis',
    modalSrc: 'files/retention_summary_modal.html',
    terminalLine: 'Retention Drop — Cohort & CLV Signals',
    heroStat: '11pt',
    heroLabel: '90-Day Retention Drop',
    links: [],
  },
];
