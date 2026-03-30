'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import SkillDetailModal from '@/components/modals/SkillDetailModal';
import { skillsData } from '@/data/skills';

/* ── Mobile card (unchanged) ─────────────────────────────────────────── */
function SkillCard({ skill, onClick, className = '' }) {
  return (
    <div
      className={`flex-shrink-0 w-[75vw] md:w-[44vw] lg:w-[28vw] h-full flex flex-col justify-center items-center text-center px-8 md:px-10 border-r border-border cursor-pointer group bg-surface/60 hover:bg-surface transition-colors overflow-hidden ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted/60 mb-2 h-4 flex items-center">
        {skill.category}
      </p>
      <h3 className="font-sans font-bold text-base md:text-lg text-accent group-hover:text-accent/80 transition-colors duration-300 mb-2 leading-tight">
        {skill.name}
      </h3>
      <p className="text-xs text-muted max-w-[220px] leading-relaxed line-clamp-2">
        {skill.description}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1">
        {skill.keyFeatures.slice(0, 3).map((f, i) => (
          <span
            key={i}
            className="font-mono text-[10px] uppercase tracking-widest text-muted/50 border-b border-muted/15 pb-0.5"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── 3D Carousel (desktop only) ──────────────────────────────────────── */
function Carousel3D({ skills, onCardClick }) {
  const total = skills.length;
  const CARD_W = 220;
  const CARD_H = 280;
  const radius = Math.round((CARD_W / 2) / Math.tan(Math.PI / total));
  const angleStep = 360 / total;

  const rotY = useMotionValue(0);
  const isPaused = useRef(false);
  const isPausedByHover = useRef(false);
  const hoverResumeTimer = useRef(null);
  const dragStartX = useRef(null);
  const dragStartRot = useRef(0);
  const [frontIndex, setFrontIndex] = useState(0);
  const cardRefs = useRef([]);
  const prevFrontRef = useRef(0);
  const cardBrightness = useRef([]);

  /* cleanup hover timer on unmount */
  useEffect(() => {
    return () => {
      if (hoverResumeTimer.current) clearTimeout(hoverResumeTimer.current);
    };
  }, []);

  /* rotation + smooth brightness — one unified frame loop */
  useAnimationFrame((_, delta) => {
    if (!isPaused.current) {
      rotY.set(rotY.get() + delta * 0.007);
    }

    const v = rotY.get();
    const norm = ((-v % 360) + 360) % 360;
    let closest = 0;
    let minDist = 360;

    for (let i = 0; i < total; i++) {
      const cardAngle = (angleStep * i) % 360;
      let dist = Math.abs(norm - cardAngle);
      if (dist > 180) dist = 360 - dist;
      if (dist < minDist) { minDist = dist; closest = i; }

      // Target brightness based on angular distance from front
      const target = dist <= 90
        ? 1 - (dist / 90) * 0.55
        : 0.45 - ((dist - 90) / 90) * 0.2;

      // Lerp toward target — controls how slowly brightness changes (lower = smoother)
      if (cardBrightness.current[i] === undefined) cardBrightness.current[i] = 0.45;
      cardBrightness.current[i] += (target - cardBrightness.current[i]) * 0.06;

      const el = cardRefs.current[i];
      if (el) {
        el.style.filter = `brightness(${cardBrightness.current[i].toFixed(3)})`;
      }
    }

    // Border + shadow snap to front card (cheap, only on change)
    if (closest !== prevFrontRef.current) {
      for (let i = 0; i < total; i++) {
        const el = cardRefs.current[i];
        if (el) {
          el.style.borderColor = i === closest
            ? 'rgba(139,92,246,0.55)'
            : 'rgba(139,92,246,0.15)';
          el.style.boxShadow = i === closest
            ? '0 0 28px rgba(139,92,246,0.13)'
            : 'none';
        }
      }
      prevFrontRef.current = closest;
      setFrontIndex(closest);
    }
  });

  /* arrow handlers */
  const jumpBy = useCallback(
    (dir) => {
      rotY.set(rotY.get() - dir * angleStep);
    },
    [rotY, angleStep]
  );

  /* drag handlers */
  const onPointerDown = useCallback(
    (e) => {
      isPaused.current = true;
      dragStartX.current = e.clientX;
      dragStartRot.current = rotY.get();
    },
    [rotY]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (dragStartX.current === null) return;
      const dx = e.clientX - dragStartX.current;
      rotY.set(dragStartRot.current + dx * 0.3);
    },
    [rotY]
  );

  const onPointerUp = useCallback(() => {
    dragStartX.current = null;
    // Only unpause if hover isn't holding it paused
    if (!isPausedByHover.current) {
      isPaused.current = false;
    }
  }, []);

  /* hover-near-center detection — pauses rotation, resumes after 4s */
  const onMouseMoveWrapper = useCallback((e) => {
    if (dragStartX.current !== null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width / 2;
    const dy = e.clientY - rect.top - rect.height / 2;
    const nearCenter = Math.sqrt(dx * dx + dy * dy) < 75;

    if (nearCenter) {
      isPausedByHover.current = true;
      isPaused.current = true;
      if (hoverResumeTimer.current) {
        clearTimeout(hoverResumeTimer.current);
        hoverResumeTimer.current = null;
      }
    } else if (isPausedByHover.current && !hoverResumeTimer.current) {
      hoverResumeTimer.current = setTimeout(() => {
        isPausedByHover.current = false;
        isPaused.current = false;
        hoverResumeTimer.current = null;
      }, 4000);
    }
  }, []);

  const onMouseLeaveWrapper = useCallback(() => {
    if (dragStartX.current !== null) return;
    if (isPausedByHover.current && !hoverResumeTimer.current) {
      hoverResumeTimer.current = setTimeout(() => {
        isPausedByHover.current = false;
        isPaused.current = false;
        hoverResumeTimer.current = null;
      }, 4000);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative select-none">
      {/* perspective wrapper */}
      <div
        className="relative"
        style={{
          perspective: '1200px',
          width: CARD_W + 100,
          height: CARD_H + 40,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onMouseMove={onMouseMoveWrapper}
        onMouseLeave={onMouseLeaveWrapper}
      >
        {/* rotating cylinder */}
        <motion.div
          style={{
            rotateY: rotY,
            transformStyle: 'preserve-3d',
            width: CARD_W,
            height: CARD_H,
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -CARD_W / 2,
            marginTop: -CARD_H / 2,
          }}
        >
          {skills.map((skill, i) => {
            const cardAngle = angleStep * i;
            const isFront = i === frontIndex;

            return (
              <motion.div
                key={skill.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="absolute cursor-pointer"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: 12,
                  backfaceVisibility: 'hidden',
                  background: 'rgba(8,8,16,0.9)',
                  border: '1px solid rgba(139,92,246,0.15)',
                  // no transition here — filter/border/shadow driven per-frame
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  willChange: 'transform, filter',
                }}
                onClick={() => { if (isFront) onCardClick(skill); }}
              >
                {/* Inner wrapper handles scale — isolated CSS transition */}
                <div
                  className="flex flex-col justify-center items-center text-center px-5 py-6 w-full h-full"
                  style={{
                    transform: isFront ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted/60 mb-2">
                    {skill.category}
                  </p>
                  <h3 className="font-serif font-bold text-lg text-accent mb-2 leading-tight">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-muted line-clamp-3 leading-relaxed max-w-[190px]">
                    {skill.description}
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-x-2 gap-y-1">
                    {skill.keyFeatures.slice(0, 3).map((f, fi) => (
                      <span
                        key={fi}
                        className="font-mono text-[10px] uppercase tracking-widest text-muted/50"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* left / right arrows */}
      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={() => jumpBy(-1)}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-colors"
          aria-label="Previous skill"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted/50">
          {skills[frontIndex].name}
        </span>
        <button
          onClick={() => jumpBy(1)}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-colors"
          aria-label="Next skill"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Main export ──────────────────────────────────────────────────────── */
export default function SkillsHorizontal() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const allSkillsTripled = [...skillsData, ...skillsData, ...skillsData];
  const mobileSetWidth = skillsData.length * 75;

  return (
    <section aria-label="Skills" className="overflow-hidden">

      {/* ── Desktop: 3D rotating carousel ────────────────────────────────── */}
      <div className="hidden lg:block" style={{ height: '88vh' }}>
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

        <div className="flex items-center justify-center" style={{ height: 'calc(88vh - 3rem)', overflow: 'hidden' }}>
          <Carousel3D skills={skillsData} onCardClick={setSelectedSkill} />
        </div>
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
              animation: 'scroll-left-mobile 130s linear infinite',
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
              animation: 'scroll-left-mobile 65s linear infinite',
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
            animation: 'scroll-left-mobile 180s linear infinite',
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
