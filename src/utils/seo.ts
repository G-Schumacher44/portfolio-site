const SITE_URL = 'https://www.garrettschumacher.com';
const DEFAULT_IMAGE = `${SITE_URL}/img/logos/gs_analytics_thumb_2.png`;
const SCHEMA_SCRIPT_ID = 'route-structured-data';
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

type RouteSeo = {
  title: string;
  description: string;
  path: string;
  pageType: 'WebPage' | 'CollectionPage' | 'ProfilePage';
};

const routeSeoMap: Record<string, RouteSeo> = {
  '/': {
    title: 'Garrett Schumacher | Data Analyst & Analytics Engineer',
    description:
      'Garrett Schumacher builds dashboards, analytics pipelines, and automation systems that turn messy data into clear business decisions.',
    path: '/',
    pageType: 'WebPage',
  },
  '/technical-showcase': {
    title: 'Garrett Schumacher | Technical Showcase',
    description:
      'Technical deep-dives into production analytics engineering projects: pipelines, quality systems, AI automation, and data architecture.',
    path: '/technical-showcase',
    pageType: 'CollectionPage',
  },
  '/quick-view': {
    title: 'Garrett Schumacher | Quick View Profile',
    description:
      'Profile snapshot for hiring managers: Garrett Schumacher credentials, stack, featured projects, and direct contact options.',
    path: '/quick-view',
    pageType: 'ProfilePage',
  },
};

const personSchema = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Garrett Schumacher',
  url: `${SITE_URL}/`,
  image: DEFAULT_IMAGE,
  email: 'mailto:me@garrettschumacher.com',
  jobTitle: 'Data Analyst & Analytics Engineer',
  description:
    'Garrett Schumacher is a data analyst and analytics engineer specializing in SQL, Python, data pipelines, and business intelligence systems.',
  knowsAbout: [
    'SQL',
    'Python',
    'Analytics Engineering',
    'Data Pipelines',
    'Business Intelligence',
    'dbt',
    'BigQuery',
    'ETL',
  ],
  sameAs: [
    'https://github.com/G-Schumacher44',
    'https://linkedin.com/in/garrett-schumacher-243a5513a',
  ],
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

function upsertStructuredData(content: Record<string, unknown>) {
  let element = document.head.querySelector<HTMLScriptElement>(`script#${SCHEMA_SCRIPT_ID}`);
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.id = SCHEMA_SCRIPT_ID;
    document.head.appendChild(element);
  }
  element.text = JSON.stringify(content);
}

function buildStructuredData(pathname: string, seo: RouteSeo, canonicalUrl: string) {
  const pageEntity: Record<string, unknown> = {
    '@type': seo.pageType,
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: seo.title,
    description: seo.description,
    isPartOf: { '@id': WEBSITE_ID },
  };

  if (pathname === '/' || pathname === '/quick-view') {
    pageEntity.mainEntity = { '@id': PERSON_ID };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: 'Garrett Schumacher',
        alternateName: 'GS Analytics',
        inLanguage: 'en-US',
      },
      personSchema,
      pageEntity,
    ],
  };
}

export function applyRouteSeo(pathname: string) {
  const seo = routeSeoMap[pathname] || routeSeoMap['/'];
  const canonicalUrl = `${SITE_URL}${seo.path === '/' ? '/' : seo.path}`;

  document.title = seo.title;
  upsertCanonical(canonicalUrl);
  upsertMeta('name', 'description', seo.description);
  upsertMeta('name', 'robots', 'index,follow');
  upsertMeta('name', 'author', 'Garrett Schumacher');

  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:site_name', 'Garrett Schumacher');
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:title', seo.title);
  upsertMeta('property', 'og:description', seo.description);
  upsertMeta('property', 'og:image', DEFAULT_IMAGE);
  upsertMeta('property', 'og:image:width', '1200');
  upsertMeta('property', 'og:image:height', '630');
  upsertMeta('property', 'og:image:alt', 'GS Analytics brand thumbnail');

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', seo.title);
  upsertMeta('name', 'twitter:description', seo.description);
  upsertMeta('name', 'twitter:image', DEFAULT_IMAGE);
  upsertMeta('name', 'twitter:image:alt', 'GS Analytics brand thumbnail');
  upsertStructuredData(buildStructuredData(pathname, seo, canonicalUrl));
}
