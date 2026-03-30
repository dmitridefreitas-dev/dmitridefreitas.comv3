'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkillDetailModal from '@/components/modals/SkillDetailModal';
import { skillsData } from '@/data/skills';

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

const VB_W = 1100;
const VB_H = 610;

function getNode(id) {
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
  EDGES.forEach(([a, b]) => {
    if (a === nodeId) connected.add(b);
    if (b === nodeId) connected.add(a);
  });
  return connected;
}

function Edge({ fromId, toId, active, dimmed }) {
  const from = getNode(fromId);
  const to   = getNode(toId);
  if (!from || !to) return null;

  const opacity = active ? 0.75 : dimmed ? 0.04 : 0.12;
  const strokeW = active ? 1.4 : 0.7;
  const color   = active ? '#8B5CF6' : 'rgba(139,92,246,0.9)';

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

  return (
    <g
      style={{ cursor: isSkill ? 'pointer' : 'default' }}
      onMouseEnter={() => onHover(nodeId)}
      onMouseLeave={onLeave}
      onClick={() => isSkill && onClick(node.skill)}
    >
      <motion.circle
        cx={node.x} cy={node.y} r={glowR}
        fill="transparent"
        stroke="rgba(139,92,246,0.18)"
        strokeWidth="1"
        animate={{
          opacity: isHovered ? 1 : isDimmed ? 0 : 0.5,
          r: isHovered ? glowR + 4 : glowR,
        }}
        transition={{ duration: 0.3 }}
      />

      {!isDimmed && (
        <motion.circle
          cx={node.x} cy={node.y}
          fill="none"
          stroke="rgba(139,92,246,0.25)"
          strokeWidth="0.8"
          animate={{ r: [r + 4, r + 20], opacity: [0.4, 0] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeOut',
            delay: Math.random() * 2,
          }}
        />
      )}

      <motion.circle
        cx={node.x} cy={node.y} r={r}
        animate={{
          fill: isHovered
            ? 'rgba(139,92,246,0.35)'
            : isLinked
            ? 'rgba(139,92,246,0.18)'
            : isDimmed
            ? 'rgba(8,8,16,0.8)'
            : 'rgba(139,92,246,0.12)',
          stroke: isHovered
            ? '#8B5CF6'
            : isLinked
            ? 'rgba(139,92,246,0.6)'
            : isDimmed
            ? 'rgba(139,92,246,0.08)'
            : 'rgba(139,92,246,0.4)',
          strokeWidth: isHovered ? 2 : 1,
          filter: isHovered ? 'drop-shadow(0 0 10px rgba(139,92,246,0.8))' : 'none',
        }}
        transition={{ duration: 0.25 }}
      />

      {isSkill && (
        <motion.circle
          cx={node.x} cy={node.y} r={4}
          animate={{
            fill: isHovered ? '#C4B5FD' : isDimmed ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.6)',
          }}
          transition={{ duration: 0.25 }}
        />
      )}

      {lines.map((line, li) => {
        const totalLines = lines.length;
        const baseY = node.y + r + 14;
        const lineY  = totalLines === 1
          ? baseY
          : baseY + (li - (totalLines - 1) / 2) * 14;

        return (
          <motion.text
            key={li}
            x={node.x}
            y={lineY}
            textAnchor="middle"
            fontSize={isSkill ? 12 : 11}
            fontFamily="var(--font-jetbrains), monospace"
            letterSpacing="0.06em"
            animate={{
              fill: isHovered
                ? '#C4B5FD'
                : isLinked
                ? 'rgba(196,181,253,0.85)'
                : isDimmed
                ? 'rgba(156,163,175,0.2)'
                : isSkill ? '#F9FAFB' : 'rgba(196,181,253,0.9)',
              fontWeight: isHovered ? '700' : '400',
            }}
            transition={{ duration: 0.2 }}
          >
            {line}
          </motion.text>
        );
      })}
    </g>
  );
}

/* ─── Robot helper popup ───────────────────────────────────────────── */
function RobotHelper({ onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(showTimer);
  }, []);

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
              🤖 Hover a skill node to trace its connections
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main component ───────────────────────────────────────────────── */
export default function SkillsNetwork() {
  const [hovered, setHovered]   = useState(null);
  const [selected, setSelected] = useState(null);
  const [showRobot, setShowRobot] = useState(true);
  const hasHoveredOnce = useRef(false);

  const handleHover = useCallback((nodeId) => {
    setHovered(nodeId);
    if (!hasHoveredOnce.current) {
      hasHoveredOnce.current = true;
      setShowRobot(false);
    }
  }, []);

  const dismissRobot = useCallback(() => {
    setShowRobot(false);
  }, []);

  const allNodeIds = [
    ...INPUT_NODES.map((n) => n.id),
    ...skillsData.map((s) => s.id),
    ...OUTPUT_NODES.map((n) => n.id),
  ];

  function edgeState(fromId, toId) {
    if (!hovered) return { active: false, dimmed: false };
    const connected = getConnectedIds(hovered);
    const active = fromId === hovered || toId === hovered || (connected.has(fromId) && connected.has(toId));
    const dimmed = !active && (fromId !== hovered && toId !== hovered);
    return { active: fromId === hovered || toId === hovered, dimmed };
  }

  return (
    <section className="py-16 px-6 lg:px-12 overflow-hidden" aria-label="Skills Network">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-mono text-xs uppercase tracking-[0.4em] text-accent text-center mb-10"
      >
        Tools &amp; Languages
      </motion.p>

      {showRobot && <RobotHelper onDismiss={dismissRobot} />}

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
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
            </defs>

            <ellipse cx={VB_W / 2} cy={VB_H / 2} rx={500} ry={260} fill="url(#netBg)" />

            <line x1="220" y1="20" x2="220" y2={VB_H - 20} stroke="rgba(139,92,246,0.05)" strokeWidth="1" strokeDasharray="4 6" />
            <line x1="490" y1="20" x2="490" y2={VB_H - 20} stroke="rgba(139,92,246,0.05)" strokeWidth="1" strokeDasharray="4 6" />
            <line x1="770" y1="20" x2="770" y2={VB_H - 20} stroke="rgba(139,92,246,0.05)" strokeWidth="1" strokeDasharray="4 6" />

            {[
              { label: 'INPUT', x: 105 },
              { label: 'LANGUAGES', x: 340 },
              { label: 'TOOLS', x: 660 },
              { label: 'OUTPUT', x: 995 },
            ].map(({ label, x }) => (
              <text key={label} x={x} y={18} textAnchor="middle" fontSize="8" fontFamily="var(--font-jetbrains), monospace" letterSpacing="0.2em" fill="rgba(139,92,246,0.5)">
                {label}
              </text>
            ))}

            <g>
              {EDGES.map(([a, b], i) => {
                const { active, dimmed } = edgeState(a, b);
                return <Edge key={i} fromId={a} toId={b} active={active} dimmed={dimmed} />;
              })}
            </g>

            <g>
              {allNodeIds.map((id) => (
                <Node
                  key={id}
                  nodeId={id}
                  hovered={hovered}
                  onHover={handleHover}
                  onLeave={() => setHovered(null)}
                  onClick={setSelected}
                />
              ))}
            </g>
          </svg>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="flex justify-center gap-12 mt-8"
      >
        {[
          { label: 'Languages', value: '6' },
          { label: 'Libraries & Viz', value: '6' },
          { label: 'Connections', value: String(EDGES.length) },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="font-mono text-xl font-bold text-accent">{value}</p>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted/60 mt-1">{label}</p>
          </div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <SkillDetailModal
            skill={selected}
            isOpen={!!selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
