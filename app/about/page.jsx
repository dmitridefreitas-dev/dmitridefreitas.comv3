import AboutContent from '@/components/sections/AboutContent';

export const metadata = {
  title: 'About — Erich Huang | Financial Engineering Student',
  description:
    'Erich Huang — BS Financial Engineering & Accounting minor at WashU (Dec 2027). Incoming Summer Analyst at MUFG. FP&A at Centene, audit at Anders CPA. Pi Mu Epsilon & Phi Beta Kappa honors. Seeking investment banking, asset management, and corporate finance roles for Summer 2026.',
  keywords: [
    'Erich Huang about',
    'Erich Huang WashU financial engineering',
    'Erich Huang MUFG analyst',
    'WashU financial engineering student',
    'financial engineering accounting minor',
    'Pi Mu Epsilon WashU',
    'Phi Beta Kappa WashU',
    'investment banking summer 2026',
  ],
  openGraph: {
    title: 'About Erich Huang — Financial Engineering & Accounting',
    description:
      'Incoming MUFG Summer Analyst. BS Financial Engineering at WashU. Pi Mu Epsilon · Phi Beta Kappa. Seeking IB, asset management, and corporate finance roles.',
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
