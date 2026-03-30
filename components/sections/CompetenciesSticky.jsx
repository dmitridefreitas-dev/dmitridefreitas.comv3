'use client';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { timeline } from '@/data/constants';

const stonePositions = [
  { left: '15%', top: '2%' },
  { left: '38%', top: '18%' },
  { left: '58%', top: '35%' },
  { left: '28%', top: '54%' },
  { left: '48%', top: '72%' },
];

const stoneBorderRadii = [
  '45% 55% 60% 40% / 50% 45% 55% 50%',
  '55% 45% 40% 60% / 45% 55% 45% 55%',
  '40% 60% 55% 45% / 60% 40% 50% 50%',
  '50% 50% 45% 55% / 40% 60% 55% 45%',
  '60% 40% 50% 50% / 55% 45% 40% 60%',
];

const stoneSizes = [
  { width: 68, height: 58 },
  { width: 74, height: 64 },
  { width: 62, height: 56 },
  { width: 78, height: 66 },
  { width: 66, height: 60 },
];

const stoneThresholds = [0.0, 0.2, 0.4, 0.6, 0.8];

// Label positions: alternate above/below based on index
const labelOffsets = [
  { top: -54, left: '50%', transform: 'translateX(-50%)', align: 'center' }, // above
  { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8, align: 'center' }, // below
  { top: -54, left: '50%', transform: 'translateX(-50%)', align: 'center' }, // above
  { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8, align: 'center' }, // below
  { top: -54, left: '50%', transform: 'translateX(-50%)', align: 'center' }, // above
];

// Compute SVG path centers based on percentages of container
// Container is ~600px tall, width is 100% of parent
// We use viewBox coordinates: 800 x 600
function getStoneCenters() {
  return stonePositions.map((pos, i) => ({
    x: (parseFloat(pos.left) / 100) * 800 + stoneSizes[i].width / 2,
    y: (parseFloat(pos.top) / 100) * 600 + stoneSizes[i].height / 2,
  }));
}

function buildPath(centers) {
  if (centers.length < 2) return '';
  let d = `M ${centers[0].x} ${centers[0].y}`;
  for (let i = 1; i < centers.length; i++) {
    const prev = centers[i - 1];
    const curr = centers[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.5;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (curr.x - prev.x) * 0.5;
    const cpy2 = curr.y;
    d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function StoneElement({ item, index, visible }) {
  const size = stoneSizes[index];
  const isEven = index % 2 === 0;
  const labelOffset = labelOffsets[index];
  const altTint = index % 2 === 0
    ? 'rgba(139,92,246,0.12)'
    : 'rgba(99,102,241,0.12)';

  return (
    <div
      style={{
        position: 'absolute',
        left: stonePositions[index].left,
        top: stonePositions[index].top,
        width: size.width,
        height: size.height,
      }}
    >
      {/* The stone */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.3, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 15,
              duration: 0.6,
            }}
            style={{
              width: size.width,
              height: size.height,
              borderRadius: stoneBorderRadii[index],
              background: altTint,
              backgroundImage:
                'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.04) 0%, transparent 50%)',
              border: '1.5px solid rgba(139,92,246,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'default',
            }}
          >
            {/* Glow burst */}
            <motion.div
              initial={{ boxShadow: '0 0 0px rgba(139,92,246,0)' }}
              animate={{
                boxShadow: [
                  '0 0 0px rgba(139,92,246,0)',
                  '0 0 30px rgba(139,92,246,0.8)',
                  '0 0 10px rgba(139,92,246,0.25)',
                ],
              }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: stoneBorderRadii[index],
                pointerEvents: 'none',
              }}
            />
            {/* Year text */}
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 700,
                color: 'rgb(139,92,246)',
                fontSize: '10px',
                lineHeight: 1,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {item.year}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating label */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: isEven ? -8 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            style={{
              position: 'absolute',
              top: labelOffset.top,
              left: labelOffset.left,
              transform: labelOffset.transform,
              marginTop: labelOffset.marginTop || 0,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-serif, serif)',
                fontWeight: 700,
                color: 'var(--foreground, #e5e5e5)',
                fontSize: '12px',
                lineHeight: 1.3,
                marginBottom: '4px',
              }}
            >
              {item.title.length > 40 ? item.title.slice(0, 38) + '...' : item.title}
            </p>
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '2px 8px',
                borderRadius: '9999px',
                background:
                  item.type === 'education'
                    ? 'rgba(99,102,241,0.15)'
                    : 'rgba(139,92,246,0.15)',
                color:
                  item.type === 'education'
                    ? 'rgb(129,140,248)'
                    : 'rgb(167,139,250)',
                border:
                  item.type === 'education'
                    ? '1px solid rgba(99,102,241,0.3)'
                    : '1px solid rgba(139,92,246,0.3)',
              }}
            >
              {item.type}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CompetenciesSticky() {
  const sectionRef = useRef(null);
  const [visibleStones, setVisibleStones] = useState(
    () => new Array(timeline.length).fill(false)
  );
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef(null);

  const centers = getStoneCenters();
  const pathD = buildPath(centers);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'end 0.2'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 35,
    damping: 20,
    restDelta: 0.001,
  });

  // Measure path length after mount
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  const strokeDashoffset = useTransform(smoothProgress, [0, 1], [pathLength, 0]);

  // Imperatively trigger stone visibility based on scroll progress
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    setVisibleStones((prev) => {
      let changed = false;
      const next = [...prev];
      for (let i = 0; i < stoneThresholds.length; i++) {
        if (!next[i] && latest >= stoneThresholds[i]) {
          next[i] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 lg:px-12 overflow-hidden"
      style={{ background: '#000000', minHeight: '700px' }}
      aria-label="Career Path"
    >
      {/* Section heading */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-mono text-xs uppercase tracking-[0.4em] text-muted text-center mb-16"
      >
        Career Path
      </motion.p>

      {/* Path container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          height: '600px',
          margin: '0 auto',
        }}
      >
        {/* SVG path connecting stones */}
        <svg
          viewBox="0 0 800 600"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background faint path */}
          <path
            d={pathD}
            stroke="rgba(139,92,246,0.08)"
            strokeWidth={2}
            fill="none"
          />
          {/* Animated drawn path */}
          <motion.path
            ref={pathRef}
            d={pathD}
            stroke="rgba(139,92,246,0.35)"
            strokeWidth={2}
            strokeDasharray={`${pathLength}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Stones */}
        {timeline.slice(0, 5).map((item, i) => (
          <StoneElement
            key={i}
            item={item}
            index={i}
            visible={visibleStones[i]}
          />
        ))}
      </div>
    </section>
  );
}
