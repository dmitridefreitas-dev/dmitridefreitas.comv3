'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import TextReveal from '@/components/effects/TextReveal';
import MagneticButton from '@/components/effects/MagneticButton';
import ExperienceModal from '@/components/modals/ExperienceModal';
import CTASection from '@/components/sections/CTASection';
import { education } from '@/data/education';
import { experiences } from '@/data/experiences';
import { skillCategories, skillsData } from '@/data/skills';
import { socialLinks, aboutKpiMetrics } from '@/data/constants';
import { ArrowUpRight, Linkedin, Trophy, Plane, BarChart3, Terminal, GraduationCap, Briefcase, FlaskConical, ChevronRight } from 'lucide-react';

/* ── data ──────────────────────────────────────────────────────────────────── */
const storyParagraphs = [
  "I'm pursuing a Bachelor of Science in Data Science & Financial Engineering at Washington University in St. Louis, graduating May 2026.",
  "My professional experience includes building ML-driven quantitative models for credit market analysis at Amphora Investment Management, where I processed 70K+ data points across 8+ statistical approaches, achieving 95% average explanatory power.",
  "My research focuses on market efficiency and quantitative finance -- from PEAD anomaly analysis testing semi-strong EMH to algorithmic trading strategy development and full-stack trading terminal infrastructure.",
  "I'm seeking full-time roles in quantitative research, financial engineering, and data science starting May 2026.",
];

const financeExps = experiences.filter((e) => e.type === 'finance');
const researchExps = experiences.filter((e) => e.type === 'research');

const personalInterests = [
  {
    icon: Trophy,
    title: 'Cricket',
    description: 'Competitive cricket player -- a lifelong passion from growing up in Barbados that sharpened strategy, teamwork, and composure under pressure.',
  },
  {
    icon: Plane,
    title: 'Travel & Adventure',
    description: 'Committed to exploring new cultures and environments. Duke of Edinburgh Award expeditions sparked a love of outdoor challenge and discovery.',
  },
  {
    icon: BarChart3,
    title: 'Open Source Quant Research',
    description: 'Building and sharing quantitative finance tools and datasets -- contributing to the open-source research community.',
  },
];

const researchFocusAreas = [
  'PEAD Market Efficiency', 'Algorithmic Trading', 'Credit Risk Modeling',
  'Time Series Analysis', 'Portfolio Optimization', 'Monte Carlo Simulation',
  'Factor Models', 'Derivatives Pricing', 'Volatility Surface',
];

const skillBadgeCategories = [
  { label: 'Languages', items: ['Python', 'R', 'SQL', 'MATLAB', 'VBA'] },
  { label: 'ML & Stats', items: ['scikit-learn', 'XGBoost', 'statsmodels', 'ARIMA', 'OLS'] },
  { label: 'Visualization', items: ['Matplotlib', 'Seaborn', 'Power BI', 'Tableau'] },
  { label: 'Finance', items: ['Bloomberg', 'QuantLib', 'FRED API'] },
];

/* ── Constellation data ────────────────────────────────────────────────────── */
const CONSTELLATION_NODES = [
  { id: 'washu',    type: 'edu',      x: 110, y: 120, size: 7,   col: '#8B5CF6',
    label: 'WashU',            sub: 'BS Data Science & Fin. Eng.', date: '2024–2026', highlight: true },
  { id: 'drew',     type: 'edu',      x: 75,  y: 245, size: 5,   col: '#8B5CF6',
    label: 'Drew University',  sub: 'BA Mathematics',               date: '2021–2023' },
  { id: 'harrison', type: 'edu',      x: 130, y: 365, size: 4,   col: '#8B5CF6',
    label: 'Harrison College', sub: 'Cambridge A-Levels',           date: '2015–2021' },
  { id: 'amphora',  type: 'work',     x: 330, y: 160, size: 5,   col: '#00D4FF',
    label: 'Amphora',          sub: 'Data Scientist Intern',         date: '2024' },
  { id: 'pead',     type: 'research', x: 510, y: 105, size: 5.5, col: '#00E5A0',
    label: 'PEAD Research',    sub: 'Market Efficiency',             date: '2024–Present' },
  { id: 'quant',    type: 'research', x: 555, y: 245, size: 5,   col: '#00E5A0',
    label: 'Quant Trading',    sub: 'Algorithmic Strategies',        date: '2023–Present' },
  { id: 'duke',     type: 'research', x: 450, y: 350, size: 3.5, col: '#00E5A0',
    label: 'Duke of Edinburgh',sub: 'Expedition Research',           date: '2019–2021' },
];

const CONSTELLATION_EDGES = [
  { from: 'harrison', to: 'drew' },
  { from: 'drew',     to: 'washu' },
  { from: 'washu',    to: 'amphora' },
  { from: 'washu',    to: 'pead' },
  { from: 'amphora',  to: 'quant' },
  { from: 'pead',     to: 'quant' },
  { from: 'drew',     to: 'duke' },
  { from: 'duke',     to: 'quant' },
];

