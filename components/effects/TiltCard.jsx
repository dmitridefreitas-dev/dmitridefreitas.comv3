'use client';
import { useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';

const SPRING = { stiffness: 260, damping: 28 };
const MAX_TILT = 8;

export default function TiltCard({ children, className = '', style = {}, disabled = false }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });

  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);

  const handleMouseMove = useCallback((e) => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    rotateX.set(-dy * MAX_TILT);
    rotateY.set(dx * MAX_TILT);

    const lx = ((e.clientX - rect.left) / rect.width) * 100;
    const ly = ((e.clientY - rect.top) / rect.height) * 100;
    setLightPos({ x: lx, y: ly });
  }, [disabled, rotateX, rotateY]);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) setIsHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '800px',
        ...style,
      }}
      className={className}
    >
      {children}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(
              circle 200px at ${lightPos.x}% ${lightPos.y}%,
              rgba(139,92,246,0.05) 0%,
              rgba(76,29,149,0.03) 40%,
              transparent 70%
            )`,
            opacity: 1,
          }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}
