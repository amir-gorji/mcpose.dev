import Hero from '@/components/landing/hero';
import FeatureGrid from '@/components/landing/feature-grid';
import ConceptDiagram from '@/components/landing/concept-diagram';
import AuditSection from '@/components/landing/audit-section';
import PackagesTable from '@/components/landing/packages-table';
import CtaCard from '@/components/landing/cta-card';
import JsonLd, { type JsonLdObject } from '@/components/seo/json-ld';
import { SITE } from '@/lib/site';
import styles from './landing.module.css';

const softwareSourceCode: JsonLdObject = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: SITE.name,
  description: SITE.description,
  codeRepository: SITE.github,
  programmingLanguage: 'TypeScript',
  runtimePlatform: 'Node.js >= 20',
  license: 'https://opensource.org/license/mit/',
};

const webSite: JsonLdObject = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE.url}/docs/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const LandingPage = () => (
  <main>
    <JsonLd data={softwareSourceCode} />
    <JsonLd data={webSite} />
    <section aria-label="Hero" className={styles.heroSection}>
      <Hero />
    </section>
    <section aria-label="Why mcpose" className={styles.section}>
      <FeatureGrid />
    </section>
    <section aria-label="Concept" className={styles.section}>
      <ConceptDiagram />
    </section>
    <section aria-label="Audit" className={styles.section}>
      <AuditSection />
    </section>
    <section aria-label="Packages" className={styles.section}>
      <PackagesTable />
    </section>
    <section aria-label="Get started" className={styles.section}>
      <CtaCard />
    </section>
  </main>
);

export default LandingPage;
