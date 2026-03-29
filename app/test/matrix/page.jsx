'use client';
import dynamic from 'next/dynamic';

const MatrixDisplacement = dynamic(() => import('@/components/hero/MatrixDisplacement'), { ssr: false });

export default function TestMatrix() {
  return <div style={{ width: '100vw', height: '100vh' }}><MatrixDisplacement /></div>;
}
