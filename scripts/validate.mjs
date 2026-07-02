#!/usr/bin/env node
// Zero-dependency structural check for the DT-OS Starter Kit vault.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED = ['name', 'description', 'domain', 'node_type', 'status', 'last_updated', 'tags', 'related_concepts'];
const STALE_DAYS = 180;
const root = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), '..');
const SCAN_DIRS = ['business', 'ops', 'memory'];

function walk(dir) {
  let out = [];
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (extname(p) === '.md') out.push(p);
  }
  return out;
}

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const km = line.match(/^([a-z_]+):\s*(.*)$/);
    if (km) fm[km[1]] = km[2].trim();
  }
  return fm;
}

// Extract wikilink targets ([[foo]], [[foo|alias]], [[foo#heading]] -> "foo").
// Intentionally scans the whole note: [[wikilinks]] are real body links in an
// Obsidian vault, and related_concepts links in frontmatter must validate too.
function extractLinks(text) {
  return [...text.matchAll(/\[\[([^\]|#]+)/g)].map((m) => m[1].trim());
}

const files = SCAN_DIRS.flatMap((d) => walk(join(root, d)));
const names = new Set(files.map((f) => basename(f, '.md')));
const contents = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]));
const linksByFile = new Map(files.map((f) => [f, extractLinks(contents.get(f))]));
const errors = [];
const warnings = [];

for (const f of files) {
  const text = contents.get(f);
  const rel = f.slice(root.length + 1);
  const fm = frontmatter(text);
  if (!fm) { errors.push(`${rel}: no frontmatter block`); continue; }
  for (const k of REQUIRED) if (!(k in fm)) errors.push(`${rel}: missing frontmatter key "${k}"`);
  const links = linksByFile.get(f);
  for (const l of links) if (!names.has(l)) errors.push(`${rel}: broken wikilink [[${l}]]`);
  const base = basename(f, '.md');
  const outbound = links.length;
  // Inbound = some OTHER note wikilinks to this note's basename exactly.
  // Exact match (not substring) so [[foobar]] never counts as a link to foo.
  const inbound = files.some((o) => o !== f && linksByFile.get(o).includes(base));
  if (outbound === 0 && !inbound) warnings.push(`${rel}: orphan (no links in or out)`);
  const lastUpdated = (fm.last_updated || '').replace(/^["'](.*)["']$/, '$1');
  if (lastUpdated && /^\d{4}-\d{2}-\d{2}$/.test(lastUpdated)) {
    const age = (Date.now() - new Date(lastUpdated).getTime()) / 86400000;
    if (age > STALE_DAYS) warnings.push(`${rel}: stale (last_updated ${lastUpdated})`);
  }
}

for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`\n${files.length} notes, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
