'use client';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { NavigateContext } from '@/components/layout/WormholeContext';

/* ── Stagger variants ───────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/* ── Component ──────────────────────────────────────────────────── */

export default function CTASection() {
  const navigateTo = useContext(NavigateContext);
  // Scene indices: 4 = Projects, 5 = Contact
  return (
    <section
      className="relative py-32 md:py-40 px-6 overflow-hidden"
      style={{ background: '#02030A' }}
      aria-label="Available for Opportunities"
    >
      {/* ── Gradient top rule ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 5%, #8B5CF6 30%, #00D4FF 50%, #00E5A0 70%, transparent 95%)',
          boxShadow:
            '0 0 12px rgba(139,92,246,0.3), 0 0 24px rgba(0,212,255,0.15)',
        }}
      />

      {/* ── Aurora radial glow ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '600px',
          background:
            'radial-gradient(ellipse at center, rgba(139,92,246,0.06) 0%, rgba(0,212,255,0.04) 40%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '60%',
          left: '40%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background:
            'radial-gradient(ellipse at center, rgba(0,229,160,0.03) 0%, transparent 70%)',
        }}
      />

      {/* ── Faint dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(rgba(139,92,246,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* ── Slow scan lines ── */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: 'rgba(0,212,255,0.03)' }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: 'rgba(139,92,246,0.025)' }}
        animate={{ top: ['100%', '0%', '100%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Availability badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2.5 px-5 py-2 mb-4 rounded-full"
          style={{
            background: 'rgba(0,229,160,0.06)',
            border: '1px solid rgba(0,229,160,0.2)',
          }}
        >
          <motion.span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background: '#00E5A0',
              boxShadow: '0 0 8px rgba(0,229,160,0.6)',
            }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span
            className="font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ color: '#34D399' }}
          >
            Available May 2026
          </span>
        </motion.div>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="font-mono text-[10px] uppercase tracking-[0.3em] mb-10"
          style={{ color: 'rgba(0,212,255,0.35)' }}
        >
          Open to Opportunities
        </motion.p>

        {/* Main heading */}
        <motion.h2
          variants={itemVariants}
          className="font-serif font-bold mb-8"
          style={{
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(139,92,246,0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Let&apos;s Build
          <br />
          Something
        </motion.h2>

        {/* Body text */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg leading-relaxed mb-12 max-w-xl"
          style={{ color: 'rgba(229,229,229,0.5)', lineHeight: 1.75 }}
        >
          Pursuing quantitative research, financial engineering, and data science
          roles. BS Data Science &amp; Financial Engineering at WashU with
          hands-on experience in ML modeling, credit analysis, and algorithmic
          trading research.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
  variants={itemVariants}
  className="flex flex-wrap justify-center gap-5"
>
  {/* Primary: Get in Touch — navigates to Contact scene (5) */}
  <button onClick={() => navigateTo(5)} className="group relative" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <span
              className="relative z-10 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.15em] px-8 py-3.5 transition-all duration-300"
              style={{
                background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.45)',
                color: '#A78BFA',
                boxShadow: '0 0 20px rgba(139,92,246,0.12), inset 0 0 20px rgba(139,92,246,0.04)',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.22)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(139,92,246,0.25), inset 0 0 30px rgba(139,92,246,0.08)';
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.12)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.12), inset 0 0 20px rgba(139,92,246,0.04)';
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)';
              }}
            >
              Get in Touch
              <span style={{ color: 'rgba(139,92,246,0.5)' }}>&rarr;</span>
            </span>
          </button>

  {/* Secondary: View Projects — navigates to Projects scene (4) */}
  <button onClick={() => navigateTo(4)} className="group relative" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <span
              className="relative z-10 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.15em] px-8 py-3.5 transition-all duration-300"
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,212,255,0.25)',
                color: 'rgba(0,212,255,0.6)',
                display: 'inline-flex', alignItems: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,212,255,0.06)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.12)';
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)';
                e.currentTarget.style.color = 'rgba(0,212,255,0.85)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)';
                e.currentTarget.style.color = 'rgba(0,212,255,0.6)';
              }}
            >
              View Projects
            </span>
          </button>
        </motion.div>

        {/* Terminal footer */}
        <motion.p
          variants={itemVariants}
          className="font-mono text-[9px] uppercase tracking-[0.3em] mt-20"
          style={{ color: 'rgba(0,212,255,0.15)' }}
        >
          {'/// END TRANSMISSION ///'}
        </motion.p>
      </motion.div>
    </section>
  );
}
