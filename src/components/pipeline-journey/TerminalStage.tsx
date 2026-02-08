import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { PipelineStage } from '../../types';
import StageMetrics from './StageMetrics';

interface TerminalStageProps {
  stage: PipelineStage;
  isActive: boolean;
  reduced: boolean;
  onComplete?: () => void;
  onDocOpen?: (title: string, src: string) => void;
}

export default function TerminalStage({ stage, isActive, reduced, onComplete, onDocOpen }: TerminalStageProps) {
  const [commandText, setCommandText] = useState(reduced ? stage.terminalCommand : '');
  const [commandTyped, setCommandTyped] = useState(reduced);
  const [outputLineIndex, setOutputLineIndex] = useState(reduced ? stage.terminalOutput.length : 0);
  const [outputCharIndex, setOutputCharIndex] = useState(0);
  const [currentOutputText, setCurrentOutputText] = useState('');
  const [showVisual, setShowVisual] = useState(reduced);
  const hasAnimated = useRef(false);
  const hasCompleted = useRef(reduced);

  // Phase 1: Type out the command character by character
  useEffect(() => {
    if (!isActive || hasAnimated.current || reduced) return;
    hasAnimated.current = true;

    let charIndex = 0;
    const cmd = stage.terminalCommand;

    const interval = setInterval(() => {
      charIndex++;
      setCommandText(cmd.slice(0, charIndex));
      if (charIndex >= cmd.length) {
        clearInterval(interval);
        // Small pause before output starts
        setTimeout(() => setCommandTyped(true), 300);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isActive, stage.terminalCommand, reduced]);

  // Phase 2: Type out each output line character by character
  useEffect(() => {
    if (!commandTyped || reduced) return;

    // All lines done
    if (outputLineIndex >= stage.terminalOutput.length) {
      const timer = setTimeout(() => {
        setShowVisual(true);
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onComplete?.();
        }
      }, 400);
      return () => clearTimeout(timer);
    }

    const line = stage.terminalOutput[outputLineIndex];

    // Empty lines — just skip quickly
    if (line === '') {
      const timer = setTimeout(() => {
        setCurrentOutputText('');
        setOutputCharIndex(0);
        setOutputLineIndex((n) => n + 1);
      }, 100);
      return () => clearTimeout(timer);
    }

    // Still typing current line
    if (outputCharIndex < line.length) {
      // Speed varies: fast for repetitive model lines, slower for important ones
      const isFastLine = line.includes('OK ') || line.includes('PASS ') || line.startsWith('  ...');
      const speed = isFastLine ? 8 : 18;

      const timer = setTimeout(() => {
        setCurrentOutputText(line.slice(0, outputCharIndex + 1));
        setOutputCharIndex((c) => c + 1);
      }, speed);
      return () => clearTimeout(timer);
    }

    // Line complete, move to next
    const timer = setTimeout(() => {
      setCurrentOutputText('');
      setOutputCharIndex(0);
      setOutputLineIndex((n) => n + 1);
    }, 60);
    return () => clearTimeout(timer);
  }, [commandTyped, outputLineIndex, outputCharIndex, stage.terminalOutput, reduced, onComplete]);

  // Build the completed lines array + current typing line
  const completedLines = stage.terminalOutput.slice(0, outputLineIndex);
  const isTypingOutput = commandTyped && outputLineIndex < stage.terminalOutput.length;

  return (
    <div className="relative flex gap-4 sm:gap-6">
      {/* Left: Stage node */}
      <div className="flex flex-col items-center">
        <motion.div
          className={`
            flex h-10 w-10 flex-shrink-0 items-center justify-center
            rounded-full border-2 font-mono text-sm font-bold
            transition-all duration-500
            ${
              isActive
                ? 'border-brand bg-brand/15 text-brand shadow-[0_0_16px_rgba(102,153,204,0.3)]'
                : 'border-line bg-card text-muted'
            }
          `}
          animate={isActive && !reduced ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {stage.number}
        </motion.div>
      </div>

      {/* Right: Terminal + Content */}
      <div className="flex-1 space-y-3">
        {/* Terminal block */}
        <div
          className={`
            overflow-hidden rounded-xl border transition-all duration-500
            ${isActive ? 'border-brand/20 shadow-[0_0_24px_rgba(102,153,204,0.08)]' : 'border-line/30'}
          `}
        >
          {/* Terminal header bar */}
          <div className="flex items-center gap-2 border-b border-line/20 bg-[#0a0f14] px-4 py-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-muted/40">
              {stage.subtitle}
            </span>
          </div>

          {/* Terminal body */}
          <div className="bg-[#0a0f14]/90 p-4 font-mono text-xs leading-relaxed backdrop-blur-sm">
            {/* Command prompt */}
            <div className="flex items-start gap-2">
              <span className="select-none text-brand/70">$</span>
              <span className="text-sky-200/90">
                {commandText}
                {!commandTyped && isActive && !reduced && (
                  <span className="inline-block w-1.5 animate-[blink_1s_infinite] bg-brand/70">
                    &nbsp;
                  </span>
                )}
              </span>
            </div>

            {/* Output lines */}
            {(completedLines.length > 0 || isTypingOutput) && (
              <div className="mt-2 space-y-0.5">
                {/* Already completed lines */}
                {completedLines.map((line, i) => (
                  <OutputLine key={i} line={line} />
                ))}

                {/* Currently typing line */}
                {isTypingOutput && currentOutputText && (
                  <div className={getLineColor(stage.terminalOutput[outputLineIndex])}>
                    {currentOutputText}
                    <span className="inline-block w-1.5 animate-[blink_1s_infinite] bg-sky-400/50">
                      &nbsp;
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Visual content — fades in after terminal output */}
        <AnimatePresence>
          {showVisual && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-3"
            >
              {/* Title + description */}
              <div>
                <h3 className="mb-1 text-lg font-semibold text-brand">{stage.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{stage.description}</p>
              </div>

              {/* Artifact metric cards */}
              {stage.artifacts && stage.artifacts.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {stage.artifacts.map((artifact) => (
                    <div
                      key={artifact.label}
                      className="rounded-lg border border-brand/10 bg-brand/5 px-3 py-2 text-center"
                    >
                      <div className="text-base font-bold text-brand">{artifact.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted/60">{artifact.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Live data metrics (fetched from JSON) */}
              {stage.liveDataSrc && <StageMetrics src={stage.liveDataSrc} stageId={stage.id} />}

              {/* Details + links */}
              <div className="border-t border-line/50 pt-3">
                <p className="text-sm leading-relaxed text-muted">{stage.details}</p>
                {stage.links && stage.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {stage.links.map((link) => {
                      const isLocal = link.href.startsWith('/files/');
                      if (isLocal && onDocOpen) {
                        return (
                          <button
                            key={link.label}
                            onClick={() => onDocOpen(link.label, link.href)}
                            className="inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-text"
                          >
                            {link.label}
                            <ExternalLink size={12} />
                          </button>
                        );
                      }
                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          {...(link.external
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className="inline-flex items-center gap-1 text-sm text-brand transition-colors hover:text-text"
                        >
                          {link.label}
                          {link.external && <ExternalLink size={12} />}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getLineColor(line: string): string {
  if (line.startsWith('[DONE]') || line.startsWith('Completed') || line.startsWith('All '))
    return 'text-brand';
  if (line.startsWith('[WARN]') || line.includes('WARN'))
    return 'text-yellow-400/70';
  if (line.startsWith('[INFO]'))
    return 'text-sky-300/60';
  if (line.includes('OK '))
    return 'text-sky-300/50';
  if (line.includes('PASS'))
    return 'text-brand/70';
  if (line === '')
    return 'h-2';
  return 'text-muted/50';
}

function OutputLine({ line }: { line: string }) {
  return <div className={getLineColor(line)}>{line}</div>;
}
