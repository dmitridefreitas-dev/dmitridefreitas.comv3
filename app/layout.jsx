import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AtmosphericBlobs from '@/components/effects/AtmosphericBlobs';
import ClientShell from '@/components/layout/ClientShell';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Erich Huang — Financial Engineering & Accounting | WashU',
    template: '%s | Erich Huang',
  },
  description:
    'Erich Huang — BS Financial Engineering & Accounting minor at Washington University in St. Louis (Dec 2027). Incoming Summer Analyst at MUFG. FP&A at Centene, audit at Anders CPA. Credit risk research, OLS regression, quantitative modeling. Available Summer 2026.',
  keywords: [
    'Erich Huang',
    'Erich Huang MUFG',
    'Erich Huang WashU',
    'Erich Huang financial engineering',
    'financial engineering student',
    'Washington University in St. Louis finance',
    'WashU financial engineering',
    'MUFG summer analyst 2026',
    'Centene FPA analyst',
    'Anders CPA audit',
    'credit risk analysis',
    'investment banking analyst',
    'asset management student',
    'quantitative finance student',
    'OLS regression credit spreads',
    'SOFR volatility research',
    'Pi Mu Epsilon WashU',
    'Phi Beta Kappa WashU',
    'financial engineering portfolio',
    'finance student portfolio',
  ],
  authors: [{ name: 'Erich Huang', url: 'https://www.linkedin.com/in/erichhuang/' }],
  creator: 'Erich Huang',
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
    title: 'Erich Huang — Financial Engineering & Accounting',
    description:
      'Erich Huang — Incoming MUFG Summer Analyst. BS Financial Engineering at WashU. FP&A at Centene, audit at Anders CPA, credit risk research. Available Summer 2026.',
    siteName: 'Erich Huang',
    url: 'https://erichhuang.com',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Erich Huang — Financial Engineering & Accounting',
    description:
      'Incoming MUFG Summer Analyst. BS Financial Engineering at WashU. FP&A at Centene, audit at Anders CPA, credit risk research.',
    creator: '@erichhuang',
  },
  alternates: {
    canonical: 'https://erichhuang.com',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Erich Huang',
  givenName: 'Erich',
  familyName: 'Huang',
  jobTitle: 'Financial Engineering Student & Incoming MUFG Summer Analyst',
  description:
    'Erich Huang is a Financial Engineering and Accounting student at Washington University in St. Louis, incoming Summer Analyst at MUFG, with FP&A experience at Centene Corporation and audit experience at Anders CPA Advisors. Available for full-time roles in investment banking, asset management, and corporate finance starting Summer 2026.',
  url: 'https://erichhuang.com',
  image: 'https://erichhuang.com/images/erich-headshot.png',
  email: 'erichhuang2002@gmail.com',
  telephone: '717-333-5758',
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Washington University in St. Louis',
      sameAs: 'https://wustl.edu',
    },
  ],
  worksFor: [
    {
      '@type': 'Organization',
      name: 'MUFG',
      description: 'Incoming Summer Analyst 2026',
    },
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Financial Analyst',
    occupationLocation: { '@type': 'Country', name: 'United States' },
    skills:
      'Financial Engineering, Accounting, Credit Risk Analysis, Financial Planning & Analysis, OLS Regression, Quantitative Modeling, Audit & Assurance, Bloomberg Terminal, Python, Excel, PowerBI, SQL, VBA',
  },
  sameAs: [
    'https://www.linkedin.com/in/erichhuang/',
  ],
  knowsAbout: [
    'Financial Engineering',
    'Accounting',
    'Credit Risk Analysis',
    'Financial Planning & Analysis',
    'Investment Banking',
    'Asset Management',
    'Corporate Finance',
    'OLS Regression',
    'Quantitative Modeling',
    'Credit Spread Analysis',
    'SOFR Volatility',
    'Audit & Assurance',
    'GAAP',
    'PCAOB',
    'Python',
    'Excel',
    'Bloomberg Terminal',
    'PowerBI',
    'OneStream',
    'SQL',
    'VBA',
    'Fieldguide',
  ],
  award: ['Pi Mu Epsilon', 'Phi Beta Kappa'],
  memberOf: [
    { '@type': 'Organization', name: 'Pi Mu Epsilon' },
    { '@type': 'Organization', name: 'Phi Beta Kappa' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
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
          <div className="flex flex-col min-h-screen relative" style={{ zIndex: 10 }}>
            <Header />
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            <Footer />
            <Toaster />
          </div>
        </ClientShell>
      </body>
    </html>
  );
}
