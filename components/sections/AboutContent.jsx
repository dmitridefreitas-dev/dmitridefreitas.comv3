'use client';
import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import TextReveal from '@/components/effects/TextReveal';
import MagneticButton from '@/components/effects/MagneticButton';
import ExperienceModal from '@/components/modals/ExperienceModal';
import { education } from '@/data/education';
import { experiences } from '@/data/experiences';
import { skillCategories } from '@/data/skills';
import { socialLinks } from '@/data/constants';
import { ArrowUpRight, Linkedin, Trees, Wind, Flower2 } from 'lucide-react';

const storyParagraphs = [
  "I'm pursuing a Bachelor of Science in Financial Engineering with a Minor in Accounting at Washington University in St. Louis, graduating December 2027.",
  "My professional experience spans financial planning & analysis at Centene Corporation, audit & assurance at Anders CPA Advisors, and an upcoming summer analyst position at MUFG — one of the world's largest financial groups.",
  "My research focuses on credit risk analysis, where I've built OLS regression models to isolate drivers of credit spread widening and analyzed non-linear credit elasticity across yield curve inversions.",
  "I'm seeking opportunities in investment banking, asset management, and corporate finance starting Summer 2026.",
];

const financeExps = experiences.filter((e) => e.type === 'finance');
const researchExps = experiences.filter((e) => e.type === 'research');

const personalInterests = [
  {
    icon: Trees,
    title: 'Golfing',
    description: 'Enjoy the strategy and precision of golf — a great way to stay sharp and network on the course.',
  },
  {
    icon: Wind,
    title: 'Paragliding',
    description: 'An adrenaline-driven passion for paragliding and exploring new perspectives from above.',
  },
  {
    icon: Flower2,
    title: 'Horticulture',
    description: 'A grounding interest in cultivating plants and understanding the patience required for growth.',
  },
];

function InterestCard({ interest, index }) {
  const Icon = interest.icon;
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const spotlightX = useTransform(springX, [0, 1], ['0%', '100%']);
  const spotlightY = useTransform(springY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };
  const handleMouseLeave = () => { mouseX.set(0.5); mouseY.set(0.5); };

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
    >
      {/* Top border sweep */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px origin-left z-20"
        style={{ background: 'linear-gradient(90deg, transparent, #8B5CF6, #C4B5FD, transparent)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: index * 0.12 + 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative border border-[#160e24] bg-[#080810]/60 p-7 rounded-xl overflow-hidden transition-colors duration-500 group-hover:border-accent/25 flex gap-5 items-start">

        {/* Mouse spotlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([x, y]) => `radial-gradient(220px circle at ${x} ${y}, rgba(139,92,246,0.1) 0%, transparent 70%)`
            ),
          }}
          aria-hidden="true"
        />

        {/* Ambient idle pulse */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.07) 0%, transparent 70%)' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4 + index * 0.9, repeat: Infinity, ease: 'easeInOut', delay: index * 0.7 }}
          aria-hidden="true"
        />

        {/* Icon with ping ripple */}
        <div className="flex-shrink-0 relative">
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{ background: 'rgba(139,92,246,0.25)' }}
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
<motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="relative mb-6"
        >
          <div className="headshot-ring-outer" aria-hidden="true" />
          <div className="headshot-glow-pulse" aria-hidden="true" />
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden ring-1 ring-accent/20 headshot-container"
            style={{ boxShadow: '0 0 60px rgba(139,92,246,0.22)' }}
          >
            {/* Negative inset zooms the image; rounded-full overflow-hidden on parent keeps it a circle */}
            <div style={{ position: 'absolute', inset: '-18%' }}>
              <Image
                src="/images/erich-headshot.png"
                alt="Erich Huang"
                fill
                className="object-cover"
                style={{ objectPosition: '50% 8%' }}
                priority
              />
            </div>
          </motion.div>
        </motion.div>

        <h1 className="font-serif font-bold text-display text-foreground will-change-transform text-balance">
          <TextReveal splitBy="word" delay={0.3} staggerDelay={0.1}>
            Erich Huang
          </TextReveal>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="font-mono text-xs uppercase tracking-[0.4em] text-accent mt-4"
        >
          {/* Slow glow pulse on the subtitle text */}
          <motion.span
            animate={{
              textShadow: [
                '0 0 0px rgba(139,92,246,0)',
                '0 0 18px rgba(139,92,246,0.7)',
                '0 0 0px rgba(139,92,246,0)',
              ],
              opacity: [1, 0.75, 1],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
            style={{ display: 'inline' }}
          >
            Financial Engineering &amp; Accounting · WashU · Available Summer 2026
          </motion.span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-4 flex flex-wrap justify-center gap-2"
        >
          {['Pi Mu Epsilon', 'Phi Beta Kappa'].map((honor, i) => (
            <motion.span
              key={honor}
              className="font-mono text-xs uppercase tracking-[0.2em] text-accent bg-surface border border-accent/25 rounded px-2 py-1"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(139,92,246,0)',
                  '0 0 10px rgba(139,92,246,0.35)',
                  '0 0 0px rgba(139,92,246,0)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 + i * 1.4 }}
            >
              {honor}
            </motion.span>
          ))}
        </motion.div>
      </section>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-16 lg:max-w-[1400px] lg:mx-auto px-6 lg:px-12 py-12 relative items-start">

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

        <section className="mb-12 lg:mb-0" aria-label="Professional Experience">
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
                    style={{ backgroundColor: 'rgba(139,92,246,0.4)' }}
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
                <h3 className="font-serif font-bold text-base md:text-lg text-foreground mb-1 group-hover:text-accent transition-colors leading-snug">
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

        <div className="flex flex-col mb-12 lg:mb-0">
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
                      style={{ backgroundColor: 'rgba(139,92,246,0.4)' }}
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
                  <h3 className="font-serif font-bold text-base md:text-lg text-foreground mb-1">
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

          <section className="pt-0 lg:-mt-[1px]" aria-label="Research">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-xs uppercase tracking-[0.4em] text-muted mb-6 mt-8"
            >
              Research
            </motion.p>

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
                      style={{ backgroundColor: 'rgba(139,92,246,0.4)' }}
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
                  <h3 className="font-serif font-bold text-lg md:text-xl text-foreground mb-1 group-hover:text-accent transition-colors leading-snug">
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
          </section>
        </div>

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
            &ldquo;The stock market is a device for transferring money from the impatient to the patient.&rdquo;
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="font-mono text-xs uppercase tracking-[0.3em] text-muted mt-6"
          >
            — Warren Buffett
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
