'use client';
import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import TextReveal from '@/components/effects/TextReveal';
import MagneticButton from '@/components/effects/MagneticButton';
import ExperienceModal from '@/components/modals/ExperienceModal';
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

      {/* ══════════════════════════════════════════════════════════════════════
          PERSONAL INTERESTS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 lg:px-12" aria-label="Personal Interests">
        <div className="max-w-5xl mx-auto">
          <motion.p
            {...fadeUp(0)}
            className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-8 text-center"
          >
            Outside the Office
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {personalInterests.map((interest, i) => (
              <InterestCard key={interest.title} interest={interest} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA — Connect
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-6 flex flex-col items-center text-center"
        aria-label="Connect"
      >
        <h2 className="font-serif font-bold text-headline text-foreground text-balance mb-7 will-change-transform">
          <TextReveal splitBy="word" staggerDelay={0.08}>
            Let&apos;s Connect
          </TextReveal>
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <MagneticButton href="/contact" size="lg" data-cursor="expand">
            Get in Touch
            <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="lg"
            data-cursor="expand"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </MagneticButton>
        </motion.div>
      </section>

      {/* ── Experience Modal ───────────────────────────────────────────────── */}
      {selectedExperience && (
        <ExperienceModal
          experience={selectedExperience}
          isOpen={!!selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}
    </>
  );
}
