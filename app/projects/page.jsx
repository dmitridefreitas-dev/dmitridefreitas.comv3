import ProjectsContent from '@/components/sections/ProjectsContent';

export const metadata = {
  title: 'Projects & Research — Dmitri De Freitas | Quantitative Finance & Data Science',
  description:
    'Quantitative finance and data science projects by Dmitri De Freitas: PEAD market efficiency research, institutional data pipeline (70K+ data points), algorithmic trading strategies, housing price ML models, climate and sports analytics. Python, R, MATLAB, Bloomberg, QuantLib.',
  keywords: [
    'Dmitri De Freitas projects',
    'Dmitri De Freitas PEAD research',
    'Dmitri De Freitas quantitative finance',
    'PEAD market efficiency',
    'algorithmic trading research',
    'institutional data pipeline',
    'housing price machine learning',
    'quantitative finance projects',
    'data science financial engineering',
    'OLS regression market efficiency',
  ],
  openGraph: {
    title: 'Projects & Research — Dmitri De Freitas',
    description:
      'PEAD market efficiency, institutional data pipeline (70K+ points), algorithmic trading, housing price ML. Python · R · MATLAB · Bloomberg · QuantLib.',
  },
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
