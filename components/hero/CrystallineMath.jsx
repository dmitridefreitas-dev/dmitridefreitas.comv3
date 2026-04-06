'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ── shared module-level state ──────────────────────── */
const mouse    = { x: 0, y: 0 };
const rawMouse = { x: 0, y: 0 };
const sceneActive = { value: true };
let   invalidateScene = null; // stored on mount, used to kick-start from outside canvas

function lerpMouse() {
  mouse.x += (rawMouse.x - mouse.x) * 0.08;
  mouse.y += (rawMouse.y - mouse.y) * 0.08;
}

/* ── Self-invalidating loop controller ──────────────── */
// Runs inside Canvas. Calls invalidate() each frame when active so the
// demand-mode loop sustains itself. When inactive it returns early and
// the loop goes idle — zero GPU/CPU cost for Bloom + all scene objects.
function SceneLoop() {
  const { invalidate } = useThree();
  useEffect(() => {
    invalidateScene = invalidate;
    return () => { invalidateScene = null; };
  }, [invalidate]);
  useFrame(() => { if (sceneActive.value) invalidate(); });
  return null;
}

/* ── Corner Particles ───────────────────────────────── */
const PARTICLES_PER_CORNER = 18;
const CORNER_COUNT         = 4;
const TOTAL_PARTICLES      = PARTICLES_PER_CORNER * CORNER_COUNT;
const CONNECTION_DIST      = 0.9;
const CONNECTION_DIST_SQ   = CONNECTION_DIST * CONNECTION_DIST;
const MAX_CONNECTIONS      = 60;

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
    lerpMouse();
    const t   = clock.getElapsedTime();
    const cur = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const i3 = i * 3;
      cur[i3]     = origin[i3]     + Math.sin(t * 0.35 + i * 0.06) * 0.06;
      cur[i3 + 1] = origin[i3 + 1] + Math.cos(t * 0.25 + i * 0.08) * 0.06;
      cur[i3 + 2] = origin[i3 + 2] + Math.sin(t * 0.2  + i * 0.04) * 0.06;

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

    let idx = 0;
    const lp = linesRef.current.geometry.attributes.position.array;
    const lc = linesRef.current.geometry.attributes.color.array;

    for (let ci = 0; ci < CORNER_COUNT && idx < MAX_CONNECTIONS; ci++) {
      const start = ci * PARTICLES_PER_CORNER;
      const end   = start + PARTICLES_PER_CORNER;
      for (let a = start; a < end && idx < MAX_CONNECTIONS; a++) {
        for (let b = a + 1; b < end && idx < MAX_CONNECTIONS; b++) {
          const dx = cur[a*3] - cur[b*3];
          const dy = cur[a*3+1] - cur[b*3+1];
          const dz = cur[a*3+2] - cur[b*3+2];
          const distSq = dx*dx + dy*dy + dz*dz;
          if (distSq < CONNECTION_DIST_SQ) {
            const dist  = Math.sqrt(distSq);
            const alpha = 1 - dist / CONNECTION_DIST;
            const o = idx * 6;
            lp[o]   = cur[a*3]; lp[o+1] = cur[a*3+1]; lp[o+2] = cur[a*3+2];
            lp[o+3] = cur[b*3]; lp[o+4] = cur[b*3+1]; lp[o+5] = cur[b*3+2];
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

/* ── Edge-glow pulse shader on wireframe ─────────────── */
const edgePulseVert = /* glsl */`
  varying vec3 vWorldPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;
const edgePulseFrag = /* glsl */`
  uniform float uTime;
  uniform vec3  uColor;
  varying vec3  vWorldPos;
  void main() {
    float wave  = sin(vWorldPos.y * 3.5 - uTime * 1.8) * 0.5 + 0.5;
    float pulse = smoothstep(0.55, 0.95, wave) * 0.7;
    vec3  col   = mix(uColor, vec3(1.0, 1.0, 1.0), pulse * 0.5);
    float alpha = 0.55 + pulse * 0.45;
    gl_FragColor = vec4(col, alpha);
  }
`;

function IcosahedronWireframe() {
  const matRef  = useRef();
  const meshRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.15 + mouse.y * 0.3;
    meshRef.current.rotation.y = t * 0.2  + mouse.x * 0.3;
    if (matRef.current) matRef.current.uniforms.uTime.value = t;
  });
  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uColor: { value: new THREE.Color('#AD8BFF') },
  }), []);
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.42, 0]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={edgePulseVert}
        fragmentShader={edgePulseFrag}
        uniforms={uniforms}
        wireframe
        transparent
      />
    </mesh>
  );
}

/* ── Outer geodesic shell ────────────────────────────── */
function OuterShell() {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = -t * 0.04 + mouse.y * 0.1;
    ref.current.rotation.y = -t * 0.05 + mouse.x * 0.1;
    ref.current.rotation.z =  t * 0.03;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2.8, 1]} />
      <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.06} />
    </mesh>
  );
}

/* ── Cross-section rings ─────────────────────────────── */
function CrossSectionRings() {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ring1.current.rotation.z = t * 0.12;
    ring1.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.07) * 0.15;
    ring2.current.rotation.y = t * 0.09;
    ring2.current.rotation.z = Math.PI / 3 + Math.sin(t * 0.05) * 0.12;
    ring3.current.rotation.x = -t * 0.07;
    ring3.current.rotation.y = Math.PI / 6 + Math.cos(t * 0.06) * 0.1;
  });
  return (
    <group>
      <mesh ref={ring1}>
        <ringGeometry args={[1.55, 1.62, 64]} />
        <meshBasicMaterial color="#AD8BFF" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2}>
        <ringGeometry args={[1.58, 1.64, 64]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring3}>
        <ringGeometry args={[1.52, 1.57, 64]} />
        <meshBasicMaterial color="#AD8BFF" transparent opacity={0.10} side={THREE.DoubleSide} />
      </mesh>
    </group>
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

function MouseTracker() {
  const { viewport } = useThree();
  return (
    <mesh
      visible={false}
      position={[0, 0, 0]}
      onPointerMove={(e) => {
        rawMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        rawMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      }}
    >
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      <meshBasicMaterial />
    </mesh>
  );
}

/* ── Main export ────────────────────────────────────── */
export default function CrystallineMath({ active = true }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    sceneActive.value = active;
    // Kick-start the demand loop when becoming active.
    // The canvas has been idle; one invalidate() wakes SceneLoop which
    // then self-sustains for as long as sceneActive.value is true.
    if (active && invalidateScene) invalidateScene();
  }, [active]);

  return (
    <Canvas
      camera={{ position: [0, 0.5, 5], fov: 55 }}
      style={{ background: '#02030A' }}
      frameloop="demand"
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        depth: false,
        stencil: false,
        alpha: false,
      }}
      dpr={[1, isMobile ? 1 : 1.5]}
    >
      {/* Loop controller — sustains or idles the demand render loop */}
      <SceneLoop />

      <fog attach="fog" args={['#02030A', 6, 14]} />

      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} color="#00ffff" intensity={1} distance={5} />
      <RimLight />

      <MouseTracker />

      <OuterShell />
      <GlassIcosahedron />
      <CrossSectionRings />
      <IcosahedronWireframe />
      <GlowingCore />

      {ORBS.map((orb, i) => <OrbitingOrb key={i} {...orb} />)}

      <CornerParticles />

      {!isMobile && (
        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.9} radius={0.5} />
          <Vignette offset={0.35} darkness={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
