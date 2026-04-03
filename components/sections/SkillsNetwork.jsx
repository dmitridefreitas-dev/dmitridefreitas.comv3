'use client';
import { useState, useRef, useEffect, useCallback, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkillDetailModal from '@/components/modals/SkillDetailModal';
import ProjectDetailModal from '@/components/modals/ProjectDetailModal';
import { skillsData } from '@/data/skills';
import { allProjects } from '@/data/projects';
import { ActiveSceneContext } from '@/components/layout/ZWormhole';

/* ─── Network topology ─────────────────────────────────────────────── */
const INPUT_NODES = [
  { id: 'cat-prog',  label: 'Programming\n& Scripting', x: 105, y: 120 },
  { id: 'cat-viz',   label: 'Data\nVisualization',      x: 105, y: 260 },
  { id: 'cat-fin',   label: 'Financial\nTools',          x: 105, y: 400 },
];

const OUTPUT_NODES = [
  { id: 'out-quant',  label: 'Quant\nFinance',     x: 995, y: 120 },
  { id: 'out-ml',     label: 'Machine\nLearning',   x: 995, y: 260 },
  { id: 'out-da',     label: 'Data\nEngineering',   x: 995, y: 400 },
];

const SKILL_POSITIONS = {
  python:     { x: 340, y:  90 },
  r:          { x: 340, y: 170 },
  sql:        { x: 340, y: 270 },
  matlab:     { x: 340, y: 370 },
  vba:        { x: 340, y: 450 },
  git:        { x: 340, y: 530 },
  matplotlib: { x: 660, y:  90 },
  powerbi:    { x: 660, y: 170 },
  tableau:    { x: 660, y: 270 },
  quantlib:   { x: 660, y: 370 },
  bloomberg:  { x: 660, y: 450 },
  fred:       { x: 660, y: 530 },
};

const EDGES = [
  ['cat-prog', 'python'], ['cat-prog', 'r'], ['cat-prog', 'sql'],
  ['cat-prog', 'matlab'], ['cat-prog', 'vba'], ['cat-prog', 'git'],
  ['cat-viz',  'matplotlib'], ['cat-viz', 'powerbi'], ['cat-viz', 'tableau'],
  ['cat-fin',  'quantlib'], ['cat-fin', 'bloomberg'], ['cat-fin', 'fred'],
  ['python', 'matplotlib'], ['python', 'powerbi'],  ['python', 'quantlib'],
  ['r',      'tableau'],    ['r',      'matplotlib'],
  ['sql',    'bloomberg'],  ['sql',    'fred'],       ['sql',    'powerbi'],
  ['matlab', 'quantlib'],
  ['vba',    'powerbi'],
  ['git',    'tableau'],
  ['matplotlib', 'tableau'],
  ['powerbi', 'bloomberg'],
  ['quantlib', 'bloomberg'],
  ['bloomberg', 'fred'],
  ['python',     'out-ml'],   ['python',     'out-quant'],
  ['r',          'out-ml'],   ['r',          'out-quant'],
  ['sql',        'out-da'],   ['sql',        'out-ml'],
  ['matlab',     'out-quant'],
  ['matplotlib', 'out-ml'],   ['matplotlib', 'out-da'],
  ['powerbi',    'out-da'],
  ['tableau',    'out-da'],
  ['quantlib',   'out-quant'],
  ['bloomberg',  'out-quant'],['bloomberg',  'out-da'],
  ['fred',       'out-da'],   ['fred',       'out-quant'],
];

/* ── Project layer ──────────────────────────────────────────────────── */
const PROJECT_NODES_DATA = {
  'pead':             { label: 'PEAD Research',    category: 'Quant Finance', x: 1390, y: 120 },
  'trading-terminal': { label: 'Trading Terminal', category: 'Quant Finance', x: 1390, y: 255 },
  'housing-price':    { label: 'Housing Price ML', category: 'Data Science',  x: 1390, y: 390 },
  'nfl-win':          { label: 'NFL Win Prob',     category: 'Data Science',  x: 1390, y: 505 },
};

const PROJECT_EDGE_LIST = [
  ['out-quant', 'pead'],
  ['out-quant', 'trading-terminal'],
  ['out-ml',    'housing-price'],
  ['out-ml',    'nfl-win'],
  ['out-da',    'trading-terminal'],
  ['out-da',    'housing-price'],
];

const ALL_EDGES = [...EDGES, ...PROJECT_EDGE_LIST];

const VB_W = 1500;
const VB_H = 610;

function getNode(id) {
  const projData = PROJECT_NODES_DATA[id];
  if (projData) return { id, ...projData, isSkill: false, isProject: true };

  const skill = skillsData.find((s) => s.id === id);
  if (skill) {
    const pos = SKILL_POSITIONS[id] || { x: 500, y: 300 };
    return { id, label: skill.name, ...pos, isSkill: true, skill };
  }
  const inp = INPUT_NODES.find((n) => n.id === id);
  if (inp) return { ...inp, isSkill: false };
  const out = OUTPUT_NODES.find((n) => n.id === id);
  if (out) return { ...out, isSkill: false };
  return null;
}

function getConnectedIds(nodeId) {
  const connected = new Set();
  ALL_EDGES.forEach(([a, b]) => {
    if (a === nodeId) connected.add(b);
    if (b === nodeId) connected.add(a);
  });
  return connected;
}

function Edge({ fromId, toId, active, dimmed }) {
  const from = getNode(fromId);
  const to   = getNode(toId);
  if (!from || !to) return null;

  const isProjectEdge = !!(PROJECT_NODES_DATA[fromId] || PROJECT_NODES_DATA[toId]);
  const opacity = active ? 0.75 : dimmed ? 0.04 : 0.12;
  const strokeW = active ? 1.4 : 0.7;
  const color   = active
    ? (isProjectEdge ? '#00D4FF' : '#8B5CF6')
    : (isProjectEdge ? 'rgba(0,212,255,0.9)' : 'rgba(139,92,246,0.9)');

  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 - 18;
  const d  = `M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`;

  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeW}
      strokeLinecap="round"
      opacity={0.12}
      animate={{ opacity, strokeWidth: strokeW }}
      transition={{ duration: 0.25 }}
    />
  );
}

