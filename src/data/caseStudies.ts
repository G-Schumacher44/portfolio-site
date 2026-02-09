import type { CaseStudyData } from '../types';

export const caseStudies: CaseStudyData[] = [
  {
    title: 'Year-End Sales Diagnostic',
    image: '/img/case_study/vp_sales_dashboards_grid_3x2.png',
    imageAlt: 'Sales dashboards grid preview',
    heroMode: 'dashboard',
    problem:
      'A growing retailer saw refunds eroding 21% of net revenue with no visibility into which channels, regions, or products were driving the losses.',
    delivered:
      'End-to-end SQL analysis, a live Looker Studio dashboard, and an executive report identifying root causes across channels, shipping methods, and customer segments.',
    impact:
      'Pinpointed $10.6M in refund exposure, flagged the highest-risk channel (29% refund rate), and provided a prioritized action plan to reduce returns below 20%.',
    techStack: 'SQL \u2022 Looker Studio \u2022 Executive Reporting',
    modalSrc: 'files/modals/case_vp_sales_summary.html',
    terminalLine: 'Returns Exposure — Root Cause Drilldown',
    heroStat: '$10.6M',
    heroLabel: 'Exposure Flagged',
    links: [
      { label: 'View Case Study', href: 'https://github.com/G-Schumacher44/VP-Request', external: true },
      { label: 'Live Dashboard', href: 'https://lookerstudio.google.com/reporting/e5f1454c-c8e4-481f-9ac8-375a3bdd289c', external: true },
    ],
  },
  {
    title: 'Inventory Efficiency Audit',
    image: '/img/case_study/story_01_dashboard_thumb.png',
    imageAlt: 'Inventory Audit Dashboard Preview',
    heroMode: 'inventory',
    problem:
      'An e-commerce retailer had $19.1M in capital locked up in under-utilized inventory with no systematic way to identify which SKUs to prioritize.',
    delivered:
      'A SQL-based audit framework with a weighted attention scoring system, interactive workbook with drill-down filters, and an executive summary with tiered recommendations.',
    impact:
      'Identified 562 under-utilized SKUs, quantified $3.8M in recoverable capital, and projected $0.8M\u2013$1.1M in annual carrying cost savings.',
    techStack: 'SQL \u2022 Python \u2022 Data Storytelling',
    modalSrc: 'files/modals/case_inventory_audit_summary.html',
    terminalLine: 'Inventory Freeze — Capital Unlock Audit',
    heroStat: '562',
    heroLabel: 'SKUs Under-Utilized',
    links: [
      { label: 'View Case Study', href: 'https://github.com/G-Schumacher44/sql_stories_portfolio_demo/tree/main', external: true },
    ],
  },
  {
    title: 'Customer Retention Strategy',
    image: '/img/case_study/stk_bar_channel_thumb.png',
    imageAlt: 'Customer Retention Chart Preview',
    heroMode: 'retention',
    problem:
      'A marketing team needed a retention snapshot but had no cohort-level visibility into churn timing, loyalty tier performance, or channel-specific lifetime value.',
    delivered:
      'Cohort retention heatmaps, first-to-second purchase conversion analysis, loyalty tier diagnostics, and channel CLV segmentation with an executive report.',
    impact:
      'Revealed an 11-point retention drop in the first 90 days, identified 0% repeat rate in the Bronze loyalty tier, and showed Phone channel drives 58% of high-CLV customers.',
    techStack: 'SQL \u2022 Python \u2022 Cohort Analysis',
    modalSrc: 'files/retention_summary_modal.html',
    terminalLine: 'Retention Drop — Cohort & CLV Signals',
    heroStat: '11pt',
    heroLabel: '90-Day Retention Drop',
    links: [
      { label: 'View Case Study', href: 'https://github.com/G-Schumacher44/sql_stories_portfolio_demo/tree/main', external: true },
      { label: 'Executive Report', href: 'files/media/Executive_Retention_Report.html', external: true },
    ],
  },
];
