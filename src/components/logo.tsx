type LogoProps = {
  size?: 'nav' | 'footer';
};

const Logo = ({ size = 'nav' }: LogoProps) =>
  size === 'nav' ? (
    <div
      aria-hidden="true"
      style={{
        width: 20,
        height: 20,
        border: '1.5px solid var(--color-neutral-700)',
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 11,
          height: 11,
          border: '1.5px solid var(--color-accent)',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 3,
            height: 3,
            background: 'var(--color-accent)',
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  ) : (
    <div
      aria-hidden="true"
      style={{
        width: 16,
        height: 16,
        border: '1.5px solid var(--color-neutral-700)',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          border: '1.5px solid var(--color-accent)',
          borderRadius: 2,
        }}
      />
    </div>
  );

export default Logo;
