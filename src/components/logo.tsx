import type { SVGProps } from 'react';

type LogoProps = SVGProps<SVGSVGElement> & {
  size?: 'nav' | 'footer' | number;
};

const Logo = ({ size = 'nav', className, ...props }: LogoProps) => {
  const dimension = typeof size === 'number' ? size : size === 'nav' ? 24 : 20;

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, color: 'var(--color-accent)' }}
      {...props}
    >
      <path
        d="M2.8125 6.5625H10.3125L15 15L10.3125 23.4375H2.8125L7.5 15L2.8125 6.5625ZM19.6875 6.5625H27.1875L22.5 15L27.1875 23.4375H19.6875L15 15L19.6875 6.5625Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Logo;
