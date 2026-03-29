'use client';
import dynamic from 'next/dynamic';

const BinaryVortex = dynamic(() => import('@/components/hero/BinaryVortex'), { ssr: false });

export default function TestBinary() {
  return <div style={{ width: '100vw', height: '100vh' }}><BinaryVortex /></div>;
}
