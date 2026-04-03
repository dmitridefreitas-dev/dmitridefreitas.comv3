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

const left  = timeline.filter((e) => e.type === 'education');
const right = experiences;

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
      initial={{ opacity: 0, x: rowIdx === -1 ? 0 : (isRight ? 32 : -32) }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.65, delay: rowIdx * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-1.5 ${rowIdx === -1 ? 'items-center text-center mx-auto scale-[0.95]' : (isRight ? 'items-start text-left' : 'items-end text-right')}`}
    >
      <div
        style={{
          background: 'rgba(8,14,28,0.72)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderLeft:  (rowIdx === -1 || isRight)  ? `2px solid ${color}` : undefined,
          borderRight: (rowIdx !== -1 && !isRight) ? `2px solid ${color}` : undefined,
          borderRadius: '10px',
          padding: '14px 16px',
          maxWidth: rowIdx === -1 ? '260px' : '270px',
          backdropFilter: 'blur(12px)',
          boxShadow: `0 4px 28px rgba(0,0,0,0.45), 0 0 18px ${color}0c`,
        }}
      >
        {/* Badge row */}
        <div className={`flex items-center gap-2 mb-2.5 ${(rowIdx === -1 || isRight) ? '' : 'flex-row-reverse justify-end'}`}>
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
          fontSize: rowIdx === -1 ? '12px' : '15px',
          lineHeight: '1.3',
          color: '#F9FAFB',
          marginBottom: '4px',
        }}>
          {entry.title}
        </h3>

        {entry.organization && (
          <p style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: rowIdx === -1 ? '8px' : '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(156,163,175,0.45)',
            marginBottom: '7px',
          }}>
            {entry.organization}
          </p>
        )}

        <p style={{
          fontSize: rowIdx === -1 ? '9.5px' : '12px',
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

  const rows = Math.max(left.length, right.length);

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

      <div className="hidden md:block">
        {/* Column labels */}
        <div className="max-w-3xl mx-auto mb-4">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-x-8">
            <p className="text-right font-mono text-[10px] uppercase tracking-[0.25em] text-muted/28">Education</p>
            <div className="w-3.5" />
            <p className="text-left font-mono text-[10px] uppercase tracking-[0.25em] text-muted/28">Experience</p>
          </div>
        </div>

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
            {Array.from({ length: rows }).map((_, rowIdx) => {
              const leftEntry  = left[rowIdx];
              const rightEntry = right[rowIdx];
              const activeType = (leftEntry || rightEntry)?.type;
              const dotColor   = TYPE_COLORS[activeType] || '#8B5CF6';

              return (
                <div key={rowIdx} className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-8 py-8">

                  <div className="flex justify-end">
                    {leftEntry && <Entry entry={leftEntry} align="right" rowIdx={rowIdx} />}
                  </div>

                  {/* Multi-layer glowing dot */}
                  <div className="flex items-center justify-center z-10 flex-shrink-0" style={{ width: '14px' }}>
                    <motion.div
                      className="relative flex items-center justify-center"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: rowIdx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Outer pulse ring */}
                      <motion.div
                        className="absolute rounded-full"
                        style={{ width: '38px', height: '38px', border: `1px solid ${dotColor}` }}
                        animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: rowIdx * 0.3 }}
                      />
                      {/* Mid pulse ring */}
                      <motion.div
                        className="absolute rounded-full"
                        style={{ width: '24px', height: '24px', border: `1px solid ${dotColor}70` }}
                        animate={{ scale: [1, 1.5], opacity: [0.45, 0] }}
                        transition={{ duration: 2.0, repeat: Infinity, ease: 'easeOut', delay: rowIdx * 0.3 + 0.5 }}
                      />
                      {/* Solid core */}
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
                    {rightEntry && <Entry entry={rightEntry} align="left" rowIdx={rowIdx} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE CONTENT: Total Scratch Rebuild */}
      <div className="md:hidden mt-12 mb-32 flex flex-col items-center w-full px-6">
        
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-3">Career History</h2>
          <div className="h-1 w-12 bg-accent mx-auto rounded-full" />
        </div>

        <div className="flex flex-col items-center w-full gap-0">
          {experiences.map((exp, i) => {
            const color = TYPE_COLORS[exp.type] || '#00D4FF';
            const desc = Array.isArray(exp.description) ? exp.description[0] : exp.shortDescription;
            
            // Calculate scroll ranges for this specific milestone
            // Total 8 items + spacers. 0.0 to 1.0.
            const start = i * (1 / experiences.length) * 0.8;
            const end   = (i + 1) * (1 / experiences.length) * 0.8;
            
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const itemScale = useTransform(scrollYProgress, [start, end], [0.8, 1]);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const lineScale = useTransform(scrollYProgress, [end - 0.05, end + 0.05], [0, 1]);

            return (
              <div key={`stepping-mob-${i}`} className="flex flex-col items-center w-full">
                
                {/* Visual Connector Dot (Stepping Stone) */}
                <div className="relative flex items-center justify-center">
                  {/* Pulse Ring (Mobile version of desktop pulse) */}
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute w-8 h-8 rounded-full border border-current"
                    style={{ color: color }}
                  />
                  <div 
                    className="w-3.5 h-3.5 rounded-full z-10 border-2 border-[#02030A]" 
                    style={{ background: color, boxShadow: `0 0 12px ${color}80` }} 
                  />
                </div>
                
                {/* Content Card: Diamond "Stepping Stone" */}
                <motion.div 
                  style={{ scale: itemScale }}
                  className="w-full mt-6 mb-6 flex justify-center relative min-h-[160px]"
                >
                  {/* SVG Stone Background */}
                  <svg 
                    className="absolute inset-0 w-full h-full drop-shadow-[0_0_25px_rgba(0,0,0,0.4)]" 
                    viewBox="0 0 400 200" 
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <defs>
                      <filter id={`stoneGlow-${i}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <path 
                      d="M 60,10 L 340,10 L 390,100 L 340,190 L 60,190 L 10,100 Z" 
                      fill="#0A1229" 
                      fillOpacity="0.95"
                      stroke={color}
                      strokeWidth="2"
                      style={{ filter: `drop-shadow(0 0 12px ${color}40)` }}
                    />
                  </svg>

                  {/* Content Overlay */}
                  <div className="relative z-10 w-full max-w-[280px] py-8 px-4 flex flex-col items-center justify-center text-center">
                    <div className="flex flex-col items-center gap-1.5 mb-3.5">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">{exp.date}</span>
                      <span 
                        style={{ color: color, background: `${color}15` }} 
                        className="text-[8px] font-mono uppercase tracking-widest px-3 py-0.5 rounded-full border border-white/5"
                      >
                        {TYPE_LABELS[exp.type]}
                      </span>
                    </div>

                    <h3 className="text-[16px] font-bold text-white mb-1 leading-tight tracking-tight px-2">{exp.title}</h3>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-accent/50 mb-4">{exp.organization}</p>
                    
                    <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2 max-w-[220px]">
                      {desc}
                    </p>
                  </div>
                </motion.div>

                {/* Animated Connector Line (The "Growing Line") */}
                {i < experiences.length - 1 && (
                  <div className="relative w-[3px] h-20 bg-white/[0.08] mb-6 rounded-full overflow-hidden">
                    <motion.div 
                      style={{ 
                        scaleY: lineScale, 
                        originY: 0,
                        background: `linear-gradient(to bottom, ${color}, ${TYPE_COLORS[experiences[i+1].type] || color})`,
                        boxShadow: `0 0 10px ${color}80` 
                      }}
                      className="absolute inset-0 rounded-full"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Closing Mark */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/10">End of Path</span>
        </div>

      </div>
    </section>
  );
}
