import Logo from '@/components/logo';
import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';
export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const colorPaper = '#F8F9F5';
const colorInk = '#101814';
const colorCobalt = '#2456E8';
const colorBorder = '#E3E8DE';

const OpengraphImage = () =>
  new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: colorPaper,
          position: 'relative',
        }}
      >
        {/* Subtle border ring */}
        <div
          style={{
            position: 'absolute',
            top: 32,
            left: 32,
            right: 32,
            bottom: 32,
            border: `1px solid ${colorBorder}`,
            borderRadius: 24,
            display: 'flex',
          }}
        />

        <Logo size={80} style={{ color: colorCobalt }} />

        <div
          style={{
            marginTop: 36,
            fontSize: 60,
            fontWeight: 600,
            fontFamily: 'sans-serif',
            color: colorInk,
            letterSpacing: '-0.03em',
            display: 'flex',
          }}
        >
          Make MCP work your way.
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 26,
            fontFamily: 'monospace',
            color: colorCobalt,
            letterSpacing: '0.02em',
            display: 'flex',
          }}
        >
          mcpose.dev
        </div>
      </div>
    ),
    size,
  );

export default OpengraphImage;
