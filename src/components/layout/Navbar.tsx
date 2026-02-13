import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navigation, resourceHubUrl } from '../../data/navigation';
import { useScrollSpy } from '../../hooks/useScrollSpy';

const sectionIds = ['sql-stories', 'technical-showcase-cta', 'services', 'contact'];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useScrollSpy(sectionIds);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    if (href === '/') {
      if (location.pathname !== '/') {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }
    if (href.startsWith('#')) {
      const targetId = href.slice(1);
      if (location.pathname !== '/') {
        navigate('/', { replace: false });
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
        return;
      }
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActive = (href: string) => {
    if (href.startsWith('#')) return activeSection === href.slice(1);
    if (href.startsWith('/') && href !== '/') return location.pathname === href;
    return false;
  };

  return (
    <nav
      ref={navRef}
      className="
        sticky top-0 z-40
        border-b border-line/50
        bg-bg/80 backdrop-blur-xl
      "
    >
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-2">

        {/* Logo + Brand name — far left */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="GS Analytics — scroll to top"
        >
          <img
            src="/img/logos/transparent_logo_centered.svg"
            alt="GS Analytics logo"
            className="h-7 w-7"
          />
          <span className="text-sm font-semibold text-brand">GS Analytics</span>
        </button>

        {/* Desktop nav — left-justified, grows to fill space */}
        <ul className="hidden flex-1 items-center gap-0.5 md:flex">
          {navigation.map((item) => (
            <li key={item.label}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-text"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  onClick={() => scrollTo(item.href)}
                  className={`
                    rounded-lg px-3 py-2 text-sm transition-colors
                    ${isActive(item.href) ? 'text-brand' : 'text-muted hover:text-text'}
                  `}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Home button — only shown on sub-pages */}
        {location.pathname !== '/' && (
          <button
            onClick={() => navigate('/')}
            className="
              hidden shrink-0 items-center gap-1.5 rounded-lg border border-line/50
              px-3 py-1.5 text-xs font-medium text-muted
              transition-all hover:border-line hover:text-text
              md:flex
            "
          >
            ← Main Page
          </button>
        )}

        {/* Quick View pill — far right, hiring manager shortcut */}
        <button
          onClick={() => scrollTo('/quick-view')}
          className="
            hidden shrink-0 items-center gap-1.5 rounded-lg border border-muted/20
            bg-surface px-3 py-1.5 text-xs font-medium text-muted
            transition-all hover:border-muted/40 hover:text-text
            md:flex
          "
        >
          Quick View
        </button>

        {/* Analytics Resource Hub — far right */}
        <a
          href={resourceHubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            hidden shrink-0 items-center gap-1.5 rounded-lg border border-brand/30
            bg-brand/5 px-3 py-1.5 text-xs font-medium text-brand
            transition-all hover:border-brand/50 hover:bg-brand/10
            md:flex
          "
        >
          Analytics Resource Hub ↗
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ml-auto rounded-lg p-2 text-muted transition-colors hover:text-text md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line/50 md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {navigation.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-surface hover:text-text"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => scrollTo(item.href)}
                    className={`
                      block w-full rounded-lg px-3 py-2 text-left text-sm
                      ${isActive(item.href) ? 'text-brand' : 'text-muted'}
                      hover:bg-surface hover:text-text
                    `}
                  >
                    {item.label}
                  </button>
                )
              )}
              {location.pathname !== '/' && (
                <button
                  onClick={() => { setMobileOpen(false); navigate('/'); }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-surface hover:text-text"
                >
                  ← Main Page
                </button>
              )}
              <a
                href={resourceHubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-brand hover:bg-surface"
              >
                Analytics Resource Hub ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
