'use client';
import dynamic from 'next/dynamic';

const CrystallineMath = dynamic(() => import('@/components/hero/CrystallineMath'), { ssr: false });

export default function TestCrystal() {
  return <div style={{ width: '100vw', height: '100vh' }}><CrystallineMath /></div>;
}
