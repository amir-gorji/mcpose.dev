'use client';

import { useEffect, useRef, useState } from 'react';

export default function HeroInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [markerPos, setMarkerPos] = useState<{ x: number; y: number } | null>(null);
  const [markerOpacity, setMarkerOpacity] = useState(0);

  useEffect(() => {
    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let animationFrameId: number;
    let delayTimer: ReturnType<typeof setTimeout>;
    let hasRun = false;

    const cubicBezier = (t: number): number => {
      // Approximation for cubic-bezier(0.22, 1, 0.36, 1)
      return t === 0 ? 0 : t === 1 ? 1 : 1 - Math.pow(1 - t, 3);
    };

    const runAnimation = () => {
      if (hasRun || !pathRef.current) return;
      hasRun = true;

      const path = pathRef.current;
      const length = path.getTotalLength();
      const startPoint = path.getPointAtLength(0);
      setMarkerPos({ x: startPoint.x, y: startPoint.y });

      delayTimer = setTimeout(() => {
        setMarkerOpacity(1);
        const startTime = performance.now();
        const duration = 960;
        const fadeDuration = 120;

        const step = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = cubicBezier(progress);

          if (pathRef.current) {
            const point = pathRef.current.getPointAtLength(eased * length);
            setMarkerPos({ x: point.x, y: point.y });
          }

          if (progress < 1) {
            animationFrameId = requestAnimationFrame(step);
          } else {
            // Fade out over 120ms
            const fadeStartTime = performance.now();
            const fadeStep = (fadeNow: number) => {
              const fadeElapsed = fadeNow - fadeStartTime;
              const fadeProgress = Math.min(fadeElapsed / fadeDuration, 1);
              setMarkerOpacity(1 - fadeProgress);

              if (fadeProgress < 1) {
                animationFrameId = requestAnimationFrame(fadeStep);
              } else {
                setMarkerPos(null);
              }
            };
            animationFrameId = requestAnimationFrame(fadeStep);
          }
        };

        animationFrameId = requestAnimationFrame(step);
      }, 250);
    };

    // Intersection observer: run only when >= 50% visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            runAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleVisibilityOrResize = () => {
      if (document.hidden) {
        clearTimeout(delayTimer);
        cancelAnimationFrame(animationFrameId);
        setMarkerPos(null);
      }
    };

    window.addEventListener('resize', handleVisibilityOrResize);
    document.addEventListener('visibilitychange', handleVisibilityOrResize);

    return () => {
      observer.disconnect();
      clearTimeout(delayTimer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleVisibilityOrResize);
      document.removeEventListener('visibilitychange', handleVisibilityOrResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 584,
        aspectRatio: '584 / 470',
        margin: '0 auto',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 584 470"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <g id="Frame">
          {/* Decorative paths */}
          <path
            id="Vector"
            d="M0 233H85C97.6667 233 109.333 227.333 120 216L226 110C236.667 99.3333 248.667 94 262 94H584"
            stroke="var(--color-border)"
          />
          <path
            id="Vector_2"
            d="M0 282H66C81.3333 282 95.3333 288.333 108 301L246 430C259.333 442 274.333 448 291 448H584"
            stroke="var(--color-border)"
          />

          {/* Top Plate (Client) */}
          <path
            id="Vector_3"
            d="M133 147L393 73L535 238L273 315L133 147Z"
            fill="var(--color-surface)"
            stroke="var(--color-border)"
          />

          {/* Middle Plate (Middleware) */}
          <path
            id="Vector_4"
            d="M112 190L372 116L514 281L252 358L112 190Z"
            fill="var(--color-tint)"
            stroke="var(--color-accent)"
          />

          {/* Bottom Plate (mcpose cobalt) */}
          <path
            id="Vector_5"
            d="M91 234L351 160L493 325L231 402L91 234Z"
            fill="#2456E8"
          />

          {/* Active Travel Path */}
          <path
            ref={pathRef}
            id="Vector_6"
            d="M0 257H95C105 257 117.333 263.667 132 277L225 364C234.333 372.667 244.667 374.667 256 370L487 302C501 298.667 513 297 523 297H584"
            stroke="var(--color-accent)"
          />

          {/* Fixed Endpoints */}
          <circle cx="57" cy="257" r="6" fill="var(--color-accent)" />
          <circle cx="548" cy="297" r="6" fill="var(--color-accent)" />

          {/* Animated 6px Traveling Marker */}
          {markerPos && (
            <circle
              cx={markerPos.x}
              cy={markerPos.y}
              r="6"
              fill="#2456E8"
              opacity={markerOpacity}
            />
          )}
        </g>
      </svg>

      {/* HTML Accessible Labels positioned directly over the SVG */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Left Client Label */}
        <div
          style={{
            position: 'absolute',
            left: '3%',
            top: '48%',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-text)',
          }}
        >
          Client
        </div>

        {/* Top Plate Label */}
        <div
          style={{
            position: 'absolute',
            left: '42%',
            top: '24%',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-muted)',
            transform: 'rotate(-16deg)',
          }}
        >
          Client request
        </div>

        {/* Middle Plate Label */}
        <div
          style={{
            position: 'absolute',
            left: '38%',
            top: '40%',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-accent)',
            transform: 'rotate(-16deg)',
          }}
        >
          Middleware
        </div>

        {/* Bottom Cobalt Plate Label */}
        <div
          style={{
            position: 'absolute',
            left: '32%',
            top: '56%',
            color: '#FFFFFF',
            transform: 'rotate(-16deg)',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>mcpose</div>
          <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.9 }}>Your behavior, composed.</div>
        </div>

        {/* Right Upstream Label */}
        <div
          style={{
            position: 'absolute',
            right: '4%',
            top: '58%',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-text)',
          }}
        >
          Upstream
        </div>

        {/* Note Box */}
        <div
          style={{
            position: 'absolute',
            right: '8%',
            bottom: '6%',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 10px',
            fontSize: 12,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>Same MCP protocol</div>
          <div style={{ color: 'var(--color-muted)' }}>New possibilities</div>
        </div>
      </div>
    </div>
  );
}
