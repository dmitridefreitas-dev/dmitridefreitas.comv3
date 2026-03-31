'use client';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import SkillDetailModal from '@/components/modals/SkillDetailModal';
import { skillsData } from '@/data/skills';

/* ── Category colors ─────────────────────────────────────────────── */

const CAT_COLORS = {
  Programming: {
    hex: '#8B5CF6',
    dim: 'rgba(139,92,246,0.12)',
    active: 'rgba(139,92,246,0.6)',
    bright: '#A78BFA',
    glow: 'rgba(139,92,246,0.5)',
  },
  'Data Visualization': {
    hex: '#00D4FF',
    dim: 'rgba(0,212,255,0.12)',
    active: 'rgba(0,212,255,0.6)',
    bright: '#67E8F9',
    glow: 'rgba(0,212,255,0.5)',
  },
  'Financial Tools': {
    hex: '#00E5A0',
    dim: 'rgba(0,229,160,0.12)',
    active: 'rgba(0,229,160,0.6)',
    bright: '#34D399',
    glow: 'rgba(0,229,160,0.5)',
  },
};

/* ── Proficiency per skill ──────────────────────────────────────── */

const SKILL_PROF = {
  python: 95, r: 85, sql: 90, matlab: 80, vba: 75, git: 88,
  matplotlib: 88, powerbi: 82, tableau: 85,
  quantlib: 78, bloomberg: 80, fred: 84,
};

/* ── ViewBox ─────────────────────────────────────────────────────── */

const VB_W = 1000;
const VB_H = 900;
const CHIP_W = 90;
const CHIP_H = 50;
const PIN = 4;

/* ── Node positions ──────────────────────────────────────────────── */

const NODES = [
  { id: 'python',     cx: 120, cy: 150, cat: 'Programming' },
  { id: 'r',          cx: 120, cy: 310, cat: 'Programming' },
  { id: 'sql',        cx: 120, cy: 470, cat: 'Programming' },
  { id: 'matlab',     cx: 280, cy: 230, cat: 'Programming' },
  { id: 'vba',        cx: 280, cy: 390, cat: 'Programming' },
  { id: 'git',        cx: 280, cy: 550, cat: 'Programming' },

  { id: 'matplotlib', cx: 480, cy: 140, cat: 'Data Visualization' },
  { id: 'powerbi',    cx: 480, cy: 300, cat: 'Data Visualization' },
  { id: 'tableau',    cx: 480, cy: 460, cat: 'Data Visualization' },

  { id: 'quantlib',   cx: 680, cy: 200, cat: 'Financial Tools' },
  { id: 'bloomberg',  cx: 680, cy: 360, cat: 'Financial Tools' },
  { id: 'fred',       cx: 680, cy: 520, cat: 'Financial Tools' },
];

const OUTPUT_LABELS = [
  { label: 'ML / AI',          cx: 880, cy: 250 },
  { label: 'Quant Finance',    cx: 880, cy: 400 },
  { label: 'Data Eng',         cx: 880, cy: 550 },
];

/* ── Traces ──────────────────────────────────────────────────────── */

