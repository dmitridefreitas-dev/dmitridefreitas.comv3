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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Identity */}
          <div className="flex-shrink-0">
            <p className="font-serif text-sm font-bold text-foreground">Dmitri De Freitas</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted/60 mt-0.5">
              Data Science &amp; Financial Engineering · WashU
            </p>
          </div>

          {/* Nav links — centered on larger screens */}
          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/70 hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 flex items-center justify-center text-muted/70 hover:text-accent transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              aria-label="Email"
              className="w-8 h-8 flex items-center justify-center text-muted/70 hover:text-accent transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
            </a>
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
