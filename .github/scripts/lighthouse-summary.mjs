#!/usr/bin/env node
/**
 * Renders the Lighthouse CI run directory as a markdown table.
 *
 * Usage: lighthouse-summary.mjs <lhci-dir> <step-summary-path> <comment-path>
 *
 * Lighthouse CI writes one lhr-*.json per run per URL. Assertions in
 * .lighthouserc.json aggregate by median, so this reports the median too —
 * otherwise the table and the pass/fail verdict could disagree on a flaky run.
 */
import { readFileSync, readdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

const [dir, stepSummaryPath, commentPath] = process.argv.slice(2);

const CATEGORIES = [
  ['performance', 'Perf'],
  ['accessibility', 'A11y'],
  ['best-practices', 'Best pr.'],
  ['seo', 'SEO'],
];

/* Google's "good" Core Web Vitals boundaries, used only to pick the marker in
   the table. The pass/fail gate lives in .lighthouserc.json. */
const VITALS = [
  ['largest-contentful-paint', 'LCP', 2500, (v) => `${(v / 1000).toFixed(2)}s`],
  ['cumulative-layout-shift', 'CLS', 0.1, (v) => v.toFixed(3)],
  ['total-blocking-time', 'TBT', 200, (v) => `${Math.round(v)}ms`],
];

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const byUrl = new Map();
for (const file of readdirSync(dir)) {
  if (!file.startsWith('lhr-') || !file.endsWith('.json')) continue;
  const report = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  const url = new URL(report.finalDisplayedUrl).pathname;
  if (!byUrl.has(url)) byUrl.set(url, []);
  byUrl.get(url).push(report);
}

if (byUrl.size === 0) {
  console.error(`No Lighthouse reports found in ${dir}`);
  process.exit(1);
}

const lines = [];
lines.push(`| Page | ${CATEGORIES.map(([, l]) => l).join(' | ')} | ${VITALS.map(([, l]) => l).join(' | ')} |`);
lines.push(`| :--- | ${CATEGORIES.map(() => '---:').join(' | ')} | ${VITALS.map(() => '---:').join(' | ')} |`);

for (const [url, reports] of [...byUrl.entries()].sort()) {
  const cells = [];

  for (const [id] of CATEGORIES) {
    const score = median(reports.map((r) => r.categories[id].score));
    /* Lighthouse's own banding: >=0.90 green, >=0.50 amber, below that red. */
    const marker = score >= 0.9 ? '🟢' : score >= 0.5 ? '🟠' : '🔴';
    cells.push(`${marker} ${Math.round(score * 100)}`);
  }

  for (const [id, , budget, format] of VITALS) {
    const value = median(reports.map((r) => r.audits[id].numericValue));
    cells.push(`${value <= budget ? '🟢' : '🟠'} ${format(value)}`);
  }

  lines.push(`| \`${url}\` | ${cells.join(' | ')} |`);
}

const table = `${lines.join('\n')}\n`;
writeFileSync(commentPath, table);
if (stepSummaryPath) appendFileSync(stepSummaryPath, `## Lighthouse\n\n${table}\n`);
process.stdout.write(table);
