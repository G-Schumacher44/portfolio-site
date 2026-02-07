import type { StatItem, ContactCard } from '../types';

export const hero = {
  name: 'Garrett Schumacher',
  tagline: 'Data Analytics & Engineering for Growing Businesses',
  subtitle:
    'I turn messy data into clear dashboards, automated pipelines, and insights that drive revenue. Operations background. Technical execution.',
  terminalLines: [
    '$ python -m src.generate --volume 50000 --messiness moderate',
    '[INFO] Generating 50,000 transactions across 8 tables...',
    '[INFO] Applying realistic return patterns (21% rate)...',
    '[INFO] Writing to bronze/orders/ingest_dt=2025-10-15/',
    '',
    '$ dbt run --select silver.*',
    '[OK] silver.stg_orders .................. PASS (194,328 rows)',
    '[OK] silver.stg_customers ............... PASS (12,491 rows)',
    '[OK] silver.stg_returns ................. PASS (40,809 rows)',
    '[OK] 147 data quality tests passed',
    '',
    'SELECT customer_id,',
    '       SUM(net_revenue) AS lifetime_value,',
    '       COUNT(DISTINCT order_id) AS total_orders',
    'FROM gold.fact_customer_orders',
    'GROUP BY 1',
    'ORDER BY 2 DESC',
    'LIMIT 10;',
    '',
    '-- Results: Top 10 customers by CLV identified',
    '-- Avg CLV: $847 | Median: $312 | Top: $4,291',
  ],
};

export const stats: StatItem[] = [
  { value: '$5M+', numericValue: 5, prefix: '$', suffix: 'M+', label: 'Territory Managed' },
  { value: '6+', numericValue: 6, suffix: '+', label: 'End-to-End Projects' },
  { value: '147', numericValue: 147, label: 'Automated Data Tests' },
  { value: '10+', numericValue: 10, suffix: '+', label: 'Open Source Repos' },
];

export const about = {
  photo: '/img/logos/temp_headshot.png',
  photoAlt: 'Photo of Garrett Schumacher',
  modalSrc: 'files/modals/about_summary.html',
  bio: "An operations leader turned data practitioner. I've managed $5M+ territories, directed a $3.5M business, and learned that the best decisions come from clean data, clear analysis, and honest storytelling. Now I build the pipelines, dashboards, and reports that give teams the confidence to act.",
  availability: 'Available for: Full-time roles \u2022 Contract projects \u2022 Freelance engagements',
};

export const howItWorks = [
  {
    number: 1,
    title: 'Discovery Call',
    description:
      "We discuss your data, your goals, and the business questions you need answered. I'll scope the work and give you a clear timeline. No obligation.",
  },
  {
    number: 2,
    title: 'Build & Validate',
    description:
      'I build the analysis, dashboard, or pipeline with regular check-ins along the way. You see progress early, not just at the end.',
  },
  {
    number: 3,
    title: 'Deliver & Support',
    description:
      'You get polished, stakeholder-ready deliverables with a walkthrough session. I provide follow-up support to make sure everything runs smoothly.',
  },
];

export const contactCards: ContactCard[] = [
  {
    title: 'Hiring Managers',
    description:
      "I'm open to full-time and contract data analyst or analytics engineer roles where I can combine operational experience with technical skills.",
    ctas: [
      { label: 'Download Resume', href: '/pdf/gschumacher_resume.pdf', primary: true, external: true },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/garrett-schumacher-243a5513a', external: true },
    ],
  },
  {
    title: 'Business Owners & Teams',
    description:
      "Need a dashboard, a data audit, or a pipeline built? Let's discuss your project. Free 30-minute discovery call, no obligation.",
    ctas: [
      { label: 'Book a Free Consultation', href: 'https://calendar.app.google/49XfSdvBVQMz9Zni9', primary: true, external: true },
      { label: 'Email Me', href: 'mailto:me@garrettschumacher.com' },
    ],
  },
];

export const resourceHub = {
  title: 'Analyst Resource Hub',
  description:
    'A curated reference system built in Obsidian and published as a living knowledge base. Covers SQL patterns, Python snippets, data engineering concepts, and analytics workflows.',
  modalSrc: 'files/modals/resource_hub_summary.html',
  links: [
    { label: 'Visit Resource Hub', href: 'https://sites.google.com/view/gs-analytics-resource-hub/home', external: true },
    { label: 'View on GitHub', href: 'https://github.com/G-Schumacher44/analyst_resource_hub', external: true },
  ],
};
