import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
const AtmosphericBlobs = dynamic(() => import('@/components/effects/AtmosphericBlobs'), { ssr: false });
import ClientShell from '@/components/layout/ClientShell';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Dmitri De Freitas — Data Science & Financial Engineering | WashU',
    template: '%s | Dmitri De Freitas',
  },
  description:
    'Dmitri De Freitas — BS Data Science & Financial Engineering at Washington University in St. Louis (May 2026). Data Scientist at Amphora Investment Management. PEAD market efficiency research, ML quantitative modeling, algorithmic trading. Available May 2026.',
  keywords: [
    'Dmitri De Freitas',
    'Dmitri De Freitas WashU',
    'Dmitri De Freitas data science',
    'Dmitri De Freitas financial engineering',
    'data science financial engineering student',
    'Washington University in St. Louis data science',
    'WashU financial engineering',
    'Amphora Investment Management data scientist',
    'PEAD market efficiency research',
    'quantitative research analyst',
    'algorithmic trading developer',
    'machine learning finance',
    'OLS regression',
    'quantitative finance student',
    'financial engineer portfolio',
    'data scientist finance portfolio',
  ],
  authors: [{ name: 'Dmitri De Freitas', url: 'https://www.linkedin.com/in/dmitri-de-freitas-16a540347/' }],
  creator: 'Dmitri De Freitas',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Dmitri De Freitas — Data Science & Financial Engineering',
    description:
      'Dmitri De Freitas — BS Data Science & Financial Engineering at WashU. Data Scientist at Amphora Investment Management. PEAD research, ML modeling, algorithmic trading. Available May 2026.',
    siteName: 'Dmitri De Freitas',
    url: 'https://dmitridefreitas.com',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dmitri De Freitas — Data Science & Financial Engineering',
    description:
      'BS Data Science & Financial Engineering at WashU. Data Scientist at Amphora. PEAD research, ML quantitative modeling, algorithmic trading.',
  },
  alternates: {
    canonical: 'https://dmitridefreitas.com',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dmitri De Freitas',
  givenName: 'Dmitri',
  familyName: 'De Freitas',
  jobTitle: 'Data Science & Financial Engineering Student',
  description:
    'Dmitri De Freitas is a Data Science and Financial Engineering student at Washington University in St. Louis. Former Data Scientist Intern at Amphora Investment Management. Researcher in PEAD market efficiency and quantitative trading. Available for full-time quantitative research, financial engineering, and data science roles starting May 2026.',
  url: 'https://dmitridefreitas.com',
  email: 'd.defreitas@wustl.edu',
  telephone: '+1-314-646-9845',
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Washington University in St. Louis',
      sameAs: 'https://wustl.edu',
    },
    {
      '@type': 'CollegeOrUniversity',
      name: 'Drew University',
    },
  ],
  worksFor: [
    {
      '@type': 'Organization',
      name: 'Amphora Investment Management',
      description: 'Data Scientist Intern',
    },
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Quantitative Research Analyst',
    occupationLocation: { '@type': 'Country', name: 'United States' },
    skills:
      'Data Science, Financial Engineering, Machine Learning, OLS Regression, Python, R, MATLAB, SQL, Bloomberg Terminal, QuantLib, PEAD Research, Algorithmic Trading, Statistical Modeling',
  },
  sameAs: [
    'https://www.linkedin.com/in/dmitri-de-freitas-16a540347/',
  ],
  knowsAbout: [
    'Data Science',
    'Financial Engineering',
    'Machine Learning',
    'Quantitative Finance',
    'PEAD Market Efficiency',
    'Algorithmic Trading',
    'OLS Regression',
    'Time Series Analysis',
    'Portfolio Optimization',
    'Credit Risk Analysis',
    'Python',
    'R',
    'MATLAB',
    'SQL',
    'Bloomberg Terminal',
    'QuantLib',
    'Power BI',
    'Tableau',
    'Statistical Modeling',
  ],
  award: ["Dean's List"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrains.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <AtmosphericBlobs />
        <ClientShell>
          {children}
          <Toaster />
        </ClientShell>
      </body>
    </html>
  );
}
