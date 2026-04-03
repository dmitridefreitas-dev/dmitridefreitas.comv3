'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SkillDetailModal from '@/components/modals/SkillDetailModal';
import { skillsData } from '@/data/skills';

const CATS = [
  {
    label: 'Programming & Scripting',
    color: '#8B5CF6',
    bg:   'rgba(139,92,246,0.07)',
    bdr:  'rgba(139,92,246,0.22)',
    hbg:  'rgba(139,92,246,0.16)',
    hbdr: '#8B5CF6',
    ids:  ['python', 'r', 'sql', 'matlab', 'vba', 'git'],
  },
  {
    label: 'Data Visualisation',
    color: '#00D4FF',
    bg:   'rgba(0,212,255,0.07)',
    bdr:  'rgba(0,212,255,0.22)',
    hbg:  'rgba(0,212,255,0.14)',
    hbdr: '#00D4FF',
    ids:  ['pandas', 'numpy', 'matplotlib', 'seaborn', 'powerbi', 'tableau'],
  },
  {
    label: 'Financial Tools',
    color: '#00E5A0',
    bg:   'rgba(0,229,160,0.07)',
    bdr:  'rgba(0,229,160,0.22)',
    hbg:  'rgba(0,229,160,0.14)',
    hbdr: '#00E5A0',
    ids:  ['quantlib', 'bloomberg', 'fred'],
  },
];

const PROF = {
  python: 95, r: 85, sql: 90, matlab: 80, vba: 75, git: 88,
  pandas: 90, numpy: 88, matplotlib: 85, seaborn: 82, powerbi: 80, tableau: 83,
  quantlib: 78, bloomberg: 80, fred: 84,
};

export default function SkillsReveal() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  return (
    <section
      style={{
        background: '#02030A',
        minHeight: '100vh',
        padding: '4rem 2rem 3rem',
        overflowY: 'auto',
      }}
      aria-label="Technical Skills"
    >
      {/* Header */}
      <p
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '11px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          textAlign: 'center',
          color: 'rgba(139,92,246,0.7)',
          marginBottom: '8px',
        }}
      >
        Tools &amp; Languages
      </p>
      <p
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          textAlign: 'center',
          color: 'rgba(0,212,255,0.35)',
          marginBottom: '3rem',
        }}
      >
        {'15 SKILLS · 3 DOMAINS'}
      </p>

      {/* Category sections */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {CATS.map(cat => {
          const skills = cat.ids
            .map(id => skillsData.find(s => s.id === id))
            .filter(Boolean);

          return (
            <div key={cat.label} style={{ marginBottom: '2.5rem' }}>
              {/* Category label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    width: 8, height: 8,
                    background: cat.color,
                    boxShadow: `0 0 6px ${cat.color}88`,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '10px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: `${cat.color}bb`,
                  }}
                >
                  {cat.label}
                </span>
              </div>

              {/* Cards grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
                  gap: '10px',
                }}
              >
                {skills.map(skill => {
                  const isHov = hovered === skill.id;
                  const prof  = PROF[skill.id] ?? 75;

                  return (
                    <div
                      key={skill.id}
                      style={{
                        background:   isHov ? cat.hbg  : cat.bg,
                        border:       `1px solid ${isHov ? cat.hbdr : cat.bdr}`,
                        padding:      '12px 14px',
                        cursor:       'pointer',
                        userSelect:   'none',
                        transition:   'background 0.18s, border-color 0.18s',
                      }}
                      onMouseEnter={() => setHovered(skill.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(skill)}
                    >
                      {/* Top: dot + name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div
                          style={{
                            width: 6, height: 6, flexShrink: 0,
                            background: cat.color,
                            boxShadow: isHov ? `0 0 5px ${cat.color}` : 'none',
                            transition: 'box-shadow 0.18s',
                          }}
                        />
                        <span
                          style={{
                            fontFamily: 'var(--font-jetbrains), monospace',
                            fontSize:   '11px',
                            fontWeight: isHov ? '700' : '500',
                            color:      isHov ? '#F9FAFB' : 'rgba(249,250,251,0.75)',
                            letterSpacing: '0.05em',
                            transition: 'color 0.18s, font-weight 0.18s',
                          }}
                        >
                          {skill.name}
                        </span>
                      </div>

                      {/* Proficiency bar */}
                      <div
                        style={{
                          height: 2,
                          background: 'rgba(255,255,255,0.06)',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            height: '100%',
                            width: `${prof}%`,
                            background: cat.color,
                            opacity: isHov ? 1 : 0.55,
                            transition: 'opacity 0.18s',
                          }}
                        />
                      </div>

                      {/* Click hint */}
                      {isHov && (
                        <p
                          style={{
                            fontFamily: 'var(--font-jetbrains), monospace',
                            fontSize: '8px',
                            letterSpacing: '0.15em',
                            color: `${cat.color}88`,
                            marginTop: '8px',
                          }}
                        >
                          CLICK TO EXPLORE
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          marginTop: '2.5rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: 'Languages',  value: '6',  color: '#8B5CF6' },
          { label: 'Libraries',  value: '6',  color: '#00D4FF' },
          { label: 'Fin Tools',  value: '3',  color: '#00E5A0' },
          { label: 'Projects',   value: '12', color: '#00D4FF' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '22px', fontWeight: '700', color }}>
              {value}
            </p>
            <p style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
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
