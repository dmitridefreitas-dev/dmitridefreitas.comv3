'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useState, useEffect, useContext, useRef } from 'react';
import { NavigateContext, ActiveSceneContext } from '@/components/layout/WormholeContext';

const CrystallineMath = dynamic(() => import('./CrystallineMath'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black flex items-center justify-center font-mono text-[10px] tracking-widest text-[#333]">LOADING...</div>,
});

export default function HeroToggler() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigateTo = useContext(NavigateContext);
  const isActive   = useContext(ActiveSceneContext);

  useEffect(() => {
    const checkMob = () => setIsMobile(window.innerWidth < 768);
    checkMob();
    window.addEventListener('resize', checkMob);

    // Track user interaction to cancel auto-scroll
    const onInteract = () => setHasInteracted(true);
    window.addEventListener('touchstart', onInteract, { passive: true });
    window.addEventListener('wheel', onInteract, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMob);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('wheel', onInteract);
    };
  }, []);

  // 3-flash auto-navigation for the premium brand intro (Unified 1:1)
  useEffect(() => {
    if (isActive && !hasInteracted && navigateTo) {
      const timer = setTimeout(() => {
        navigateTo(1);
      }, 3800); 
      return () => clearTimeout(timer);
    }
  }, [isActive, hasInteracted, navigateTo]);

  return (
    <section style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div className="absolute inset-0 z-0">
        <CrystallineMath active={isActive} />
        
        {/* Unified 1:1 flashing brand intro */}
        {isActive && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1, 0, 1, 0] }}
              transition={{ 
                duration: 3.7, 
                times: [0, 0.15, 0.35, 0.5, 0.7, 0.85, 1],
                ease: [0.22, 1, 0.36, 1]
              }}
              style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
              className="flex flex-col items-center"
            >
              <h1 
                style={{ 
                  fontFamily: 'var(--font-space-grotesk)',
                  textShadow: '0 0 50px rgba(173,139,255,0.4)',
                  letterSpacing: '0.4em'
                }}
                className="text-white text-[32px] md:text-[48px] font-bold text-center leading-tight mb-4"
              >
                DMITRI DE FREITAS
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0, 0.7, 0, 0.7, 0] }}
                transition={{ duration: 3.7, delay: 0.1 }}
                className="font-mono text-[9px] md:text-[11px] uppercase tracking-[0.5em] text-[#AD8BFF]"
              >
                Quantitative Researcher
              </motion.p>
            </motion.div>
          </div>
        )}
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
          willChange: 'transform, opacity',
          transform: 'translateX(-50%) translateZ(0)'
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
