'use client';
import { useEffect, useRef } from 'react';

const BLOBS = [
  ['18%', '12%',  '50vw', '50vw', 'rgba(139,92,246,0.07)',  28, 0.6, 0],
  ['68%', '8%',   '42vw', '42vw', 'rgba(76,29,149,0.06)',   36, 0.5, 1],
  ['5%',  '52%',  '38vw', '38vw', 'rgba(6,182,212,0.05)',   22, 0.5, 2],
  ['72%', '55%',  '46vw', '46vw', 'rgba(139,92,246,0.05)',  42, 0.4, 3],
  ['40%', '80%',  '32vw', '32vw', 'rgba(34,211,238,0.04)',  18, 0.4, 4],
];

const MOUSE_LERP = 0.03;

export default function AtmosphericBlobs() {
  const containerRef = useRef(null);
  const stateRef = useRef({
    mouseX: 0.5,
    mouseY: 0.5,
    blobOffsets: BLOBS.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 })),
    rafId: null,
    reduced: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const s = stateRef.current;
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const container = containerRef.current;
    if (!container) return;

    const blobEls = Array.from(container.querySelectorAll('.atm-blob'));
    const maxShift = window.innerWidth * 0.03;

    const onMove = (e) => {
      if (s.reduced) return;
      s.mouseX = e.clientX / window.innerWidth;
      s.mouseY = e.clientY / window.innerHeight;
    };

    const loop = () => {
      if (!s.reduced) {
        blobEls.forEach((el, i) => {
          const off = s.blobOffsets[i];
          const blobCx = parseFloat(BLOBS[i][0]) / 100;
          const blobCy = parseFloat(BLOBS[i][1]) / 100;

          const dx = (s.mouseX - blobCx) * maxShift;
          const dy = (s.mouseY - blobCy) * maxShift;

          off.tx = dx;
          off.ty = dy;
          off.x += (off.tx - off.x) * MOUSE_LERP;
          off.y += (off.ty - off.y) * MOUSE_LERP;

          el.style.transform = `translate(${off.x}px, ${off.y}px)`;
        });
      }
      s.rafId = requestAnimationFrame(loop);
    };

    s.rafId = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(s.rafId);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        contain: 'layout style paint',
      }}
    >
      {BLOBS.map(([x, y, w, h, color, dur, opacity, phase], i) => (
        <div
          key={i}
          className={`atm-blob atm-blob-${phase}`}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: w,
            height: h,
            background: color,
            borderRadius: '50%',
            filter: 'blur(70px)',
            opacity,
            willChange: 'transform',
            animationDuration: `${dur}s`,
          }}
        />
      ))}
    </div>
  );
}
