'use client';
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValue,
  animate
} from 'framer-motion';
import { useRef, useState, useEffect, useContext } from 'react';
import { NavigateContext, ActiveSceneContext } from '@/components/layout/WormholeContext';

/* ── Data ─────────────────────────────────────────────────────────── */

const EDUCATION = [
  { year: '2024 – 2026', title: 'BS Data Science & Financial Engineering — WashU', type: 'education' },
  { year: '2021 – 2023', title: 'BA Mathematics — Drew University', type: 'education' },
  { year: '2015 – 2021', title: 'A-Levels — Harrison College, Cambridge', type: 'education' },
];

const CAREER = [
  { year: '2024', title: 'Data Scientist Intern', org: 'Amphora Investment Management', type: 'finance' },
  { year: '2023', title: 'Startup Founder', org: 'MobileHub Barbados', type: 'finance' },
  { year: '2024 – Present', title: 'Front Desk Associate', org: 'WashU Recreation Center', type: 'finance' },
  { year: '2022 – 2023', title: 'Personal Care Assistant', type: 'finance' },
  { year: '2024 – Present', title: 'PEAD Market Efficiency Research', org: 'WashU', type: 'research' },
  { year: '2023 – Present', title: 'Quantitative & Algorithmic Trading Research', type: 'research' },
  { year: '2018 – 2020', title: 'Duke of Edinburgh Award', type: 'activity' },
  { year: '2018 – 2021', title: 'Science Club', org: 'Harrison College', type: 'activity' },
];

/* ── Stone positions (viewBox 1000x820) ───────────────────────────── */

const VIEWBOX_H = 820;

const EDU_POSITIONS = [
  { cx: 220, cy: 60 },
  { cx: 330, cy: 252 },
  { cx: 220, cy: 460 },
];

const CAREER_POSITIONS = [
  { cx: 680, cy: 45 },
  { cx: 840, cy: 134 },
  { cx: 625, cy: 238 },
  { cx: 800, cy: 340 },
  { cx: 640, cy: 445 },
  { cx: 855, cy: 535 },
  { cx: 655, cy: 638 },
  { cx: 820, cy: 726 },
];

/* ── Irregular stone polygon shapes (offsets from center) ─────────── */

const EDU_SHAPES = [
  '-28,-18 -12,-32 15,-28 30,-8 22,20 -5,28 -25,12',
  '-30,-14 -10,-30 18,-26 32,-4 26,18 2,32 -22,16 -32,2',
  '-26,-20 -8,-34 20,-24 28,-6 24,22 -2,30 -28,14',
];

const CAREER_SHAPES = [
  '-32,-12 -14,-30 16,-28 34,-6 28,16 4,32 -24,18 -30,4',
  '-26,-22 -6,-35 22,-20 30,-2 20,24 -8,30 -28,10',
  '-30,-16 -12,-32 14,-30 32,-10 26,14 6,28 -20,22 -28,4',
  '-28,-20 -4,-34 20,-26 34,-8 24,18 0,32 -26,12',
  '-34,-10 -16,-28 12,-32 30,-14 28,12 8,30 -18,24 -32,6',
  '-26,-24 -2,-32 24,-22 32,-4 22,20 -4,34 -24,16',
  '-30,-18 -8,-34 18,-28 34,-6 26,16 2,30 -22,18 -28,2',
  '-28,-16 -10,-30 16,-26 30,-10 24,14 4,28 -20,20 -26,6',
];

/* ── Type colors ──────────────────────────────────────────────────── */

const TYPE_COLORS = {
  education: { fill: 'rgba(0,212,255,0.12)', stroke: 'rgba(0,212,255,0.5)', glow: 'rgba(0,212,255,0.4)', badge_bg: 'rgba(0,212,255,0.1)', badge_text: 'rgb(103,232,249)', badge_border: 'rgba(0,212,255,0.25)' },
  finance:   { fill: 'rgba(139,92,246,0.15)', stroke: 'rgba(139,92,246,0.55)', glow: 'rgba(139,92,246,0.45)', badge_bg: 'rgba(139,92,246,0.12)', badge_text: 'rgb(167,139,250)', badge_border: 'rgba(139,92,246,0.28)' },
  research:  { fill: 'rgba(0,229,160,0.1)', stroke: 'rgba(0,229,160,0.45)', glow: 'rgba(0,229,160,0.35)', badge_bg: 'rgba(0,229,160,0.08)', badge_text: 'rgb(52,211,153)', badge_border: 'rgba(0,229,160,0.22)' },
  activity:  { fill: 'rgba(139,92,246,0.12)', stroke: 'rgba(139,92,246,0.4)', glow: 'rgba(139,92,246,0.3)', badge_bg: 'rgba(139,92,246,0.1)', badge_text: 'rgb(167,139,250)', badge_border: 'rgba(139,92,246,0.22)' },
};

