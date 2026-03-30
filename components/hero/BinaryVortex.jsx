'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const COUNT = 800;

function Vortex() {
  const meshRef = useRef();
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => Array.from({ length: COUNT }, (_, i) => {
    const t = i / COUNT;
    return { t, speed: 0.2 + Math.random() * 0.3, baseAngle: t * Math.PI * 2 * 10 };
  }), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // mouse parallax
    groupRef.current.rotation.x += (mouse.current.y * 0.3 - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (mouse.current.x * 0.3 - groupRef.current.rotation.y) * 0.05;

    for (let i = 0; i < COUNT; i++) {
      const { t, speed, baseAngle } = data[i];
      const spiralT = (t + time * speed * 0.04) % 1;
      const angle = baseAngle + time * 0.15;
      const radius = spiralT * 4.5;
      dummy.position.set(Math.cos(angle) * radius, (spiralT - 0.5) * 6, Math.sin(angle) * radius);
      const s = 0.03 + spiralT * 0.07;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef} onPointerMove={(e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }}>
      <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
        <boxGeometry args={[1, 1, 0.3]} />
        <meshStandardMaterial color="#cccccc" roughness={0.5} />
      </instancedMesh>
      <mesh>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={6} />
      </mesh>
    </group>
  );
}

export default function BinaryVortex() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 60 }} style={{ background: '#02030A' }} gl={{ antialias: false, powerPreference: 'high-performance' }}>
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 0, 0]} color="#ffffff" intensity={8} distance={3} />
      <Vortex />
      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.8} radius={0.6} />
      </EffectComposer>
    </Canvas>
  );
}
