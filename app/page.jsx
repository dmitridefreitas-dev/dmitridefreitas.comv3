import dynamic from 'next/dynamic';

const ZWormhole = dynamic(() => import('@/components/layout/ZWormhole'), { ssr: false });

export const metadata = {
  title: 'Dmitri De Freitas — Data Science & Financial Engineering',
  description:
    'Portfolio of Dmitri De Freitas — Data Science & Financial Engineering at WashU. Data Scientist at Amphora Investment Management. PEAD research, ML modeling, algorithmic trading.',
};

export default function Home() {
  return <ZWormhole />;
}
