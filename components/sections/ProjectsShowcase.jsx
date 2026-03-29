'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import TextReveal from '@/components/effects/TextReveal';
import TiltCard from '@/components/effects/TiltCard';
import { heroProjects } from '@/data/projects';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

// Per-card finance data — sparkline paths are connected segments of one continuous graph
// Each segment starts at the y-value where the previous one ended
const CARD_META = [
  {
    metrics: [
      { label: 'SOFR', base: 5.28, range: 0.06, fmt: (v) => v.toFixed(2) + '%' },
      { label: 'SPRD', base: 142,  range: 5,    fmt: (v) => v.toFixed(0) + 'bps' },
      { label: 'YLDS', base: 4.18, range: 0.04, fmt: (v) => v.toFixed(2) + '%' },
    ],
    // Segment 1 — ends at y=10
    path: 'M0,38 L18,32 L36,26 L54,30 L72,18 L90,13 L108,20 L126,15 L144,10',
    endY: 10,
  },
  {
    metrics: [
      { label: 'MLR ', base: 83.2, range: 0.3, fmt: (v) => v.toFixed(1) + '%' },
      { label: 'CAPX', base: 998,  range: 3,   fmt: (v) => '$' + v.toFixed(0) + 'M' },
      { label: 'VAR ', base: 4.9,  range: 0.3, fmt: (v) => '$' + v.toFixed(1) + 'M' },
    ],
    // Segment 2 — starts at y=10, ends at y=32
    path: 'M0,10 L18,6 L36,14 L54,22 L72,17 L90,28 L108,22 L126,28 L144,32',
    endY: 32,
  },
  {
    metrics: [
      { label: 'ASST', base: 10.2, range: 0.1, fmt: (v) => '$' + v.toFixed(1) + 'M' },
      { label: 'TXN ', base: 1024, range: 8,   fmt: (v) => v.toFixed(0) },
      { label: 'RISK', base: 12,   range: 1,   fmt: (v) => v.toFixed(0) + ' flags' },
    ],
    // Segment 3 — starts at y=32, ends at y=20
    path: 'M0,32 L18,26 L36,30 L54,22 L72,15 L90,21 L108,17 L126,24 L144,20',
    endY: 20,
  },
  {
    metrics: [
      { label: 'DSET', base: 2000, range: 0,   fmt: (v) => v.toFixed(0) },
      { label: 'CONF', base: 80.1, range: 0.3, fmt: (v) => v.toFixed(1) + '%' },
      { label: 'FREQ', base: 1.42, range: 0.02, fmt: (v) => v.toFixed(2) + 'GHz' },
    ],
    // Segment 4 — starts at y=20, ends at y=4
    path: 'M0,20 L18,14 L36,10 L54,17 L72,12 L90,8 L108,14 L126,6 L144,4',
    endY: 4,
  },
];

