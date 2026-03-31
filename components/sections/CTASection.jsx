'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { targetRoles } from '@/data/constants';

/* ── Floating particle canvas ────────────────────────────────────── */

function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    function resize() {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }

    function init() {
      resize();
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        color: ['rgba(139,92,246,0.3)', 'rgba(0,212,255,0.25)', 'rgba(0,229,160,0.2)'][Math.floor(Math.random() * 3)],
      }));
    }

    function draw() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

/* ── Stagger variants ────────────────────────────────────────────── */

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

/* ── Component ───────────────────────────────────────────────────── */

export default function CTASection() {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: '#02030A' }}
      aria-label="Available for Opportunities"
    >
      {/* Particle background */}
      <ParticleField />

      {/* Gradient top rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, #8B5CF6, #00D4FF, #00E5A0, transparent)',
        }}
      />

      {/* Subtle radial glow behind content */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Availability badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full"
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

        {/* Heading with gradient */}
        <motion.h2
          variants={itemVariants}
          className="font-serif font-bold mb-5"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.15,
            background: 'linear-gradient(135deg, #8B5CF6 0%, #00D4FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Let&apos;s Build Something
        </motion.h2>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-base leading-relaxed mb-6 max-w-lg"
          style={{ color: 'rgba(229,229,229,0.55)' }}
        >
          Pursuing quantitative research, financial engineering, and data science roles.
          BS Data Science &amp; Financial Engineering at WashU with hands-on experience
          in ML modeling, credit analysis, and algorithmic trading research.
        </motion.p>

        {/* Role tags */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {targetRoles.map((role) => (
            <span
              key={role}
              className="font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-sm"
              style={{
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.18)',
                color: 'rgba(167,139,250,0.7)',
              }}
            >
              {role}
            </span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4"
        >
          {/* Primary: Get in Touch */}
          <Link href="/contact" className="group relative">
            <span
              className="relative z-10 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.15em] px-7 py-3 rounded-sm transition-all duration-300"
              style={{
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.4)',
                color: '#A78BFA',
                boxShadow: '0 0 20px rgba(139,92,246,0.15), inset 0 0 20px rgba(139,92,246,0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.25)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(139,92,246,0.3), inset 0 0 30px rgba(139,92,246,0.1)';
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139,92,246,0.15)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.15), inset 0 0 20px rgba(139,92,246,0.05)';
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
              }}
            >
              <span style={{ color: 'rgba(139,92,246,0.4)' }}>$</span>
              Get in Touch
              <span style={{ color: 'rgba(139,92,246,0.4)' }}>&rarr;</span>
            </span>
          </Link>

          {/* Secondary: View Projects */}
          <Link href="/projects" className="group relative">
            <span
              className="relative z-10 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.15em] px-7 py-3 rounded-sm transition-all duration-300"
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,212,255,0.3)',
                color: 'rgba(0,212,255,0.7)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(0,212,255,0.15)';
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
              }}
            >
              <span style={{ color: 'rgba(0,212,255,0.35)' }}>$</span>
              View Projects
              <span style={{ color: 'rgba(0,212,255,0.35)' }}>&rarr;</span>
            </span>
          </Link>
        </motion.div>

        {/* Bottom terminal-style status */}
        <motion.p
          variants={itemVariants}
          className="font-mono text-[9px] uppercase tracking-[0.3em] mt-12"
          style={{ color: 'rgba(0,212,255,0.18)' }}
        >
          {'/// END TRANSMISSION ///'}
        </motion.p>
      </motion.div>
    </section>
  );
}
