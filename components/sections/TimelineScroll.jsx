'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { timeline } from '@/data/constants';
import { experiences } from '@/data/experiences';

const TYPE_COLORS = {
  finance:   '#8B5CF6',
  research:  '#8B5CF6',
  education: '#8B5CF6',
  activity:  '#8B5CF6',
};

// Left: education entries from timeline
const left = timeline.filter((e) => e.type === 'education');

// Right: ALL work/research/activity experiences
const right = experiences;

function Entry({ entry, align = 'left' }) {
  const dot = TYPE_COLORS[entry.type] || '#8B5CF6';
  const isRight = align === 'right';

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 28 : -28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-1.5 ${isRight ? 'items-start text-left' : 'items-end text-right'}`}
    >
      <div className={`flex items-center gap-2 ${isRight ? '' : 'flex-row-reverse'}`}>
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
        <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: dot }}>
          {entry.type}
        </span>
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted/60 leading-none">
        {entry.year ?? entry.date}
      </p>
      <h3 className="font-sans font-bold text-base md:text-lg text-foreground leading-snug max-w-[260px]">
        {entry.title}
      </h3>
      <p className="text-xs text-muted/70 leading-relaxed max-w-[260px] line-clamp-2">
        {entry.description ?? entry.shortDescription}
      </p>
    </motion.div>
  );
}

export default function TimelineScroll() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.3'],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const rows = Math.max(left.length, right.length);

  return (
    <section ref={sectionRef} className="py-20 px-6 lg:px-12" aria-label="Timeline">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-mono text-xs uppercase tracking-[0.4em] text-accent text-center mb-14"
      >
        Career Path
      </motion.p>

      <div className="relative max-w-3xl mx-auto">
        {/* Ghost center line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{ background: 'rgba(139,92,246,0.08)' }}
        />
        {/* Animated fill line */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 origin-top"
          style={{
            background: 'rgba(139,92,246,0.7)',
            scaleY: lineScaleY,
            boxShadow: '0 0 8px rgba(139,92,246,0.4)',
          }}
        />

        <div className="flex flex-col">
          {Array.from({ length: rows }).map((_, rowIdx) => {
            const leftEntry  = left[rowIdx];
            const rightEntry = right[rowIdx];
            const dotColor   = TYPE_COLORS[leftEntry?.type || rightEntry?.type] || '#8B5CF6';

            return (
              <div key={rowIdx} className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-8 py-9">
                <div className="flex justify-end">
                  {leftEntry && <Entry entry={leftEntry} align="right" />}
                </div>

                <motion.div
                  className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 z-10"
                  style={{
                    backgroundColor: dotColor,
                    borderColor: '#000000',
                    boxShadow: `0 0 12px ${dotColor}70`,
                  }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: rowIdx * 0.1 }}
                />

                <div className="flex justify-start">
                  {rightEntry && <Entry entry={rightEntry} align="left" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
