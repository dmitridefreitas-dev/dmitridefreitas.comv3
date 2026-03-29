'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const PARTICLE_COUNT = 600;
const CONNECTION_DISTANCE = 1.2;
const MAX_CONNECTIONS = 800;

function ParticleField() {
  const pointsRef = useRef();
  const linesRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 1.5;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const origin = useMemo(() => positions.slice(), [positions]);
  const linePos = useMemo(() => new Float32Array(MAX_CONNECTIONS * 6), []);
  const lineCol = useMemo(() => new Float32Array(MAX_CONNECTIONS * 6), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const cur = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      cur[i * 3]     = origin[i * 3]     + Math.sin(t * 0.3 + i * 0.05) * 0.08;
      cur[i * 3 + 1] = origin[i * 3 + 1] + Math.cos(t * 0.2 + i * 0.07) * 0.08;
      cur[i * 3 + 2] = origin[i * 3 + 2] + Math.sin(t * 0.25 + i * 0.04) * 0.08;

      // mouse repulsion
      const dx = cur[i * 3] - mouse.current.x * 4;
      const dy = cur[i * 3 + 1] - mouse.current.y * 4;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 1.2 && d > 0) {
        const f = (1.2 - d) / 1.2 * 0.25;
        cur[i * 3]     += (dx / d) * f;
        cur[i * 3 + 1] += (dy / d) * f;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // connections — only check every other particle to halve cost
    let idx = 0;
    const lp = linesRef.current.geometry.attributes.position.array;
    const lc = linesRef.current.geometry.attributes.color.array;

    for (let i = 0; i < PARTICLE_COUNT && idx < MAX_CONNECTIONS; i += 2) {
      for (let j = i + 1; j < PARTICLE_COUNT && idx < MAX_CONNECTIONS; j += 2) {
        const dx = cur[i*3] - cur[j*3];
        const dy = cur[i*3+1] - cur[j*3+1];
        const dz = cur[i*3+2] - cur[j*3+2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist < CONNECTION_DISTANCE) {
          const a = 1 - dist / CONNECTION_DISTANCE;
          lp[idx*6]   = cur[i*3];   lp[idx*6+1] = cur[i*3+1]; lp[idx*6+2] = cur[i*3+2];
          lp[idx*6+3] = cur[j*3];   lp[idx*6+4] = cur[j*3+1]; lp[idx*6+5] = cur[j*3+2];
          lc[idx*6]   = 0;  lc[idx*6+1] = a*0.8; lc[idx*6+2] = a;
          lc[idx*6+3] = 0.2;lc[idx*6+4] = a*0.3; lc[idx*6+5] = a;
          idx++;
        }
      }
    }
    for (let i = idx; i < MAX_CONNECTIONS; i++) {
      lp[i*6] = lp[i*6+1] = lp[i*6+2] = lp[i*6+3] = lp[i*6+4] = lp[i*6+5] = 0;
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <group onPointerMove={(e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#00eeff" transparent opacity={0.85} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineCol, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

function Scene() {
  const ref = useRef();
  useFrame(({ clock }) => { ref.current.rotation.y = clock.getElapsedTime() * 0.04; });
  return <group ref={ref}><ParticleField /></group>;
}

export default function NeuralLatentSpace() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 60 }} style={{ background: '#000008' }} gl={{ antialias: false, powerPreference: 'high-performance' }}>
      <Scene />
      <EffectComposer>
        <Bloom intensity={1.0} luminanceThreshold={0.15} luminanceSmoothing={0.9} radius={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
