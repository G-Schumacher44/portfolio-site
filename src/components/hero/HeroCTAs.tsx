import Button from '../shared/Button';

export default function HeroCTAs() {
  return (
    <div className="mt-8 flex flex-col items-center gap-8">
      {/* Top row: Work With Me + Hiring Manager */}
      <div className="flex flex-wrap justify-center gap-10">
        <div className="text-center">
          <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-muted">
            Work With Me
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="primary"
              href="https://calendar.app.google/49XfSdvBVQMz9Zni9"
              external
            >
              Book a Free Consultation
            </Button>
            <Button href="mailto:me@garrettschumacher.com">Email Me</Button>
          </div>
        </div>

        <div className="text-center">
          <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-muted">
            Hiring Manager?
          </span>
          <Button variant="primary" href="/quick-view">
            Quick View
          </Button>
        </div>
      </div>

      {/* Bottom row: Explore My Work */}
      <div className="text-center">
        <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-muted">
          Explore My Work
        </span>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/pdf/gschumacher_resume.pdf" external>
            Resume
          </Button>
          <Button href="https://github.com/G-Schumacher44" external>
            GitHub
          </Button>
          <Button
            href="https://linkedin.com/in/garrett-schumacher-243a5513a"
            external
          >
            LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
}
