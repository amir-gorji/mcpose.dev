/* Renders a schema.org JSON-LD block. Server component; data is serialized at
   build time. `<` is escaped so content can never close the script element. */

export type JsonLdObject = {
  '@context': 'https://schema.org';
  '@type': string;
} & Record<string, unknown>;

type JsonLdProps = {
  data: JsonLdObject;
};

const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll('<', '\\u003c') }}
  />
);

export default JsonLd;
