'use client';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const ATMOSPHERE_MAP = {
  hero: {
    '--atm-primary':   'rgba(139,92,246,0.08)',
    '--atm-secondary': 'rgba(76,29,149,0.05)',
    '--atm-intensity': '1',
  },
  work: {
    '--atm-primary':   'rgba(139,92,246,0.06)',
    '--atm-secondary': 'rgba(34,211,238,0.04)',
    '--atm-intensity': '0.85',
  },
  skills: {
    '--atm-primary':   'rgba(76,29,149,0.06)',
    '--atm-secondary': 'rgba(139,92,246,0.04)',
    '--atm-intensity': '0.75',
  },
  timeline: {
    '--atm-primary':   'rgba(109,40,217,0.06)',
    '--atm-secondary': 'rgba(139,92,246,0.04)',
    '--atm-intensity': '0.8',
  },
  cta: {
    '--atm-primary':   'rgba(139,92,246,0.09)',
    '--atm-secondary': 'rgba(76,29,149,0.06)',
    '--atm-intensity': '1',
  },
};

export default function SectionAtmosphere({ children, atmosphere = 'hero', className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-30% 0px -30% 0px' });

  useEffect(() => {
    if (!isInView || typeof document === 'undefined') return;

    const vars = ATMOSPHERE_MAP[atmosphere] || ATMOSPHERE_MAP.hero;
    const root = document.documentElement;

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [isInView, atmosphere]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
