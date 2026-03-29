'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import SkillDetailModal from '@/components/modals/SkillDetailModal';
import { skillsData } from '@/data/skills';

function SkillCard({ skill, onClick, className = '' }) {
  return (
    <div
      className={`flex-shrink-0 w-[75vw] md:w-[44vw] lg:w-[28vw] h-full flex flex-col justify-center items-center text-center px-8 md:px-10 border-r border-border cursor-pointer group bg-surface/60 hover:bg-surface transition-colors ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent mb-3">
        {skill.category}
      </p>
      <h3 className="font-serif font-bold text-base md:text-lg text-foreground mb-1.5 group-hover:text-accent transition-colors duration-300">
        {skill.name}
      </h3>
      <p className="text-xs text-muted max-w-xs leading-relaxed">
        {skill.description}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {skill.keyFeatures.slice(0, 3).map((f, i) => (
          <span
            key={i}
            className="font-mono text-xs uppercase tracking-widest text-muted border-b border-muted/20 pb-0.5"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

const ROW_1 = skillsData.slice(0, 5);
const ROW_2 = skillsData.slice(5, 10);
const ROW_3 = skillsData.slice(10);

const CARD_VW = 28;

function InfiniteRow({ skills, direction = 'left', duration = 80, onCardClick }) {
  const tripled = [...skills, ...skills, ...skills];
  const setWidthVw = skills.length * CARD_VW;

  return (
    <div className="flex-1 overflow-hidden border-b border-border last:border-b-0 contain-paint">
      <div
        className="flex h-full"
        style={{
          width: `${setWidthVw * 3}vw`,
          animation: `scroll-${direction} ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {tripled.map((skill, i) => (
          <SkillCard
            key={`${skill.name}-${i}`}
            skill={skill}
            onClick={() => onCardClick(skill)}
          />
        ))}
      </div>
    </div>
  );
}

export default function SkillsHorizontal() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const allSkillsTripled = [...skillsData, ...skillsData, ...skillsData];
  const mobileSetWidth = skillsData.length * 75;

  return (
    <section aria-label="Skills" className="overflow-hidden">

      {/* ── Desktop: 3 auto-scrolling infinite rows ──────────────────────── */}
      <div className="hidden lg:flex flex-col" style={{ height: '88vh' }}>
        <div className="flex items-center px-12 border-b border-border flex-shrink-0" style={{ height: '3rem' }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-[0.4em] text-muted"
          >
            Tools &amp; Languages
          </motion.p>
        </div>

        <InfiniteRow skills={ROW_1} direction="left"  duration={80}  onCardClick={setSelectedSkill} />
        <InfiniteRow skills={ROW_2} direction="right" duration={100} onCardClick={setSelectedSkill} />
        <InfiniteRow skills={ROW_3} direction="left"  duration={90}  onCardClick={setSelectedSkill} />
      </div>

      {/* ── Mobile/Tablet: single auto-scrolling row ─────────────────────── */}
      <div className="lg:hidden relative">
        <div className="pt-12 pb-4 flex items-end px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs uppercase tracking-[0.4em] text-muted"
          >
            Tools &amp; Languages
          </motion.p>
        </div>

        <div className="overflow-hidden contain-paint" style={{ height: '50vh' }}>
          <div
            className="flex h-full"
            style={{
              width: `${mobileSetWidth * 2}vw`,
              animation: 'scroll-left-mobile 90s linear infinite',
              willChange: 'transform',
            }}
          >
            {[...skillsData, ...skillsData].map((skill, i) => (
              <SkillCard
                key={`mob-${skill.name}-${i}`}
                skill={skill}
                className="!h-full !w-[75vw] !px-8"
                onClick={() => setSelectedSkill(skill)}
              />
            ))}
          </div>
        </div>

        {/* Mobile marquee */}
        <div className="mt-4 overflow-hidden whitespace-nowrap border-y border-border py-8 scroll-fade-edges contain-paint">
          <div
            className="flex gap-12 items-center"
            style={{
              width: 'max-content',
              animation: 'scroll-left-mobile 30s linear infinite',
              willChange: 'transform',
            }}
          >
            {[...skillsData, ...skillsData].map((skill, i) => (
              <span
                key={`${skill.name}-${i}`}
                className="font-serif font-bold text-4xl md:text-6xl uppercase tracking-tighter cursor-pointer"
                style={{ color: 'rgba(139,92,246,0.12)' }}
                onClick={() => setSelectedSkill(skill)}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Desktop marquee strip ─────────────────────────────────────────── */}
      <div className="hidden lg:block overflow-hidden border-y border-border py-5 scroll-fade-edges contain-paint">
        <div
          className="flex gap-16 items-center whitespace-nowrap"
          style={{
            width: 'max-content',
            animation: 'scroll-left-mobile 40s linear infinite',
            willChange: 'transform',
          }}
        >
          {allSkillsTripled.map((skill, i) => (
            <span
              key={`marquee-${skill.name}-${i}`}
              className="inline-flex items-center font-mono text-xs uppercase tracking-[0.3em] text-muted hover:text-accent transition-colors cursor-pointer"
              onClick={() => setSelectedSkill(skill)}
            >
              <span className="w-1 h-1 rounded-full bg-accent/30 mr-4 flex-shrink-0" />
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          isOpen={!!selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </section>
  );
}