/* ── typing cursor hook ───────────────────────────────────────────────────── */
const ROLE_TEXT = 'Data Science & Financial Engineering // WashU // Available May 2026';

/* ── animations ───────────────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const stagger = (i, base = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay: base + i * 0.08, ease: [0.22, 1, 0.36, 1] },
});

/* ── interest card (preserved from original) ──────────────────────────────── */
function InterestCard({ interest, index }) {
  const Icon = interest.icon;
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const rx = (ny - 0.5) * -12;
    const ry = (nx - 0.5) * 16;
    const sx = (nx * 100).toFixed(1);
    const sy = (ny * 100).toFixed(1);
    const inner = cardRef.current?.querySelector('.interest-card-inner');
    if (inner) {
      inner.style.setProperty('--rx', `${rx}deg`);
      inner.style.setProperty('--ry', `${ry}deg`);
      inner.style.setProperty('--sx', `${sx}%`);
      inner.style.setProperty('--sy', `${sy}%`);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const inner = cardRef.current?.querySelector('.interest-card-inner');
    if (inner) {
      inner.style.setProperty('--rx', '0deg');
      inner.style.setProperty('--ry', '0deg');
      inner.style.setProperty('--sx', '50%');
      inner.style.setProperty('--sy', '50%');
    }
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...stagger(index, 0.2)}
      className="group relative overflow-hidden rounded-xl"
      style={{ perspective: '900px' }}
    >
      <motion.div
        className="absolute top-0 left-0 right-0 h-px origin-left z-20"
        style={{ background: 'linear-gradient(90deg, transparent, #00D4FF, #8B5CF6, transparent)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: index * 0.12 + 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <div
        className="interest-card-inner relative border border-[rgba(0_212_255_/_0.08)] bg-[#080E1C]/65 p-7 rounded-xl overflow-hidden transition-colors duration-500 group-hover:border-[rgba(0_212_255_/_0.25)] flex gap-5 items-start"
        style={{
          transform: 'perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))',
          transition: 'transform 0.12s ease',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'radial-gradient(220px circle at var(--sx,50%) var(--sy,50%), rgba(0,212,255,0.08) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.05) 0%, transparent 70%)' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4 + index * 0.9, repeat: Infinity, ease: 'easeInOut', delay: index * 0.7 }}
          aria-hidden="true"
        />
        <div className="flex-shrink-0 relative">
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{ background: 'rgba(0,212,255,0.2)', willChange: 'transform, opacity' }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: index * 0.8 }}
            aria-hidden="true"
          />
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center relative z-10 group-hover:bg-accent/20 transition-colors">
            <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
          </div>
        </div>
        <div className="relative z-10">
          <h3 className="font-serif font-bold text-base text-foreground mb-1.5 group-hover:text-accent/90 transition-colors">
            {interest.title}
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            {interest.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Hex Grid Tech Stack ──────────────────────────────────────────── */
const HEX_CELLS = [
  { id: 'python',      label: 'Python',      cat: 'Languages',   col: '#8B5CF6' },
  { id: 'r',           label: 'R',           cat: 'Languages',   col: '#8B5CF6' },
  { id: 'sql',         label: 'SQL',         cat: 'Languages',   col: '#8B5CF6' },
  { id: 'matlab',      label: 'MATLAB',      cat: 'Languages',   col: '#8B5CF6' },
  { id: 'vba',         label: 'VBA',         cat: 'Languages',   col: '#8B5CF6' },
  { id: 'sklearn',     label: 'sklearn',     cat: 'ML & Stats',  col: '#00D4FF' },
  { id: 'xgboost',     label: 'XGBoost',     cat: 'ML & Stats',  col: '#00D4FF' },
  { id: 'statsmodels', label: 'statsmodels', cat: 'ML & Stats',  col: '#00D4FF' },
  { id: 'arima',       label: 'ARIMA',       cat: 'ML & Stats',  col: '#00D4FF' },
  { id: 'ols',         label: 'OLS',         cat: 'ML & Stats',  col: '#00D4FF' },
  { id: 'matplotlib',  label: 'Matplotlib',  cat: 'Viz',         col: '#00E5A0' },
  { id: 'seaborn',     label: 'Seaborn',     cat: 'Viz',         col: '#00E5A0' },
  { id: 'powerbi',     label: 'Power BI',    cat: 'Viz',         col: '#00E5A0' },
  { id: 'tableau',     label: 'Tableau',     cat: 'Viz',         col: '#00E5A0' },
  { id: 'bloomberg',   label: 'Bloomberg',   cat: 'Finance',     col: '#F59E0B' },
  { id: 'quantlib',    label: 'QuantLib',    cat: 'Finance',     col: '#F59E0B' },
  { id: 'fredapi',     label: 'FRED API',    cat: 'Finance',     col: '#F59E0B' },
];

const HEX_LEGEND = [
  { cat: 'Languages', col: '#8B5CF6' },
  { cat: 'ML & Stats', col: '#00D4FF' },
  { cat: 'Viz', col: '#00E5A0' },
  { cat: 'Finance', col: '#F59E0B' },
];

function HexGrid() {
  const [hovered, setHovered] = useState(null);

  // Flat-top hexagon geometry
  // size = circumradius; w = 2*size; h = sqrt(3)*size
  const SIZE = 44;
  const W = SIZE * 2;
  const H = Math.sqrt(3) * SIZE;
  const COLS = 5;

  // Arrange cells in offset-column hex grid
  const cellPositions = HEX_CELLS.map((cell, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const xOffset = col % 2 === 1 ? H / 2 : 0; // odd columns shifted down
    const x = col * (H * 0.92);
    const y = row * (SIZE * 1.55) + xOffset;
    return { ...cell, x, y };
  });

  const svgW = COLS * H * 0.92 + H * 0.1;
  const rows = Math.ceil(HEX_CELLS.length / COLS);
  const svgH = rows * SIZE * 1.55 + SIZE;

  // Flat-top hex points
  function hexPoints(cx, cy, r) {
    return Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 180) * (60 * i);
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
  }

  return (
    <div>
      <motion.p
        {...fadeUp(0)}
        className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-1"
      >
        Tech Stack
      </motion.p>
      <motion.p
        {...fadeUp(0.05)}
        className="font-mono text-[9px] uppercase tracking-[0.3em] mb-5"
        style={{ color: 'rgba(0,212,255,0.35)' }}
      >
        HEX.GRID.v1 · {HEX_CELLS.length} NODES
      </motion.p>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-5">
        {HEX_LEGEND.map(({ cat, col }) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: col, boxShadow: `0 0 5px ${col}88` }} />
            <span className="font-mono text-[9px] uppercase tracking-[0.15em]" style={{ color: `${col}99` }}>{cat}</span>
          </div>
        ))}
      </div>

      <motion.div
        {...fadeUp(0.1)}
        style={{ overflowX: 'auto' }}
      >
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          style={{ width: '100%', maxWidth: `${svgW}px`, height: 'auto', overflow: 'visible' }}
          fill="none"
        >
          <defs>
            <filter id="hexGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" in="SourceGraphic" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {cellPositions.map((cell, i) => {
            const cx = cell.x + H / 2;
            const cy = cell.y + SIZE;
            const isHov = hovered === cell.id;
            const pts = hexPoints(cx, cy, SIZE - 3);

            return (
              <motion.g
                key={cell.id}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={{ cursor: 'default', transformOrigin: `${cx}px ${cy}px` }}
                onMouseEnter={() => setHovered(cell.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Hex background */}
                <polygon
                  points={pts}
                  fill={isHov ? `${cell.col}18` : 'rgba(8,14,28,0.85)'}
                  stroke={isHov ? cell.col : `${cell.col}33`}
                  strokeWidth={isHov ? 1.5 : 0.8}
                  filter={isHov ? 'url(#hexGlow)' : undefined}
                  style={{ transition: 'fill 0.2s, stroke 0.2s, stroke-width 0.2s' }}
                />

                {/* Corner dots */}
                {isHov && Array.from({ length: 6 }, (_, vi) => {
                  const angle = (Math.PI / 180) * (60 * vi);
                  const dx = cx + (SIZE - 3) * Math.cos(angle);
                  const dy = cy + (SIZE - 3) * Math.sin(angle);
                  return <circle key={vi} cx={dx} cy={dy} r={1.5} fill={cell.col} opacity={0.8} />;
                })}

                {/* Label */}
                <text
                  x={cx}
                  y={cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={8.5}
                  fontFamily="var(--font-jetbrains), 'Courier New', monospace"
                  letterSpacing="0.08em"
                  fill={isHov ? cell.col : `${cell.col}BB`}
                  style={{ transition: 'fill 0.2s', textTransform: 'uppercase', userSelect: 'none' }}
                >
                  {cell.label.length > 8 ? cell.label.substring(0, 8) : cell.label}
                </text>

                {/* Category dot at top */}
                <circle
                  cx={cx}
                  cy={cy - SIZE + 8}
                  r={1.8}
                  fill={isHov ? cell.col : `${cell.col}55`}
                  style={{ transition: 'fill 0.2s' }}
                />
              </motion.g>
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}

/* ── Constellation Blueprint ──────────────────────────────────────── */

function ConstellationBlueprint({ onSelectExperience }) {
  const [revealed, setRevealed] = useState(new Set());
  const [hoveredNode, setHoveredNode] = useState(null);
  const [edgeProgress, setEdgeProgress] = useState(0);
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: '-10%' });

  useEffect(() => {
    if (!inView) return;
    // Reveal nodes with stagger
    CONSTELLATION_NODES.forEach((node, i) => {
      setTimeout(() => {
        setRevealed(prev => new Set([...prev, node.id]));
      }, 300 + i * 250);
    });
    // Animate edge progress
    const start = performance.now();
    const EDGE_DUR = 3500;
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / EDGE_DUR, 1);
      setEdgeProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setTimeout(() => { raf = requestAnimationFrame(tick); }, 500);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const getNode = (id) => CONSTELLATION_NODES.find(n => n.id === id);

  const VBW = 680;
  const VBH = 430;

  // Experience lookup for clickable nodes
  const EXP_IDS = {
    amphora: 'amphora',
    pead: 'pead-research',
    quant: 'quant-research',
  };

  return (
    <section className="px-6 lg:px-16 py-12" aria-label="Education and Research">
      <div className="max-w-5xl mx-auto">
        <motion.p
          {...fadeUp(0)}
          className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-1 flex items-center gap-2"
        >
          <GraduationCap className="h-3.5 w-3.5 text-accent" />
          Education &amp; Research Path
        </motion.p>
        <motion.p
          {...fadeUp(0.05)}
          className="font-mono text-[9px] uppercase tracking-[0.3em] mb-8"
          style={{ color: 'rgba(0,212,255,0.35)' }}
        >
          CONSTELLATION.BLUEPRINT · {CONSTELLATION_NODES.length} STARS · {CONSTELLATION_EDGES.length} CONNECTIONS
        </motion.p>

        {/* Legend */}
        <div className="flex flex-wrap gap-5 mb-8">
          {[
            { label: 'Education', col: '#8B5CF6' },
            { label: 'Professional', col: '#00D4FF' },
            { label: 'Research', col: '#00E5A0' },
          ].map(({ label, col }) => (
            <div key={label} className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="4" fill={col} opacity={0.8} />
                <circle cx="7" cy="7" r="6" fill="none" stroke={col} strokeWidth="0.8" opacity={0.4} />
              </svg>
              <span className="font-mono text-[9px] uppercase tracking-[0.15em]" style={{ color: `${col}99` }}>{label}</span>
            </div>
          ))}
        </div>

        <div ref={containerRef} className="relative">
          {/* SVG constellation - desktop */}
          <div className="hidden md:block">
            <svg
              viewBox={`0 0 ${VBW} ${VBH}`}
              style={{ width: '100%', height: 'auto', overflow: 'visible' }}
              fill="none"
            >
              <defs>
                <filter id="starGlow" x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="4" result="b" in="SourceGraphic" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="starGlowBig" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="7" result="b" in="SourceGraphic" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Background star field */}
                <pattern id="starfield" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="15" r="0.5" fill="rgba(255,255,255,0.04)" />
                  <circle cx="35" cy="8" r="0.4" fill="rgba(139,92,246,0.06)" />
                  <circle cx="50" cy="40" r="0.5" fill="rgba(0,212,255,0.05)" />
                  <circle cx="20" cy="50" r="0.3" fill="rgba(255,255,255,0.03)" />
                  <circle cx="45" cy="25" r="0.4" fill="rgba(0,229,160,0.04)" />
                </pattern>
              </defs>

              {/* Star field background */}
              <rect width={VBW} height={VBH} fill="url(#starfield)" />

              {/* Cluster labels */}
              <text x="110" y="55" textAnchor="middle" fontSize={7}
                fontFamily="var(--font-jetbrains), 'Courier New', monospace"
                letterSpacing="0.25em" fill="rgba(139,92,246,0.25)">
                {'[ EDUCATION ]'}
              </text>
              <text x="510" y="55" textAnchor="middle" fontSize={7}
                fontFamily="var(--font-jetbrains), 'Courier New', monospace"
                letterSpacing="0.25em" fill="rgba(0,229,160,0.25)">
                {'[ RESEARCH ]'}
              </text>
              <text x="340" y="55" textAnchor="middle" fontSize={7}
                fontFamily="var(--font-jetbrains), 'Courier New', monospace"
                letterSpacing="0.25em" fill="rgba(0,212,255,0.25)">
                {'[ WORK ]'}
              </text>

              {/* Edges */}
              {CONSTELLATION_EDGES.map((edge, ei) => {
                const from = getNode(edge.from);
                const to = getNode(edge.to);
                if (!from || !to) return null;
                const edgeThreshold = ei / CONSTELLATION_EDGES.length;
                const visible = edgeProgress > edgeThreshold;
                if (!visible) return null;
                const localP = Math.min((edgeProgress - edgeThreshold) / (1 / CONSTELLATION_EDGES.length), 1);
                // Determine color based on node types
                const isEduEdge = from.type === 'edu' && to.type === 'edu';
                const isResEdge = to.type === 'research';
                const strokeCol = isEduEdge ? 'rgba(139,92,246,0.25)' : isResEdge ? 'rgba(0,229,160,0.2)' : 'rgba(0,212,255,0.2)';

                return (
                  <line
                    key={`${edge.from}-${edge.to}`}
                    x1={from.x} y1={from.y}
                    x2={from.x + (to.x - from.x) * localP}
                    y2={from.y + (to.y - from.y) * localP}
                    stroke={strokeCol}
                    strokeWidth={0.8}
                    strokeDasharray="4 3"
                  />
                );
              })}

              {/* Nodes */}
              {CONSTELLATION_NODES.map((node, ni) => {
                const isRevealed = revealed.has(node.id);
                const isHov = hoveredNode === node.id;
                const isClickable = !!EXP_IDS[node.id];

                return (
                  <g
                    key={node.id}
                    style={{ cursor: isClickable ? 'pointer' : 'default' }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => {
                      if (isClickable && onSelectExperience) {
                        // find experience by id from experiences data - handled by parent
                      }
                    }}
                  >
                    {isRevealed && (
                      <>
                        {/* Outer ring */}
                        <circle
                          cx={node.x} cy={node.y}
                          r={node.size + (isHov ? 6 : 4)}
                          fill="none"
                          stroke={node.col}
                          strokeWidth={0.5}
                          opacity={isHov ? 0.5 : 0.15}
                          style={{ transition: 'r 0.2s, opacity 0.2s' }}
                        />
                        {/* Star core */}
                        <circle
                          cx={node.x} cy={node.y}
                          r={isHov ? node.size + 1.5 : node.size}
                          fill={isHov ? node.col : `${node.col}CC`}
                          filter={node.highlight || isHov ? 'url(#starGlowBig)' : 'url(#starGlow)'}
                          style={{ transition: 'r 0.2s, fill 0.2s' }}
                        />
                        {/* Cross hair on highlight nodes */}
                        {node.highlight && (
                          <>
                            <line x1={node.x - 12} y1={node.y} x2={node.x + 12} y2={node.y}
                              stroke={node.col} strokeWidth={0.5} opacity={0.3} />
                            <line x1={node.x} y1={node.y - 12} x2={node.x} y2={node.y + 12}
                              stroke={node.col} strokeWidth={0.5} opacity={0.3} />
                          </>
                        )}

                        {/* Label */}
                        <text
                          x={node.x + node.size + 8}
                          y={node.y - 4}
                          fontSize={8.5}
                          fontFamily="var(--font-jetbrains), 'Courier New', monospace"
                          fill={isHov ? node.col : `${node.col}DD`}
                          letterSpacing="0.06em"
                          style={{ transition: 'fill 0.2s', userSelect: 'none' }}
                        >
                          {node.label}
                        </text>
                        <text
                          x={node.x + node.size + 8}
                          y={node.y + 8}
                          fontSize={7}
                          fontFamily="var(--font-jetbrains), 'Courier New', monospace"
                          fill={`${node.col}77`}
                          letterSpacing="0.04em"
                          style={{ userSelect: 'none' }}
                        >
                          {node.sub}
                        </text>
                        <text
                          x={node.x + node.size + 8}
                          y={node.y + 19}
                          fontSize={6.5}
                          fontFamily="var(--font-jetbrains), 'Courier New', monospace"
                          fill={`${node.col}55`}
                          letterSpacing="0.06em"
                          style={{ userSelect: 'none' }}
                        >
                          {node.date}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Mobile fallback: simple vertical list */}
          <div className="md:hidden">
            <div className="mb-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/60 mb-4">Education</p>
              <div className="relative border-l border-border pl-6 flex flex-col gap-0">
                {education.map((edu, i) => (
                  <motion.article key={edu.school} {...stagger(i, 0.1)} className="py-5 relative">
                    <div className="absolute left-[-26px] top-7 w-2 h-2">
                      <div className="absolute inset-0 rounded-full bg-accent/50 border border-background" />
                    </div>
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent mb-1">{edu.years}</p>
                    <h3 className="font-sans font-bold text-sm text-foreground mb-0.5">{edu.school}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{edu.degree}</p>
                  </motion.article>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/60 mb-4">Research</p>
              <div className="relative border-l border-border pl-6 flex flex-col gap-0">
                {researchExps.map((exp, i) => (
                  <motion.article key={exp.id} {...stagger(i, 0.1)}
                    className="py-5 relative group cursor-pointer"
                    onClick={() => onSelectExperience && onSelectExperience(exp)}
                  >
                    <div className="absolute left-[-26px] top-7 w-2 h-2">
                      <div className="absolute inset-0 rounded-full bg-[#00E5A0]/50 border border-background" />
                    </div>
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#00E5A0] mb-1">{exp.date}</p>
                    <h3 className="font-sans font-bold text-sm text-foreground mb-0.5 group-hover:text-[#00E5A0] transition-colors">{exp.title}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{exp.organization}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Research Signal Matrix ───────────────────────────────────────── */

function ResearchMatrix() {
  const [hovered, setHovered] = useState(null);

  const ROW_COLORS = ['#8B5CF6', '#00D4FF', '#00E5A0'];

  return (
    <section className="px-6 lg:px-16 py-12" aria-label="Research Focus Areas">
      <div className="max-w-5xl mx-auto">
        <motion.p
          {...fadeUp(0)}
          className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-1 flex items-center gap-2"
        >
          <FlaskConical className="h-3.5 w-3.5 text-accent" />
          Research Focus Areas
        </motion.p>
        <motion.p
          {...fadeUp(0.05)}
          className="font-mono text-[9px] uppercase tracking-[0.3em] mb-8"
          style={{ color: 'rgba(0,212,255,0.35)' }}
        >
          SIGNAL.MATRIX · {researchFocusAreas.length} DOMAINS
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {researchFocusAreas.map((area, i) => {
            const rowColor = ROW_COLORS[Math.floor(i / 3)];
            const isHov = hovered === i;

            return (
              <motion.div
                key={area}
                {...stagger(i, 0.05)}
                className="relative overflow-hidden"
                style={{
                  background: isHov ? `${rowColor}0D` : 'rgba(8,14,28,0.6)',
                  border: `1px solid ${isHov ? rowColor + '44' : rowColor + '18'}`,
                  borderRadius: '4px',
                  cursor: 'default',
                  transition: 'background 0.25s, border-color 0.25s',
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: isHov
                      ? `linear-gradient(90deg, transparent, ${rowColor}, transparent)`
                      : `linear-gradient(90deg, transparent, ${rowColor}44, transparent)`,
                    transition: 'background 0.25s',
                  }}
                />

                {/* Scan line */}
                {isHov && (
                  <motion.div
                    className="absolute left-0 right-0 h-px pointer-events-none"
                    style={{ background: `${rowColor}22` }}
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                  />
                )}

                <div className="p-4 flex items-center gap-3">
                  {/* Indicator */}
                  <div
                    className="flex-shrink-0 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: rowColor,
                      boxShadow: isHov ? `0 0 8px ${rowColor}` : 'none',
                      transition: 'box-shadow 0.25s',
                    }}
                  />

                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.2em]"
                    style={{
                      color: isHov ? rowColor : `${rowColor}99`,
                      transition: 'color 0.25s',
                    }}
                  >
                    {area}
                  </span>

                  {/* Index */}
                  <span
                    className="ml-auto font-mono text-[8px] flex-shrink-0"
                    style={{ color: `${rowColor}44` }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── main component ───────────────────────────────────────────────────────── */
export default function AboutContent() {
  const [selectedExperience, setSelectedExperience] = useState(null);

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Personal Data Profile Header
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative text-center px-6 overflow-hidden pt-32 pb-16"
        aria-label="About hero"
      >
        {/* Decorative floating symbols */}
        {['>', '//', '{', '}', 'fn', '::'].map((sym, i) => (
          <motion.span
            key={i}
            className="font-mono absolute select-none pointer-events-none"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.75rem)',
              color: i % 2 === 0 ? 'rgba(139,92,246,0.06)' : 'rgba(0,212,255,0.05)',
              top: `${15 + i * 12}%`,
              [i % 2 === 0 ? 'left' : 'right']: `${4 + i * 2}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, i % 2 === 0 ? -8 : 8, 0] }}
            transition={{
              opacity: { delay: 1 + i * 0.15, duration: 1 },
              y: { duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            aria-hidden="true"
          >
            {sym}
          </motion.span>
        ))}

        {/* Status indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-muted mb-6 relative z-10"
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-[#00E5A0]"
            animate={{ opacity: [1, 0.4, 1], boxShadow: ['0 0 0px rgba(0,229,160,0)', '0 0 12px rgba(0,229,160,0.6)', '0 0 0px rgba(0,229,160,0)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          sys.profile.loaded
        </motion.div>

        {/* Name with gradient */}
        <h1 className="relative z-10">
          <span
            className="font-serif font-bold text-foreground will-change-transform block"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #F9FAFB 0%, #8B5CF6 50%, #00D4FF 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            <TextReveal splitBy="word" delay={0.3} staggerDelay={0.12} center>
              DMITRI DE FREITAS
            </TextReveal>
          </span>
        </h1>

        {/* Typed role description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-5 relative z-10"
        >
          <span
            className="font-mono text-xs uppercase tracking-[0.35em] inline-block"
            style={{
              color: '#00D4FF',
              textShadow: '0 0 20px rgba(0,212,255,0.5)',
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {ROLE_TEXT}
            </motion.span>
            <motion.span
              className="inline-block ml-0.5"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ color: '#8B5CF6' }}
            >
              _
            </motion.span>
          </span>
        </motion.div>

        {/* Honor badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-5 flex flex-wrap justify-center gap-2 relative z-10"
        >
          {["Dean's List", 'GPA 3.7'].map((honor, i) => (
            <motion.span
              key={honor}
              className="font-mono text-xs uppercase tracking-[0.2em] text-accent bg-surface border border-accent/25 rounded px-3 py-1"
              style={{ boxShadow: '0 0 10px rgba(139,92,246,0.35)' }}
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 + i * 1.4 }}
            >
              {honor}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SYSTEM METRICS — Stats Grid
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-16 pb-12" aria-label="System metrics">
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeUp(0.1)}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {aboutKpiMetrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                {...stagger(i)}
                className="relative border border-border rounded-xl p-5 bg-surface/50 overflow-hidden group"
              >
                {/* Top accent line */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, #8B5CF6, #00D4FF, transparent)' }}
                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
                {/* Ambient glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06), transparent 70%)' }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
                />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted mb-2 relative z-10">
                  {metric.label}
                </p>
                <p
                  className="font-serif font-bold text-2xl md:text-3xl relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #F9FAFB, #8B5CF6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {metric.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BIO — Terminal Output Block
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-16 py-12" aria-label="Background">
        <div className="max-w-5xl mx-auto">
          <motion.p
            {...fadeUp(0)}
            className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6 flex items-center gap-2"
          >
            <Terminal className="h-3.5 w-3.5 text-accent" />
            Background
          </motion.p>

          <motion.div
            {...fadeUp(0.1)}
            className="relative rounded-xl overflow-hidden"
          >
            {/* Terminal-style header bar */}
            <div className="flex items-center gap-2 px-5 py-3 bg-[#080E1C] border border-border border-b-0 rounded-t-xl">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]/70" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/70" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]/70" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60 ml-3">
                profile.bio
              </span>
            </div>

            {/* Bio content */}
            <div className="border border-border border-t-0 rounded-b-xl bg-[#080E1C]/40 p-6 md:p-8">
              <div className="border-l-2 border-accent/30 pl-6 flex flex-col gap-5">
                {storyParagraphs.map((para, i) => (
                  <motion.div
                    key={i}
                    {...stagger(i, 0.2)}
                    className="flex gap-3"
                  >
                    <span className="font-mono text-xs text-accent/40 mt-1 flex-shrink-0 select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm md:text-base text-muted leading-relaxed font-sans">
                      {para}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SKILLS — Category Badges + Proficiency Bars
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-16 py-12" aria-label="Skills">
        <div className="max-w-5xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 items-start">
            {/* Left: Proficiency bars */}
            <div>
              <motion.p
                {...fadeUp(0)}
                className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6"
              >
                Proficiency
              </motion.p>
              <div className="flex flex-col gap-7 mb-10 lg:mb-0">
                {skillCategories.map((cat, ci) => (
                  <motion.div
                    key={cat.name}
                    {...stagger(ci)}
                  >
                    <div className="flex justify-between items-baseline mb-3">
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                        {cat.name}
                      </p>
                      <span className="font-mono text-xs text-accent/70">
                        {cat.proficiency}%
                      </span>
                    </div>
                    <div className="h-[2px] bg-surface rounded relative overflow-hidden">
                      <motion.div
                        className="h-full rounded"
                        style={{ background: 'linear-gradient(90deg, #8B5CF6, #00D4FF)' }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: ci * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Skill category badges */}
            <div>
              <motion.p
                {...fadeUp(0)}
                className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6"
              >
                Tech Stack
              </motion.p>
              <div className="flex flex-col gap-6">
                {skillBadgeCategories.map((group, gi) => (
                  <motion.div key={group.label} {...stagger(gi)}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/60 mb-2">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="font-mono text-xs uppercase tracking-[0.15em] text-muted border border-border rounded-lg px-3 py-1.5 bg-surface/30 hover:border-accent/30 hover:text-foreground transition-all duration-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          EDUCATION TIMELINE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-16 py-12" aria-label="Education">
        <div className="max-w-5xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 items-start">
            <div>
              <motion.p
                {...fadeUp(0)}
                className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6 flex items-center gap-2"
              >
                <GraduationCap className="h-3.5 w-3.5 text-accent" />
                Education
              </motion.p>
              <div className="relative border-l border-border pl-8 flex flex-col gap-0">
                {education.map((edu, i) => (
                  <motion.article
                    key={edu.school}
                    {...stagger(i, 0.1)}
                    className="py-7 relative"
                  >
                    {/* Timeline dot with pulse */}
                    <div className="absolute left-[-34px] top-9 w-2.5 h-2.5">
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: 'rgba(139,92,246,0.4)', willChange: 'transform, opacity' }}
                        animate={{ scale: [1, 2.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut', delay: i * 1.2 }}
                      />
                      <div className="absolute inset-0 rounded-full bg-accent/60 border-2 border-background" />
                    </div>
                    <motion.p
                      className="font-mono text-xs uppercase tracking-[0.25em] text-accent mb-1.5"
                      animate={{ opacity: [1, 0.6, 1] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: i * 2 }}
                    >
                      {edu.years}
                    </motion.p>
                    <h3 className="font-sans font-bold text-base md:text-lg text-foreground mb-1">
                      {edu.school}
                    </h3>
                    {edu.department && (
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-1">
                        {edu.department}
                      </p>
                    )}
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
                      {edu.degree}
                    </p>
                    {edu.honors && edu.honors.length > 0 && (
                      <ul className="flex flex-col gap-1">
                        {edu.honors.map((h) => (
                          <li key={h} className="font-mono text-xs uppercase tracking-[0.15em] text-muted flex items-start gap-2">
                            <span className="text-accent/40 mt-0.5">·</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.article>
                ))}
              </div>
            </div>

            {/* Professional Experience */}
            <div>
              <motion.p
                {...fadeUp(0)}
                className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6 flex items-center gap-2"
              >
                <Briefcase className="h-3.5 w-3.5 text-accent" />
                Professional Experience
              </motion.p>
              <div className="relative border-l border-border pl-8 flex flex-col gap-0">
                {financeExps.map((exp, i) => (
                  <motion.article
                    key={exp.id}
                    {...stagger(i)}
                    className="py-7 relative group cursor-pointer bg-transparent hover:bg-surface/60 transition-all rounded-xl px-5 -mx-5"
                    role="button"
                    tabIndex={0}
                    data-cursor="expand"
                    onClick={() => setSelectedExperience(exp)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedExperience(exp)}
                  >
                    <div className="absolute left-[-34px] top-9 w-2.5 h-2.5">
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: 'rgba(139,92,246,0.4)', willChange: 'transform, opacity' }}
                        animate={{ scale: [1, 2.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: i * 0.9 }}
                      />
                      <div className="absolute inset-0 rounded-full border-2 border-background" style={{ backgroundColor: 'rgba(139,92,246,0.5)' }} />
                    </div>
                    <motion.p
                      className="font-mono text-xs uppercase tracking-[0.25em] mb-2 text-accent"
                      animate={{ opacity: [1, 0.6, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
                    >
                      {exp.date}
                    </motion.p>
                    <h3 className="font-sans font-bold text-base md:text-lg text-foreground mb-1 group-hover:text-accent transition-colors leading-snug">
                      {exp.title}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">
                      {exp.organization}
                    </p>
                    <p className="text-[12px] text-muted leading-relaxed max-w-sm line-clamp-2">
                      {exp.shortDescription}
                    </p>
                    <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/50 group-hover:text-accent mt-2 transition-colors">
                      View details <ChevronRight className="h-3 w-3" />
                    </span>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          RESEARCH — Full width
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-16 py-12" aria-label="Research">
        <div className="max-w-5xl mx-auto">
          <motion.p
            {...fadeUp(0)}
            className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6 flex items-center gap-2"
          >
            <FlaskConical className="h-3.5 w-3.5 text-accent" />
            Research
          </motion.p>
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
            <div className="relative border-l border-border pl-8 flex flex-col gap-0">
              {researchExps.map((exp, i) => (
                <motion.article
                  key={exp.id}
                  {...stagger(i)}
                  className="py-8 relative group cursor-pointer bg-transparent hover:bg-surface/60 transition-all rounded-xl px-5 -mx-5"
                  role="button"
                  tabIndex={0}
                  data-cursor="expand"
                  onClick={() => setSelectedExperience(exp)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedExperience(exp)}
                >
                  <div className="absolute left-[-34px] top-10 w-2.5 h-2.5">
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: 'rgba(139,92,246,0.4)', willChange: 'transform, opacity' }}
                      animate={{ scale: [1, 2.8, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: i * 1.1 }}
                    />
                    <div className="absolute inset-0 rounded-full bg-accent/50 border-2 border-background group-hover:bg-accent transition-colors" />
                  </div>
                  <motion.p
                    className="font-mono text-xs uppercase tracking-[0.25em] text-accent mb-2"
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 1.8 }}
                  >
                    {exp.date}
                  </motion.p>
                  <h3 className="font-sans font-bold text-lg md:text-xl text-foreground mb-1 group-hover:text-accent transition-colors leading-snug">
                    {exp.title}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
                    {exp.organization}
                  </p>
                  <p className="text-[13px] text-muted leading-relaxed max-w-md line-clamp-2">
                    {exp.shortDescription}
                  </p>
                  <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/50 group-hover:text-accent mt-2 transition-colors">
                    View details <ChevronRight className="h-3 w-3" />
                  </span>
                </motion.article>
              ))}
            </div>

            {/* Research focus pills */}
            <div className="mt-10 lg:mt-0">
              <motion.p
                {...fadeUp(0)}
                className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6"
              >
                Research Focus Areas
              </motion.p>
              <div className="flex flex-wrap gap-2">
                {researchFocusAreas.map((area, i) => (
                  <motion.span
                    key={area}
                    {...stagger(i, 0.1)}
                    className="font-mono text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border border-border bg-surface/30 text-muted hover:border-[#00D4FF]/30 hover:text-[#00D4FF] transition-all duration-300 cursor-default"
                  >
                    {area}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PHILOSOPHY QUOTE
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-6 flex items-center justify-center"
        aria-label="Philosophy"
      >
        <blockquote className="max-w-2xl text-center relative">
          {/* Decorative quotation marks */}
          <motion.span
            className="absolute -top-6 -left-4 font-serif text-6xl text-accent/10 select-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            aria-hidden="true"
          >
            &ldquo;
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-serif italic text-subhead text-foreground leading-relaxed"
          >
            &ldquo;In God we trust. All others must bring data.&rdquo;
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="font-mono text-xs uppercase tracking-[0.3em] text-muted mt-6"
          >
            &mdash; W. Edwards Deming
          </motion.p>
        </blockquote>
      </section>



      {/* ── Experience Modal ───────────────────────────────────────────────── */}
      {selectedExperience && (
        <ExperienceModal
          experience={selectedExperience}
          isOpen={!!selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}

      {/* ── Let's Get in Touch (CTA) ─────────────────────────────────────────── */}
      <CTASection />
    </>
  );
}
