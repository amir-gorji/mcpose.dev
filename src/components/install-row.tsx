import CopyButton from '@/components/copy-button';
import { SITE } from '@/lib/site';

import styles from './install-row.module.css';

type InstallRowProps = {
  variant?: 'hero' | 'cta';
};

const InstallRow = ({ variant = 'hero' }: InstallRowProps) => (
  <div className={variant === 'cta' ? styles.rowCta : styles.rowHero}>
    <div className={variant === 'cta' ? styles.boxCta : styles.boxHero}>
      <span className={styles.prompt}>$</span>
      <span className={styles.command}>{SITE.installCommand}</span>
    </div>
    <CopyButton text={SITE.installCommand} style={{ fontSize: 12 }} />
  </div>
);

export default InstallRow;
