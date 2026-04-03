'use client';

export default function AboutScene() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content card */}
      <div
        style={{
          maxWidth: '900px',
          width: '90%',
          padding: '60px',
          background: 'rgba(2,3,10,0.8)',
          border: '1px solid rgba(139,92,246,0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: '4px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Section label */}
        <p
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '10px',
            letterSpacing: '0.4em',
            color: '#8B5CF6',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          02 / About
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(1.8rem, 3vw, 3rem)',
            fontWeight: 700,
            color: '#F9FAFB',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          Quantitative Researcher
          <br />
          <span style={{ color: '#8B5CF6' }}>&amp; Financial Engineer</span>
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '15px',
            color: 'rgba(249,250,251,0.65)',
            lineHeight: 1.8,
            maxWidth: '600px',
            marginBottom: '40px',
          }}
        >
          Pursuing a BS in Data Science &amp; Financial Engineering at Washington
          University in St. Louis. Building ML-driven quantitative models at
          Amphora Investment Management, researching PEAD market efficiency, and
          developing algorithmic trading strategies. Available May 2026.
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          {[
            { val: '3.7', label: 'GPA', color: '#8B5CF6' },
            { val: '70K+', label: 'Data Points Analyzed', color: '#00D4FF' },
            { val: '95%', label: 'Avg. Explanatory Power', color: '#00E5A0' },
            { val: 'May 2026', label: 'Available', color: '#F59E0B' },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: stat.color,
                }}
              >
                {stat.val}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '9px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(249,250,251,0.4)',
                  marginTop: '4px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Corner accents */}
        {[
          ['top', 'left'],
          ['top', 'right'],
          ['bottom', 'left'],
          ['bottom', 'right'],
        ].map(([v, h]) => (
          <div
            key={`${v}${h}`}
            style={{
              position: 'absolute',
              [v]: -1,
              [h]: -1,
              width: '20px',
              height: '20px',
              borderTop: v === 'top' ? '1px solid #8B5CF6' : 'none',
              borderBottom: v === 'bottom' ? '1px solid #8B5CF6' : 'none',
              borderLeft: h === 'left' ? '1px solid #8B5CF6' : 'none',
              borderRight: h === 'right' ? '1px solid #8B5CF6' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
