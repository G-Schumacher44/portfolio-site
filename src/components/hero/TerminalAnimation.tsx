import { useState, useEffect, useRef } from 'react';
import { hero } from '../../data/sections';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function TerminalAnimation() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const containerRef = useRef<HTMLPreElement>(null);
  const reduced = useReducedMotion();

  const lines = hero.terminalLines;

  useEffect(() => {
    if (reduced) {
      setDisplayedLines(lines);
      return;
    }

    if (currentLine >= lines.length) {
      // Loop after a pause
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
      }, 4000);
      return () => clearTimeout(timeout);
    }

    const line = lines[currentLine];

    if (currentChar <= line.length) {
      const speed = line === '' ? 200 : 25;
      const timeout = setTimeout(() => {
        const partial = line.slice(0, currentChar);
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[currentLine] = partial;
          return next;
        });
        setCurrentChar((c) => c + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }

    // Line complete, move to next
    const timeout = setTimeout(() => {
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, lines[currentLine].startsWith('$') ? 800 : 150);
    return () => clearTimeout(timeout);
  }, [currentLine, currentChar, lines, reduced]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLines]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        perspective: '800px',
      }}
    >
      <pre
        ref={containerRef}
        className="
          h-full overflow-hidden whitespace-pre-wrap
          font-mono text-sm leading-relaxed text-brand/20
        "
        style={{
          transform: 'rotateX(3deg)',
          transformOrigin: 'center top',
        }}
      >
        {displayedLines.map((line, i) => (
          <div key={i} className={line.startsWith('$') ? 'text-brand/25' : ''}>
            {line}
            {i === currentLine && !reduced && (
              <span className="inline-block w-2 animate-[blink_1s_infinite] bg-brand/40">
                &nbsp;
              </span>
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}
