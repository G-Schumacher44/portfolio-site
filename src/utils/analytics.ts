const DEFAULT_GA_MEASUREMENT_ID = 'G-D1Q0RESQ6H';
const GA_SCRIPT_ID = 'ga4-gtag-script';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const gaMeasurementId =
  import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || DEFAULT_GA_MEASUREMENT_ID;

let analyticsInitialized = false;
let lastTrackedPath: string | null = null;

function hasGtag(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

export function initAnalytics() {
  if (typeof window === 'undefined' || analyticsInitialized) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

  window.gtag('js', new Date());
  window.gtag('config', gaMeasurementId, { send_page_view: false });

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    document.head.appendChild(script);
  }

  analyticsInitialized = true;
}

export function trackEvent(action: string, category: string, label?: string) {
  if (!hasGtag()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    send_to: gaMeasurementId,
  });
}

export function trackPageView(path: string, title?: string) {
  if (!hasGtag()) return;
  if (lastTrackedPath === path) return;

  lastTrackedPath = path;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
    send_to: gaMeasurementId,
  });
}

export function trackQuickViewLink(label: string) {
  trackEvent('quick_view_link_click', 'quick_view', label);
}

export function trackResumeOpen(source: string) {
  trackEvent('resume_open', 'engagement', source);
}

export function trackGenerateLead(channel: string, source: string) {
  trackEvent('generate_lead', 'conversion', `${channel}:${source}`);
}

export function trackTechnicalShowcaseOpen(source: string) {
  trackEvent('technical_showcase_open', 'navigation', source);
}

export function trackTechnicalShowcaseModalOpen(slug: string) {
  trackEvent('technical_showcase_modal_open', 'showcase_modal', slug);
}

export function trackSqlStoriesModalOpen(source: string) {
  trackEvent('sql_stories_modal_open', 'showcase_modal', source);
}

export function trackFridaiDeckOpen(source: string) {
  trackEvent('fridai_core_slide_deck_open', 'showcase_modal', source);
}
