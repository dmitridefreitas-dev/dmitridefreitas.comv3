'use client';

import dynamic from 'next/dynamic';

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

      {/* Fade into page */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '180px',
        background: 'linear-gradient(to bottom, transparent 0%, #000000 100%)',
        pointerEvents: 'none',
      }} />
    </section>
  );
}
