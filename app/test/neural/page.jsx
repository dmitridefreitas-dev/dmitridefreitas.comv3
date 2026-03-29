'use client';
import dynamic from 'next/dynamic';

const NeuralLatentSpace = dynamic(() => import('@/components/hero/NeuralLatentSpace'), { ssr: false });

export default function TestNeural() {
  return <div style={{ width: '100vw', height: '100vh' }}><NeuralLatentSpace /></div>;
}
