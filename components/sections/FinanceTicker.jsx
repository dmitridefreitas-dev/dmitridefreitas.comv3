'use client';
import { tickerTerms } from '@/data/constants';

export default function AcademicTicker() {
  const tripled = [...tickerTerms, ...tickerTerms, ...tickerTerms];

  return (
    <div className="relative overflow-hidden py-3 border-b border-border bg-surface/60 scroll-fade-edges">
      <div className="flex animate-ticker-scroll whitespace-nowrap">
        {tripled.map((term, i) => (
          <span
            key={i}
            className="inline-flex items-center text-xs font-mono uppercase tracking-[0.2em] text-muted mx-6"
          >
            <span className="w-1 h-1 rounded-full mr-4 flex-shrink-0" style={{ backgroundColor: 'rgba(139,92,246,0.5)' }} />
            {term}
          </span>
        ))}
      </div>
    </div>
  );
}
