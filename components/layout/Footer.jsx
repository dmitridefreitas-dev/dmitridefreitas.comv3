'use client';
import Link from 'next/link';
import { Linkedin, Mail } from 'lucide-react';
import { socialLinks, contactInfo } from '@/data/constants';

const NAV_LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact',  label: 'Contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-8 py-6">

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
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/60 hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <span className="text-muted/25 hidden sm:inline">·</span>
            <div className="flex items-center gap-0.5">
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-7 h-7 flex items-center justify-center text-muted/60 hover:text-accent transition-colors"
              >
                <Linkedin className="h-3 w-3" />
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                aria-label="Email"
                className="w-7 h-7 flex items-center justify-center text-muted/60 hover:text-accent transition-colors"
              >
                <Mail className="h-3 w-3" />
              </a>
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