/* ── Stone thresholds ─────────────────────────────────────────────── */

const EDU_THRESHOLDS = [0.08, 0.35, 0.62];
const CAREER_THRESHOLDS = [0.05, 0.14, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74];

/* ── Path builder ─────────────────────────────────────────────────── */

function buildPath(positions) {
  if (positions.length < 2) return '';
  let d = `M ${positions[0].cx} ${positions[0].cy}`;
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];
    const cpx1 = prev.cx + (curr.cx - prev.cx) * 0.5;
    const cpy1 = prev.cy;
    const cpx2 = prev.cx + (curr.cx - prev.cx) * 0.5;
    const cpy2 = curr.cy;
    d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.cx} ${curr.cy}`;
  }
  return d;
}

/* ── Polygon points with offset ───────────────────────────────────── */

function offsetPoints(shapeStr, cx, cy) {
  return shapeStr
    .split(' ')
    .map((pair) => {
      const [x, y] = pair.split(',').map(Number);
      return `${cx + x},${cy + y}`;
    })
    .join(' ');
}

/* ── Component ────────────────────────────────────────────────────── */

export default function CompetenciesSticky() {
  const sectionRef = useRef(null);
  const eduPathRef = useRef(null);
  const careerPathRef = useRef(null);

  const [eduPathLength, setEduPathLength] = useState(0);
  const [careerPathLength, setCareerPathLength] = useState(0);

  const [eduVisible, setEduVisible] = useState(() => new Array(EDUCATION.length).fill(false));
  const [careerVisible, setCareerVisible] = useState(() => new Array(CAREER.length).fill(false));

  // Mobile step-by-step stagger (separate from desktop path-drawing timings)
  const [mobEduVisible, setMobEduVisible]       = useState(() => new Array(EDUCATION.length).fill(false));
  const [mobCareerVisible, setMobCareerVisible] = useState(() => new Array(CAREER.length).fill(false));
  const mobAnimStarted = useRef(false);   // guard: run once even if isSceneActive flips rapidly

  const eduPathD = buildPath(EDU_POSITIONS);
  const careerPathD = buildPath(CAREER_POSITIONS);

  const isSceneActive = useContext(ActiveSceneContext);

  const autoProgress = useMotionValue(0);

  useEffect(() => {
    if (eduPathRef.current) setEduPathLength(eduPathRef.current.getTotalLength());
    if (careerPathRef.current) setCareerPathLength(careerPathRef.current.getTotalLength());
  }, []);

  const eduDashoffset    = useTransform(autoProgress, [0, 1], [eduPathLength,    0]);
  const careerDashoffset = useTransform(autoProgress, [0, 1], [careerPathLength, 0]);

  useEffect(() => {
    if (!isSceneActive) return;

    const DURATION = 10; // seconds

    const t1 = setTimeout(() => {
      animate(autoProgress, 1, { duration: DURATION, ease: 'easeInOut' });
    }, 600);

    // Staggered node reveals using timeouts instead of per-frame state checks
    const timers = [t1];
    EDU_THRESHOLDS.forEach((threshold, i) => {
      timers.push(setTimeout(() => {
        setEduVisible(prev => { const next = [...prev]; next[i] = true; return next; });
      }, 600 + threshold * DURATION * 1000));
    });
    CAREER_THRESHOLDS.forEach((threshold, i) => {
      timers.push(setTimeout(() => {
        setCareerVisible(prev => { const next = [...prev]; next[i] = true; return next; });
      }, 600 + threshold * DURATION * 1000));
    });

    return () => timers.forEach(clearTimeout);
  }, [autoProgress, isSceneActive]);

  // Mobile: fast staggered reveal — starts once when scene first becomes active
  useEffect(() => {
    if (!isSceneActive || mobAnimStarted.current) return;
    mobAnimStarted.current = true;
    const STAGGER = 350;
    const timers = [];
    EDUCATION.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setMobEduVisible(prev => { const next = [...prev]; next[i] = true; return next; });
      }, 400 + i * STAGGER));
    });
    CAREER.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setMobCareerVisible(prev => { const next = [...prev]; next[i] = true; return next; });
      }, 500 + i * STAGGER));
    });
    // No cleanup — once started, let it run to completion
  }, [isSceneActive]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: '#02030A' }}
      aria-label="Career Path"
    >
      {/* Section heading */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-mono text-xs uppercase tracking-[0.4em] text-muted text-center mb-12 w-full"
        style={{ textAlign: 'center' }}
      >
        Career Path
      </motion.p>

      {/* ── Mobile vertical list ── */}
      {/* REMOVED: Flat layout omitted in favor of the 1-1 SVG layout */}

      {/* ── 1-1 SVG layout (Universal) ── */}
      <div className="block" style={{ position: 'relative', width: '100%', minHeight: `${VIEWBOX_H}px` }}>

        {/* Column headers */}
        <div
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{
            position: 'absolute',
            left: '20%',
            top: '10px',
            color: 'rgba(160,160,160,0.5)',
            zIndex: 5,
          }}
        >
          Education
        </div>
        <div
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{
            position: 'absolute',
            left: '62%',
            top: '10px',
            color: 'rgba(160,160,160,0.5)',
            zIndex: 5,
          }}
        >
          Career
        </div>

        {/* SVG overlay */}
        <svg
          viewBox={`0 0 1000 ${VIEWBOX_H}`}
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
          <defs>
            <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2={VIEWBOX_H} gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#8B5CF6" />
              <stop offset="55%"  stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#00E5A0" />
            </linearGradient>
            {/* Stone polygon glow — matches card boxShadow style */}
            <filter id="stoneGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" in="SourceGraphic" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Matches CSS: 0 0 10px rgba(139,92,246,0.6), 0 0 20px rgba(0,212,255,0.2) */}
            <filter id="pathGlow" x="-200%" y="-10%" width="500%" height="120%">
              <feGaussianBlur stdDeviation="5" result="blur1" in="SourceGraphic" />
              <feFlood floodColor="#8B5CF6" floodOpacity="0.6" result="color1" />
              <feComposite in="color1" in2="blur1" operator="in" result="glow1" />
              <feGaussianBlur stdDeviation="10" result="blur2" in="SourceGraphic" />
              <feFlood floodColor="#00D4FF" floodOpacity="0.2" result="color2" />
              <feComposite in="color2" in2="blur2" operator="in" result="glow2" />
              <feMerge>
                <feMergeNode in="glow2" />
                <feMergeNode in="glow1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Education path ── */}
          <path
            d={eduPathD}
            stroke="rgba(139,92,246,0.07)"
            strokeWidth={1}
            fill="none"
          />
          <motion.path
            ref={eduPathRef}
            d={eduPathD}
            stroke="url(#pathGradient)"
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
            filter="url(#pathGlow)"
            strokeDasharray={eduPathLength}
            style={{ strokeDashoffset: eduDashoffset }}
          />

          {/* ── Career path ── */}
          <path
            d={careerPathD}
            stroke="rgba(139,92,246,0.07)"
            strokeWidth={1}
            fill="none"
          />
          <motion.path
            ref={careerPathRef}
            d={careerPathD}
            stroke="url(#pathGradient)"
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
            filter="url(#pathGlow)"
            strokeDasharray={careerPathLength}
            style={{ strokeDashoffset: careerDashoffset }}
          />

          {/* ── Education stones ── */}
          {EDUCATION.map((item, i) => {
            const { cx, cy } = EDU_POSITIONS[i];
            const pts = offsetPoints(EDU_SHAPES[i], cx, cy);
            const colors = TYPE_COLORS[item.type];
            return (
              <g key={`edu-${i}`}>
                <AnimatePresence>
                  {eduVisible[i] && (
                    <>
                      <motion.g
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.67, 1], opacity: [0, 0.6, 0.15] }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      >
                        <circle cx={cx} cy={cy} r={30} fill={colors.glow} />
                      </motion.g>
                      <motion.g
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <polygon points={pts} fill={colors.fill} stroke={colors.stroke} strokeWidth={2} filter="url(#stoneGlow)" />
                      </motion.g>
                      {/* Center dot — matches stone type color */}
                      <motion.circle
                        cx={cx} cy={cy} r={19}
                        fill="none" stroke={colors.stroke} strokeWidth="0.8"
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                        animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: i * 0.3 }}
                      />
                      <motion.circle
                        cx={cx} cy={cy} r={12}
                        fill="none" stroke={colors.stroke} strokeWidth="0.8"
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                        animate={{ scale: [1, 1.5], opacity: [0.45, 0] }}
                        transition={{ duration: 2.0, repeat: Infinity, ease: 'easeOut', delay: i * 0.3 + 0.5 }}
                      />
                      <circle
                        cx={cx} cy={cy} r={5}
                        fill={colors.stroke}
                        stroke="rgba(2,3,10,0.95)"
                        strokeWidth="1"
                        style={{ filter: `drop-shadow(0 0 7px ${colors.glow}) drop-shadow(0 0 16px ${colors.glow})` }}
                      />
                    </>
                  )}
                </AnimatePresence>
              </g>
            );
          })}

          {/* ── Career stones ── */}
          {CAREER.map((item, i) => {
            const { cx, cy } = CAREER_POSITIONS[i];
            const pts = offsetPoints(CAREER_SHAPES[i], cx, cy);
            const colors = TYPE_COLORS[item.type];
            return (
              <g key={`career-${i}`}>
                <AnimatePresence>
                  {careerVisible[i] && (
                    <>
                      <motion.g
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.67, 1], opacity: [0, 0.6, 0.15] }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      >
                        <circle cx={cx} cy={cy} r={30} fill={colors.glow} />
                      </motion.g>
                      <motion.g
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <polygon points={pts} fill={colors.fill} stroke={colors.stroke} strokeWidth={2} filter="url(#stoneGlow)" />
                      </motion.g>
                      {/* Center dot — matches stone type color */}
                      <motion.circle
                        cx={cx} cy={cy} r={19}
                        fill="none" stroke={colors.stroke} strokeWidth="0.8"
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                        animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: i * 0.3 }}
                      />
                      <motion.circle
                        cx={cx} cy={cy} r={12}
                        fill="none" stroke={colors.stroke} strokeWidth="0.8"
                        style={{ transformOrigin: `${cx}px ${cy}px` }}
                        animate={{ scale: [1, 1.5], opacity: [0.45, 0] }}
                        transition={{ duration: 2.0, repeat: Infinity, ease: 'easeOut', delay: i * 0.3 + 0.5 }}
                      />
                      <circle
                        cx={cx} cy={cy} r={5}
                        fill={colors.stroke}
                        stroke="rgba(2,3,10,0.95)"
                        strokeWidth="1"
                        style={{ filter: `drop-shadow(0 0 7px ${colors.glow}) drop-shadow(0 0 16px ${colors.glow})` }}
                      />
                    </>
                  )}
                </AnimatePresence>
              </g>
            );
          })}
        </svg>

        {/* ── Education labels (HTML, left of stones) ── */}
        {EDUCATION.map((item, i) => {
          const { cx, cy } = EDU_POSITIONS[i];
          const colors = TYPE_COLORS[item.type];
          const leftPct = (cx / 1000) * 100;
          const topPct = (cy / VIEWBOX_H) * 100;
          return (
            <AnimatePresence key={`edu-label-${i}`}>
              {eduVisible[i] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    transform: 'translateX(-100%) translateY(-50%)',
                    paddingRight: '14px',
                    textAlign: 'right',
                    pointerEvents: 'none',
                    zIndex: 4,
                    maxWidth: '210px',
                  }}
                >
                  <p
                    className="font-mono"
                    style={{
                      fontSize: '13px',
                      color: 'rgba(139,92,246,0.7)',
                      marginBottom: '4px',
                      lineHeight: 1.2,
                    }}
                  >
                    {item.year}
                  </p>
                  <p
                    className="font-serif"
                    style={{
                      fontWeight: 700,
                      color: 'var(--foreground, #e5e5e5)',
                      fontSize: '16px',
                      lineHeight: 1.35,
                      maxWidth: '200px',
                      marginLeft: 'auto',
                    }}
                  >
                    {item.title}
                  </p>
                  <span
                    className="font-mono"
                    style={{
                      display: 'inline-block',
                      marginTop: '5px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: colors.badge_bg,
                      color: colors.badge_text,
                      border: `1px solid ${colors.badge_border}`,
                    }}
                  >
                    {item.type}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}

        {/* ── Career labels (HTML, right of stones) ── */}
        {CAREER.map((item, i) => {
          const { cx, cy } = CAREER_POSITIONS[i];
          const colors = TYPE_COLORS[item.type];
          const leftPct = (cx / 1000) * 100;
          const topPct = (cy / VIEWBOX_H) * 100;
          return (
            <AnimatePresence key={`career-label-${i}`}>
              {careerVisible[i] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    transform: 'translateY(-50%)',
                    paddingLeft: '14px',
                    textAlign: 'left',
                    pointerEvents: 'none',
                    zIndex: 4,
                    maxWidth: '210px',
                  }}
                >
                  <p
                    className="font-mono"
                    style={{
                      fontSize: '13px',
                      color: 'rgba(139,92,246,0.7)',
                      marginBottom: '4px',
                      lineHeight: 1.2,
                    }}
                  >
                    {item.year}
                  </p>
                  <p
                    className="font-serif"
                    style={{
                      fontWeight: 700,
                      color: 'var(--foreground, #e5e5e5)',
                      fontSize: '16px',
                      lineHeight: 1.35,
                      maxWidth: '200px',
                    }}
                  >
                    {item.title}
                  </p>
                  {item.org && (
                    <p
                      className="font-mono"
                      style={{
                        fontSize: '9px',
                        color: 'rgba(160,160,160,0.6)',
                        marginTop: '1px',
                        lineHeight: 1.2,
                      }}
                    >
                      {item.org}
                    </p>
                  )}
                  <span
                    className="font-mono"
                    style={{
                      display: 'inline-block',
                      marginTop: '5px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: colors.badge_bg,
                      color: colors.badge_text,
                      border: `1px solid ${colors.badge_border}`,
                    }}
                  >
                    {item.type}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>
    </section>
  );
}
