'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TextReveal from '@/components/effects/TextReveal';
import MagneticButton from '@/components/effects/MagneticButton';
import { ArrowDown } from 'lucide-react';

const FINANCE_SHAPES = [
  {
    label: '$',
    className: 'float-geo-slow font-mono select-none pointer-events-none absolute',
    style: { fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', top: '16%', left: '5%', color: 'rgba(139,92,246,0.07)', animationDuration: '11s' },
  },
  {
    label: '%',
    className: 'float-geo font-mono select-none pointer-events-none absolute',
    style: { fontSize: 'clamp(1.25rem, 2.5vw, 2.25rem)', top: '20%', right: '6%', color: 'rgba(139,92,246,0.06)', animationDelay: '1.5s', animationDuration: '9s' },
  },
  {
    label: 'Δ',
    className: 'float-geo-reverse font-mono select-none pointer-events-none absolute',
    style: { fontSize: 'clamp(1.1rem, 2.2vw, 1.9rem)', bottom: '28%', left: '4%', color: 'rgba(76,29,149,0.06)', animationDelay: '0.8s', animationDuration: '12s' },
  },
  {
    label: 'σ',
    className: 'float-geo font-mono select-none pointer-events-none absolute',
    style: { fontSize: 'clamp(1rem, 1.8vw, 1.6rem)', bottom: '22%', right: '5%', color: 'rgba(139,92,246,0.05)', animationDelay: '2s', animationDuration: '8s' },
  },
  {
    label: 'α',
    className: 'float-geo-slow font-mono select-none pointer-events-none absolute',
    style: { fontSize: 'clamp(1.2rem, 2.2vw, 2rem)', top: '52%', right: '9%', color: 'rgba(34,211,238,0.05)', animationDelay: '3s', animationDuration: '13s' },
  },
  {
    label: 'β',
    className: 'float-geo-reverse font-mono select-none pointer-events-none absolute',
    style: { fontSize: 'clamp(0.85rem, 1.4vw, 1.35rem)', top: '62%', left: '8%', color: 'rgba(139,92,246,0.045)', animationDelay: '1.2s', animationDuration: '10s' },
  },
  {
    label: 'Σ',
    className: 'float-geo font-mono select-none pointer-events-none absolute',
    style: { fontSize: 'clamp(0.75rem, 1.2vw, 1.2rem)', top: '35%', left: '3%', color: 'rgba(109,40,217,0.04)', animationDelay: '4s', animationDuration: '14s' },
  },
];

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const geoOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const geoY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  return (
    <section
      ref={ref}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      <div
        className="absolute pointer-events-none animate-aurora-shift"
        style={{
          top: '-25%',
          left: '50%',
          width: '140%',
          height: '80%',
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.08) 0%, rgba(76,29,149,0.04) 40%, rgba(109,40,217,0.02) 65%, transparent 85%)',
          transformOrigin: 'center top',
        }}
        aria-hidden="true"
      />

      <motion.div
        style={{ opacity: geoOpacity, y: geoY }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        {FINANCE_SHAPES.map((shape, i) => (
          <motion.span
            key={i}
            className={shape.className}
            style={shape.style}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 + i * 0.18, duration: 1.2 }}
          >
            {shape.label}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        style={{ scale, opacity, y }}
        className="relative z-10 flex flex-col items-center text-center px-6 gpu"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-xs uppercase tracking-[0.45em] text-accent mb-5"
        >
          Portfolio — Available May 2026
        </motion.p>

        <h1
          className="font-serif font-bold text-display text-foreground text-balance will-change-transform"
          style={{ animation: 'glow-text-pulse 5s ease-in-out infinite' }}
        >
          <TextReveal splitBy="word" delay={0.4} staggerDelay={0.1}>
            Dmitri De Freitas
          </TextReveal>
        </h1>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.95, ease: 'easeOut' }}
          className="w-32 my-6 origin-center"
          style={{
            height: '1px',
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.8) 0%, transparent 70%)',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 }}
          className="font-mono text-xs uppercase tracking-[0.3em] max-w-sm"
          style={{
            background: 'linear-gradient(90deg, #8B5CF6, #22D3EE, #4C1D95, #8B5CF6)',
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradient-shift-subtitle 6s ease infinite',
          }}
        >
          Data Science &amp; Financial Engineering
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.25 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted mt-3"
        >
          Washington University in St. Louis
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.45 }}
          className="mt-7 flex flex-col sm:flex-row items-center gap-4"
        >
          <MagneticButton href="/projects" data-cursor="expand">
            View Projects
          </MagneticButton>
          <MagneticButton href="/contact" variant="ghost" data-cursor="expand">
            Get in Touch
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-2 text-muted hover:text-accent transition-colors"
        aria-label="Scroll down"
        data-cursor="expand"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.div>
        <span className="font-mono text-xs uppercase tracking-[0.3em]">Scroll</span>
      </motion.button>
    </section>
  );
}
