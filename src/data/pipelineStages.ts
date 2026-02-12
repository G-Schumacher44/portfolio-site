import type { PipelineStage } from '../types';

/**
 * Data story: 1 year of generated e-commerce data flows through the pipeline.
 *
 * Generator → 50K orders expand to ~194K rows across 8 tables
 * Bronze    → all 194K land raw, untouched
 * Silver    → validated, 147 tests, 0% row loss (dbt metrics are representative)
 * Gold      → aggregated down to ~35K fact/dim records for dashboards
 * Insight   → executive findings from the case studies
 */

export const pipelineStages: PipelineStage[] = [
  {
    id: 'generation',
    number: 1,
    title: 'Data Generation',
    subtitle: '1 year of synthetic e-commerce data',
    terminalCommand: 'python -m src.generate --volume 50000 --messiness moderate',
    terminalOutput: [
      '[INFO] Initializing generation engine...',
      '[INFO] Seeding 25,903 customers across 50 states',
      '[INFO] Building product catalog: 15,000 SKUs / 12 categories',
      '[INFO] Generating 50,000 orders with seasonal patterns...',
      '[INFO] Expanding to line items, carts, returns...',
      '[INFO] Applying return patterns (21% rate)',
      '[INFO] Injecting data quality issues (moderate)',
      '[INFO] Writing 8 tables to data/',
      '[DONE] 194,328 rows generated across 8 tables in 4.2s',
    ],
    artifacts: [
      { label: 'Rows', value: '194,328' },
      { label: 'Tables', value: '8' },
      { label: 'Orders', value: '50,000' },
      { label: 'Customers', value: '25,903' },
    ],
    description:
      'A Python-based generator creates a full year of realistic e-commerce data — 50K orders expand into 194K rows across orders, line items, customers, products, carts, and returns.',
    stats: ['194K rows', '8 tables', 'Configurable noise'],
    details:
      'The generator produces realistic distributions: seasonal sales patterns, geographic clustering, product category hierarchies, and correlated return reasons. Messiness injection creates the data quality issues the pipeline is designed to catch.',
  },
  {
    id: 'bronze',
    number: 2,
    title: 'Bronze Layer',
    subtitle: 'Raw ingestion with manifest tracking',
    terminalCommand: 'dbt run --select tag:bronze --full-refresh',
    terminalOutput: [
      'Running with dbt=1.8.0',
      'Found 42 models, 147 tests, 8 sources',
      '',
      'Concurrency: 4 threads',
      '',
      '1 of 8 OK bronze_orders ............ [INSERT 50,000 in 1.2s]',
      '2 of 8 OK bronze_order_items ....... [INSERT 68,247 in 1.8s]',
      '3 of 8 OK bronze_customers ......... [INSERT 25,903 in 0.6s]',
      '4 of 8 OK bronze_products .......... [INSERT 15,000 in 0.4s]',
      '5 of 8 OK bronze_shopping_carts .... [INSERT 18,412 in 0.5s]',
      '6 of 8 OK bronze_cart_items ........ [INSERT 6,284 in 0.3s]',
      '7 of 8 OK bronze_returns ........... [INSERT 10,319 in 0.3s]',
      '8 of 8 OK bronze_return_items ...... [INSERT 163 in 0.1s]',
      '',
      'Finished running 8 models in 5.2s',
      'All 194,328 source rows landed. 0 dropped.',
    ],
    artifacts: [
      { label: 'Models', value: '8' },
      { label: 'Rows Landed', value: '194,328' },
      { label: 'Dropped', value: '0' },
      { label: 'Time', value: '5.2s' },
    ],
    description:
      'All 194K generated rows land in the Bronze layer raw and untouched. A manifest system tracks every batch with timestamps, row counts, and schema fingerprints — nothing is modified, nothing is lost.',
    stats: ['100% rows preserved', 'Manifest validated', 'Schema tracked'],
    details:
      'The Bronze layer follows an append-only pattern. Every batch is immutable and traceable. The manifest enables replay, auditing, and lineage tracking from day one.',
  },
  {
    id: 'silver',
    number: 3,
    title: 'Silver Layer',
    subtitle: 'Cleaned, validated, and tested',
    terminalCommand: 'dbt test --select tag:silver && dbt run --select tag:silver',
    terminalOutput: [
      'Running with dbt=1.8.0',
      'Found 147 tests for silver models',
      '',
      'Concurrency: 4 threads',
      '',
      '  PASS not_null_stg_orders_order_id ............. [PASS in 0.1s]',
      '  PASS unique_stg_orders_order_id ............... [PASS in 0.1s]',
      '  PASS accepted_values_stg_orders_status ........ [PASS in 0.1s]',
      '  PASS relationships_stg_orders_customer_id ..... [PASS in 0.2s]',
      '  WARN missing_partition_returns_2020-01-01 ..... [WARN in 0.1s]',
      '  ... 142 more tests',
      '',
      'Finished: 145 passed, 2 warnings, 0 failures',
      '',
      '1 of 8 OK stg_orders ............... [SELECT 49,847 in 0.9s]',
      '2 of 8 OK stg_order_items .......... [SELECT 68,031 in 1.6s]',
      '3 of 8 OK stg_customers ............ [SELECT 25,903 in 0.5s]',
      '4 of 8 OK stg_products ............. [SELECT 15,000 in 0.3s]',
      '5 of 8 OK stg_shopping_carts ....... [SELECT 18,412 in 0.5s]',
      '6 of 8 OK stg_cart_items ........... [SELECT 6,284 in 0.2s]',
      '7 of 8 OK stg_returns .............. [SELECT 10,319 in 0.3s]',
      '8 of 8 OK stg_return_items ......... [SELECT 163 in 0.1s]',
      '',
      'Completed: 193,959 rows clean. 369 quarantined. 0 dropped.',
    ],
    liveDataSrc: '/files/pipeline_project/silver_quality_pretty.json',
    artifacts: [
      { label: 'Tests', value: '147' },
      { label: 'Pass Rate', value: '99.2%' },
      { label: 'Quarantined', value: '369' },
      { label: 'Row Loss', value: '0%' },
    ],
    description:
      'dbt models clean, type-cast, and deduplicate the 194K Bronze rows. 147 automated tests validate primary keys, foreign keys, accepted values, and custom business rules. 369 rows quarantined — zero dropped.',
    stats: ['99.2% pass rate', '147 tests', 'Quarantine system'],
    details:
      'Failed records are quarantined rather than dropped, preserving data lineage. The Silver layer splits into Base Silver (direct transformations) and Enriched Silver (joined, denormalized views for downstream analytics).',
  },
  {
    id: 'gold',
    number: 4,
    title: 'Gold Layer',
    subtitle: 'Analytics-ready fact tables',
    terminalCommand: 'dbt run --select tag:gold && echo "Deploying to Looker Studio..."',
    terminalOutput: [
      'Running with dbt=1.8.0',
      'Found 10 models tagged gold',
      '',
      'Concurrency: 4 threads',
      '',
      '1 of 8 OK fact_customer_orders ..... [SELECT 25,903 in 0.9s]',
      '2 of 8 OK fact_product_perf ........ [SELECT 4,218 in 0.4s]',
      '3 of 8 OK fact_daily_metrics ....... [SELECT 365 in 0.2s]',
      '4 of 8 OK fact_regional_finance .... [SELECT 738 in 0.3s]',
      '5 of 8 OK fact_inventory_risk ...... [SELECT 1,847 in 0.3s]',
      '6 of 8 OK fact_sales_velocity ...... [SELECT 365 in 0.2s]',
      '7 of 8 OK fact_shipping_econ ....... [SELECT 738 in 0.2s]',
      '8 of 8 OK dim_customer_retention ... [SELECT 25,903 in 0.8s]',
      '',
      'Finished: 194K silver → 35,174 gold records in 3.3s',
      'Deploying to Looker Studio...',
      'Dashboard refresh triggered. 8 tables synced.',
    ],
    liveDataSrc: '/files/pipeline_project/enriched_silver_pretty.json',
    artifacts: [
      { label: 'Fact Tables', value: '8' },
      { label: 'Records', value: '35,174' },
      { label: 'Compression', value: '~6:1' },
      { label: 'Status', value: 'SYNCED' },
    ],
    description:
      'Gold models aggregate 194K Silver rows down to 35K analytics-ready records — one row per customer, per product, per region, per day. Star schema design powers self-service Looker dashboards.',
    stats: ['~6:1 compression', '8 fact tables', 'Dashboard-ready'],
    details:
      'Gold tables power Looker Studio dashboards and executive reports. The star schema design enables self-service analytics without requiring SQL knowledge. fact_daily_metrics has 365 rows (1 per day), fact_customer_orders has 25,903 (1 per customer).',
  },
  {
    id: 'insight',
    number: 5,
    title: 'Insight',
    subtitle: 'From data to executive decision',
    terminalCommand: 'python -m reports.generate --all-studies',
    terminalOutput: [
      'Aggregating gold layer outputs...',
      '',
      '  Retail returns diagnostic:    $10.6M exposure flagged',
      '  Inventory efficiency audit:   1,847 SKUs at risk',
      '  Customer retention strategy:  25,903 customers scored',
      '',
      '3 executive reports generated.',
      '3 case studies delivered.',
      'Opening report index...',
    ],
    artifacts: [
      { label: 'Reports', value: '3' },
      { label: 'Exposure', value: '$10.6M' },
      { label: 'SKUs Flagged', value: '1,847' },
      { label: 'Customers', value: '25,903' },
    ],
    description:
      'The pipeline culminates in stakeholder-ready deliverables: a retail returns diagnostic, an inventory efficiency audit, and a customer retention strategy — each backed by the same validated, tested data.',
    stats: ['3 case studies', '$10.6M exposure found', 'Action plans delivered'],
    details:
      'The same data that was generated, ingested, cleaned, and modeled powers three distinct analyses. Each case study tells a different story — returns, inventory, retention — but all trace back to a single trusted pipeline.',
  },
];
