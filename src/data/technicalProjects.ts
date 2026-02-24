export type TechnicalProject = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  summary: string;
  tags: string[];
  callout: string;
  includes?: string[];
  relatedImages?: { src: string; alt: string }[];
  comicStrip?: { src: string; alt: string; label?: string };
  comicStrips?: { src: string; alt: string; label?: string }[];
};

export const technicalProjects: TechnicalProject[] = [
  {
    slug: 'fridai-core',
    title: 'FridAI Core',
    subtitle: 'MCP hub + vector memory + agentic automation + governance engine.',
    image: '/img/projects/comic_fridai_core.png',
    imageAlt: 'FridAI Core comic banner',
    summary:
      'An open-source platform for governed AI execution at scale. Unifies MCP tool routing, vector memory, and spec-driven workflows behind a single governance-first runtime.',
    tags: ['MCP', 'Agents', 'Memory', 'Automation', 'Governance'],
    callout: 'Most ambitious build. The one I want engineers to grill me on.',
    comicStrips: [
      {
        src: '/img/tech_showcase/comic_strips/fridai/fridai_origins.png',
        alt: 'FridAI origins comic strip',
        label: 'Origins',
      },
      {
        src: '/img/tech_showcase/comic_strips/fridai/ollama_farm.png',
        alt: 'FridAI local model farm comic strip',
        label: 'Ollama Farm',
      },
      {
        src: '/img/tech_showcase/comic_strips/fridai/release_strip.png',
        alt: 'FridAI preview release comic strip',
        label: 'Preview Release',
      },
    ],
  },
  {
    slug: 'analyst-toolkit',
    title: 'Analyst Toolkit',
    subtitle: 'MCP Server + Self-Healing Data Audit engine.',
    image: '/comic_imgs/analyst_toolkit_logo.png',
    imageAlt: 'Analyst Toolkit logo',
    summary:
      'A modular QA and preprocessing platform that runs in notebooks, CLI, or as an MCP tool server with in-memory pipeline chaining.',
    tags: ['MCP', 'Data QA', 'Pipeline Mode', 'Auto-Heal', 'Docker'],
    callout: 'Now available as an MCP server with session-based tool chaining.',
    comicStrip: {
      src: '/img/tech_showcase/comic_strips/analyst_toolkit/analyst_toolkit_origins.png',
      alt: 'Analyst Toolkit origins comic strip',
      label: 'Origins',
    },
  },
  {
    slug: 'regression-model-eval',
    title: 'ML Model Evaluation Suite',
    subtitle: 'Metric sanity checks, automated.',
    image: '/img/projects/comic_model_eval.png',
    imageAlt: 'Model evaluation suite comic',
    summary:
      'A config-driven evaluation harness for regression and classification models — repeatable benchmarks, diagnostics, and a stakeholder-ready HTML report.',
    tags: ['Python', 'ML', 'Metrics', 'Automation'],
    callout: 'Built so every model gets the same honest diagnostic — no skipped steps.',
    comicStrip: {
      src: '/img/tech_showcase/comic_strips/model_eval/model_eval_strip.png',
      alt: 'Model evaluation suite comic strip',
      label: 'Model Eval Story',
    },
  },
  {
    slug: 'ecommerce-datalakes',
    title: 'Ecommerce Datalakes',
    subtitle: 'Extension + Pipelines + Backlog Bear.',
    image: '/img/projects/comic_datalakes.png',
    imageAlt: 'Ecommerce datalakes comic banner',
    summary:
      'A connected lakehouse build that hydrates raw data, backfills history, and ships Bronze → Silver → Gold transformations.',
    tags: ['Medallion', 'Hydration', 'Backfill', 'Pipelines'],
    callout: 'Two production tracks plus a backfill specialist — all built to scale.',
    includes: [
      'Datalake Extension (Bronze + hydration)',
      'Pipelines (Silver → Gold)',
      'Backlog Bear (historical backfill workflow)',
    ],
    comicStrip: {
      src: '/img/tech_showcase/comic_strips/datalakes/pipelines_main.png',
      alt: 'Datalakes pipelines comic strip',
      label: 'Pipelines Story',
    },
  },
  {
    slug: 'dirty-birds-generator',
    title: 'Dirty Birds Generator',
    subtitle: 'Palmer penguins data generator + QA framework.',
    image: '/img/projects/comic_dirty_birds.png',
    imageAlt: 'Dirty Birds generator comic',
    summary:
      'A standalone ecological generator that simulates penguin tagging studies with controllable messiness for QA and model stress tests.',
    tags: ['Synthetic Data', 'Ecology', 'QA', 'Simulation'],
    callout: 'Standalone generator — built for messy, real‑world style data.',
    comicStrip: {
      src: '/img/tech_showcase/comic_strips/dirty_birds/dirty_birds_strip.png',
      alt: 'Dirty Birds comic strip',
      label: 'Dirty Birds Story',
    },
  },
];
