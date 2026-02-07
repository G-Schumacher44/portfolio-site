import { Github, Linkedin, Mail } from 'lucide-react';
import GradientBorder from '../shared/GradientBorder';

export default function Footer() {
  return (
    <footer className="relative pb-8 pt-4">
      <GradientBorder className="mb-8" />
      <div className="mx-auto max-w-5xl px-4 text-center">
        <div className="mb-4 flex items-center justify-center gap-4">
          <a
            href="https://github.com/G-Schumacher44"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-muted transition-colors hover:text-brand"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/garrett-schumacher-243a5513a"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-muted transition-colors hover:text-brand"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:me@garrettschumacher.com"
            className="rounded-lg p-2 text-muted transition-colors hover:text-brand"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} Garrett Schumacher. All rights reserved.
        </p>
        <p className="mt-1 text-xs text-muted/50">
          Built with React, Tailwind, and Framer Motion
        </p>
      </div>
    </footer>
  );
}
