import type { PipelineStage } from '../types';

export const pipelineStages: PipelineStage[] = [
  {
    id: 'generation',
    number: 1,
    title: 'Data Generation',
    subtitle: 'Synthetic e-commerce data at scale',
    description:
      'A Python-based data generator creates realistic e-commerce transactions — orders, customers, products, returns — with configurable volume and messiness levels.',
    stats: ['194K rows', '8 tables', 'Configurable noise'],
    codeSnippet: `$ python -m src.generate \\
    --volume 50000 \\
    --messiness moderate

[INFO] Generating orders, customers, products...
[INFO] Applying return patterns (21% rate)
[INFO] Writing 8 tables to data/
[DONE] 194,328 rows generated`,
    codeLanguage: 'bash',
    details:
      'The generator produces a complete e-commerce dataset with realistic distributions: seasonal sales patterns, geographic clustering, product category hierarchies, and correlated return reasons. It powers all downstream analysis.',
    links: [
      { label: 'Data Generator Repo', href: 'https://github.com/G-Schumacher44/ecom_sales_data_generator', external: true },
    ],
  },
  {
    id: 'bronze',
    number: 2,
    title: 'Bronze Layer',
    subtitle: 'Raw ingestion with manifest tracking',
    description:
      'Raw data lands in the Bronze layer as-is. A manifest system tracks every ingestion batch with timestamps, row counts, and schema fingerprints.',
    stats: ['Raw data preserved', 'Manifest validated', 'Schema tracked'],
    codeSnippet: `-- Bronze manifest entry
INSERT INTO bronze._manifest (
    table_name, ingest_dt, row_count,
    schema_hash, status
) VALUES (
    'orders', '2025-10-15', 50000,
    'a3f8c2...', 'LANDED'
);`,
    codeLanguage: 'sql',
    details:
      'The Bronze layer follows an append-only pattern. Every batch is immutable and traceable. The manifest enables replay, auditing, and lineage tracking from day one.',
    links: [
      { label: 'Architecture Docs', href: '/files/pipeline_project/architecture.html', external: true },
    ],
  },
  {
    id: 'silver',
    number: 3,
    title: 'Silver Layer',
    subtitle: 'Cleaned, validated, and tested',
    description:
      'dbt models transform raw Bronze data into typed, deduplicated, business-ready tables. 147 automated tests validate primary keys, foreign keys, accepted values, and custom business rules.',
    stats: ['99.2% pass rate', '147 tests', 'Quarantine system'],
    codeSnippet: `-- dbt model: stg_orders.sql
SELECT
    order_id,
    customer_id,
    CAST(order_date AS DATE) AS order_date,
    ROUND(amount, 2) AS amount,
    CASE WHEN status = 'REFUNDED'
         THEN TRUE ELSE FALSE
    END AS is_refunded
FROM {{ ref('bronze_orders') }}
WHERE order_id IS NOT NULL`,
    codeLanguage: 'sql',
    details:
      'Failed records are quarantined rather than dropped, preserving data lineage. The Silver layer splits into Base Silver (direct transformations) and Enriched Silver (joined, denormalized views).',
    links: [
      { label: 'Data Contract', href: '/files/pipeline_project/data_contract.html', external: true },
    ],
  },
  {
    id: 'gold',
    number: 4,
    title: 'Gold Layer',
    subtitle: 'Analytics-ready fact tables',
    description:
      'Gold models aggregate Silver data into business-oriented fact and dimension tables. Partition-level idempotency ensures reliable incremental loads.',
    stats: ['8 fact tables', 'Idempotent loads', 'Dashboard-ready'],
    codeSnippet: `-- gold.fact_customer_orders
SELECT
    c.customer_id,
    c.segment,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(o.amount) AS lifetime_value,
    SUM(CASE WHEN o.is_refunded
        THEN o.amount ELSE 0 END) AS refund_total
FROM {{ ref('stg_customers') }} c
JOIN {{ ref('stg_orders') }} o USING (customer_id)
GROUP BY 1, 2`,
    codeLanguage: 'sql',
    details:
      'Gold tables power Looker Studio dashboards and executive reports. The star schema design enables self-service analytics without requiring SQL knowledge from end users.',
    links: [
      { label: 'Live Dashboard', href: 'https://lookerstudio.google.com/reporting/e5f1454c-c8e4-481f-9ac8-375a3bdd289c', external: true },
    ],
  },
  {
    id: 'insight',
    number: 5,
    title: 'Insight',
    subtitle: 'From data to executive decision',
    description:
      'The pipeline culminates in stakeholder-ready deliverables: interactive dashboards, executive reports, and actionable recommendations backed by validated data.',
    stats: ['$10.6M exposure found', '21% refund rate flagged', 'Action plan delivered'],
    details:
      'This is where the VP of Sales case study unfolds. The same data that was generated, ingested, cleaned, and modeled now tells a story that drives real business decisions.',
    links: [
      { label: 'See the Case Study', href: '#case-studies' },
      { label: 'Explore All Repos', href: 'https://github.com/G-Schumacher44', external: true },
    ],
  },
];
