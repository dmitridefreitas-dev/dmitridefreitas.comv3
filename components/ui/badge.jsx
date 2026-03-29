import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'bg-accent/10 text-accent border border-accent/20',
        secondary: 'bg-surface text-muted border border-border',
        outline: 'border border-border text-muted',
        destructive: 'bg-red-950/30 text-red-400 border border-red-800/30',
        award: 'bg-amber-950/30 text-amber-400 border border-amber-800/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
