import Spline from '@splinetool/react-spline/next';

export default function SplineHero() {
  return (
    <section style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Spline
        scene="https://prod.spline.design/hfx-W8UXlB9ZgdVJ/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Seamless fade into page background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to bottom, transparent 0%, #000000 100%)',
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