const TRACES = [
  // Power rail
  { id: 'rail', pts: '50,650 950,650', phase: [0, 0.08], cat: null },

  // Vertical drops from rail to left cluster
  { id: 'drop-l1', pts: '120,650 120,470', phase: [0.04, 0.14], cat: 'Programming' },
  { id: 'drop-l2', pts: '280,650 280,550', phase: [0.05, 0.15], cat: 'Programming' },

  // Left cluster internal wiring
  { id: 'l-vert-up1', pts: '120,470 120,150', phase: [0.10, 0.22], cat: 'Programming' },
  { id: 'l-vert-up2', pts: '280,550 280,230', phase: [0.12, 0.24], cat: 'Programming' },
  { id: 'l-h1', pts: '165,150 235,150 235,230 235,230', phase: [0.16, 0.26], cat: 'Programming' },
  { id: 'l-h2', pts: '165,310 235,310 235,390 235,390', phase: [0.18, 0.28], cat: 'Programming' },
  { id: 'l-h3', pts: '165,470 235,470 235,550 235,550', phase: [0.20, 0.30], cat: 'Programming' },

  // Bridge from left to center
  { id: 'bridge-lc', pts: '325,230 390,230 390,140 435,140', phase: [0.22, 0.32], cat: 'Data Visualization' },
  { id: 'bridge-lc2', pts: '325,390 390,390 390,300 435,300', phase: [0.24, 0.34], cat: 'Data Visualization' },
  { id: 'bridge-lc3', pts: '325,550 390,550 390,460 435,460', phase: [0.26, 0.36], cat: 'Data Visualization' },

  // Vertical drops from rail to center
  { id: 'drop-c', pts: '480,650 480,460', phase: [0.06, 0.18], cat: 'Data Visualization' },
  // Center cluster internal
  { id: 'c-vert', pts: '480,460 480,140', phase: [0.18, 0.32], cat: 'Data Visualization' },

  // Bridge from center to right
  { id: 'bridge-cr1', pts: '525,140 590,140 590,200 635,200', phase: [0.32, 0.42], cat: 'Financial Tools' },
  { id: 'bridge-cr2', pts: '525,300 590,300 590,360 635,360', phase: [0.34, 0.44], cat: 'Financial Tools' },
  { id: 'bridge-cr3', pts: '525,460 590,460 590,520 635,520', phase: [0.36, 0.46], cat: 'Financial Tools' },

  // Vertical drops from rail to right
  { id: 'drop-r', pts: '680,650 680,520', phase: [0.08, 0.20], cat: 'Financial Tools' },
  // Right cluster internal
  { id: 'r-vert', pts: '680,520 680,200', phase: [0.28, 0.42], cat: 'Financial Tools' },

  // Output traces
  { id: 'out1', pts: '725,200 780,200 780,250 840,250', phase: [0.52, 0.62], cat: null },
  { id: 'out2', pts: '725,360 780,360 780,400 840,400', phase: [0.56, 0.66], cat: null },
  { id: 'out3', pts: '725,520 780,520 780,550 840,550', phase: [0.60, 0.70], cat: null },
];

/* ── Node appearance thresholds ──────────────────────────────────── */

const NODE_THRESHOLDS = {
  python: 0.12, r: 0.16, sql: 0.20,
  matlab: 0.18, vba: 0.22, git: 0.26,
  matplotlib: 0.30, powerbi: 0.34, tableau: 0.38,
  quantlib: 0.42, bloomberg: 0.48, fred: 0.54,
};

const OUTPUT_THRESHOLDS = [0.62, 0.68, 0.74];

/* ── Helpers ─────────────────────────────────────────────────────── */

function parsePts(str) {
  return str.split(' ').map(p => {
    const [x, y] = p.split(',').map(Number);
    return { x, y };
  });
}

function ptsToPath(pts) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
}

function traceLen(pts) {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return len;
}

/* ── Component ───────────────────────────────────────────────────── */

