import { useEffect, useCallback, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  src?: string;
  children?: ReactNode;
}

export default function DocumentViewer({
  isOpen,
  onClose,
  title,
  src,
  children,
}: DocumentViewerProps) {
  const [iframeLoading, setIframeLoading] = useState(true);

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
      setIframeLoading(true);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative flex h-full w-full flex-col border-l border-line/50 bg-bg/95 backdrop-blur-xl md:w-[80%] lg:w-[75%]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Document viewer'}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line/50 px-5 py-3">
              <h2 className="truncate text-sm font-medium text-muted">
                {title || ''}
              </h2>
              <button
                onClick={onClose}
                className="ml-4 flex-shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-text"
                aria-label="Close viewer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="relative flex-1 overflow-auto">
              {src ? (
                <>
                  {iframeLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 size={24} className="animate-spin text-brand/50" />
                    </div>
                  )}
                  <iframe
                    src={src}
                    title={title || 'Content'}
                    className="h-full w-full border-0"
                    loading="lazy"
                    onLoad={() => setIframeLoading(false)}
                  />
                </>
              ) : (
                <div className="p-6 md:p-8">{children}</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