function LiveMetrics({ meta, active }) {
  const [vals, setVals] = useState(() =>
    meta.metrics.map((m) => m.fmt(m.base))
  );

  useEffect(() => {
    const id = setInterval(() => {
      // Only flicker 1 random metric per tick
      const pick = Math.floor(Math.random() * meta.metrics.length);
      setVals((prev) => {
        const next = [...prev];
        const m = meta.metrics[pick];
        next[pick] = m.fmt(m.base + (Math.random() - 0.5) * m.range * 2);
        return next;
      });
    }, 900 + Math.random() * 600);
    return () => clearInterval(id);
  }, [meta]);

  return (
    <div className="absolute top-5 left-6 flex gap-7 z-20" aria-hidden="true">
      {meta.metrics.map((m, i) => (
        <div key={m.label} className="flex flex-col gap-0.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: 'rgba(196,181,253,0.8)' }}>
            {m.label}
          </span>
          <motion.span
            key={vals[i]}
            className="font-mono text-[17px] font-bold text-white"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {vals[i]}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

function SparkLine({ path, active, endY }) {
  return (
    <div className="absolute left-0 right-0 pointer-events-none z-10" style={{ top: '38%' }} aria-hidden="true">
      <svg
        viewBox="0 0 144 50"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '50px', overflow: 'visible' }}
      >
        {/* Fill under the line */}
        <motion.path
          d={path + ' L144,50 L0,50 Z'}
          fill="url(#sparkFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 0.18 : 0.08 }}
          transition={{ duration: 0.6 }}
        />
        {/* The line itself */}
        <motion.path
          d={path}
          fill="none"
          stroke="url(#sparkStroke)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: active ? 0.7 : 0.35 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.4 } }}
        />
        {/* End dot — y matches the path's last point so graph looks continuous */}
        <motion.circle
          cx="144" cy={endY ?? 10}
          r="2"
          fill="#8B5CF6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: active ? 1 : 0.4, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        />
        <defs>
          <linearGradient id="sparkStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(139,92,246,0.3)" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(139,92,246,0.6)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function ProjectCard({ project, index, isActive }) {
  const meta = CARD_META[index] || CARD_META[0];

  return (
    <TiltCard
      className={`relative flex-shrink-0 w-[82vw] md:w-[50vw] lg:w-[36vw] h-[40vh] overflow-hidden ${
        isActive ? 'animated-border-card' : 'academic-card'
      }`}
      style={{ borderRadius: '8px' }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{ background: project.gradient || 'linear-gradient(135deg, #1e0f3a 0%, #0a0720 100%)' }}
        aria-hidden="true"
      />

      {/* Subtle graph grid */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-12 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(139,92,246,0.05), transparent)' }}
        animate={{ top: ['-15%', '115%'] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: index * 1.1 }}
        aria-hidden="true"
      />

      {/* Live metrics */}
      <LiveMetrics meta={meta} active={isActive} />

      {/* Sparkline chart — continuous graph segment per card */}
      <SparkLine path={meta.path} active={isActive} endY={meta.endY} />

      {/* Ghost index */}
      <p
        className="absolute top-5 right-6 font-mono font-bold select-none pointer-events-none z-20"
        style={{
          fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
          color: isActive ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.09)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
        }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </p>

      {/* Live indicator */}
      {isActive && (
        <motion.div
          className="absolute top-[4.5rem] left-6 flex items-center gap-1.5 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#8B5CF6' }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: 'rgba(139,92,246,0.6)' }}>
            live
          </span>
        </motion.div>
      )}

      {/* Card content */}
      <motion.div
        className="w-full h-full flex flex-col justify-end p-6 md:p-8 overflow-hidden rounded-lg relative z-20"
        animate={{ opacity: 1, scale: isActive ? 1 : 0.97 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative z-10">
          <h3 className="font-serif font-bold text-lg md:text-xl text-white leading-tight mb-2">
            {project.title}
          </h3>
          <p className="text-white/60 max-w-xs leading-relaxed font-mono text-xs uppercase tracking-wider">
            {project.subtitle}
          </p>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: isActive
              ? 'linear-gradient(90deg, rgba(139,92,246,0.6), rgba(76,29,149,0.4), transparent)'
              : 'linear-gradient(90deg, rgba(139,92,246,0.2), rgba(76,29,149,0.1), transparent)',
          }}
        />
      </motion.div>
    </TiltCard>
  );
}

export default function ProjectsShowcase() {
  const [current, setCurrent] = useState(0);
  const constraintsRef = useRef(null);
  const projects = heroProjects;
  const total = projects.length;

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(total - 1, c + 1));

  const cardStep = typeof window !== 'undefined'
    ? (window.innerWidth < 768
        ? window.innerWidth * 0.85 + 24
        : Math.min(window.innerWidth * 0.4 + 32, 632))
    : 632;

  return (
    <section className="section-full flex-col" aria-label="Featured Work" style={{ gap: 0 }}>
      <div className="w-full px-6 lg:px-12 mb-8">
        <div className="flex items-end justify-between max-w-7xl mx-auto">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-4"
            >
              Featured Work
            </motion.p>
            <h2 className="font-serif font-bold text-headline text-foreground will-change-transform">
              <TextReveal splitBy="word" staggerDelay={0.07}>
                Project Highlights
              </TextReveal>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={prev}
              disabled={current === 0}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 flex items-center justify-center border border-border text-muted hover:text-accent hover:border-accent/40 transition-all disabled:opacity-25 rounded-lg"
              aria-label="Previous project"
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
            <motion.button
              onClick={next}
              disabled={current === total - 1}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 flex items-center justify-center border border-border text-muted hover:text-accent hover:border-accent/40 transition-all disabled:opacity-25 rounded-lg"
              aria-label="Next project"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>

      <div ref={constraintsRef} className="w-full overflow-hidden pl-6 lg:pl-12">
        <motion.div
          className="flex gap-6 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={constraintsRef}
          animate={{ x: -(current * cardStep) }}
          transition={{ type: 'spring', stiffness: 300, damping: 40 }}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -50 && current < total - 1) next();
            if (offset.x > 50 && current > 0) prev();
          }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} isActive={i === current} />
          ))}
        </motion.div>
      </div>

      <div className="w-full px-6 lg:px-12 mt-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex gap-1 items-center">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={`Go to project ${i + 1}`}
              >
                <span
                  className="block transition-all"
                  style={{
                    width: i === current ? 24 : 6,
                    height: 2,
                    background: i === current
                      ? 'linear-gradient(90deg, #8B5CF6, #4C1D95)'
                      : 'rgba(139,92,246,0.2)',
                    borderRadius: 2,
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }}
                />
              </button>
            ))}
          </div>

          <Link
            href="/projects"
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-muted hover:text-accent transition-colors"
          >
            View All Projects
            <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
