'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Linkedin, Mail } from 'lucide-react';
import MagneticButton from '@/components/effects/MagneticButton';
import { socialLinks, contactInfo } from '@/data/constants';

const NAV_LINKS = [
  { href: '/',        label: 'Home' },
  { href: '/about',   label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3 relative z-10" data-cursor="expand">
          <motion.span
            className="font-serif text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-200"
            whileHover={{ scale: 1.04 }}
          >
            D. De Freitas
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const isHome    = link.href === '/';
            const isContact = link.href === '/contact';
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] transition-colors duration-200 hover:text-accent"
                style={{ color: isActive ? '#8B5CF6' : '#9CA3AF' }}
                data-cursor="expand"
              >
                {isHome && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/35 hidden lg:block">
                    data sci
                  </span>
                )}
                {link.label}
                {isContact && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/35 hidden lg:block">
                    fin eng
                  </span>
                )}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4 relative z-10">
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors"
            aria-label="LinkedIn"
            data-cursor="expand"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${contactInfo.email}`}
            className="text-muted hover:text-accent transition-colors"
            aria-label="Email"
            data-cursor="expand"
          >
            <Mail className="h-4 w-4" />
          </a>
          <MagneticButton href={socialLinks.resume} target="_blank" rel="noopener noreferrer" variant="ghost" className="text-sm px-4 py-1.5" data-cursor="expand">
            Resume
          </MagneticButton>
        </div>

        <button
          className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-foreground transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          data-cursor="expand"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/98 backdrop-blur-md border-b border-border px-8 py-8 flex flex-col gap-6"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-mono text-xs uppercase tracking-[0.3em] transition-colors py-2 min-h-[44px] flex items-center"
                  style={{ color: isActive ? '#8B5CF6' : '#F9FAFB' }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-accent transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href={`mailto:${contactInfo.email}`} aria-label="Email" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-accent transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
