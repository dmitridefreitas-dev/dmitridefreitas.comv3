'use client';
import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import TextReveal from '@/components/effects/TextReveal';
import MagneticButton from '@/components/effects/MagneticButton';
import ExperienceModal from '@/components/modals/ExperienceModal';
import { education } from '@/data/education';
import { experiences } from '@/data/experiences';
import { skillCategories } from '@/data/skills';
import { socialLinks } from '@/data/constants';
import { ArrowUpRight, Linkedin, Trophy, Plane, BarChart3 } from 'lucide-react';

const storyParagraphs = [
  "I'm pursuing a Bachelor of Science in Data Science & Financial Engineering at Washington University in St. Louis, graduating May 2026.",
  "My professional experience includes building ML-driven quantitative models for credit market analysis at Amphora Investment Management, where I processed 70K+ data points across 8+ statistical approaches, achieving 95% average explanatory power.",
  "My research focuses on market efficiency and quantitative finance — from PEAD anomaly analysis testing semi-strong EMH to algorithmic trading strategy development and full-stack trading terminal infrastructure.",
  "I'm seeking full-time roles in quantitative research, financial engineering, and data science starting May 2026.",
];

const financeExps = experiences.filter((e) => e.type === 'finance');
const researchExps = experiences.filter((e) => e.type === 'research');

const personalInterests = [
  {
    icon: Trophy,
    title: 'Cricket',
    description: 'Competitive cricket player — a lifelong passion from growing up in Barbados that sharpened strategy, teamwork, and composure under pressure.',
  },
  {
    icon: Plane,
    title: 'Travel & Adventure',
    description: 'Committed to exploring new cultures and environments. Duke of Edinburgh Award expeditions sparked a love of outdoor challenge and discovery.',
  },
  {
    icon: BarChart3,
    title: 'Open Source Quant Research',
    description: 'Building and sharing quantitative finance tools and datasets — contributing to the open-source research community.',
  },
];

function InterestCard({ interest, index }) {
  const Icon = interest.icon;
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const rx = (ny - 0.5) * -12;  // maps [0,1] -> [6, -6]
    const ry = (nx - 0.5) * 16;   // maps [0,1] -> [-8, 8]
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-xl"
      style={{ perspective: '900px' }}
    >
      {/* Top border sweep */}
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

        {/* Mouse spotlight — pure CSS via custom properties */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(220px circle at var(--sx,50%) var(--sy,50%), rgba(0,212,255,0.08) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Ambient idle pulse */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.05) 0%, transparent 70%)' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4 + index * 0.9, repeat: Infinity, ease: 'easeInOut', delay: index * 0.7 }}
          aria-hidden="true"
        />

        {/* Icon with ping ripple */}
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

        {/* Bottom accent line — widens on hover */}
        <motion.div
          className="absolute bottom-0 left-0 h-px"
          style={{ background: 'linear-gradient(90deg, #8B5CF6, transparent)' }}
          initial={{ width: 0 }}
          whileHover={{ width: 56 }}
          animate={{ width: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

export default function AboutContent() {
  const [selectedExperience, setSelectedExperience] = useState(null);

  return (
    <>
      <section
        className="section-full flex-col text-center px-6 pt-28 relative overflow-hidden"
        aria-label="About hero"
      >
        <h1 className="font-serif font-bold text-display text-foreground will-change-transform text-balance">
          <TextReveal splitBy="word" delay={0.3} staggerDelay={0.1}>
            Dmitri De Freitas
          </TextReveal>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="font-mono text-xs uppercase tracking-[0.4em] text-accent mt-4"
        >
          <span className="relative inline-block" style={{ textShadow: '0 0 18px rgba(139,92,246,0.7)' }}>
            <motion.span
              animate={{ opacity: [1, 0.75, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
              style={{ display: 'inline' }}
            >
              Data Science &amp; Financial Engineering · WashU · Available May 2026
            </motion.span>
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-4 flex flex-wrap justify-center gap-2"
        >
          {["Dean's List", 'GPA 3.7'].map((honor, i) => (
            <motion.span
              key={honor}
              className="font-mono text-xs uppercase tracking-[0.2em] text-accent bg-surface border border-accent/25 rounded px-2 py-1"
              style={{ boxShadow: '0 0 10px rgba(139,92,246,0.35)' }}
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 + i * 1.4 }}
            >
              {honor}
            </motion.span>
          ))}
        </motion.div>
      </section>

      <div className="lg:max-w-[1400px] lg:mx-auto px-6 lg:px-12 py-12 relative">

        {/* Row 1: Background + Proficiency */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 mb-16 items-start">
          <section className="flex flex-col mb-12 lg:mb-0" aria-label="Background">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6 self-start"
            >
              Background
            </motion.p>
            <div className="flex flex-col gap-8">
              {storyParagraphs.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  className="text-base text-muted leading-relaxed font-sans"
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </section>

          <section aria-label="Skills Proficiency">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6"
            >
              Proficiency
            </motion.p>
            <div className="flex flex-col gap-7">
              {skillCategories.map((cat, ci) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: ci * 0.06 }}
                >
                  <div className="flex justify-between items-baseline mb-3">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                      {cat.name}
                    </p>
                    <span className="font-mono text-xs text-accent/70">
                      {cat.proficiency}%
                    </span>
                  </div>
                  <div className="h-[2px] bg-surface rounded">
                    <motion.div
                      className="h-full rounded"
                      style={{ background: 'linear-gradient(90deg, #8B5CF6, #4C1D95)' }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${cat.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: ci * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Row 2: Education + Professional Experience */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 mb-16 items-start">
          <section aria-label="Education">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6"
            >
              Education
            </motion.p>
            <div className="relative border-l border-border pl-8 flex flex-col gap-0">
              {education.map((edu, i) => (
                <motion.article
                  key={edu.school}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="py-7 relative"
                >
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
          </section>

          <section aria-label="Professional Experience">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6"
            >
              Professional Experience
            </motion.p>
            <div className="relative border-l border-border pl-8 flex flex-col gap-0">
              {financeExps.map((exp, i) => (
                <motion.article
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.06 }}
                  className="py-7 relative group cursor-pointer bg-transparent hover:bg-surface transition-colors rounded-xl px-5 -mx-5"
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
                </motion.article>
              ))}
            </div>
          </section>
        </div>

        {/* Row 3: Research — full width */}
        <section aria-label="Research">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6 text-center"
          >
            Research
          </motion.p>
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
            <div className="relative border-l border-border pl-8 flex flex-col gap-0">
              {researchExps.map((exp, i) => (
                <motion.article
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.07 }}
                  className="py-8 relative group cursor-pointer bg-transparent hover:bg-surface transition-colors rounded-xl px-5 -mx-5"
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
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section
        className="section-full px-6"
        aria-label="Philosophy"
      >
        <blockquote className="max-w-2xl text-center">
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
            — W. Edwards Deming
          </motion.p>
        </blockquote>
      </section>

      <section className="py-16 px-6 lg:px-12" aria-label="Personal Interests">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
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

      <section
        className="section-full flex-col text-center px-6"
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
