'use client';
import Link from 'next/link';
import { Linkedin, Mail } from 'lucide-react';
import { socialLinks, contactInfo } from '@/data/constants';
import FooterMeters from './FooterMeters';

const NAV_LINKS = [
  { href: '/',        label: 'Home' },
  { href: '/about',   label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-surface/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          <div>
            <p className="font-serif text-lg font-bold text-foreground">Dmitri De Freitas</p>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted mt-1">
              Data Science &amp; Financial Engineering · WashU
            </p>
          </div>

          <nav className="flex-1 flex justify-center flex-wrap gap-4" aria-label="Footer navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.25em] text-muted hover:text-accent transition-colors py-2 min-h-[44px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-accent transition-colors"
              data-cursor="expand"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              aria-label="Email"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-accent transition-colors"
              data-cursor="expand"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <FooterMeters />

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            &copy; {year} Dmitri De Freitas &middot; St. Louis, MO
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Available for Full-Time Roles &middot; May 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