function Node({ nodeId, hovered, onHover, onLeave, onClick }) {
  const node      = getNode(nodeId);
  const connected = getConnectedIds(nodeId);
  const isHovered = hovered === nodeId;
  const isLinked  = hovered && connected.has(hovered);
  const isDimmed  = hovered && !isHovered && !isLinked;
  const isSkill   = node?.isSkill;

  if (!node) return null;

  const r       = isSkill ? 18 : 12;
  const glowR   = r + 14;
  const lines   = node.label.split('\n');

  const nodeFill   = isHovered ? 'rgba(139,92,246,0.35)' : isLinked ? 'rgba(139,92,246,0.18)' : isDimmed ? 'rgba(8,8,16,0.8)' : 'rgba(139,92,246,0.12)';
  const nodeStroke = isHovered ? '#8B5CF6' : isLinked ? 'rgba(139,92,246,0.6)' : isDimmed ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.4)';
  const textFill   = isHovered ? '#C4B5FD' : isLinked ? 'rgba(196,181,253,0.85)' : isDimmed ? 'rgba(156,163,175,0.2)' : isSkill ? '#F9FAFB' : 'rgba(196,181,253,0.9)';
  const dotFill    = isHovered ? '#C4B5FD' : isDimmed ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.6)';
  const trans      = 'fill 0.2s, stroke 0.2s, opacity 0.2s';

  return (
    <g
      style={{ cursor: isSkill ? 'pointer' : 'default' }}
      onMouseEnter={() => onHover(nodeId)}
      onMouseLeave={onLeave}
      onClick={() => isSkill && onClick(node.skill)}
    >
      <circle
        cx={node.x} cy={node.y} r={isHovered ? glowR + 4 : glowR}
        fill="transparent"
        stroke="rgba(139,92,246,0.18)"
        strokeWidth="1"
        style={{ opacity: isHovered ? 1 : isDimmed ? 0 : 0.5, transition: trans }}
      />

      {!isDimmed && (
        <circle
          cx={node.x} cy={node.y} r={r + 4}
          fill="none"
          stroke="rgba(139,92,246,0.25)"
          strokeWidth="0.8"
          className="animate-pulse-ring"
          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
        />
      )}

      <circle
        cx={node.x} cy={node.y} r={r}
        fill={nodeFill}
        stroke={nodeStroke}
        strokeWidth={isHovered ? 2 : 1}
        style={{
          filter: isHovered ? 'drop-shadow(0 0 8px rgba(139,92,246,0.7))' : 'none',
          transition: trans,
        }}
      />

      {isSkill && (
        <circle
          cx={node.x} cy={node.y} r={4}
          fill={dotFill}
          style={{ transition: trans }}
        />
      )}

      {lines.map((line, li) => {
        const totalLines = lines.length;
        const baseY = node.y + r + 14;
        const lineY  = totalLines === 1
          ? baseY
          : baseY + (li - (totalLines - 1) / 2) * 14;

        return (
          <text
            key={li}
            x={node.x}
            y={lineY}
            textAnchor="middle"
            fontSize={isSkill ? 12 : 11}
            fontFamily="var(--font-jetbrains), monospace"
            letterSpacing="0.06em"
            fontWeight={isHovered ? '700' : '400'}
            fill={textFill}
            style={{ transition: trans }}
          >
            {line}
          </text>
        );
      })}
    </g>
  );
}

