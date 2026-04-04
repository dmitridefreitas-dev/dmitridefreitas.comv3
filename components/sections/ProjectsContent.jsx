'use client';
import { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextReveal from '@/components/effects/TextReveal';
import ProjectDetailModal from '@/components/modals/ProjectDetailModal';
import { allProjects, projectCategories } from '@/data/projects';
import { ArrowUpRight, FileText, Layers, ChevronRight } from 'lucide-react';

/* ── category accent colors ───────────────────────────────────────────────── */
const CATEGORY_COLORS = {
  'Quantitative Finance': '#8B5CF6',
  'Data Science': '#00D4FF',
  'Statistical Modeling': '#00E5A0',
};

const getCategoryColor = (cat) => CATEGORY_COLORS[cat] || '#8B5CF6';

/* ── featured project id ──────────────────────────────────────────────────── */
const FEATURED_ID = 'pead';

/* ── animations ───────────────────────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
};

/* ── project card ─────────────────────────────────────────────────────────── */
function ProjectCard({ project, index, onOpen, isFeatured }) {
  const cardRef = useRef(null);
  const color = getCategoryColor(project.category);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const ny = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    cardRef.current.style.setProperty('--mx', `${nx}%`);
    cardRef.current.style.setProperty('--my', `${ny}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--mx', '50%');
      cardRef.current.style.setProperty('--my', '50%');
    }
  }, []);

  return (
    <motion.article
      ref={cardRef}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isFeatured ? 'md:col-span-2 md:row-span-1' : ''
      }`}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(project)}
      data-cursor="expand"
      style={{ '--mx': '50%', '--my': '50%' }}
    >
      {/* Top accent border in category color */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-20"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}80, transparent)` }}
      />

      {/* Card body */}
      <div
        className="relative border border-border rounded-xl p-6 bg-[#080E1C]/70 h-full flex flex-col transition-all duration-300 group-hover:border-opacity-50"
        style={{
          borderTopColor: `${color}30`,
        }}
      >
        {/* Mouse spotlight */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(300px circle at var(--mx) var(--my), ${color}12 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        {/* Featured glow for featured card */}
        {isFeatured && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${color}10 0%, transparent 70%)`,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        )}

        {/* Header: category badge + index */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 rounded border"
            style={{
              color,
              borderColor: `${color}30`,
              backgroundColor: `${color}08`,
            }}
          >
            {project.category}
          </span>
          <span
            className="font-mono text-xs tracking-wide"
            style={{ color: `${color}30` }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-lg md:text-xl text-foreground mb-2 group-hover:text-accent transition-colors leading-snug relative z-10">
          {project.title}
        </h3>

        {/* Date */}
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60 mb-3 relative z-10">
          {project.date}
        </p>

        {/* Description */}
        <p className="text-sm text-muted leading-relaxed mb-4 flex-grow relative z-10 line-clamp-3">
          {project.shortDescription}
        </p>

        {/* Tech stack pills */}
        <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
          {project.tech.slice(0, isFeatured ? 5 : 4).map((tech) => (
            <span
              key={tech}
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted/70 border border-border rounded px-2 py-0.5 bg-surface/30"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > (isFeatured ? 5 : 4) && (
            <span className="font-mono text-[10px] text-muted/40 px-1 py-0.5">
              +{project.tech.length - (isFeatured ? 5 : 4)}
            </span>
          )}
        </div>

        {/* Metrics for featured card */}
        {isFeatured && project.metrics && (
          <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
            {project.metrics.map((m) => (
              <div key={m.label} className="bg-surface/50 rounded-lg px-3 py-2 border border-border">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/60 mb-0.5">{m.label}</p>
                <p className="font-serif font-bold text-sm text-foreground">{m.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Footer: links */}
        <div className="flex items-center gap-4 relative z-10 mt-auto pt-3 border-t border-border">
          {project.reportLink && project.reportLink !== '#' && (
            <a
              href={project.reportLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-accent hover:text-accent/80 transition-colors"
              aria-label="View report"
            >
              <FileText className="h-3.5 w-3.5" />
              Report
            </a>
          )}
          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted group-hover:text-accent transition-colors ml-auto">
            View Details
            <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ── main component ───────────────────────────────────────────────────────── */
export default function ProjectsContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = useMemo(
    () => activeCategory === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative text-center px-6 overflow-hidden pt-32 pb-16"
        aria-label="Projects hero"
      >
        {/* Ghost watermark */}
        <motion.p
          className="absolute font-mono font-bold select-none pointer-events-none"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 7rem)',
            color: 'rgba(139,92,246,1)',
            letterSpacing: '-0.06em',
            lineHeight: 1,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
          }}
          animate={{ opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          Research
        </motion.p>

        {/* Decorative symbols */}
        {['def', '()', '[]', '{}'].map((sym, i) => (
          <motion.span
            key={sym}
            className="font-mono absolute select-none pointer-events-none"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              color: i % 2 === 0 ? 'rgba(0,212,255,0.05)' : 'rgba(139,92,246,0.05)',
              top: `${20 + i * 15}%`,
              [i % 2 === 0 ? 'left' : 'right']: `${5 + i * 3}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, i % 2 === 0 ? -6 : 6, 0] }}
            transition={{
              opacity: { delay: 0.8 + i * 0.15, duration: 1 },
              y: { duration: 7 + i * 2, repeat: Infinity, ease: 'easeInOut' },
            }}
            aria-hidden="true"
          >
            {sym}
          </motion.span>
        ))}

        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-xs uppercase tracking-[0.4em] mb-6 relative z-10"
          style={{ color: '#AD8BFF' }}
        >
          <span className="relative inline-block" style={{ textShadow: '0 0 20px rgba(173, 139, 255, 0.4)' }}>
            <motion.span
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              style={{ display: 'inline' }}
            >
              Experience &amp; Projects
            </motion.span>
          </span>
        </motion.p>

        <h1 className="font-serif font-bold text-foreground text-balance will-change-transform relative z-10" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
          <TextReveal splitBy="word" delay={0.4} staggerDelay={0.1} center>
            PROJECTS
          </TextReveal>
        </h1>

        {/* Counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-6 relative z-10 flex items-center justify-center gap-3"
        >
          <Layers className="h-3.5 w-3.5 text-muted/50" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            {allProjects.length} Projects &nbsp;&middot;&nbsp; {projectCategories.length - 1} Domains
          </span>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FILTER TABS + PROJECT GRID
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 lg:px-16 py-12" aria-label="All projects">
        <div className="max-w-6xl mx-auto">
          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {projectCategories.map((cat) => {
              const isActive = activeCategory === cat;
              const catColor = cat === 'All' ? '#8B5CF6' : getCategoryColor(cat);
              return (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="font-mono text-xs uppercase tracking-[0.25em] px-4 py-2.5 rounded-lg border transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: isActive ? catColor : 'transparent',
                    color: isActive ? '#FFFFFF' : '#9CA3AF',
                    borderColor: isActive ? catColor : 'rgba(0,212,255,0.08)',
                    boxShadow: isActive ? `0 0 20px ${catColor}30` : 'none',
                  }}
                  data-cursor="expand"
                >
                  {cat}
                  {isActive && (
                    <motion.span
                      layoutId="active-filter-glow"
                      className="absolute inset-0 rounded-lg"
                      style={{ boxShadow: `inset 0 0 20px ${catColor}20` }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Project cards grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onOpen={setSelectedProject}
                  isFeatured={project.id === FEATURED_ID && activeCategory === 'All'}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                No projects in this category yet
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Project Detail Modal ───────────────────────────────────────────── */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
