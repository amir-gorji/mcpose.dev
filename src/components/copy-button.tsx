'use client';

import { useEffect, useRef, useState } from 'react';

type CopyButtonProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
};

export default function CopyButton({ text, className, style, label = 'Copy' }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [announcement, setAnnouncement] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
      setAnnouncement('Copied to clipboard');
      timeoutRef.current = setTimeout(() => {
        setStatus('idle');
        setAnnouncement('');
      }, 2000);
    } catch {
      setStatus('failed');
      setAnnouncement('Copy failed. Select and copy the code.');
      timeoutRef.current = setTimeout(() => {
        setStatus('idle');
        setAnnouncement('');
      }, 3000);
    }
  };

  const displayText = status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : label;

  return (
    <>
      <button
        type="button"
        className={className ? `btn btn-secondary ${className}` : 'btn btn-secondary'}
        style={{ minWidth: 72, ...style }}
        onClick={handleClick}
        aria-label={status === 'copied' ? 'Copied to clipboard' : `Copy ${text.slice(0, 30)}`}
      >
        {displayText}
      </button>
      <span
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          margin: -1,
          padding: 0,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          border: 0,
        }}
      >
        {announcement}
      </span>
    </>
  );
}
