'use client';
import { useEffect, useRef } from 'react';

function DataFeedLines() {
  const svgRef = useRef(null);
  const animRef = useRef(null);
  let t = 0;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const line1 = svg.querySelector('#feed-line-1');
    const line2 = svg.querySelector('#feed-line-2');
    const line3 = svg.querySelector('#feed-line-3');

    const buildLine = (yBase, amplitude, freq, offset) => {
      const pts = [];
      for (let x = 0; x <= W + 20; x += 6) {
        const y = H * yBase + Math.sin((x / W) * 2 * Math.PI * freq + offset) * (H * amplitude);
        pts.push(`${x},${y}`);
      }
      return 'M ' + pts.join(' L ');
    };

    const animate = () => {
      t += 0.002;
      if (line1) line1.setAttribute('d', buildLine(0.35, 0.04, 2, t));
      if (line2) line2.setAttribute('d', buildLine(0.65, 0.03, 1.5, t * 0.8));
      if (line3) line3.setAttribute('d', buildLine(0.5, 0.025, 2.5, t * 0.6));
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        id="feed-line-1"
        stroke="rgba(59,130,246,0.04)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        id="feed-line-2"
        stroke="rgba(30,58,138,0.03)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="6 4"
      />
      <path
        id="feed-line-3"
        stroke="rgba(59,130,246,0.025)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function GridBackground() {
  return (
    <>
      <div className="dot-grid-layer" aria-hidden="true" />
      <div className="dot-grid-layer-fine" aria-hidden="true" />
      <div className="paper-wash" aria-hidden="true" />
      <DataFeedLines />
    </>
  );
}
