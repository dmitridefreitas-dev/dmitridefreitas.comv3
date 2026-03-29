'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const METERS = [
  { label: 'Markets Analyzed', baseVal: 74, unit: '%', color: '#8B5CF6' },
  { label: 'Models Built', baseVal: 88, unit: '%', color: '#4C1D95' },
];

function YieldCurve() {
  const width = 120;
  const height = 24;
  const points = [
    `0,${height - 2}`,
    `${width * 0.15},${height * 0.55}`,
    `${width * 0.35},${height * 0.3}`,
    `${width * 0.55},${height * 0.22}`,
    `${width * 0.75},${height * 0.25}`,
    `${width * 0.9},${height * 0.35}`,
    `${width},${height * 0.4}`,
  ].join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className="overflow-visible"
      aria-hidden="true"
    >
      <motion.polyline
        points={points}
        stroke="rgba(139,92,246,0.55)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop', repeatDelay: 1 }}
      />
    </svg>
  );
}

export default function FooterMeters() {
  const [values, setValues] = useState(METERS.map((m) => m.baseVal));

  useEffect(() => {
    const id = setInterval(() => {
      setValues(METERS.map((m) => {
        const delta = Math.random() * 8 - 4;
        return Math.max(20, Math.min(98, m.baseVal + delta));
      }));
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-8">
      {METERS.map((meter, i) => (
        <div key={meter.label} className="flex flex-col gap-1.5 min-w-[120px]">
          <div className="flex justify-between items-baseline">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {meter.label}
            </span>
            <span className="font-mono text-xs text-muted">
              {Math.round(values[i])} {meter.unit}
            </span>
          </div>
          <div className="h-[2px] bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: meter.color, opacity: 0.5 }}
              animate={{ width: `${values[i]}%` }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3 ml-auto">
        <YieldCurve />
        <span className="font-mono text-xs tracking-[0.2em] text-muted" style={{ fontStyle: 'italic' }}>
          SOFR 30d
        </span>
      </div>
    </div>
  );
}
