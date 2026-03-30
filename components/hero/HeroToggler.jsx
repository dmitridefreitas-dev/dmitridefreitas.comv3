'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const CrystallineMath = dynamic(() => import('./CrystallineMath'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#000', color: '#333',
      fontFamily: 'monospace', fontSize: '13px', letterSpacing: '0.2em',
    }}>
      LOADING...
    </div>
  ),
});

export default function HeroToggler() {
  return (
    <section style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div style={{ width: '100%', height: '100%' }}>
        <CrystallineMath />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1.2 }}
        style={{
          position: 'absolute',
          bottom: '52px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <motion.span
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(0,212,255,0.65)',
          }}
        >
          scroll
        </motion.span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg
            width="14" height="20" viewBox="0 0 14 20"
            fill="none" stroke="rgba(0,212,255,0.5)"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <line x1="7" y1="1" x2="7" y2="14" />
            <path d="M2 10l5 6 5-6" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Fade into page */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '180px',
        background: 'linear-gradient(to bottom, transparent 0%, #02030A 100%)',
        pointerEvents: 'none',
      }} />
    </section>
  );
}
