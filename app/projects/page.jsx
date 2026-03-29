import ProjectsContent from '@/components/sections/ProjectsContent';

export const metadata = {
  title: 'Projects & Research — Erich Huang | Finance & Quantitative Work',
  description:
    'Finance projects and research by Erich Huang: OLS regression credit risk spread analysis (SOFR volatility), FP&A forecasting at Centene ($1B capital budget), forensic audit analytics at Anders CPA ($10M reconciliation), and pulsar timing statistical analysis. Python, Excel, PowerBI, Bloomberg.',
  keywords: [
    'Erich Huang projects',
    'Erich Huang credit risk research',
    'Erich Huang Centene FPA',
    'Erich Huang Anders audit',
    'credit spread OLS regression',
    'SOFR volatility credit risk',
    'financial engineering projects',
    'quantitative finance research',
    'forensic audit analytics',
    'financial planning analysis student',
  ],
  openGraph: {
    title: 'Projects & Research — Erich Huang',
    description:
      'Credit risk OLS regression, FP&A at Centene ($1B budget), forensic audit at Anders CPA, pulsar timing research. Python · Excel · PowerBI · Bloomberg.',
  },
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
