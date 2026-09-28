'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './hero.module.css';

export default function HeroInteractive() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pausedRef = useRef(false);
  const syncRef = useRef<() => void>(() => {});
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const parts = new Map(Array.from(svg.querySelectorAll<SVGElement>('[data-part]'), el => [el.dataset.part, el]));
    const $ = (name: string) => parts.get(name)!;
    const route = $('route') as SVGPathElement;
    const length = route.getTotalLength();
    const clamp = (n: number) => Math.max(0, Math.min(1, n));
    const ease = (value: number) => { const n = clamp(value); return n * n * (3 - 2 * n); };
    // Route distances to the gates at (345,215), (570,240), (480,285), (615,310), (420,415).
    // Precomputed: measuring the path on load blocked the main thread. Recompute if the route changes.
    const gates = [262.5, 719.9, 828.4, 1098.2, 1390.6];
    let time = 0.025;
    // Update SVG attributes directly; pause/play never rebuilds the animation.
    const attr = (id: string, name: string, value: string | number) => $(id).setAttribute(name, String(value));
    function render() {
      const distance = time * length;
      const point = route.getPointAtLength(distance);
      const response = distance >= gates[2];
      const approve = ease((distance - gates[0]) / 35);
      const adapt = ease((distance - gates[1]) / 45);
      const simplify = ease((distance - gates[3]) / 55);
      const mask = ease((distance - gates[4]) / 45);
      attr('token', 'transform', `translate(${point.x} ${point.y}) scale(0.9)`);
      attr('token', 'opacity', Math.min(clamp(distance / 20), clamp((length - distance) / 25)));
      attr('card', 'fill', response ? '#e4f5f1' : '#fff4dd');
      for (const id of ['card', 'fold']) attr(id, 'stroke', response ? '#198681' : '#bc731e');
      $('rows').style.color = response ? '#198681' : '#bc731e';
      attr('approval', 'opacity', response ? 0 : approve);
      attr('row1', 'width', response ? 25 - 5 * simplify : 21 - 7 * adapt);
      attr('row1', 'y', response ? -10 + 2 * simplify : -10 + 10 * adapt);
      attr('row2', 'width', response ? 21 : 14 + 11 * adapt);
      attr('row2', 'y', response ? 6 * simplify : -10 * adapt);
      attr('row3', 'width', response ? 15 : 25 - 5 * adapt);
      attr('row3', 'opacity', response ? 1 - simplify : 1);
      attr('row2', 'opacity', 1 - mask);
      attr('mask', 'opacity', mask);
      const activity = Math.max(0, 1 - Math.abs(distance - gates[2]) / 40);
      attr('server', 'fill', `rgb(${41 + 30 * activity},${84 + 30 * activity},237)`);
    }
    let frame = 0;
    let last = 0;
    let visible = false;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const step = (now: number) => {
      if (last) time = (time + Math.min(now - last, 50) / 12000) % 1;
      last = now;
      render();
      frame = requestAnimationFrame(step);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!pausedRef.current && !motion.matches && !document.hidden && visible) frame = requestAnimationFrame(step);
    };
    syncRef.current = sync;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    render();
    observer.observe(svg);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      syncRef.current = () => {};
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <div className={styles.motionArtwork}>
      <svg ref={svgRef} viewBox="75 22 670 483" role="img" aria-label="A request transforms through mcpose layers, then returns as a refined response" width="100%" style={{ display: 'block' }}>
        <desc>A request is approved and adapted. The MCP server responds, and middleware simplifies the response and masks a field before returning it.</desc>
        <text x="480" y="46" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="18" letterSpacing="1.5" fill="var(--color-muted)">YOUR MIDDLEWARE</text>
        <g data-part="guides"><path data-part="route" fill="none" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3 7" d="M120 260H325Q345 260 345 240V165Q345 145 365 145H595Q615 145 615 165V220Q615 240 595 240H535Q525 240 515 248L492 267Q480 277 480 293V315Q480 335 500 335H515Q535 335 535 315V285Q535 265 555 265H595Q615 265 615 285V395Q615 415 595 415H200"/></g>
        <path fill="none" stroke="var(--color-accent)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" d="M300 220V140Q300 100 340 100H620Q660 100 660 140V420Q660 460 620 460H420"/>
        <path fill="none" stroke="var(--color-accent)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" d="M540 190H420Q390 190 390 220V340Q390 370 420 370H540Q570 370 570 340V295"/>
        <text x="490" y="88" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="18" letterSpacing="1.2" fill="var(--color-muted)">FILTER</text>
        <text x="462" y="224" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="18" letterSpacing="1.2" fill="var(--color-muted)">TRANSFORM</text>
        <text fontFamily="var(--font-mono)" fontSize="18" letterSpacing="1.5" fill="var(--color-muted)" x="113" y="218">REQUEST →</text>
        <text fontFamily="var(--font-mono)" fontSize="18" letterSpacing="1.5" fill="var(--color-muted)" x="160" y="465">← RESPONSE</text>
        <g data-part="token" transform="translate(120 260) scale(0.9)">
        <rect data-part="card" x="-22" y="-27" width="44" height="54" rx="7" fill="#fff4dd" stroke="#bc731e" strokeWidth="2.5"/>
        <path data-part="fold" d="M8 -26V-15H21" fill="none" stroke="#bc731e" strokeWidth="1.5"/>
        <g fill="currentColor" data-part="rows" style={{ color: "#bc731e" }}>
        <rect data-part="row1" x="-13" y="-10" width="21" height="4" rx="2"/>
        <rect data-part="row2" x="-13" y="0" width="14" height="4" rx="2"/>
        <rect data-part="row3" x="-13" y="10" width="25" height="4" rx="2"/>
        </g>
        <g data-part="approval" opacity="0"><circle cx="20" cy="-24" r="9" fill="#eff8ed" stroke="#34815d" strokeWidth="2"/><path d="m16 -24 3 3 5 -6" fill="none" stroke="#34815d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>
        <rect data-part="mask" x="-13" y="6" width="26" height="6" rx="2" fill="#215554" opacity="0"/>
        </g>
        <rect data-part="server" x="442" y="244" width="76" height="72" rx="10" fill="#2954ed"/>
        <text fontFamily="var(--font-sans)" fontSize="14" fontWeight="600" fill="white" textAnchor="middle" x="480" y="276">MCP</text><text fontFamily="var(--font-sans)" fontSize="14" fontWeight="600" fill="white" textAnchor="middle" x="480" y="294">SERVER</text>
      </svg>
      <button type="button" className={styles.motionControl} onClick={() => {
        pausedRef.current = !pausedRef.current;
        syncRef.current();
        setPaused(pausedRef.current);
      }} aria-label={paused ? 'Play illustration' : 'Pause illustration'}>
        {paused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
}
