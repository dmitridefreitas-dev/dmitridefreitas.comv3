'use client';

const PROJECTS = [
  {
    title: 'PEAD Anomaly Research',
    tech: 'Python \u00B7 OLS \u00B7 Bloomberg',
    desc: 'Testing semi-strong EMH via post-earnings announcement drift analysis.',
  },
  {
    title: 'Credit Risk Pipeline',
    tech: 'Python \u00B7 XGBoost \u00B7 SQL',
    desc: '70K+ data points, 8+ statistical approaches, 95% explanatory power.',
  },
  {
    title: 'Algorithmic Trading',
    tech: 'Python \u00B7 MATLAB \u00B7 QuantLib',
    desc: 'Multi-strategy quant trading system with live backtesting infrastructure.',
  },
  {
    title: 'Housing Price ML',
    tech: 'R \u00B7 scikit-learn \u00B7 Tableau',
    desc: 'Machine learning regression models for real estate valuation.',
  },
];

export default function ProjectsScene() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 70%)',
        }}
      />

      <div style={{ maxWidth: '1000px', width: '90%', position: 'relative', zIndex: 1 }}>
        <p
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '10px',
            letterSpacing: '0.4em',
            color: '#00D4FF',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          03 / Projects &amp; Research
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(1.8rem, 3vw, 3rem)',
            fontWeight: 700,
            color: '#F9FAFB',
            marginBottom: '40px',
          }}
        >
          Quantitative Work
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {PROJECTS.map((project, i) => (
            <div
              key={i}
              style={{
                padding: '28px',
                background: 'rgba(2,3,10,0.85)',
                border: '1px solid rgba(0,212,255,0.1)',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Accent line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, #00D4FF, transparent)',
                }}
              />
              <h3
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#F9FAFB',
                  marginBottom: '8px',
                }}
              >
                {project.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  color: '#00D4FF',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                {project.tech}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: '13px',
                  color: 'rgba(249,250,251,0.5)',
                  lineHeight: 1.6,
                }}
              >
                {project.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
