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
        role="img"
        aria-label="Three layers: client request, your middleware, and the upstream MCP server"
        style={{ display: 'block' }}
      >
        <path d="M110 300L325 240L475 345L260 405Z" fill="var(--color-surface)" stroke="var(--color-border)" />
        <path d="M130 195L345 135L495 240L280 300Z" fill="var(--color-hero-plate)" />
        <path d="M150 90L365 30L515 135L300 195Z" fill="var(--color-surface)" stroke="var(--color-border)" />
        <path
          ref={pathRef}
          d="M40 135H150L300 195L280 300L475 345H548"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeDasharray="4 6"
        />
        <circle cx="40" cy="135" r="5" fill="var(--color-accent)" />
        <circle cx="548" cy="345" r="5" fill="var(--color-accent)" />
        <g fontFamily="var(--font-sans)" textAnchor="middle">
          <text x="333" y="115" fill="var(--color-text)" fontSize="18">Client request</text>
          <text x="312" y="220" fill="var(--color-hero-plate-text)" fontSize="24" fontWeight="600">mcpose</text>
          <text x="320" y="244" fill="var(--color-hero-plate-text)" fontSize="14">Your middleware</text>
          <text x="292" y="332" fill="var(--color-text)" fontSize="18">MCP server</text>
          <text x="67" y="113" fill="var(--color-muted)" fontSize="12">Request</text>
          <text x="522" y="376" fill="var(--color-muted)" fontSize="12">Response</text>
        </g>
        {markerPos && <circle cx={markerPos.x} cy={markerPos.y} r="6" fill="var(--color-accent)" opacity={markerOpacity} />}
      </svg>
    </div>
  );
}