/* ─── Project node (right column) ──────────────────────────────────── */
function ProjectNode({ nodeId, hovered, onHover, onLeave, onClick }) {
  const PW = 162;
  const PH = 60;
  const node = PROJECT_NODES_DATA[nodeId];
  if (!node) return null;

  const connected  = getConnectedIds(nodeId);
  const isHovered  = hovered === nodeId;
  const isLinked   = hovered && connected.has(hovered);
  const isDimmed   = hovered && !isHovered && !isLinked;

  const color       = node.category === 'Quant Finance' ? '#00D4FF' : '#8B5CF6';
  const fillColor   = isHovered ? 'rgba(0,212,255,0.10)' : isDimmed ? 'rgba(8,14,28,0.5)' : 'rgba(8,14,28,0.88)';
  const strokeColor = isHovered ? color : isDimmed ? 'rgba(0,212,255,0.04)' : isLinked ? 'rgba(0,212,255,0.38)' : 'rgba(0,212,255,0.18)';
  const textPrimary = isHovered ? '#F9FAFB' : isDimmed ? 'rgba(249,250,251,0.12)' : 'rgba(249,250,251,0.85)';
  const textSec     = isHovered ? color : isDimmed ? 'rgba(0,212,255,0.08)' : 'rgba(0,212,255,0.45)';
  const glow        = isHovered
    ? `drop-shadow(0 0 16px ${color}60)`
    : isLinked ? `drop-shadow(0 0 6px ${color}28)` : 'none';

  return (
    <g style={{ cursor: 'pointer' }} onMouseEnter={() => onHover(nodeId)} onMouseLeave={onLeave} onClick={() => onClick(nodeId)}>
      <rect
        x={node.x - PW / 2} y={node.y - PH / 2}
        width={PW} height={PH} rx={10}
        fill={fillColor} stroke={strokeColor}
        strokeWidth={isHovered ? 1.5 : 1}
        style={{ transition: 'fill 0.25s, stroke 0.25s', filter: glow }}
      />
      <text
        x={node.x} y={node.y - 9}
        textAnchor="middle" fontSize={9}
        fontFamily="var(--font-jetbrains), monospace"
        letterSpacing="0.2em" fill={textSec}
        style={{ transition: 'fill 0.25s' }}
      >
        {node.category.toUpperCase()}
      </text>
      <text
        x={node.x} y={node.y + 11}
        textAnchor="middle" fontSize={12}
        fontFamily="var(--font-jetbrains), monospace"
        fontWeight={isHovered ? '700' : '500'}
        fill={textPrimary}
        style={{ transition: 'fill 0.25s' }}
      >
        {node.label}
      </text>
    </g>
  );
}

