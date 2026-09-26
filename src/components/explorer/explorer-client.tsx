'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import CopyButton from '@/components/copy-button';
import { PRESETS, type PresetId } from './explorer-data';
import styles from './explorer.module.css';

interface ExplorerClientProps {
  readonly highlightedSnippets: Record<PresetId, string>;
}

type RunState = 'idle' | 'running' | 'complete';

export default function ExplorerClient({ highlightedSnippets }: ExplorerClientProps) {
  const [selectedId, setSelectedId] = useState<PresetId>('transform');
  const [runState, setRunState] = useState<RunState>('idle');
  const [stage, setStage] = useState<number>(0);
  const [tryHiddenCall, setTryHiddenCall] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const timersRef = useRef<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Record<PresetId, HTMLButtonElement | null>>({
    transform: null,
    filter: null,
    mesh: null,
    audit: null,
  });

  const activePreset = PRESETS.find((p) => p.id === selectedId) ?? PRESETS[0];

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const cancelToStatic = useCallback(() => {
    clearAllTimers();
    setRunState('complete');
    setStage(0);
  }, [clearAllTimers]);

  // Handle preset switch
  const handleSelectPreset = useCallback(
    (id: PresetId) => {
      if (id === selectedId) return;
      clearAllTimers();
      setSelectedId(id);
      setRunState('idle');
      setStage(0);
      setTryHiddenCall(false);
      setStatusMessage('');
    },
    [clearAllTimers, selectedId],
  );

  // Handle running trace
  const handleRun = useCallback(() => {
    if (runState === 'running') return;

    clearAllTimers();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setRunState('complete');
      setStatusMessage(`${activePreset.label} example complete`);
      return;
    }

    setRunState('running');
    setStatusMessage(`Running ${activePreset.label} example`);

    if (selectedId === 'filter' && tryHiddenCall) {
      // 540ms total rejection trace
      // 0-180ms: Client -> mcpose
      setStage(0);
      const t1 = window.setTimeout(() => setStage(1), 180); // mcpose blocked
      const t2 = window.setTimeout(() => setStage(2), 360); // mcpose -> Client
      const t3 = window.setTimeout(() => {
        setRunState('complete');
        setStatusMessage(`${activePreset.label} example complete`);
      }, 540);
      timersRef.current.push(t1, t2, t3);
      return;
    }

    // 1200ms standard round-trip trace
    setStage(0); // 0-180ms: Client -> mcpose
    const t1 = window.setTimeout(() => setStage(1), 180); // 180-360ms: mcpose -> Upstream
    const t2 = window.setTimeout(() => setStage(2), 360); // 360-480ms: Upstream stationary outline
    const t3 = window.setTimeout(() => setStage(3), 480); // 480-660ms: Upstream -> mcpose
    const t4 = window.setTimeout(() => setStage(4), 660); // 660-840ms: mcpose middleware outline
    const t5 = window.setTimeout(() => setStage(5), 840); // 840-1020ms: mcpose -> Client
    const t6 = window.setTimeout(() => setStage(6), 1020); // 1020-1200ms: finish
    const t7 = window.setTimeout(() => {
      setRunState('complete');
      setStatusMessage(`${activePreset.label} example complete`);
    }, 1200);

    timersRef.current.push(t1, t2, t3, t4, t5, t6, t7);
  }, [activePreset.label, clearAllTimers, runState, selectedId, tryHiddenCall]);

  const runStateRef = useRef(runState);
  useEffect(() => {
    runStateRef.current = runState;
  }, [runState]);

  // Interruption triggers: visibilitychange, resize, intersection, unmount
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && runStateRef.current === 'running') {
        cancelToStatic();
      }
    };

    const handleResize = () => {
      if (runStateRef.current === 'running') {
        cancelToStatic();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.intersectionRatio < 0.5 && runStateRef.current === 'running') {
            cancelToStatic();
          }
        });
      },
      { threshold: 0.5 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      clearAllTimers();
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [cancelToStatic, clearAllTimers]);

  // Keyboard navigation for manual activation tabs
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const count = PRESETS.length;
    let nextIndex = -1;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (index + 1) % count;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (index - 1 + count) % count;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = count - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleSelectPreset(PRESETS[index].id);
        return;
      default:
        return;
    }

    if (nextIndex >= 0) {
      const nextId = PRESETS[nextIndex].id;
      tabRefs.current[nextId]?.focus();
    }
  };

  // Calculate node active highlights based on stage and runState
  const isRunning = runState === 'running';
  const isFilterHidden = selectedId === 'filter' && tryHiddenCall;

  const clientActive = isRunning && (stage === 0 || (isFilterHidden ? stage === 2 : stage === 5));
  const mcposeActive =
    isRunning &&
    (isFilterHidden
      ? stage === 1
      : stage === 0 || stage === 1 || stage === 3 || stage === 4 || stage === 5);
  const mcposeBlocked = isRunning && isFilterHidden && stage === 1;
  const upstreamActive = isRunning && !isFilterHidden && (stage === 1 || stage === 2 || stage === 3);

  // Trace marker positions (percentage along path)
  let markerLeft = '0%';
  let showMarker = isRunning;
  if (isRunning) {
    if (isFilterHidden) {
      if (stage === 0) markerLeft = '25%'; // Client -> mcpose
      else if (stage === 1) markerLeft = '50%'; // at mcpose
      else if (stage === 2) markerLeft = '25%'; // mcpose -> Client
    } else {
      if (stage === 0) markerLeft = '25%'; // Client -> mcpose
      else if (stage === 1) markerLeft = '60%'; // mcpose -> Upstream
      else if (stage === 2) markerLeft = '85%'; // at Upstream
      else if (stage === 3) markerLeft = '60%'; // Upstream -> mcpose
      else if (stage === 4) markerLeft = '50%'; // at mcpose middleware
      else if (stage === 5) markerLeft = '25%'; // mcpose -> Client
      else showMarker = false;
    }
  }

  const runButtonLabel =
    runState === 'running'
      ? 'Running…'
      : runState === 'complete'
        ? 'Replay trace'
        : 'Run example';

  const displayedRequest =
    selectedId === 'filter' && tryHiddenCall
      ? activePreset.secondaryAction?.request ?? activePreset.request
      : activePreset.request;

  return (
    <section
      ref={sectionRef}
      id="explore"
      aria-label="Request explorer"
      className={styles.section}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>What would you change?</h2>
        <p className={styles.lede}>Follow one call. Add middleware. See the difference.</p>
      </div>

      {/* Manual activation tabs */}
      <div role="tablist" aria-label="Explorer presets" className={styles.tabList}>
        {PRESETS.map((preset, index) => {
          const isSelected = preset.id === selectedId;
          return (
            <button
              key={preset.id}
              ref={(el) => {
                tabRefs.current[preset.id] = el;
              }}
              role="tab"
              id={`tab-${preset.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${preset.id}`}
              tabIndex={isSelected ? 0 : -1}
              className={`${styles.tab} ${isSelected ? styles.tabSelected : ''}`}
              onClick={() => handleSelectPreset(preset.id)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      <div
        role="tabpanel"
        id={`panel-${activePreset.id}`}
        aria-labelledby={`tab-${activePreset.id}`}
        className={styles.layout}
      >
        {/* Left Column: Trace diagram, results, controls */}
        <div className={styles.leftCol}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>{activePreset.heading}</h3>
            <span className={styles.requestBadge}>{displayedRequest}</span>
          </div>

          {/* Trace diagram */}
          <div
            className={`${styles.diagramBox} ${
              runState === 'running' && stage === 6 ? styles.diagramBoxAccent : ''
            }`}
          >
            <div className={styles.nodesRow}>
              <div
                className={`${styles.node} ${clientActive ? styles.nodeActive : ''}`}
              >
                <strong>Client</strong>
                <span className={styles.nodeSubtext}>Agent / LLM</span>
              </div>

              <div className={styles.tracePath}>
                {showMarker && (
                  <div
                    className={styles.traceMarker}
                    style={{ left: markerLeft }}
                    aria-hidden="true"
                  />
                )}
              </div>

              <div
                className={`${styles.node} ${
                  mcposeBlocked
                    ? styles.nodeBlocked
                    : mcposeActive
                      ? styles.nodeActive
                      : ''
                }`}
              >
                <strong>mcpose</strong>
                <span className={styles.nodeSubtext}>
                  {selectedId === 'audit'
                    ? 'redact → audit'
                    : 'Middleware proxy'}
                </span>
              </div>

              <div className={styles.tracePath} />

              <div
                className={`${styles.node} ${upstreamActive ? styles.nodeActive : ''}`}
              >
                <strong>Upstream</strong>
                <span className={styles.nodeSubtext}>
                  {selectedId === 'mesh' ? 'docs (selected)' : 'MCP server'}
                </span>
              </div>
            </div>
          </div>

          {/* Results box */}
          <div className={styles.resultsBox}>
            <div className={styles.resultsGrid}>
              <div className={styles.resultCol}>
                <h4 className={styles.resultHeading}>Before middleware</h4>
                {activePreset.before.map((item) => (
                  <div key={item} className={styles.resultItem}>
                    {item}
                  </div>
                ))}
              </div>

              <div className={styles.resultCol}>
                <h4 className={styles.resultHeading}>After middleware</h4>
                {selectedId === 'filter' && tryHiddenCall ? (
                  <div
                    className={`${styles.resultItem} ${styles.resultItemBlocked}`}
                  >
                    {activePreset.secondaryAction?.result}
                  </div>
                ) : (
                  activePreset.after.map((item, idx) => (
                    <div
                      key={item}
                      className={`${styles.resultItem} ${
                        idx > 0 ? styles.resultItemHighlight : ''
                      }`}
                    >
                      {item}
                    </div>
                  ))
                )}
              </div>
            </div>

            <p className={styles.explanation}>
              {selectedId === 'filter' && tryHiddenCall
                ? activePreset.secondaryAction?.explanation
                : activePreset.explanation}
            </p>
          </div>

          {/* Action buttons & simulation status */}
          <div className={styles.actionsRow}>
            <div className={styles.controlsGroup}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRun}
                disabled={runState === 'running'}
              >
                {runButtonLabel}
              </button>

              {activePreset.secondaryAction && (
                <button
                  type="button"
                  className={`${styles.secondaryBtn} ${
                    tryHiddenCall ? styles.secondaryBtnActive : ''
                  }`}
                  onClick={() => {
                    clearAllTimers();
                    setTryHiddenCall(!tryHiddenCall);
                    setRunState('idle');
                    setStage(0);
                  }}
                >
                  {tryHiddenCall ? 'Reset to tools/list' : 'Try hidden call'}
                </button>
              )}

              <span className={styles.simBadge}>
                <span className={styles.simDot} aria-hidden="true" />
                Sample data · simulated trace
              </span>
            </div>

            <Link href={activePreset.guideUrl} className={styles.guideLink}>
              Learn more in docs →
            </Link>
          </div>

          {/* Live region for accessibility announcements */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {statusMessage}
          </div>
        </div>

        {/* Right Column: Code excerpt */}
        <div className={styles.rightCol}>
          <div className={styles.codeHeader}>
            <span>TypeScript · configuration excerpt</span>
          </div>

          <div className={styles.codeFrame}>
            <div className={styles.codeFrameHeader}>
              <span>proxy-config.ts</span>
              <CopyButton text={activePreset.codeSnippet} />
            </div>
            <div
              className={styles.codeContent}
              dangerouslySetInnerHTML={{
                __html: highlightedSnippets[activePreset.id],
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
