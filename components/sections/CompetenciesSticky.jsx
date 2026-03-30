'use client';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { timeline } from '@/data/constants';

function Stone({ item, index, total }) {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: '-80px' });
  const isEven = index % 2 === 1;
  const baseDelay = 0.15;

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center"
      style={{ minHeight: index < total - 1 ? 120 : 0 }}
    >
      {/* Row container — zigzag layout */}
      <div
        className={`flex items-center w-full max-w-[700px] mx-auto gap-5 md:gap-8 ${
          isEven ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Text side */}
        <motion.div
          className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}
          initial={{ opacity: 0, x: isEven ? 30 : -30 }}
          animate={
            isVisible
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: isEven ? 30 : -30 }
          }
          transition={{
            duration: 0.6,
            delay: baseDelay + 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <h3 className="font-serif font-bold text-foreground text-sm md:text-base leading-snug mb-1.5">
            {item.title}
          </h3>
          <span
            className={`inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
              item.type === 'education'
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                : 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
            }`}
          >
            {item.type}
          </span>
        </motion.div>

        {/* Stone circle */}
        <motion.div
          className="relative flex-shrink-0 w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center z-10"
          style={{
            border: '2px solid rgba(139,92,246,0.7)',
            background: 'rgba(139,92,246,0.15)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isVisible
              ? { scale: [0, 1.3, 1], opacity: [0, 1, 1] }
              : { scale: 0, opacity: 0 }
          }
          transition={{
            duration: 0.55,
            delay: baseDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Landing glow */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ boxShadow: '0 0 0px rgba(139,92,246,0)' }}
            animate={
              isVisible
                ? {
                    boxShadow: [
                      '0 0 0px rgba(139,92,246,0)',
                      '0 0 24px rgba(139,92,246,0.6)',
                      '0 0 8px rgba(139,92,246,0.2)',
                    ],
                  }
                : { boxShadow: '0 0 0px rgba(139,92,246,0)' }
            }
            transition={{
              duration: 1,
              delay: baseDelay + 0.1,
              ease: 'easeOut',
            }}
          />
          <span className="font-mono font-bold text-accent text-[9px] md:text-xs leading-none text-center whitespace-nowrap select-none">
            {item.year}
          </span>
        </motion.div>

        {/* Spacer to balance the other side */}
        <div className="flex-1" />
      </div>
    </div>
  );
}

export default function CompetenciesSticky() {
  const sectionRef = useRef(null);
  const trailRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'end 0.6'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  const trailHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  // Gradient position for the "flowing" effect
  const gradientY = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 lg:px-12 overflow-hidden"
      style={{ background: '#000000' }}
      aria-label="Career Path"
    >
      {/* Section heading */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-mono text-xs uppercase tracking-[0.4em] text-muted text-center mb-16 md:mb-20"
      >
        Career Path
      </motion.p>

      {/* Timeline container */}
      <div className="relative max-w-[700px] mx-auto">
        {/* Vertical trail line — positioned at center */}
        <div
          ref={trailRef}
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {/* Background track */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(139,92,246,0.08)' }}
          />
          {/* Animated fill */}
          <motion.div
            className="absolute top-0 left-0 w-full origin-top"
            style={{
              height: trailHeight,
              background:
                'linear-gradient(to bottom, rgba(139,92,246,0.1), rgba(139,92,246,0.4) 50%, rgba(139,92,246,0.6))',
            }}
          />
          {/* Flowing glow dot */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-8 rounded-full pointer-events-none"
            style={{
              top: trailHeight,
              background:
                'radial-gradient(ellipse at center, rgba(139,92,246,0.8), transparent)',
              filter: 'blur(2px)',
              marginTop: '-16px',
            }}
          />
        </div>

        {/* Stones */}
        <div className="relative flex flex-col gap-[120px] md:gap-[120px]">
          {timeline.map((item, i) => (
            <Stone key={i} item={item} index={i} total={timeline.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
