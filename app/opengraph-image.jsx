import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Dmitri De Freitas — Data Science & Financial Engineering';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 88px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Purple glow blob — top right */}
        <div
          style={{
            position: 'absolute',
            top: '-160px',
            right: '-160px',
            width: '560px',
            height: '560px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(76,29,149,0.08) 50%, transparent 70%)',
          }}
        />
        {/* Faint glow blob — bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-60px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Left accent bar */}
        <div
          style={{
            position: 'absolute',
            left: '88px',
            top: '88px',
            bottom: '88px',
            width: '2px',
            background:
              'linear-gradient(to bottom, rgba(139,92,246,0.9) 0%, rgba(196,181,253,0.5) 50%, rgba(76,29,149,0.1) 100%)',
          }}
        />

        {/* Content block — indented from the left bar */}
        <div
          style={{
            paddingLeft: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
          }}
        >
          {/* Eyebrow label */}
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '13px',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              color: '#8B5CF6',
              marginBottom: '20px',
            }}
          >
            Portfolio — Available May 2026
          </div>

          {/* Name */}
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '90px',
              fontWeight: '700',
              color: '#F9FAFB',
              lineHeight: 1.05,
              letterSpacing: '-2px',
              marginBottom: '28px',
            }}
          >
            Dmitri De Freitas
          </div>

          {/* Divider */}
          <div
            style={{
              width: '64px',
              height: '2px',
              background: 'linear-gradient(to right, #8B5CF6, #4C1D95)',
              borderRadius: '2px',
              marginBottom: '28px',
            }}
          />

          {/* Subtitle row 1 */}
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '19px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'rgba(249,250,251,0.7)',
              marginBottom: '12px',
            }}
          >
            Data Science &amp; Financial Engineering
          </div>

          {/* Subtitle row 2 */}
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '15px',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: 'rgba(139,92,246,0.75)',
            }}
          >
            Washington University in St. Louis · Data Scientist · Quant Researcher
          </div>
        </div>

        {/* Bottom rule */}
        <div
          style={{
            position: 'absolute',
            bottom: '64px',
            left: '88px',
            right: '88px',
            height: '1px',
            background:
              'linear-gradient(to right, rgba(139,92,246,0.6), rgba(139,92,246,0.1), transparent)',
          }}
        />

        {/* Ghost H watermark — top right corner */}
        <div
          style={{
            position: 'absolute',
            top: '50px',
            right: '100px',
            fontFamily: 'Georgia, serif',
            fontSize: '220px',
            fontWeight: '700',
            color: 'rgba(139,92,246,0.04)',
            letterSpacing: '-8px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          D
        </div>
      </div>
    ),
    { ...size }
  );
}
