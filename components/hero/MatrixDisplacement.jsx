'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const GRID_X = 40;
const GRID_Y = 26;
const COUNT = GRID_X * GRID_Y;
const SPACING = 0.22;
const RADIUS = 1.6;
const MAX_H = 1.2;

function Grid() {
  const meshRef = useRef();
  const mouse3D = useRef({ x: 0, y: 0 });
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { camera, size } = useThree();

  const base = useMemo(() => Array.from({ length: COUNT }, (_, i) => ({
    x: ((i % GRID_X) - GRID_X / 2) * SPACING,
    y: (Math.floor(i / GRID_X) - GRID_Y / 2) * SPACING,
  })), []);

  const colors = useMemo(() => new Float32Array(COUNT * 3), []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, COUNT]}
      frustumCulled={false}
      onPointerMove={(e) => {
        const x = (e.clientX / size.width) * 2 - 1;
        const y = -(e.clientY / size.height) * 2 + 1;
        const vec = new THREE.Vector3(x, y, 0.5).unproject(camera);
        const dir = vec.sub(camera.position).normalize();
        const dist = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(dist));
        mouse3D.current = { x: pos.x, y: pos.y };
      }}
    >
      <boxGeometry args={[1, 1, 1]}>
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </boxGeometry>
      <meshStandardMaterial vertexColors roughness={0.6} metalness={0.2} />
      <FrameUpdater meshRef={meshRef} base={base} mouse3D={mouse3D} colors={colors} dummy={dummy} />
    </instancedMesh>
  );
}

function FrameUpdater({ meshRef, base, mouse3D, colors, dummy }) {
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mx = mouse3D.current.x;
    const my = mouse3D.current.y;

    for (let i = 0; i < COUNT; i++) {
      const { x, y } = base[i];
      const dx = x - mx, dy = y - my;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const falloff = dist < RADIUS ? Math.pow(1 - dist / RADIUS, 2) : 0;
      const wave = Math.sin(x * 2 + t * 0.8) * Math.cos(y * 2 + t * 0.6) * 0.04;
      const h = falloff * MAX_H + wave;
      dummy.position.set(x, y, h / 2);
      dummy.scale.set(0.17, 0.17, Math.max(0.005, h + 0.005));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      const c = 0.15 + falloff * 0.85;
      colors[i*3] = colors[i*3+1] = colors[i*3+2] = c;
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.geometry.attributes.color.needsUpdate = true;
  });
  return null;
}

export default function MatrixDisplacement() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 55 }} style={{ background: '#02030A' }} gl={{ antialias: false, powerPreference: 'high-performance' }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 4]} color="#ffffff" intensity={3} distance={10} />
      <Grid />
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.35} luminanceSmoothing={0.9} radius={0.4} />
      </EffectComposer>
    </Canvas>
  );
}
