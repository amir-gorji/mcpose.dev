import Link from 'next/link';
import CopyButton from '@/components/copy-button';
import HeroInteractive from './hero-interactive';
import styles from './hero.module.css';

const INSTALL_CMD = 'npm install mcpose @modelcontextprotocol/sdk';

export default function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.copyCol}>
        <span className={styles.eyebrow}>The composable MCP proxy</span>
        <h1 className={styles.headline}>
          Make MCP <span className={styles.headlineAccent}>work your way.</span>
        </h1>
        <p className={styles.lead}>
          Transform responses. Shape tool access. Connect servers. Add the behavior you need between your client and its MCP servers.
        </p>
        <div className={styles.actions}>
          <Link href="/docs/v3/getting-started/quick-start/" className="btn btn-primary">
            Get started
          </Link>
          <a href="#explore" className="btn btn-secondary">
            Explore middleware
          </a>
        </div>
        <div className={styles.installBlock}>
          <code className={styles.installCode} tabIndex={0} role="region" aria-label="Install command">
            {INSTALL_CMD}
          </code>
          <CopyButton text={INSTALL_CMD} />
        </div>
        <div className={styles.metadata}>
          TypeScript / MIT / stdio + HTTP
        </div>
      </div>

      <div className={styles.visualCol}>
        <div className={styles.desktopArtwork}>
          <HeroInteractive />
        </div>
        <div className={styles.mobileDiagram} aria-hidden="true">
          <div className={styles.mobileCard}>Client request</div>
          <div className={styles.mobileConnector}>↓</div>
          <div className={`${styles.mobileCard} ${styles.mobileCardAccent}`}>
            <strong>mcpose</strong>
            <br />
            Your middleware
          </div>
          <div className={styles.mobileConnector}>↓</div>
          <div className={styles.mobileCard}>MCP server</div>
        </div>
        <p className={styles.caption}>
          A small function in the middle can change the whole interaction.
        </p>
      </div>
    </div>
  );
}
