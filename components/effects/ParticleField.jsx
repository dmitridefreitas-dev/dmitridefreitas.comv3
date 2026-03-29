'use client';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function Particle({ x, y, size, duration, delay }) {
  return (
    <motion.div
      className="absolute rounded-full bg-violet-400/15"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, Math.random() > 0.5 ? 15 : -15, 0],
        opacity: [0.08, 0.25, 0.08],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function ParticleField() {
  const [particles, setParticles] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 3000], [0, -150]);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined' || window.innerWidth < 768) return;

    const generated = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10,
    }));

    setParticles(generated);
  }, []);

  if (!isMounted || particles.length === 0) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ y: parallaxY, zIndex: 0 }}
    >
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </motion.div>
  );
}
