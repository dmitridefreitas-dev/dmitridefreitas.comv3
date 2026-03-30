'use client';
import { motion } from 'framer-motion';
import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/lib/utils';

export default function MagneticButton({
  children,
  className,
  onClick,
  href,
  target,
  rel,
  variant = 'default',
  size = 'default',
  disabled = false,
  type = 'button',
  asChild = false,
}) {
  const { ref, position, handleMouseMove, handleMouseLeave } = useMagnetic(0.3);

  const baseStyles =
    'relative inline-flex items-center justify-center font-mono text-sm uppercase tracking-wider transition-colors transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default:
      'border border-accent text-accent bg-transparent hover:bg-accent/10 hover:text-foreground shadow-[3px_3px_0px_0px_rgba(139,92,246,1)] hover:shadow-none hover:translate-y-[3px] hover:translate-x-[3px] transition-all rounded-none',
    outline:
      'border border-accent/50 text-accent hover:bg-accent/10 hover:border-accent/70 rounded-none shadow-[3px_3px_0px_0px_rgba(139,92,246,0.55)] hover:shadow-none hover:translate-y-[3px] hover:translate-x-[3px] transition-all',
    ghost: 'text-muted hover:text-foreground hover:bg-surface-hover rounded-none',
  };

  const sizes = {
    default: 'h-11 px-6 py-2',
    sm: 'h-9 px-4 text-xs',
    lg: 'h-14 px-8 py-3 text-base',
    icon: 'h-10 w-10',
  };

  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  const content = (
    <motion.span
      className="relative z-10 flex items-center gap-2"
      animate={{ x: position.x * 0.5, y: position.y * 0.5 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.span>
  );

  const Tag = href ? 'a' : 'button';
  const linkProps = href ? { href, target, rel } : { type, disabled };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.2 }}
      className="inline-block"
    >
      <Tag onClick={onClick} className={classes} {...linkProps}>
        {content}
      </Tag>
    </motion.div>
  );
}
