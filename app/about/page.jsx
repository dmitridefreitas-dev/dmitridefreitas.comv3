import AboutContent from '@/components/sections/AboutContent';

export const metadata = {
  title: 'About — Dmitri De Freitas | Data Science & Financial Engineering',
  description:
    'Dmitri De Freitas — BS Data Science & Financial Engineering at WashU (May 2026). GPA 3.7, Dean\'s List. Data Scientist at Amphora Investment Management. PEAD research, algorithmic trading, ML quantitative modeling. Available May 2026.',
  keywords: [
    'Dmitri De Freitas about',
    'Dmitri De Freitas WashU data science',
    'Dmitri De Freitas financial engineering',
    'WashU data science student',
    'quantitative research analyst',
    'financial engineering student portfolio',
    'data scientist finance',
    'algorithmic trading developer',
  ],
  openGraph: {
    title: 'About Dmitri De Freitas — Data Science & Financial Engineering',
    description:
      'BS Data Science & Financial Engineering at WashU. GPA 3.7. Data Scientist at Amphora Investment Management. PEAD research · ML modeling · Algorithmic trading.',
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
