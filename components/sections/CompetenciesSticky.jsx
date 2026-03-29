'use client';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { competencies } from '@/data/constants';

function CompCard({ comp, index }) {
  const Icon = comp.icon;
  const num  = String(index + 1).padStart(2, '0');
  const cardRef = useRef(null);

  // Mouse tracking for spotlight
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const spotlightX = useTransform(springX, [0, 1], ['0%', '100%']);
  const spotlightY = useTransform(springY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top)  / rect.height);
  };
  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden"
    >
      {/* Sweep-in top border */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px origin-left z-20"
        style={{ background: 'linear-gradient(90deg, #8B5CF6, #C4B5FD, transparent)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: index * 0.15 + 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Travelling light dot along top border */}
      <motion.div
        className="absolute top-0 w-6 h-px z-20 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #C4B5FD, transparent)' }}
        animate={{ left: ['-10%', '110%'] }}
        transition={{
          duration: 3.2 + index * 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 1.1 + 1.5,
          repeatDelay: 2.5,
        }}
      />

      <div className="relative border border-[#160e24] bg-[#080810]/60 p-8 rounded-xl overflow-hidden transition-colors duration-500 group-hover:border-accent/25">

        {/* Mouse-tracked spotlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([x, y]) =>
                `radial-gradient(260px circle at ${x} ${y}, rgba(139,92,246,0.1) 0%, transparent 70%)`
            ),
          }}
          aria-hidden="true"
        />

        {/* Idle ambient pulse */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 70%)' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3.5 + index * 0.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
          aria-hidden="true"
        />

        {/* Scan line sweeping down */}
        <motion.div
          className="absolute left-0 right-0 h-8 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(139,92,246,0.04), transparent)' }}
          animate={{ top: ['-10%', '110%'] }}
          transition={{
            duration: 4 + index * 0.7,
            repeat: Infinity,
            ease: 'linear',
            delay: index * 1.4,
          }}
          aria-hidden="true"
        />

        {/* Ghost index number — strobe */}
        <motion.p
          className="absolute top-3 right-5 font-mono font-bold select-none pointer-events-none leading-none"
          style={{ fontSize: '4.5rem', color: 'rgba(139,92,246,1)', letterSpacing: '-0.05em' }}
          animate={{ opacity: [0.025, 0.055, 0.025, 0.04, 0.025] }}
          transition={{ duration: 4 + index * 1.3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.9 }}
          aria-hidden="true"
        >
          {num}
        </motion.p>

        {/* Icon with pulsing glow ring */}
        <div className="flex items-center gap-2 mb-7 relative">
          <motion.span
            className="font-mono text-xl leading-none select-none"
            style={{ color: 'rgba(139,92,246,0.3)' }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
          >[</motion.span>

          <div className="relative flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: index * 0.6 }}
              aria-hidden="true"
            />
            <Icon className="w-5 h-5 text-accent relative z-10" strokeWidth={1.5} />
          </div>

          <motion.span
            className="font-mono text-xl leading-none select-none"
            style={{ color: 'rgba(139,92,246,0.3)' }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 + 0.3 }}
          >]</motion.span>
        </div>

        <h3 className="font-serif font-bold text-lg text-foreground mb-3 leading-tight">
          {comp.title}
        </h3>

        <p className="text-sm text-muted leading-relaxed">
          {comp.description}
        </p>

        {/* Bottom accent — animates width on hover */}
        <motion.div
          className="mt-7 h-px"
          style={{ background: 'linear-gradient(90deg, #8B5CF6, transparent)' }}
          initial={{ width: 0 }}
          whileHover={{ width: 48 }}
          animate={{ width: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

export default function CompetenciesSticky() {
  return (
    <section className="section-full flex-col px-6 lg:px-12" aria-label="Core Competencies">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-mono text-xs uppercase tracking-[0.4em] text-muted text-center mb-12"
      >
        Core Competencies
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
        {competencies.map((comp, i) => (
          <CompCard key={comp.title} comp={comp} index={i} />
        ))}
      </div>
    </section>
  );
}
