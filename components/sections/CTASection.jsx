'use client';
import { motion } from 'framer-motion';
import TextReveal from '@/components/effects/TextReveal';
import MagneticButton from '@/components/effects/MagneticButton';
import { targetRoles } from '@/data/constants';
import { ArrowUpRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section
      className="section-full flex-col text-center px-6 overflow-hidden"
      aria-label="Available for Opportunities"
    >
      <p
        className="absolute font-mono font-bold select-none pointer-events-none"
        style={{
          fontSize: 'clamp(2rem, 6vw, 5.5rem)',
          color: 'rgba(139,92,246,0.04)',
          letterSpacing: '-0.05em',
          lineHeight: 1,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          whiteSpace: 'nowrap',
        }}
        aria-hidden="true"
      >
        PV = FV / (1+r)^n
      </p>

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xs uppercase tracking-[0.4em] text-accent mb-5"
        >
          Available — May 2026
        </motion.p>

        <h2 className="font-serif font-bold text-headline text-foreground text-center w-full will-change-transform mb-6">
          <TextReveal splitBy="word" staggerDelay={0.08} center>
            Open to Opportunities
          </TextReveal>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-body-fluid text-muted max-w-lg mx-auto leading-relaxed mb-7"
        >
          Pursuing quantitative research, financial engineering, and data science roles.
          BS Data Science &amp; Financial Engineering at WashU (May 2026) with hands-on experience in ML modeling, credit analysis, and algorithmic trading research.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8"
        >
          {targetRoles.map((role, i) => (
            <span
              key={role}
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted"
            >
              {i > 0 && <span className="mr-6 text-accent/50">·</span>}
              {role}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <MagneticButton href="/contact" size="lg" data-cursor="expand">
            Get in Touch
            <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
