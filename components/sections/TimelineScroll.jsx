'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { timeline } from '@/data/constants';
import { experiences } from '@/data/experiences';

const TYPE_COLORS = {
  finance:   '#00D4FF',
  research:  '#00FFB2',
  education: '#AD8BFF',
  activity:  'rgba(173,139,255,0.7)',
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
          boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${color}15`,
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
              textShadow: `0 0 10px ${color}80`,
              background: `${color}25`,
              border: `1px solid ${color}50`,
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
    offset: ['start 0.8', 'end 0.2'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

  return (
    <section ref={sectionRef} className="pt-24 pb-[40vh] px-6 relative overflow-hidden" aria-label="Timeline History">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[800px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(173, 139, 255, 0.15) 0%, transparent 100%)' }}
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Unified Header */}
        <div className="mb-24 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-mono text-xs uppercase tracking-[0.5em] mb-4"
            style={{ color: '#AD8BFF', textShadow: '0 0 20px rgba(173, 139, 255, 0.9), 0 0 10px rgba(173, 139, 255, 0.6)' }}
          >
            Career Path
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            Professional History
          </motion.h2>
          <div className="h-1 w-16 mx-auto rounded-full" style={{ background: '#AD8BFF', boxShadow: '0 0 25px #AD8BFF' }} />
        </div>

        {/* 1:1 Unified Stepping Stones Path */}
        <div className="flex flex-col items-center w-full max-w-2xl gap-0 relative">
          
          {/* Robust Continuous Background Line (Fixed 1:1 Parity) */}
          <div className="absolute top-[30px] bottom-[260px] left-1/2 -translate-x-1/2 w-[3px] bg-white/[0.04] rounded-full overflow-hidden z-0">
            <motion.div 
              style={{ 
                scaleY: pathLength,
                originY: 0,
                background: 'linear-gradient(to bottom, #00D4FF 0%, #00FFB2 50%, #AD8BFF 100%)',
                boxShadow: '0 0 35px #00D4FF',
                willChange: 'transform',
                transform: 'translateZ(0)'
              }}
              className="absolute inset-0 rounded-full"
            />
          </div>
          
          {experiences.map((exp, i) => {
            const color = TYPE_COLORS[exp.type] || '#00D4FF';
            const desc = Array.isArray(exp.description) ? exp.description[0] : exp.shortDescription;
            
            return (
              <div key={`stepping-stone-${i}`} className="flex flex-col items-center w-full">
                
                {/* Visual Connector Dot */}
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    className="absolute w-10 h-10 rounded-full border border-current"
                    style={{ color: color }}
                  />
                  <div 
                    className="w-5 h-5 rounded-full z-10 border-2 border-[#02030A]" 
                    style={{ background: color, boxShadow: `0 0 25px ${color}` }} 
                  />
                </div>
                
                {/* Content Card: Diamond "Stepping Stone" (Shared Mobile/Desktop Layout) */}
                <motion.div 
                  initial={{ scale: 0.85, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ amount: 0.2, once: false }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full mt-10 mb-10 flex justify-center relative min-h-[200px] md:min-h-[220px] will-change-transform"
                >
                  <svg 
                    className="absolute inset-0 w-full h-full drop-shadow-[0_0_40px_rgba(0,0,0,0.6)]" 
                    viewBox="0 0 400 200" 
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path 
                      d="M 65,10 L 335,10 L 390,100 L 335,190 L 65,190 L 10,100 Z" 
                      fill="#0A1229" 
                      fillOpacity="0.97"
                      stroke={color}
                      strokeWidth="2.5"
                      style={{ filter: `drop-shadow(0 0 25px ${color})` }}
                    />
                  </svg>

                  <div className="relative z-10 w-full px-8 md:px-12 py-12 flex flex-col items-center justify-center text-center">
                    <div className="flex flex-col items-center gap-2 mb-5">
                      <span className="text-[12px] font-mono uppercase tracking-[0.3em] text-white/40">{exp.date}</span>
                      <span 
                        style={{ color: '#FFFFFF', background: color, boxShadow: `0 0 20px ${color}80` }} 
                        className="text-[10px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full"
                      >
                        {TYPE_LABELS[exp.type]}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight tracking-tight">{exp.title}</h3>
                    <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.2em] text-accent mb-6 opacity-90">{exp.organization}</p>
                    
                    <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-[420px] line-clamp-3">
                      {desc}
                    </p>
                  </div>
                </motion.div>

                  {/* Spacer for continuous line flow */}
                  <div className="relative w-[3px] h-24 mb-10" />
              </div>
            );
          })}
        </div>

        {/* Closing Mark */}
        <div className="mt-32 flex flex-col items-center gap-4 opacity-40">
          <div className="w-2 h-2 rounded-full bg-[#AD8BFF] shadow-[0_0_15px_#AD8BFF]" />
          <span className="text-[10px] font-mono uppercase tracking-[0.6em] text-[#AD8BFF]">End of Path</span>
        </div>

      </div>
    </section>
  );
}
