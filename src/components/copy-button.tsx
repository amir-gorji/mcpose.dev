'use client';

import { useRef, useState } from 'react';

type CopyButtonProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
};

const CopyButton = ({ text, className, style }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number>(0);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <button
      type="button"
      className={className ? `btn btn-secondary ${className}` : 'btn btn-secondary'}
      style={style}
      onClick={handleClick}
    >
      {copied ? 'copied ✓' : 'copy'}
    </button>
  );
};

export default CopyButton;
