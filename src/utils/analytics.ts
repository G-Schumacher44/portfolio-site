declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function trackEvent(action: string, category: string, label?: string) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
}

export function trackPageView(path: string) {
  if (typeof window.gtag === 'function') {
    window.gtag('config', 'G-D1Q0RESQ6H', {
      page_path: path,
    });
  }
}
