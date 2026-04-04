'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useState, useEffect, useContext, useRef } from 'react';
import { NavigateContext, ActiveSceneContext } from '@/components/layout/ZWormhole';

const CrystallineMath = dynamic(() => import('./CrystallineMath'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black flex items-center justify-center font-mono text-[10px] tracking-widest text-[#333]">LOADING...</div>,
});

export default function HeroToggler() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigateTo = useContext(NavigateContext);
  const isActive   = useContext(ActiveSceneContext);
  const videoRef   = useRef(null);

  useEffect(() => {
    const checkMob = () => setIsMobile(window.innerWidth < 768);
    checkMob();
    window.addEventListener('resize', checkMob);

    // Track user interaction to cancel auto-scroll
    const onInteract = () => setHasInteracted(true);
    window.addEventListener('touchstart', onInteract, { passive: true });
    window.addEventListener('wheel', onInteract, { passive: true });

    // Explicitly play video to bypass some mobile restrictions
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log("Autoplay blocked:", err));
    }

    return () => {
      window.removeEventListener('resize', checkMob);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('wheel', onInteract);
    };
  }, [isMobile]); // Re-run when switching to mobile to grab ref

  const handleVideoEnd = () => {
    // Only auto-scroll if still on home and user hasn't manually moved
    if (isMobile && isActive && !hasInteracted && navigateTo) {
      navigateTo(1);
    }
  };
  return (
    <section style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div className="absolute inset-0 z-0">
        {!isMobile ? (
          <CrystallineMath />
        ) : (
          <div className="relative w-full h-full bg-[#000000] overflow-hidden flex items-center justify-center">
            {/* Subtle mask to blend edge bars into the page deeper background */}
            <div className="absolute inset-0 z-10 pointer-events-none" 
              style={{ background: 'radial-gradient(circle, transparent 40%, rgba(2,3,10,0.4) 100%)' }} 
            />
            <video
              ref={videoRef}
              src="/intro.mp4"
              autoPlay
              muted
              playsInline
              loop={false}
              onEnded={handleVideoEnd}
              className="relative w-[112%] h-auto max-w-none opacity-90 shadow-[0_0_80px_rgba(0,0,0,1)]"
              style={{ 
                filter: 'contrast(1.04) brightness(0.98)',
              }}
            />
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
