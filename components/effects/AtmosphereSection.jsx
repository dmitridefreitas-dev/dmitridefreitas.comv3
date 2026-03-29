'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const VARS = {
  hero: { hue: '220', intensity: '1', wash: '0.55' },
  ticker: { hue: '222', intensity: '0.98', wash: '0.5' },
  metrics: { hue: '224', intensity: '1', wash: '0.6' },
  work: { hue: '226', intensity: '1.1', wash: '0.75' },
  skills: { hue: '218', intensity: '1.02', wash: '0.65' },
  competencies: { hue: '216', intensity: '0.96', wash: '0.58' },
  journey: { hue: '214', intensity: '0.94', wash: '0.52' },
  cta: { hue: '228', intensity: '1.14', wash: '0.82' },
  default: { hue: '220', intensity: '1', wash: '0.62' },
};

export default function AtmosphereSection({
  atmosphere = 'default',
  children,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin: '-42% 0px -42% 0px',
    amount: 0.12,
  });

  useEffect(() => {
    if (!isInView) return;
    const v = VARS[atmosphere] ?? VARS.default;
    const root = document.documentElement;
    root.style.setProperty('--atmosphere-hue', v.hue);
    root.style.setProperty('--blob-intensity', v.intensity);
    root.style.setProperty('--atmosphere-wash', v.wash);
    root.setAttribute('data-atmosphere', atmosphere);
  }, [isInView, atmosphere]);

  return (
    <Tag ref={ref} data-atmosphere={atmosphere} className={className} {...rest}>
      {children}
    </Tag>
  );
}
