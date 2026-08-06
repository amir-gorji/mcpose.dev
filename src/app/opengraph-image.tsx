import { ImageResponse } from 'next/og';

import { SITE } from '@/lib/site';

export const dynamic = 'force-static';
export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/* Nocturne tokens, hardcoded: ImageResponse (satori) cannot resolve CSS custom
   properties. Values mirror src/styles/nocturne.css. */
const colorBg = '#161826';
const colorText = '#e9e9ed';
const colorMuted = '#b2b6ca'; /* neutral-400 */
const colorAccent = '#9184d9';
const colorFrame = '#595d6c'; /* neutral-700 */
const colorHairline = '#3f424d'; /* neutral-800 */

/* No remote font fetches: the site is a static export and build-time fetches
   add flake. Satori's bundled default face renders both text runs. */
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
          background: colorBg,
          position: 'relative',
        }}
      >
        {/* Inset hairline ring, echoing the nocturne card edge. */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: `1px solid ${colorHairline}`,
            borderRadius: 18,
            display: 'flex',
          }}
        />
        {/* Nested-squares logo mark: frame outline, accent outline, accent dot. */}
        <div
          style={{
            width: 96,
            height: 96,
            border: `6px solid ${colorFrame}`,
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              border: `6px solid ${colorAccent}`,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                background: colorAccent,
                borderRadius: 4,
                display: 'flex',
              }}
            />
          </div>
        </div>
        <div
          style={{
            marginTop: 44,
            fontSize: 64,
            fontFamily: 'monospace',
            color: colorText,
            display: 'flex',
          }}
        >
          mcpose
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 28,
            color: colorMuted,
            display: 'flex',
          }}
        >
          The audit and governance layer for MCP.
        </div>
      </div>
    ),
    size,
  );

export default OpengraphImage;
