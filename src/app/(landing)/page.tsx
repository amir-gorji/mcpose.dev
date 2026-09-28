import Hero from '@/components/landing/hero';
import Explorer from '@/components/explorer';
import MeshSection from '@/components/landing/mesh-section';
import Capabilities from '@/components/landing/capabilities';
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
      urlTemplate: `${SITE.url}/docs/v3/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function LandingPage() {
  return (
    <main className={styles.container}>
      <JsonLd data={softwareSourceCode} />
      <JsonLd data={webSite} />

      <Hero />
      <Capabilities />
      <MeshSection />
      <Explorer />
      <PackagesTable />
      <CtaCard />
    </main>
  );
}
