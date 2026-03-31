import Link from 'next/link';

const ITEMS = [
  { label: 'Data Science & Financial Engineering', href: null },
  { label: 'Washington University in St. Louis', href: null },
  { label: 'View Projects', href: '/projects' },
  { label: 'Get in Touch', href: '/contact' },
];

const tripled = [...ITEMS, ...ITEMS, ...ITEMS];

export default function InfoBanner() {
  return (
    <div className="relative overflow-hidden py-3 border-t border-border bg-surface/60 scroll-fade-edges">
      <div
        className="flex whitespace-nowrap"
        style={{
          width: 'max-content',
          animation: 'scroll-right 78s linear infinite',
          willChange: 'transform',
        }}
      >
        {tripled.map((item, i) =>
          item.href ? (
            <Link
              key={i}
              href={item.href}
              className="inline-flex items-center text-xs font-mono uppercase tracking-[0.2em] mx-8"
              style={{ textDecoration: 'none', color: '#8B5CF6' }}
            >
              <span
                className="w-1 h-1 rounded-full mr-4 flex-shrink-0"
                style={{ backgroundColor: '#8B5CF6' }}
              />
              {item.label}
            </Link>
          ) : (
            <span
              key={i}
              className="inline-flex items-center text-xs font-mono uppercase tracking-[0.2em] text-foreground/80 mx-8"
            >
              <span
                className="w-1 h-1 rounded-full mr-4 flex-shrink-0"
                style={{ backgroundColor: 'rgba(139,92,246,0.35)' }}
              />
              {item.label}
            </span>
          )
        )}
      </div>
    </div>
  );
}
