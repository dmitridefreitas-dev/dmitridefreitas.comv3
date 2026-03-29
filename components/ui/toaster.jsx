'use client';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts
          .filter((t) => t.open)
          .map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  {t.title && (
                    <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  )}
                  {t.description && (
                    <p className="text-xs text-muted mt-1">{t.description}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
