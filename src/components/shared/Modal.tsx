import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  src?: string;
  size?: 'default' | 'large' | 'small';
  children?: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  src,
  size = 'default',
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const sizeClasses = {
    small: 'max-w-lg',
    default: 'max-w-4xl',
    large: 'max-w-6xl',
  };

  // Determine size from title (matching existing modal behavior)
  const resolvedSize = (() => {
    if (size !== 'default') return size;
    const reportTitles = [
      'Retail Returns Diagnostic for VP of Sales',
      'Inventory Efficiency Audit',
      'Customer Retention Strategy',
      'Ecom Datalake Pipelines',
      'SQL Stories Ecosystem',
    ];
    if (title && reportTitles.some((t) => title.includes(t))) return 'large';
    return 'default';
  })();

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            className={`relative flex max-h-[90vh] w-full flex-col rounded-2xl border border-line bg-bg shadow-2xl ${sizeClasses[resolvedSize]}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Modal'}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="text-sm font-medium text-muted">{title || ''}</span>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-text"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto">
              {src ? (
                <iframe
                  src={src}
                  title={title || 'Content'}
                  className="h-full min-h-[60vh] w-full border-0"
                  loading="lazy"
                />
              ) : (
                <div className="p-6">{children}</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
