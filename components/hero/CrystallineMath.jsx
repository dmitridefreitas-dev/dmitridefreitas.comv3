'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ── shared mouse state ─────────────────────────────── */
const mouse = { x: 0, y: 0 };

/* ── Corner Particles ───────────────────────────────── */
const PARTICLES_PER_CORNER = 18;
const CORNER_COUNT = 4;
const TOTAL_PARTICLES = PARTICLES_PER_CORNER * CORNER_COUNT;
const CONNECTION_DIST = 0.9;
const MAX_CONNECTIONS = 60;

// corners in world‑space (camera at z=5, fov 55 → ~±4.5 x, ~±2.8 y)
const CORNERS = [
  { x: -4.2, y:  2.6 },
  { x:  4.2, y:  2.6 },
  { x: -4.2, y: -2.6 },
  { x:  4.2, y: -2.6 },
];

function CornerParticles() {
  const pointsRef = useRef();
  const linesRef  = useRef();

  const positions = useMemo(() => {
    const p = new Float32Array(TOTAL_PARTICLES * 3);
    CORNERS.forEach((c, ci) => {
      for (let i = 0; i < PARTICLES_PER_CORNER; i++) {
        const idx = (ci * PARTICLES_PER_CORNER + i) * 3;
        p[idx]     = c.x + (Math.random() - 0.5) * 2.8;
        p[idx + 1] = c.y + (Math.random() - 0.5) * 2.2;
        p[idx + 2] = (Math.random() - 0.5) * 1.5;
      }
    });
    return p;
  }, []);

  const origin  = useMemo(() => positions.slice(), [positions]);
  const linePos = useMemo(() => new Float32Array(MAX_CONNECTIONS * 6), []);
  const lineCol = useMemo(() => new Float32Array(MAX_CONNECTIONS * 6), []);

  useFrame(({ clock }) => {
    const t   = clock.getElapsedTime();
    const cur = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const i3 = i * 3;
      cur[i3]     = origin[i3]     + Math.sin(t * 0.35 + i * 0.06) * 0.06;
      cur[i3 + 1] = origin[i3 + 1] + Math.cos(t * 0.25 + i * 0.08) * 0.06;
      cur[i3 + 2] = origin[i3 + 2] + Math.sin(t * 0.2  + i * 0.04) * 0.06;

      // mouse repulsion
      const mx = mouse.x * 5;
      const my = mouse.y * 3;
      const dx = cur[i3]     - mx;
      const dy = cur[i3 + 1] - my;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 1.8 && d > 0) {
        const f = (1.8 - d) / 1.8 * 0.35;
        cur[i3]     += (dx / d) * f;
        cur[i3 + 1] += (dy / d) * f;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // connections within each corner cluster
    let idx = 0;
    const lp = linesRef.current.geometry.attributes.position.array;
    const lc = linesRef.current.geometry.attributes.color.array;

    for (let ci = 0; ci < CORNER_COUNT && idx < MAX_CONNECTIONS; ci++) {
      const start = ci * PARTICLES_PER_CORNER;
      const end   = start + PARTICLES_PER_CORNER;
      for (let a = start; a < end && idx < MAX_CONNECTIONS; a += 1) {
        for (let b = a + 1; b < end && idx < MAX_CONNECTIONS; b += 1) {
          const dx = cur[a*3] - cur[b*3];
          const dy = cur[a*3+1] - cur[b*3+1];
          const dz = cur[a*3+2] - cur[b*3+2];
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < CONNECTION_DIST) {
            const alpha = 1 - dist / CONNECTION_DIST;
            const o = idx * 6;
            lp[o]   = cur[a*3]; lp[o+1] = cur[a*3+1]; lp[o+2] = cur[a*3+2];
            lp[o+3] = cur[b*3]; lp[o+4] = cur[b*3+1]; lp[o+5] = cur[b*3+2];
            // cyan ➜ purple gradient
            lc[o]   = alpha*0.3; lc[o+1] = alpha*0.6; lc[o+2] = alpha;
            lc[o+3] = alpha*0.4; lc[o+4] = alpha*0.2; lc[o+5] = alpha*0.9;
            idx++;
          }
        }
      }
    }
    for (let i = idx; i < MAX_CONNECTIONS; i++) {
      const o = i * 6;
      lp[o] = lp[o+1] = lp[o+2] = lp[o+3] = lp[o+4] = lp[o+5] = 0;
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate    = true;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#AD8BFF" transparent opacity={0.9} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
          <bufferAttribute attach="attributes-color"    args={[lineCol, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

/* ── Crystal components ─────────────────────────────── */

function GlowingCore() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.material.emissiveIntensity = 1.5 + Math.sin(clock.getElapsedTime() * 2) * 0.5;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.35, 16, 16]} />
      <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
    </mesh>
  );
}

function GlassIcosahedron() {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.15 + mouse.y * 0.3;
    ref.current.rotation.y = t * 0.2  + mouse.x * 0.3;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.4, 0]} />
      <meshStandardMaterial
        color="#9988ff"
        transparent
        opacity={0.18}
        roughness={0.1}
        metalness={0.2}
      />
    </mesh>
  );
}

function IcosahedronWireframe() {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.15 + mouse.y * 0.3;
    ref.current.rotation.y = t * 0.2  + mouse.x * 0.3;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.42, 0]} />
      <meshBasicMaterial color="#AD8BFF" wireframe transparent opacity={0.8} />
    </mesh>
  );
}

function OrbitingOrb({ radius, speed, offset, yOffset, color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = yOffset + Math.sin(t * 1.3) * 0.2;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} />
    </mesh>
  );
}

const ORBS = [
  { radius: 2.2, speed: 0.4,  offset: 0,   yOffset: 0,    color: '#AD8BFF' },
  { radius: 2.5, speed: 0.3,  offset: 1.0, yOffset: 0.5,  color: '#00ffff' },
  { radius: 2.0, speed: 0.5,  offset: 2.1, yOffset: -0.4, color: '#AD8BFF' },
];

function RimLight() {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.5;
    ref.current.position.x = Math.cos(t) * 4;
    ref.current.position.z = Math.sin(t) * 4;
  });
  return <pointLight ref={ref} color="#AD8BFF" intensity={12} distance={10} />;
}

/* ── Mouse tracker (invisible plane) ────────────────── */
function MouseTracker() {
  const { viewport } = useThree();
  return (
    <mesh
      visible={false}
      position={[0, 0, 0]}
      onPointerMove={(e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      }}
    >
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      <meshBasicMaterial />
    </mesh>
  );
}

/* ── Main export ────────────────────────────────────── */
export default function CrystallineMath() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 5], fov: 55 }}
      style={{ background: '#02030A' }}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        depth: false,
        stencil: false,
        alpha: false,
      }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} color="#00ffff" intensity={1} distance={5} />
      <RimLight />

      <MouseTracker />

      <GlassIcosahedron />
      <IcosahedronWireframe />
      <GlowingCore />

      {ORBS.map((orb, i) => <OrbitingOrb key={i} {...orb} />)}

      <CornerParticles />
    </Canvas>
  );
}
