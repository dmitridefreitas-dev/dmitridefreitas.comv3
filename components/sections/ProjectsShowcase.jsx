'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import TextReveal from '@/components/effects/TextReveal';
import TiltCard from '@/components/effects/TiltCard';
import { heroProjects } from '@/data/projects';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

function ProjectCard({ project, index, isActive }) {
  return (
    <TiltCard
      className={`relative flex-shrink-0 w-[82vw] md:w-[50vw] lg:w-[36vw] h-[40vh] overflow-hidden ${
        isActive ? 'animated-border-card' : ''
      }`}
      style={{
        borderRadius: '8px',
        border: isActive ? undefined : '1px solid rgba(139,92,246,0.1)',
        willChange: 'transform',
      }}
    >
      {/* Crystal dark base */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(160deg, rgba(14,8,28,0.97) 0%, rgba(6,3,14,0.99) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Crystal facet lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        style={{ borderRadius: '8px' }}
      >
        <line x1="0" y1="100" x2="65" y2="0" stroke="rgba(196,181,253,0.07)" strokeWidth="0.4" />
        <line x1="25" y1="100" x2="100" y2="15" stroke="rgba(139,92,246,0.05)" strokeWidth="0.4" />
        <line x1="0" y1="55" x2="100" y2="85" stroke="rgba(139,92,246,0.03)" strokeWidth="0.3" />
        <line x1="70" y1="0" x2="100" y2="40" stroke="rgba(196,181,253,0.04)" strokeWidth="0.3" />
      </svg>

      {/* Top-right crystal refraction */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: '90px',
          height: '90px',
          background: 'linear-gradient(225deg, rgba(196,181,253,0.11) 0%, rgba(139,92,246,0.04) 35%, transparent 60%)',
          borderRadius: '0 8px 0 0',
        }}
        aria-hidden="true"
      />

      {/* Bottom-left secondary refraction */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: '55px',
          height: '55px',
          background: 'linear-gradient(45deg, rgba(139,92,246,0.06) 0%, transparent 55%)',
          borderRadius: '0 0 0 8px',
        }}
        aria-hidden="true"
      />

      {/* Active inset glow */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{ boxShadow: 'inset 0 0 40px rgba(139,92,246,0.08)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          aria-hidden="true"
        />
      )}

      {/* Ghost index */}
      <p
        className="absolute top-5 right-6 font-mono font-bold select-none pointer-events-none z-20"
        style={{
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: isActive ? 'rgba(196,181,253,0.15)' : 'rgba(139,92,246,0.07)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
        }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </p>

      {/* Card content */}
      <motion.div
        className="w-full h-full flex flex-col justify-end p-6 md:p-8 relative z-20"
        animate={{ opacity: 1, scale: isActive ? 1 : 0.97 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <span
            className="font-mono block mb-3"
            style={{
              fontSize: '9px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: isActive ? 'rgba(196,181,253,0.65)' : 'rgba(139,92,246,0.38)',
            }}
          >
            {project.subtitle.split('·')[0].trim()}
          </span>
          <h3
            className="font-serif font-bold text-lg md:text-xl leading-tight mb-2"
            style={{ color: isActive ? '#F9FAFB' : 'rgba(249,250,251,0.68)' }}
          >
            {project.title}
          </h3>
          <p
            className="font-mono text-xs uppercase leading-relaxed"
            style={{
              color: 'rgba(156,163,175,0.48)',
              letterSpacing: '0.09em',
              maxWidth: '280px',
            }}
          >
            {project.subtitle.split('·').slice(1).join('·').trim()}
          </p>
        </div>

        {/* Bottom edge accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: isActive
              ? 'linear-gradient(90deg, rgba(196,181,253,0.5), rgba(139,92,246,0.25), transparent)'
              : 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)',
          }}
        />
        {/* Left edge accent */}
        <div
          className="absolute left-0 top-8 bottom-8 w-px"
          style={{
            background: isActive
              ? 'linear-gradient(180deg, transparent, rgba(196,181,253,0.22), transparent)'
              : 'none',
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