/* ─── Robot helper popup ───────────────────────────────────────────── */
function RobotHelper({ onDismiss, active, message }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    const showTimer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(showTimer);
  }, [active]);

  useEffect(() => {
    if (!visible) return;
    const autoHide = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 5000);
    return () => clearTimeout(autoHide);
  }, [visible, onDismiss]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{
            position: 'fixed',
            left: '16px',
            top: '60%',
            transform: 'translateY(-50%)',
            zIndex: 50,
          }}
          className="pointer-events-auto"
        >
          <div
            style={{
              position: 'relative',
              background: 'rgba(22, 14, 36, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '12px',
              padding: '14px 38px 14px 16px',
              boxShadow: '0 0 24px rgba(139, 92, 246, 0.2), 0 0 48px rgba(139, 92, 246, 0.08)',
              maxWidth: '240px',
            }}
          >
            {/* Right-pointing tail */}
            <div
              style={{
                position: 'absolute',
                right: '-8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderLeft: '8px solid rgba(139, 92, 246, 0.4)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                borderLeft: '7px solid rgba(22, 14, 36, 0.85)',
              }}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '6px',
                right: '8px',
                background: 'none',
                border: 'none',
                color: 'rgba(156, 163, 175, 0.6)',
                cursor: 'pointer',
                fontSize: '14px',
                lineHeight: 1,
                padding: '2px 4px',
              }}
              aria-label="Dismiss helper"
            >
              ✕
            </button>

            <p
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '12px',
                lineHeight: '1.5',
                color: 'rgba(196, 181, 253, 0.9)',
                margin: 0,
              }}
            >
              {message ?? '🤖 Hover a skill node to trace its connections'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Demo label shown during tutorial auto-hover ─────────────────── */
function DemoLabel({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            left: '16px',
            top: 'calc(60% + 50px)',
            zIndex: 50,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10px',
              letterSpacing: '0.08em',
              color: 'rgba(139, 92, 246, 0.6)',
              margin: 0,
            }}
          >
            ▶ watching demo
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Mobile vertical network ─────────────────────────────────────── */

const MOB_W = 400;
const MOB_H = 1600;

const MOB_INPUT = [
  { id: 'cat-prog', label: 'Programming\n& Scripting', x: 70,  y: 140 },
  { id: 'cat-viz',  label: 'Data\nVisualization',      x: 200, y: 140 },
  { id: 'cat-fin',  label: 'Financial\nTools',          x: 330, y: 140 },
];

const MOB_LANGS = [
  { id: 'python', label: 'Python',  x: 50,  y: 340 },
  { id: 'r',      label: 'R',       x: 130, y: 340 },
  { id: 'sql',    label: 'SQL',     x: 210, y: 340 },
  { id: 'matlab', label: 'MATLAB',  x: 290, y: 340 },
  { id: 'vba',    label: 'VBA',     x: 360, y: 340 },
  { id: 'git',    label: 'Git',     x: 130, y: 430 },
];

const MOB_TOOLS = [
  { id: 'matplotlib', label: 'Matplotlib', x: 70,  y: 620 },
  { id: 'powerbi',    label: 'Power BI',   x: 200, y: 620 },
  { id: 'tableau',    label: 'Tableau',    x: 330, y: 620 },
  { id: 'quantlib',   label: 'QuantLib',   x: 70,  y: 720 },
  { id: 'bloomberg',  label: 'Bloomberg',  x: 200, y: 720 },
  { id: 'fred',       label: 'FRED',       x: 330, y: 720 },
];

const MOB_OUTPUT = [
  { id: 'out-quant', label: 'Quant\nFinance',   x: 70,  y: 920 },
  { id: 'out-ml',    label: 'Machine\nLearning', x: 200, y: 920 },
  { id: 'out-da',    label: 'Data\nEngineering', x: 330, y: 920 },
];

const MOB_PROJECTS = [
  { id: 'pead',             label: 'PEAD Research',    category: 'Quant Finance', x: 100, y: 1140 },
  { id: 'trading-terminal', label: 'Trading Terminal', category: 'Quant Finance', x: 300, y: 1140 },
  { id: 'housing-price',    label: 'Housing Price ML', category: 'Data Science',  x: 100, y: 1280 },
  { id: 'nfl-win',          label: 'NFL Win Prob',     category: 'Data Science',  x: 300, y: 1280 },
];

/* Simplified edges for mobile — category→skills, skills→tools, tools→output, output→projects */
const MOB_EDGES = [
  // input → languages
  ['cat-prog', 'python'], ['cat-prog', 'r'], ['cat-prog', 'sql'],
  ['cat-prog', 'matlab'], ['cat-prog', 'vba'], ['cat-prog', 'git'],
  ['cat-viz', 'matplotlib'], ['cat-viz', 'powerbi'], ['cat-viz', 'tableau'],
  ['cat-fin', 'quantlib'], ['cat-fin', 'bloomberg'], ['cat-fin', 'fred'],
  // languages → tools (simplified)
  ['python', 'matplotlib'], ['python', 'quantlib'],
  ['r', 'tableau'], ['r', 'matplotlib'],
  ['sql', 'powerbi'], ['sql', 'bloomberg'],
  ['matlab', 'quantlib'],
  ['vba', 'powerbi'],
  ['git', 'tableau'],
  // tools → output
  ['matplotlib', 'out-ml'], ['matplotlib', 'out-da'],
  ['powerbi', 'out-da'],
  ['tableau', 'out-da'],
  ['quantlib', 'out-quant'],
  ['bloomberg', 'out-quant'], ['bloomberg', 'out-da'],
  ['fred', 'out-quant'], ['fred', 'out-da'],
  // output → projects
  ['out-quant', 'pead'], ['out-quant', 'trading-terminal'],
  ['out-ml', 'housing-price'], ['out-ml', 'nfl-win'],
  ['out-da', 'trading-terminal'], ['out-da', 'housing-price'],
];

function getMobNodePos(id) {
  const all = [...MOB_INPUT, ...MOB_LANGS, ...MOB_TOOLS, ...MOB_OUTPUT, ...MOB_PROJECTS];
  return all.find((n) => n.id === id);
}

function MobileSkillsNetwork({ onSkillClick, onProjectClick, isSceneActive, tutorialNode, onUserTap }) {
  const allMobNodes = [...MOB_INPUT, ...MOB_LANGS, ...MOB_TOOLS, ...MOB_OUTPUT];
  const rowLabels = [
    { label: 'INPUT',     y: 80,   color: 'rgba(196,181,253,0.75)' },
    { label: 'LANGUAGES', y: 280,  color: 'rgba(196,181,253,0.75)' },
    { label: 'TOOLS',     y: 560,  color: 'rgba(196,181,253,0.75)' },
    { label: 'OUTPUT',    y: 860,  color: 'rgba(196,181,253,0.75)' },
    { label: 'PROJECTS',  y: 1060, color: 'rgba(0,212,255,0.75)' },
  ];

  // Tapped node id for mobile highlight animation
  const [tapped, setTapped] = useState(null);
  const touchOrigin = useRef({ y: 0, t: 0 });

  // Record touch origin — called directly on each node <g>, not at SVG level,
  // because the SVG-level handler never fires when stopPropagation was used on <g>.
  const recordTouch = useCallback((e) => {
    if (e.touches && e.touches[0]) {
      touchOrigin.current = { y: e.touches[0].clientY, t: Date.now() };
    }
  }, []);

  const makeTouchEnd = useCallback((node, isSkill) => (e) => {
    const dy = Math.abs(e.changedTouches[0].clientY - touchOrigin.current.y);
    const dt = Date.now() - touchOrigin.current.t;
    if (dy > 12 || dt > 350) return; // swipe, not tap
    e.stopPropagation();
    e.preventDefault();
    if (!isSkill) return;
    if (tapped === node.id) {
      // second tap → open modal
      const skill = skillsData.find((s) => s.id === node.id);
      if (skill) onSkillClick(skill);
      setTapped(null);
    } else {
      setTapped(node.id);
      onUserTap?.(); // dismiss tutorial on first real tap
    }
  }, [tapped, onSkillClick, onUserTap]);

  const makeProjectTouchEnd = useCallback((nodeId) => (e) => {
    const dy = Math.abs(e.changedTouches[0].clientY - touchOrigin.current.y);
    const dt = Date.now() - touchOrigin.current.t;
    if (dy > 12 || dt > 350) return;
    e.stopPropagation();
    e.preventDefault();
    onProjectClick(nodeId);
    onUserTap?.();
  }, [onProjectClick, onUserTap]);

  // Use real tap OR tutorial node for highlight (tutorial drives the demo animation)
  const effectiveMobActive = tapped ?? tutorialNode ?? null;
  const tappedConnected = useMemo(() => effectiveMobActive ? getConnectedIds(effectiveMobActive) : new Set(), [effectiveMobActive]);

  // Row-by-row reveal: 1=INPUT 2=LANGS 3=TOOLS 4=OUTPUT 5=PROJECTS
  const [visRows, setVisRows] = useState(0);
  const rowAnimStarted = useRef(false); // guard: run once even if isSceneActive flips rapidly
  useEffect(() => {
    if (!isSceneActive || rowAnimStarted.current) return;
    rowAnimStarted.current = true;
    const DELAYS = [300, 900, 1500, 2100, 2700];
    // No cleanup — let the timers run to completion once started
    DELAYS.forEach((ms, i) => setTimeout(() => setVisRows(i + 1), ms));
  }, [isSceneActive]);

  function getRowForId(id) {
    if (MOB_INPUT.find(n => n.id === id)) return 1;
    if (MOB_LANGS.find(n => n.id === id)) return 2;
    if (MOB_TOOLS.find(n => n.id === id)) return 3;
    if (MOB_OUTPUT.find(n => n.id === id)) return 4;
    if (MOB_PROJECTS.find(n => n.id === id)) return 5;
    return 1;
  }

  function nodeVisible(row) { return visRows >= row; }
  function edgeVisible(a, b) { return visRows >= Math.max(getRowForId(a), getRowForId(b)); }
  function rowIndexOf(id, arr) { return arr.findIndex(n => n.id === id); }

  return (
    <div className="md:hidden">
      {/* Mobile tap hint — fades in with first row */}
      <p style={{
        textAlign: 'center', fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(139,92,246,0.6)', marginBottom: '8px',
        opacity: visRows >= 1 ? 1 : 0, transition: 'opacity 0.5s ease',
      }}>
        TAP NODE · TAP AGAIN TO EXPLORE
      </p>
      <div style={{ width: '100%', overflowX: 'hidden' }}>
        <svg
          viewBox={`0 0 ${MOB_W} ${MOB_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'auto', overflow: 'visible', touchAction: 'pan-y' }}
          aria-label="Skills network graph (mobile)"
          onClick={() => setTapped(null)}
        >
          <defs>
            <radialGradient id="mobNetBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(139,92,246,0.04)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width={MOB_W} height={MOB_H} fill="url(#mobNetBg)" />

          {/* Row separator lines */}
          {[220, 500, 800, 1020].map((ly) => (
            <line key={ly} x1="20" y1={ly} x2={MOB_W - 20} y2={ly} stroke="rgba(139,92,246,0.06)" strokeWidth="1" strokeDasharray="4 6" />
          ))}

          {/* Row labels */}
          {rowLabels.map(({ label, y, color }) => (
            <text key={label} x={MOB_W / 2} y={y} textAnchor="middle" fontSize="10" fontFamily="var(--font-jetbrains), monospace" letterSpacing="0.25em" fill={color}>
              {label}
            </text>
          ))}

          {/* Edges — fade in row by row, highlight connected ones when a node is tapped */}
          <g>
            {MOB_EDGES.map(([a, b], i) => {
              const from = getMobNodePos(a);
              const to = getMobNodePos(b);
              if (!from || !to) return null;
              const isProj = !!MOB_PROJECTS.find((p) => p.id === a || p.id === b);
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2 - 10;
              const d = `M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`;
              const isActive = effectiveMobActive && (a === effectiveMobActive || b === effectiveMobActive);
              const isDimmed = effectiveMobActive && !isActive;
              const revealed = edgeVisible(a, b);
              const stroke = isProj ? (isActive ? '#00D4FF' : 'rgba(0,212,255,0.12)') : (isActive ? '#8B5CF6' : 'rgba(139,92,246,0.12)');
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={isActive ? 1.4 : 0.7}
                  strokeLinecap="round"
                  opacity={!revealed ? 0 : isDimmed ? 0.04 : 1}
                  style={{ transition: 'opacity 0.5s ease, stroke 0.2s, stroke-width 0.2s' }}
                />
              );
            })}
          </g>

          {/* Skill & category nodes — pop in row by row with per-node stagger */}
          <g>
            {allMobNodes.map((node) => {
              const isSkill = !!skillsData.find((s) => s.id === node.id);
              const r = isSkill ? 16 : 10;
              const lines = node.label.split('\n');
              const isNodeTapped = effectiveMobActive === node.id;
              const isUserTapped = tapped === node.id; // only show badge for real taps
              const isLinked = effectiveMobActive && tappedConnected.has(node.id);
              const isDimmedNode = effectiveMobActive && !isNodeTapped && !isLinked;
              const nodeFill = isNodeTapped ? 'rgba(139,92,246,0.35)' : isLinked ? 'rgba(139,92,246,0.18)' : 'rgba(139,92,246,0.12)';
              const nodeStroke = isNodeTapped ? '#8B5CF6' : isLinked ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.4)';
              const textColor = isNodeTapped ? '#C4B5FD' : isDimmedNode ? 'rgba(156,163,175,0.2)' : isSkill ? '#F9FAFB' : 'rgba(196,181,253,0.9)';

              // Per-node stagger within row
              const nodeRow = getRowForId(node.id);
              const rowArr = nodeRow === 1 ? MOB_INPUT : nodeRow === 2 ? MOB_LANGS : nodeRow === 3 ? MOB_TOOLS : MOB_OUTPUT;
              const idxInRow = rowIndexOf(node.id, rowArr);
              const nodeDelay = `${idxInRow * 80}ms`;
              const revealed = nodeVisible(nodeRow);

              return (
                <g
                  key={node.id}
                  style={{
                    cursor: isSkill ? 'pointer' : 'default',
                    opacity: revealed ? (isDimmedNode ? 0.25 : 1) : 0,
                    transform: revealed ? 'scale(1)' : 'scale(0.5)',
                    transformOrigin: `${node.x}px ${node.y}px`,
                    transition: `opacity 0.4s ease ${nodeDelay}, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${nodeDelay}`,
                  }}
                  onTouchStart={recordTouch}
                  onTouchEnd={makeTouchEnd(node, isSkill)}
                >
                  {/* Larger invisible hit area */}
                  <circle cx={node.x} cy={node.y} r={r + 14} fill="transparent" />
                  {/* Outer glow ring */}
                  <circle
                    cx={node.x} cy={node.y} r={r + 10}
                    fill="transparent" stroke="rgba(139,92,246,0.12)" strokeWidth="0.8"
                    opacity={isNodeTapped ? 1 : 0.5}
                    style={{ transition: 'opacity 0.2s' }}
                  />
                  {/* Main circle */}
                  <circle
                    cx={node.x} cy={node.y} r={isNodeTapped ? r + 2 : r}
                    fill={nodeFill} stroke={nodeStroke} strokeWidth={isNodeTapped ? 2 : 1}
                    style={{
                      filter: isNodeTapped ? 'drop-shadow(0 0 8px rgba(139,92,246,0.7))' : 'none',
                      transition: 'fill 0.2s, stroke 0.2s',
                    }}
                  />
                  {isSkill && (
                    <circle cx={node.x} cy={node.y} r={3.5}
                      fill={isNodeTapped ? '#C4B5FD' : 'rgba(139,92,246,0.6)'}
                      style={{ transition: 'fill 0.2s' }} />
                  )}
                  {/* Badge only for real user taps, not tutorial demo */}
                  {isUserTapped && (
                    <text x={node.x} y={node.y - r - 8} textAnchor="middle" fontSize={8}
                      fontFamily="var(--font-jetbrains), monospace" letterSpacing="0.1em"
                      fill="rgba(196,181,253,0.8)">
                      TAP AGAIN →
                    </text>
                  )}
                  {lines.map((line, li) => {
                    const baseY = node.y + r + 14;
                    const lineY = lines.length === 1 ? baseY : baseY + (li - (lines.length - 1) / 2) * 12;
                    return (
                      <text key={li} x={node.x} y={lineY} textAnchor="middle"
                        fontSize={isSkill ? 10 : 9} fontFamily="var(--font-jetbrains), monospace"
                        letterSpacing="0.05em" fill={textColor} fontWeight={isNodeTapped ? '700' : '400'}
                        style={{ transition: 'fill 0.2s' }}>
                        {line}
                      </text>
                    );
                  })}
                </g>
              );
            })}
          </g>

          {/* Project nodes — appear in row 5 with per-node stagger */}
          <g>
            {MOB_PROJECTS.map((node, ni) => {
              const pw = 140;
              const ph = 52;
              const color = node.category === 'Quant Finance' ? '#00D4FF' : '#8B5CF6';
              const isLinkedProj = tapped && tappedConnected.has(node.id);
              const projDelay = `${ni * 100}ms`;
              const revealedProj = nodeVisible(5);
              return (
                <g
                  key={node.id}
                  style={{
                    cursor: 'pointer',
                    opacity: revealedProj ? 1 : 0,
                    transform: revealedProj ? 'scale(1)' : 'scale(0.7)',
                    transformOrigin: `${node.x}px ${node.y}px`,
                    transition: `opacity 0.4s ease ${projDelay}, transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${projDelay}`,
                  }}
                  onTouchStart={recordTouch}
                  onTouchEnd={makeProjectTouchEnd(node.id)}
                >
                  <rect
                    x={node.x - pw / 2} y={node.y - ph / 2}
                    width={pw} height={ph} rx={8}
                    fill="rgba(8,14,28,0.88)"
                    stroke={isLinkedProj ? color : 'rgba(0,212,255,0.18)'}
                    strokeWidth={isLinkedProj ? 1.5 : 1}
                    style={{ transition: 'stroke 0.2s' }}
                  />
                  <text
                    x={node.x} y={node.y - 7}
                    textAnchor="middle" fontSize={8}
                    fontFamily="var(--font-jetbrains), monospace"
                    letterSpacing="0.15em"
                    fill={`${color}99`}
                  >
                    {node.category.toUpperCase()}
                  </text>
                  <text
                    x={node.x} y={node.y + 10}
                    textAnchor="middle" fontSize={10}
                    fontFamily="var(--font-jetbrains), monospace"
                    fontWeight="500"
                    fill="rgba(249,250,251,0.85)"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────────────── */
export default function SkillsNetwork() {
  const [hovered, setHovered]   = useState(null);
  const [tutorialNode, setTutorialNode] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showRobot, setShowRobot] = useState(true);
  const hasHoveredOnce = useRef(false);

  const sectionRef = useRef(null);
  const isSceneActive = useContext(ActiveSceneContext);

  // No blinking — just use whichever is set
  const effectiveHovered = hovered ?? tutorialNode;

  /* ─── Tutorial auto-demo loop ─────────────────────────────────────── */
  useEffect(() => {
    if (!isSceneActive) return;
    if (!showRobot) return;

    const DEMO_SEQUENCE = ['python', 'bloomberg', 'tableau'];
    const HOLD_MS = 1200;
    const INITIAL_DELAY = 2500;
    const CYCLES = 2;

    let timeouts = [];
    let cancelled = false;

    const schedule = (fn, ms) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timeouts.push(id);
      return id;
    };

    let elapsed = INITIAL_DELAY;

    for (let cycle = 0; cycle < CYCLES; cycle++) {
      for (let i = 0; i < DEMO_SEQUENCE.length; i++) {
        const nodeId = DEMO_SEQUENCE[i];
        const showAt = elapsed;
        schedule(() => {
          if (!hasHoveredOnce.current) setTutorialNode(nodeId);
        }, showAt);
        elapsed += HOLD_MS;
      }
      // Clear after each cycle
      const clearAt = elapsed;
      schedule(() => {
        if (!hasHoveredOnce.current) setTutorialNode(null);
      }, clearAt);
      elapsed += 800; // short pause between cycles
    }

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [showRobot, isSceneActive]);

  const handleProjectClick = useCallback((projectId) => {
    const project = allProjects.find((p) => p.id === projectId);
    if (project) setSelectedProject(project);
  }, []);

  const handleHover = useCallback((nodeId) => {
    setHovered(nodeId);
    if (!hasHoveredOnce.current) {
      hasHoveredOnce.current = true;
      setTutorialNode(null);
      setShowRobot(false);
    }
  }, []);

  const dismissRobot = useCallback(() => {
    setShowRobot(false);
    setTutorialNode(null);
  }, []);

  // Called when mobile user taps any node — stops the tutorial
  const handleMobileUserTap = useCallback(() => {
    if (!hasHoveredOnce.current) {
      hasHoveredOnce.current = true;
      setTutorialNode(null);
      setShowRobot(false);
    }
  }, []);

  const allNodeIds = [
    ...INPUT_NODES.map((n) => n.id),
    ...skillsData.map((s) => s.id),
    ...OUTPUT_NODES.map((n) => n.id),
  ];
  const allProjectIds = Object.keys(PROJECT_NODES_DATA);

  function edgeState(fromId, toId) {
    if (!effectiveHovered) return { active: false, dimmed: false };
    const connected = getConnectedIds(effectiveHovered);
    const active = fromId === effectiveHovered || toId === effectiveHovered || (connected.has(fromId) && connected.has(toId));
    const dimmed = !active && (fromId !== effectiveHovered && toId !== effectiveHovered);
    return { active: fromId === effectiveHovered || toId === effectiveHovered, dimmed };
  }

  return (
    <section ref={sectionRef} className="py-16 px-6 lg:px-12 overflow-hidden" aria-label="Skills Network">
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent text-center mb-3">
        Tools &amp; Languages
      </p>

      {/* Bobbing hint — desktop shows "hover", mobile shows "tap" */}
      <div className="hidden md:flex items-center justify-center gap-2 mb-8">
        <motion.span animate={{ y: [0,-5,0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted/50">hover</motion.span>
        <motion.span animate={{ y: [0,-5,0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
          style={{ color: 'rgba(139,92,246,0.4)', fontSize: '10px' }}>↑</motion.span>
      </div>
      <div className="flex md:hidden items-center justify-center gap-2 mb-4">
        <motion.span animate={{ y: [0,-5,0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted/50">tap</motion.span>
        <motion.span animate={{ y: [0,-5,0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
          style={{ color: 'rgba(139,92,246,0.4)', fontSize: '10px' }}>↓</motion.span>
      </div>

      {/* Robot helper + demo label — shown on both desktop and mobile */}
      {showRobot && (
        <>
          <div className="hidden md:block">
            <RobotHelper onDismiss={dismissRobot} active={isSceneActive}
              message="🤖 Hover a skill node to trace its connections" />
            <DemoLabel visible={tutorialNode !== null} />
          </div>
          <div className="block md:hidden">
            <RobotHelper onDismiss={dismissRobot} active={isSceneActive}
              message="🤖 Tap a skill node to trace its connections" />
            <DemoLabel visible={tutorialNode !== null} />
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto">
        {/* ── Desktop SVG ── */}
        <div className="hidden md:block">
          <div>
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ width: '100%', height: 'auto', overflow: 'visible' }}
              aria-label="Skills network graph"
            >
              <defs>
                <radialGradient id="netBg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(139,92,246,0.04)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
                <radialGradient id="projBg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0,212,255,0.04)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>

              <ellipse cx={650} cy={VB_H / 2} rx={580} ry={280} fill="url(#netBg)" />
              <ellipse cx={1390} cy={VB_H / 2} rx={160} ry={300} fill="url(#projBg)" />

              <line x1="220"  y1="20" x2="220"  y2={VB_H - 20} stroke="rgba(139,92,246,0.05)" strokeWidth="1" strokeDasharray="4 6" />
              <line x1="490"  y1="20" x2="490"  y2={VB_H - 20} stroke="rgba(139,92,246,0.05)" strokeWidth="1" strokeDasharray="4 6" />
              <line x1="770"  y1="20" x2="770"  y2={VB_H - 20} stroke="rgba(139,92,246,0.05)" strokeWidth="1" strokeDasharray="4 6" />
              <line x1="1185" y1="20" x2="1185" y2={VB_H - 20} stroke="rgba(0,212,255,0.07)"  strokeWidth="1" strokeDasharray="4 6" />

              {[
                { label: 'INPUT',     x: 105,  color: 'rgba(196,181,253,0.75)' },
                { label: 'LANGUAGES', x: 340,  color: 'rgba(196,181,253,0.75)' },
                { label: 'TOOLS',     x: 660,  color: 'rgba(196,181,253,0.75)' },
                { label: 'OUTPUT',    x: 995,  color: 'rgba(196,181,253,0.75)' },
                { label: 'PROJECTS',  x: 1390, color: 'rgba(0,212,255,0.75)'   },
              ].map(({ label, x, color }) => (
                <text key={label} x={x} y={18} textAnchor="middle" fontSize="11" fontFamily="var(--font-jetbrains), monospace" letterSpacing="0.2em" fill={color}>
                  {label}
                </text>
              ))}

              <g>
                {ALL_EDGES.map(([a, b], i) => {
                  const { active, dimmed } = edgeState(a, b);
                  return <Edge key={i} fromId={a} toId={b} active={active} dimmed={dimmed} />;
                })}
              </g>

              <g>
                {allNodeIds.map((id) => (
                  <Node
                    key={id}
                    nodeId={id}
                    hovered={effectiveHovered}
                    onHover={handleHover}
                    onLeave={() => setHovered(null)}
                    onClick={setSelected}
                  />
                ))}
              </g>

              <g>
                {allProjectIds.map((id) => (
                  <ProjectNode
                    key={id}
                    nodeId={id}
                    hovered={effectiveHovered}
                    onHover={handleHover}
                    onLeave={() => setHovered(null)}
                    onClick={handleProjectClick}
                  />
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* ── Mobile SVG (vertical layout) ── */}
        <MobileSkillsNetwork
          onSkillClick={setSelected}
          onProjectClick={handleProjectClick}
          isSceneActive={isSceneActive}
          tutorialNode={tutorialNode}
          onUserTap={handleMobileUserTap}
        />
      </div>

      <div className="flex justify-center gap-6 md:gap-12 mt-8 flex-wrap">
        {[
          { label: 'Languages', value: '6' },
          { label: 'Libraries & Viz', value: '6' },
          { label: 'Projects', value: String(allProjectIds.length) },
          { label: 'Connections', value: String(ALL_EDGES.length) },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="font-mono text-xl font-bold text-accent">{value}</p>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted/60 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <SkillDetailModal
            skill={selected}
            isOpen={!!selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2.2s infinite ease-out;
        }
      ` }} />
    </section>
  );
}
