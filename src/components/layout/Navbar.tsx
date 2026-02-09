import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navigation } from '../../data/navigation';
import { useScrollSpy } from '../../hooks/useScrollSpy';

const sectionIds = ['services', 'case-studies', 'projects', 'pipeline-journey', 'contact'];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useScrollSpy(sectionIds);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const scrollTo = (href: string) => {
    setOpenDropdown(null);
    setMobileOpen(false);
    if (href.startsWith('#')) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
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
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Logo / Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-sm font-semibold text-brand transition-colors hover:text-text"
        >
          GS Analytics
        </button>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <li key={item.label} className="relative">
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
                  onClick={() => {
                    if (item.children) {
                      setOpenDropdown(openDropdown === item.label ? null : item.label);
                    } else {
                      scrollTo(item.href);
                    }
                  }}
                  className={`
                    rounded-lg px-3 py-2 text-sm transition-colors
                    ${activeSection === item.href.slice(1)
                      ? 'text-brand'
                      : 'text-muted hover:text-text'
                    }
                  `}
                >
                  {item.label}
                </button>
              )}

              {/* Dropdown */}
              <AnimatePresence>
                {item.children && openDropdown === item.label && (
                  <motion.ul
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="
                      absolute right-0 top-full mt-1 min-w-[220px]
                      rounded-xl border border-line bg-card/95
                      p-2 shadow-xl backdrop-blur-xl
                    "
                  >
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={child.href}
                          {...(child.external
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          onClick={(e) => {
                            if (!child.external) {
                              e.preventDefault();
                              scrollTo(child.href);
                            }
                            setOpenDropdown(null);
                          }}
                          className="
                            block rounded-lg px-3 py-2 text-sm text-muted
                            no-underline transition-colors
                            hover:bg-surface hover:text-text
                          "
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-muted transition-colors hover:text-text md:hidden"
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
                      ${activeSection === item.href.slice(1) ? 'text-brand' : 'text-muted'}
                      hover:bg-surface hover:text-text
                    `}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
