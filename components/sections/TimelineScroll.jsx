'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { timeline } from '@/data/constants';
import { experiences } from '@/data/experiences';

const TYPE_COLORS = {
  finance:   '#00D4FF',
  research:  '#00E5A0',
  education: '#8B5CF6',
  activity:  'rgba(139,92,246,0.55)',
};

const TYPE_LABELS = {
  finance:   'Industry',
  research:  'Research',
  education: 'Education',
  activity:  'Activity',
};

const _edu  = timeline.filter((e) => e.type === 'education');
const _exp  = experiences;

// Interleave education and experience entries into one alternating list
const merged = [];
const _max = Math.max(_edu.length, _exp.length);
for (let i = 0; i < _max; i++) {
  if (_edu[i]) merged.push(_edu[i]);
  if (_exp[i]) merged.push(_exp[i]);
}

function Entry({ entry, align = 'left', rowIdx = 0 }) {
  const isRight = align === 'right';
  const color   = TYPE_COLORS[entry.type] || '#8B5CF6';
  const label   = TYPE_LABELS[entry.type]  || entry.type;

  const desc = typeof entry.description === 'string'
    ? entry.description
    : Array.isArray(entry.description)
    ? entry.description[0]
    : entry.shortDescription;

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 32 : -32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.65, delay: rowIdx * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-1.5 ${isRight ? 'items-start text-left' : 'items-end text-right'}`}
    >
      <div
        style={{
          background: 'rgba(8,14,28,0.72)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderLeft:  isRight  ? `2px solid ${color}` : undefined,
          borderRight: !isRight ? `2px solid ${color}` : undefined,
          borderRadius: '10px',
          padding: '14px 16px',
          maxWidth: '270px',
          backdropFilter: 'blur(12px)',
          boxShadow: `0 4px 28px rgba(0,0,0,0.45), 0 0 18px ${color}0c`,
        }}
      >
        {/* Badge row */}
        <div className={`flex items-center gap-2 mb-2.5 ${isRight ? '' : 'flex-row-reverse justify-end'}`}>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '9px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: color,
              background: `${color}18`,
              border: `1px solid ${color}38`,
              borderRadius: '4px',
              padding: '2px 7px',
              flexShrink: 0,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10px',
              letterSpacing: '0.16em',
              color: `${color}70`,
            }}
          >
            {entry.year ?? entry.date}
          </span>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-sans, sans-serif)',
          fontWeight: 700,
          fontSize: '15px',
          lineHeight: '1.3',
          color: '#F9FAFB',
          marginBottom: '4px',
        }}>
          {entry.title}
        </h3>

        {entry.organization && (
          <p style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(156,163,175,0.45)',
            marginBottom: '7px',
          }}>
            {entry.organization}
          </p>
        )}

        <p style={{
          fontSize: '12px',
          color: 'rgba(156,163,175,0.65)',
          lineHeight: '1.65',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function TimelineScroll() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'end 0.25'],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="py-20 px-6 lg:px-12" aria-label="Timeline">

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-mono text-xs uppercase tracking-[0.4em] text-accent text-center mb-2"
      >
        Career Path
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted/35 text-center mb-14"
      >
        Education &nbsp;·&nbsp; Experience &nbsp;·&nbsp; Research
      </motion.p>


      <div className="relative max-w-3xl mx-auto">
        {/* Ghost center line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
          style={{ width: '1px', background: 'rgba(139,92,246,0.07)' }}
        />
        {/* Animated gradient fill line */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 origin-top"
          style={{
            width: '1px',
            background: 'linear-gradient(to bottom, #8B5CF6 0%, #00D4FF 55%, #00E5A0 100%)',
            scaleY: lineScaleY,
            boxShadow: '0 0 10px rgba(139,92,246,0.6), 0 0 20px rgba(0,212,255,0.2)',
          }}
        />

        <div className="flex flex-col">
          {merged.map((entry, idx) => {
            const isLeft   = idx % 2 === 0;
            const dotColor = TYPE_COLORS[entry.type] || '#8B5CF6';

            return (
              <div key={entry.id ?? idx} className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-8 py-8">

                <div className="flex justify-end">
                  {isLeft && <Entry entry={entry} align="right" rowIdx={idx} />}
                </div>

                {/* Multi-layer glowing dot */}
                <div className="flex items-center justify-center z-10 flex-shrink-0" style={{ width: '14px' }}>
                  <motion.div
                    className="relative flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      className="absolute rounded-full"
                      style={{ width: '38px', height: '38px', border: `1px solid ${dotColor}` }}
                      animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: idx * 0.25 }}
                    />
                    <motion.div
                      className="absolute rounded-full"
                      style={{ width: '24px', height: '24px', border: `1px solid ${dotColor}70` }}
                      animate={{ scale: [1, 1.5], opacity: [0.45, 0] }}
                      transition={{ duration: 2.0, repeat: Infinity, ease: 'easeOut', delay: idx * 0.25 + 0.5 }}
                    />
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: dotColor,
                        border: '2px solid rgba(2,3,10,0.95)',
                        boxShadow: `0 0 14px ${dotColor}dd, 0 0 32px ${dotColor}55`,
                        position: 'relative',
                        zIndex: 1,
                        flexShrink: 0,
                      }}
                    />
                  </motion.div>
                </div>

                <div className="flex justify-start">
                  {!isLeft && <Entry entry={entry} align="left" rowIdx={idx} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
