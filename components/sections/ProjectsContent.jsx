'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import TextReveal from '@/components/effects/TextReveal';
import ProjectDetailModal from '@/components/modals/ProjectDetailModal';
import { allProjects, projectCategories } from '@/data/projects';
import { ArrowUpRight, FileText } from 'lucide-react';

function ProjectRow({ project, index, onOpen }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border-b border-border py-5 cursor-pointer hover:bg-surface transition-all rounded-lg px-4 -mx-4 overflow-hidden"
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(project)}
      data-cursor="expand"
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
        <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-1 md:w-24 flex-shrink-0">
          <span
            className="font-serif font-bold text-3xl leading-none group-hover:text-accent transition-colors"
            style={{ color: 'rgba(139,92,246,0.15)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {project.category}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-lg md:text-xl text-foreground group-hover:text-accent transition-colors leading-snug mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-muted leading-relaxed max-w-2xl">
            {project.shortDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs uppercase tracking-[0.15em] text-muted border border-border rounded px-2 py-0.5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex md:flex-col items-center gap-3 md:gap-2 flex-shrink-0">
          {project.reportLink && project.reportLink !== '#' && (
            <a
              href={project.reportLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-accent hover:text-accent/80 transition-colors"
              aria-label="View report"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Report</span>
            </a>
          )}
          <span className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.15em] text-muted group-hover:text-accent transition-colors">
            Details <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

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
      <section
        className="section-full flex-col text-center px-6 overflow-hidden pt-28"
        aria-label="Projects hero"
      >
        {/* Slow-pulsing ghost watermark */}
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
          animate={{ opacity: [0.025, 0.055, 0.025] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          Finance
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-xs uppercase tracking-[0.4em] text-accent mb-6 relative z-10"
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 0px rgba(139,92,246,0)',
                '0 0 16px rgba(139,92,246,0.65)',
                '0 0 0px rgba(139,92,246,0)',
              ],
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            style={{ display: 'inline' }}
          >
            Experience &amp; Projects
          </motion.span>
        </motion.p>

        <h1 className="font-serif font-bold text-display text-foreground text-balance will-change-transform relative z-10">
          <TextReveal splitBy="word" delay={0.4} staggerDelay={0.1}>
            Projects &amp; Research
          </TextReveal>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted mt-6 relative z-10"
        >
          {allProjects.length} Projects
        </motion.p>
      </section>

      <section className="px-6 lg:px-16 py-16" aria-label="All projects">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-8">
            {projectCategories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="font-mono text-xs uppercase tracking-[0.25em] px-4 py-2 rounded-lg border transition-all"
                style={{
                  background: activeCategory === cat ? '#8B5CF6' : 'transparent',
                  color: activeCategory === cat ? '#FFFFFF' : '#9CA3AF',
                  borderColor: activeCategory === cat ? '#8B5CF6' : '#160e24',
                }}
                data-cursor="expand"
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeCategory}>
              {filtered.map((project, i) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={i}
                  onOpen={setSelectedProject}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

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
