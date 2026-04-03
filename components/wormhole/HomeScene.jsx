'use client';
import dynamic from 'next/dynamic';

const CrystallineMath = dynamic(
  () => import('@/components/hero/CrystallineMath'),
  { ssr: false }
);

export default function HomeScene() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <CrystallineMath />
      {/* Name overlay - centered */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 700,
            color: '#F9FAFB',
            letterSpacing: '-0.02em',
            textShadow: '0 0 40px rgba(0,212,255,0.3)',
            marginBottom: '12px',
          }}
        >
          Dmitri De Freitas
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '11px',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(0,212,255,0.7)',
          }}
        >
          Data Science &middot; Financial Engineering &middot; WashU
        </p>
      </div>
      {/* Bottom gradient fade into depth */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to bottom, transparent 0%, #02030A 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
