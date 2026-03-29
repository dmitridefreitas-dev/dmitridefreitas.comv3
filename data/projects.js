export const heroProjects = [
  {
    id: 'credit-risk',
    title: 'Credit Risk Spread Analysis',
    subtitle: 'OLS Regression · SOFR Volatility · Health Insurance Sector',
    gradient: 'linear-gradient(135deg, #1e0f3a 0%, #0d0720 50%, #1e0f3a 100%)',
    image: null,
  },
  {
    id: 'centene-fpa',
    title: 'Centene FP&A Forecasting',
    subtitle: '$1B Capital Budgeting · MLR Optimization · PowerBI',
    gradient: 'linear-gradient(135deg, #160928 0%, #08051a 50%, #160928 100%)',
    image: null,
  },
  {
    id: 'anders-audit',
    title: 'Anders Forensic Audit Analytics',
    subtitle: '$10M Reconciliation · 1,000+ Transactions · GAAP/PCAOB',
    gradient: 'linear-gradient(135deg, #0d0720 0%, #1e0f3a 50%, #0d0720 100%)',
    image: null,
  },
  {
    id: 'pulsar-research',
    title: 'Pulsar Timing Data Analysis',
    subtitle: '2,000 Datasets · Statistical Modeling · 80% Recognition Rate',
    gradient: 'linear-gradient(135deg, #160928 0%, #0d0720 50%, #1e0f3a 100%)',
    image: null,
  },
];

export const featuredProjects = [
  {
    id: 'credit-risk',
    title: 'Credit Risk Spread Analysis',
    description: 'Multivariate OLS regression isolating credit spread widening drivers in the Health Insurance sector.',
    category: 'Finance',
  },
  {
    id: 'centene-fpa',
    title: 'Centene FP&A Forecasting',
    description: 'Financial forecasting models for stop-loss provisions and $1B quarterly capital budgeting.',
    category: 'Finance',
  },
  {
    id: 'anders-audit',
    title: 'Anders Forensic Audit Analytics',
    description: 'Forensic data analytics on 1,000+ transactions identifying risk-sensitive outliers.',
    category: 'Finance',
  },
  {
    id: 'pulsar-research',
    title: 'Pulsar Timing Analysis',
    description: 'Statistical analysis on 2,000 pulsar timing datasets with Python and Excel.',
    category: 'Research',
  },
];

export const allProjects = [
  {
    id: 'credit-risk',
    title: 'Credit Risk Spread Analysis',
    category: 'Finance',
    date: 'Jan 2026 – Present',
    shortDescription: 'Multivariate OLS regression model isolating drivers of credit spread widening.',
    longDescription: 'Developed a multivariate OLS regression model in Python to isolate drivers of credit spread widening in the Health Insurance sector. Demonstrated that SOFR volatility accounted for 55% of spread variance. Analyzed non-linear credit elasticity, discovering that idiosyncratic liquidity factors superseded systemic macro-drivers when the yield curve inverted beyond 50 bps, signaling a transition to solvency risk.',
    tech: ['Python', 'OLS Regression', 'Statistical Analysis', 'Excel'],
    metrics: [
      { label: 'Spread Variance Explained', value: '55%' },
      { label: 'Yield Curve Inversion Threshold', value: '50 bps' },
    ],
    dataSources: ['SOFR rate data', 'Health Insurance credit spreads', 'Yield curve data'],
    codeLink: '#',
    reportLink: '#',
  },
  {
    id: 'centene-fpa',
    title: 'Centene FP&A Forecasting',
    category: 'Finance',
    date: 'May 2025 – Aug 2025',
    shortDescription: 'Financial forecasting models and $1B quarterly capital budgeting process.',
    longDescription: 'Built financial forecasting models in Excel evaluating stop-loss provisions to optimize the Medical Loss Ratio within 82%–85% target range. Facilitated $1B quarterly capital budgeting using PowerBI and OneStream, identifying $5M in expense variances driving resource reallocation. Authored executive briefings translating MLR drivers into actionable EPS insights.',
    tech: ['Excel', 'PowerBI', 'OneStream', 'Financial Modeling'],
    metrics: [
      { label: 'Capital Budget Managed', value: '$1B' },
      { label: 'Variance Identified', value: '$5M' },
      { label: 'MLR Target', value: '82–85%' },
    ],
    dataSources: ['Internal financial data', 'OneStream forecasts', 'PowerBI dashboards'],
    codeLink: null,
    reportLink: null,
  },
  {
    id: 'anders-audit',
    title: 'Anders Forensic Audit Analytics',
    category: 'Finance',
    date: 'Dec 2025 – Mar 2026',
    shortDescription: 'Forensic data analytics identifying risk-sensitive outliers across legal entities.',
    longDescription: 'Analyzed and reconciled $10M in liquid assets across 5 legal entities ensuring balance sheet integrity and GAAP/PCAOB compliance. Performed forensic data analytics on 1,000+ transactions using Excel and Fieldguide, identifying 10+ risk-sensitive outliers to mitigate corporate fraud and financial exposure.',
    tech: ['Excel', 'Fieldguide', 'GAAP', 'PCAOB', 'Forensic Analytics'],
    metrics: [
      { label: 'Assets Reconciled', value: '$10M' },
      { label: 'Transactions Analyzed', value: '1,000+' },
      { label: 'Outliers Identified', value: '10+' },
    ],
    dataSources: ['Client financial records', 'Balance sheet data', 'Transaction logs'],
    codeLink: null,
    reportLink: null,
  },
  {
    id: 'pulsar-research',
    title: 'Pulsar Timing Data Analysis',
    category: 'Research',
    date: 'Jan 2024 – May 2024',
    shortDescription: 'Statistical analysis on 2,000 pulsar timing datasets using Python and Excel.',
    longDescription: 'Used Python and Excel to perform statistical analysis on 2,000 pulsar timing datasets, achieving an 80% recognition rate through data modeling and pattern identification. Presented progress to 25 student researchers at Franklin & Marshall College.',
    tech: ['Python', 'Excel', 'Statistical Modeling', 'Data Analysis'],
    metrics: [
      { label: 'Datasets Analyzed', value: '2,000' },
      { label: 'Recognition Rate', value: '80%' },
    ],
    dataSources: ['Pulsar timing observations'],
    codeLink: '#',
    reportLink: null,
  },
];

export const projectCategories = ['All', 'Finance', 'Research'];
