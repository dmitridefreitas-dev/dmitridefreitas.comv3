'use client';
import { socialLinks, contactInfo } from '@/data/constants';

export default function ContactScene() {
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
      {/* Background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 30% 50%, rgba(139,92,246,0.08) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(0,212,255,0.05) 0%, transparent 60%)',
        }}
      />

      <div
        style={{
          maxWidth: '700px',
          width: '90%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
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
          04 / Contact
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            color: '#F9FAFB',
            lineHeight: 1.1,
            marginBottom: '20px',
          }}
        >
          Available
          <br />
          <span style={{ color: '#8B5CF6' }}>May 2026</span>
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '16px',
            color: 'rgba(249,250,251,0.55)',
            lineHeight: 1.7,
            marginBottom: '48px',
          }}
        >
          Seeking full-time roles in quantitative research, financial
          engineering, and data science.
        </p>

        {/* Action links */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={`mailto:${contactInfo?.email || 'd.defreitas@wustl.edu'}`}
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#02030A',
              background: '#00D4FF',
              padding: '14px 32px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.2s ease',
            }}
          >
            Email Me
          </a>
          <a
            href={socialLinks?.linkedin || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#F9FAFB',
              border: '1px solid rgba(139,92,246,0.4)',
              padding: '14px 32px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.2s ease',
            }}
          >
            LinkedIn
          </a>
        </div>

        {/* Copyright */}
        <p
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '9px',
            letterSpacing: '0.25em',
            color: 'rgba(249,250,251,0.25)',
            marginTop: '80px',
            textTransform: 'uppercase',
          }}
        >
          &copy; {new Date().getFullYear()} Dmitri De Freitas &middot; St. Louis, MO
        </p>
      </div>
    </div>
  );
}