export default function SkillsReveal() {
  const sectionRef = useRef(null);
  const [activeNodes, setActiveNodes] = useState(() => new Set());
  const [activeOutputs, setActiveOutputs] = useState(() => new Array(3).fill(false));
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 1.0', 'end 0.0'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20,
    restDelta: 0.001,
  });

  useMotionValueEvent(smooth, 'change', (v) => {
    setProgress(v);

    setActiveNodes(prev => {
      let changed = false;
      const next = new Set(prev);
      Object.entries(NODE_THRESHOLDS).forEach(([id, t]) => {
        if (!next.has(id) && v >= t) { next.add(id); changed = true; }
      });
      return changed ? next : prev;
    });

    setActiveOutputs(prev => {
      let changed = false;
      const next = [...prev];
      OUTPUT_THRESHOLDS.forEach((t, i) => {
        if (!next[i] && v >= t) { next[i] = true; changed = true; }
      });
      return changed ? next : prev;
    });
  });

  const getSkill = useCallback((id) => skillsData.find(s => s.id === id), []);
  const handleClick = useCallback((skill) => setSelectedSkill(skill), []);

  const traceProgress = useCallback((phase) => {
    const [s, e] = phase;
    if (progress <= s) return 0;
    if (progress >= e) return 1;
    return (progress - s) / (e - s);
  }, [progress]);

  /* ── Render ── */
  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: '#02030A' }}
      aria-label="Technical Skills Circuit Board"
    >
      {/* ── Section header ── */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-mono text-xs uppercase tracking-[0.4em] text-center mb-2"
        style={{ color: 'rgba(139,92,246,0.7)' }}
      >
        Tools &amp; Languages
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="font-mono text-[9px] uppercase tracking-[0.3em] text-center mb-10"
        style={{ color: 'rgba(0,212,255,0.35)' }}
      >
        {'CIRCUIT \u00B7 12 NODES \u00B7 49 CONNECTIONS'}
      </motion.p>

      {/* ── Legend ── */}
      <div className="flex justify-center gap-6 mb-8 flex-wrap">
        {Object.entries(CAT_COLORS).map(([cat, c]) => (
          <div key={cat} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5"
              style={{
                background: c.hex,
                boxShadow: `0 0 6px ${c.glow}`,
              }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: `${c.hex}88` }}>
              {cat}
            </span>
          </div>
        ))}
      </div>

      {/* ── Mobile layout ── */}
      <div className="md:hidden space-y-8 px-2">
        {['Programming', 'Data Visualization', 'Financial Tools'].map(cat => {
          const c = CAT_COLORS[cat];
          const nodes = NODES.filter(n => n.cat === cat);
          return (
            <div key={cat}>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.25em] mb-3"
                style={{ color: `${c.hex}77` }}
              >
                {cat}
              </p>
              <div className="space-y-2">
                {nodes.map(node => {
                  const skill = getSkill(node.id);
                  if (!skill) return null;
                  const prof = SKILL_PROF[node.id] || 75;
                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      onClick={() => handleClick(skill)}
                      className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                      style={{
                        background: 'rgba(2,3,10,0.9)',
                        border: `1px solid ${c.dim}`,
                        borderRadius: '3px',
                      }}
                    >
                      {/* Pin indicator */}
                      <div className="w-2 h-2 flex-shrink-0" style={{ background: c.hex, boxShadow: `0 0 6px ${c.glow}` }} />
                      {/* Name */}
                      <span className="font-mono text-[12px] text-white/80 flex-1 tracking-wide">{skill.name}</span>
                      {/* Proficiency bar */}
                      <div className="w-16 h-1.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '1px' }}>
                        <div
                          style={{
                            width: `${prof}%`,
                            height: '100%',
                            background: c.hex,
                            borderRadius: '1px',
                            boxShadow: `0 0 4px ${c.glow}`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-[9px]" style={{ color: `${c.hex}88` }}>{prof}%</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Desktop SVG circuit board ── */}
      <div className="hidden md:block max-w-5xl mx-auto" style={{ position: 'relative' }}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible' }}
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Dot grid pattern */}
            <pattern id="pcb-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.8" fill="rgba(139,92,246,0.08)" />
            </pattern>

            {/* Trace glow */}
            <filter id="tGlow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="3" result="b" in="SourceGraphic" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Chip hover glow */}
            <filter id="chipHover" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="6" result="b" in="SourceGraphic" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Rail glow */}
            <filter id="railGlow" x="-100%" y="-300%" width="300%" height="700%">
              <feGaussianBlur stdDeviation="4" result="b" in="SourceGraphic" />
              <feFlood floodColor="#00D4FF" floodOpacity="0.3" result="c" />
              <feComposite in="c" in2="b" operator="in" result="g" />
              <feMerge>
                <feMergeNode in="g" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background dot grid */}
          <rect width={VB_W} height={VB_H} fill="url(#pcb-dots)" />

          {/* ═══ TRACES ═══ */}
          {TRACES.map(trace => {
            const pts = parsePts(trace.pts);
            const d = ptsToPath(pts);
            const len = traceLen(pts);
            const tp = traceProgress(trace.phase);
            const isRail = trace.id === 'rail';
            const isOutput = trace.id.startsWith('out');
            const c = trace.cat ? CAT_COLORS[trace.cat] : null;

            const dimStroke = isRail
              ? 'rgba(0,212,255,0.08)'
              : isOutput
                ? 'rgba(0,212,255,0.06)'
                : c ? c.dim : 'rgba(139,92,246,0.08)';

            const activeStroke = isRail || isOutput
              ? 'rgba(0,212,255,0.3)'
              : c ? c.active : '#8B5CF6';

            return (
              <g key={trace.id}>
                {/* Ghost trace */}
                <path
                  d={d}
                  stroke={dimStroke}
                  strokeWidth={isRail ? 2 : 1.2}
                  fill="none"
                  strokeLinecap="square"
                />
                {/* Active trace */}
                {tp > 0 && (
                  <path
                    d={d}
                    stroke={activeStroke}
                    strokeWidth={isRail ? 2.5 : 1.5}
                    fill="none"
                    strokeLinecap="square"
                    filter={isRail ? 'url(#railGlow)' : 'url(#tGlow)'}
                    strokeDasharray={len}
                    strokeDashoffset={len * (1 - tp)}
                    style={{ transition: 'stroke-dashoffset 0.12s linear' }}
                  />
                )}
              </g>
            );
          })}

          {/* ═══ RAIL JUNCTION SQUARES ═══ */}
          {[120, 280, 480, 680].map(jx => {
            const on = progress >= 0.08;
            return (
              <rect
                key={`j-${jx}`}
                x={jx - 3} y={647} width={6} height={6}
                fill={on ? '#00D4FF' : 'rgba(0,212,255,0.1)'}
                style={{
                  transition: 'fill 0.4s',
                  filter: on ? 'drop-shadow(0 0 4px rgba(0,212,255,0.5))' : 'none',
                }}
              />
            );
          })}

          {/* ═══ POWER RAIL LABEL ═══ */}
          {progress > 0.05 && (
            <text
              x={500} y={678}
              textAnchor="middle"
              fontSize={7}
              fontFamily="var(--font-jetbrains), 'Courier New', monospace"
              letterSpacing="0.35em"
              fill="rgba(0,212,255,0.18)"
            >
              {'///  POWER RAIL  ///'}
            </text>
          )}

          {/* ═══ CLUSTER HEADERS ═══ */}
          {progress > 0.14 && (
            <text x={190} y={100} textAnchor="middle" fontSize={8}
              fontFamily="var(--font-jetbrains), 'Courier New', monospace"
              letterSpacing="0.2em" fill="rgba(139,92,246,0.22)">
              {'[ PROGRAMMING ]'}
            </text>
          )}
          {progress > 0.34 && (
            <text x={480} y={90} textAnchor="middle" fontSize={8}
              fontFamily="var(--font-jetbrains), 'Courier New', monospace"
              letterSpacing="0.2em" fill="rgba(0,212,255,0.22)">
              {'[ DATA VIZ ]'}
            </text>
          )}
          {progress > 0.48 && (
            <text x={680} y={150} textAnchor="middle" fontSize={8}
              fontFamily="var(--font-jetbrains), 'Courier New', monospace"
              letterSpacing="0.2em" fill="rgba(0,229,160,0.22)">
              {'[ FINANCIAL ]'}
            </text>
          )}

          {/* ═══ CHIP NODES ═══ */}
          {NODES.map(node => {
            const skill = getSkill(node.id);
            if (!skill) return null;
            const on = activeNodes.has(node.id);
            const hov = hoveredNode === node.id;
            const c = CAT_COLORS[node.cat];
            const prof = SKILL_PROF[node.id] || 75;
            const rx = node.cx - CHIP_W / 2;
            const ry = node.cy - CHIP_H / 2;
            const barW = CHIP_W - 16;

            return (
              <g key={node.id}>
                {/* Ghost chip outline (always) */}
                <rect
                  x={rx} y={ry} width={CHIP_W} height={CHIP_H} rx={3}
                  fill="none"
                  stroke={c.dim}
                  strokeWidth={0.5}
                  strokeDasharray="3 5"
                />

                <AnimatePresence>
                  {on && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Burst ring on appear */}
                      <motion.rect
                        x={rx - 5} y={ry - 5}
                        width={CHIP_W + 10} height={CHIP_H + 10}
                        rx={4}
                        fill="none"
                        stroke={c.hex}
                        strokeWidth={1.5}
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
                      />

                      {/* Chip body */}
                      <rect
                        x={rx} y={ry}
                        width={CHIP_W} height={CHIP_H}
                        rx={3}
                        fill="rgba(2,3,10,0.92)"
                        stroke={hov ? c.bright : `${c.hex}55`}
                        strokeWidth={hov ? 2 : 1}
                        filter={hov ? 'url(#chipHover)' : undefined}
                        style={{ cursor: 'pointer', transition: 'stroke 0.2s, stroke-width 0.2s' }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => handleClick(skill)}
                      />

                      {/* Corner pin squares */}
                      {[
                        [rx - 1, ry - 1],
                        [rx + CHIP_W - PIN + 1, ry - 1],
                        [rx - 1, ry + CHIP_H - PIN + 1],
                        [rx + CHIP_W - PIN + 1, ry + CHIP_H - PIN + 1],
                      ].map(([px, py], pi) => (
                        <rect
                          key={pi}
                          x={px} y={py} width={PIN} height={PIN}
                          fill={hov ? c.bright : `${c.hex}44`}
                          style={{ transition: 'fill 0.2s' }}
                        />
                      ))}

                      {/* Side pins (IC package style) */}
                      {[0, 1, 2].map(pi => {
                        const pinY = ry + 8 + pi * 14;
                        return (
                          <g key={`sp-${pi}`}>
                            <rect x={rx - 7} y={pinY} width={7} height={3} fill={`${c.hex}25`} />
                            <rect x={rx + CHIP_W} y={pinY} width={7} height={3} fill={`${c.hex}25`} />
                          </g>
                        );
                      })}

                      {/* Invisible click area */}
                      <rect
                        x={rx - 7} y={ry - 1}
                        width={CHIP_W + 14} height={CHIP_H + 2}
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => handleClick(skill)}
                      />

                      {/* Skill name */}
                      <ChipLabel
                        text={skill.name}
                        x={node.cx} y={node.cy - 6}
                        fill={hov ? c.bright : '#E5E7EB'}
                      />

                      {/* Proficiency bar */}
                      <ChipBar
                        x={rx + 8} y={node.cy + 10}
                        w={barW} prof={prof}
                        color={c.hex}
                      />

                      {/* Proficiency % */}
                      <text
                        x={rx + CHIP_W - 7} y={node.cy + 8}
                        textAnchor="end"
                        fontSize={7}
                        fontFamily="var(--font-jetbrains), 'Courier New', monospace"
                        fill={`${c.hex}66`}
                        style={{ pointerEvents: 'none' }}
                      >
                        {prof}%
                      </text>

                      {/* Hover tooltip */}
                      <AnimatePresence>
                        {hov && (
                          <motion.g
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 3 }}
                            transition={{ duration: 0.12 }}
                          >
                            <rect
                              x={node.cx - 90} y={ry - 36}
                              width={180} height={28}
                              rx={2}
                              fill="rgba(2,3,10,0.95)"
                              stroke={`${c.hex}35`}
                              strokeWidth={1}
                            />
                            <polygon
                              points={`${node.cx - 4},${ry - 8} ${node.cx + 4},${ry - 8} ${node.cx},${ry - 2}`}
                              fill="rgba(2,3,10,0.95)"
                            />
                            <text
                              x={node.cx} y={ry - 22}
                              textAnchor="middle" fontSize={7.5}
                              fontFamily="var(--font-jetbrains), 'Courier New', monospace"
                              fill="rgba(249,250,251,0.55)"
                              style={{ pointerEvents: 'none' }}
                            >
                              {skill.description.length > 48
                                ? skill.description.slice(0, 45) + '...'
                                : skill.description}
                            </text>
                            <text
                              x={node.cx} y={ry - 12}
                              textAnchor="middle" fontSize={6.5}
                              fontFamily="var(--font-jetbrains), 'Courier New', monospace"
                              fill={`${c.hex}66`}
                              style={{ pointerEvents: 'none' }}
                            >
                              {'> click to explore'}
                            </text>
                          </motion.g>
                        )}
                      </AnimatePresence>
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            );
          })}

          {/* ═══ OUTPUT LABELS ═══ */}
          {OUTPUT_LABELS.map((out, i) => (
            <g key={`out-${i}`}>
              <rect
                x={out.cx - 48} y={out.cy - 12}
                width={96} height={24}
                rx={2}
                fill="none"
                stroke="rgba(0,212,255,0.06)"
                strokeWidth={0.5}
                strokeDasharray="3 5"
              />
              <AnimatePresence>
                {activeOutputs[i] && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <rect
                      x={out.cx - 48} y={out.cy - 12}
                      width={96} height={24}
                      rx={2}
                      fill="rgba(2,3,10,0.85)"
                      stroke="rgba(0,212,255,0.22)"
                      strokeWidth={1}
                    />
                    <motion.circle
                      cx={out.cx - 38} cy={out.cy}
                      r={2}
                      fill="#00D4FF"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                    <text
                      x={out.cx - 30} y={out.cy + 4}
                      textAnchor="start" fontSize={8.5}
                      fontFamily="var(--font-jetbrains), 'Courier New', monospace"
                      fontWeight="600"
                      letterSpacing="0.1em"
                      fill="rgba(0,212,255,0.6)"
                      style={{ pointerEvents: 'none' }}
                    >
                      {out.label.toUpperCase()}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          ))}

          {/* Ambient scan line */}
          <motion.line
            x1={0} y1={0} x2={VB_W} y2={0}
            stroke="rgba(0,212,255,0.03)"
            strokeWidth={1}
            animate={{ y1: [0, VB_H, 0], y2: [0, VB_H, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      </div>

      {/* ── Stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center gap-12 mt-10 max-w-4xl mx-auto pt-8 flex-wrap"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        {[
          { label: 'Languages', value: '6', color: '#8B5CF6' },
          { label: 'Libraries', value: '6', color: '#00D4FF' },
          { label: 'Projects', value: '12', color: '#00E5A0' },
          { label: 'Connections', value: '49', color: '#00D4FF' },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <p className="font-mono text-xl font-bold" style={{ color }}>{value}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25 mt-1">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className="max-w-4xl mx-auto mt-4 flex items-center justify-center gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <span className="font-mono text-[9px] tracking-wider" style={{ color: 'rgba(0,212,255,0.28)' }}>
          SYS.STATUS: {activeNodes.size === NODES.length ? 'ALL NODES ONLINE' : `${activeNodes.size}/${NODES.length} NODES ACTIVE`}
        </span>
        <motion.span
          className="inline-block w-1.5 h-1.5"
          style={{
            background: activeNodes.size === NODES.length ? '#00E5A0' : '#00D4FF',
            boxShadow: `0 0 4px ${activeNodes.size === NODES.length ? 'rgba(0,229,160,0.6)' : 'rgba(0,212,255,0.6)'}`,
          }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </motion.div>

      {/* ── Skill Detail Modal ── */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillDetailModal
            skill={selectedSkill}
            isOpen={!!selectedSkill}
            onClose={() => setSelectedSkill(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

function ChipLabel({ text, x, y, fill }) {
  return (
    <text
      x={x} y={y}
      textAnchor="middle"
      fontSize={10}
      fontFamily="var(--font-jetbrains), 'Courier New', monospace"
      fontWeight="600"
      letterSpacing="0.08em"
      fill={fill}
      style={{ pointerEvents: 'none', textTransform: 'uppercase' }}
    >
      {text}
    </text>
  );
}

function ChipBar({ x, y, w, prof, color }) {
  const fillW = (prof / 100) * w;
  return (
    <g>
      <rect x={x} y={y} width={w} height={5} rx={1} fill="rgba(255,255,255,0.05)" />
      <rect
        x={x} y={y} width={fillW} height={5} rx={1}
        fill={color}
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}
      />
    </g>
  );
}
