'use client';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';
import { socialLinks, contactInfo } from '@/data/constants';
import { NavigateContext } from '@/components/layout/WormholeContext';

const NAV_LINKS = [
  { scene: 0, label: 'Home' },
  { scene: 3, label: 'About' },
  { scene: 4, label: 'Projects' },
  { scene: 5, label: 'Contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const navigateTo = useContext(NavigateContext);

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #050810 0%, #02030A 100%)',
        boxShadow: '0 -1px 0 rgba(0,212,255,0.06), 0 -8px 32px rgba(0,212,255,0.03)',
      }}
    >
      {/* Top edge crystal highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.15) 30%, rgba(139,92,246,0.1) 70%, transparent 100%)' }}
      />
      {/* Diagonal facet */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(140deg, rgba(0,212,255,0.02) 0%, transparent 45%, rgba(139,92,246,0.015) 100%)' }}
      />
      <div className="max-w-6xl mx-auto px-8 py-6 relative z-10">

        {/* Main row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

          {/* Name only */}
          <p className="font-serif text-sm font-bold text-foreground flex-shrink-0">Dmitri De Freitas</p>

          {/* Subtitle + nav + social — all on one line */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/60">
              Data Science &amp; Financial Engineering · WashU
            </span>
            <span className="text-muted/25 hidden sm:inline">·</span>
            <nav className="flex items-center gap-4" aria-label="Footer navigation">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.scene}
                  onClick={() => navigateTo?.(link.scene)}
                  className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/60 hover:text-accent transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <span className="text-muted/25 hidden sm:inline">·</span>
            <div className="flex items-center gap-0.5">
              <motion.a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-7 h-7 flex items-center justify-center text-muted/60 hover:text-accent transition-colors"
                whileHover={{ y: -2, scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Linkedin className="h-3 w-3" />
              </motion.a>
              <motion.a
                href={`mailto:${contactInfo.email}`}
                aria-label="Email"
                className="w-7 h-7 flex items-center justify-center text-muted/60 hover:text-accent transition-colors"
                whileHover={{ y: -2, scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Mail className="h-3 w-3" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-4 pt-4 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/50">
            &copy; {year} Dmitri De Freitas &middot; St. Louis, MO
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/50">
            Available for Full-Time Roles &middot; May 2026
          </p>
        </div>

      </div>
    </footer>
  );
}
