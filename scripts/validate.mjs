#!/usr/bin/env node
// Zero-dependency structural check for the DT-OS Starter Kit vault.
import { lstatSync, readdirSync, readFileSync } from 'node:fs';
import { join, basename, extname, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED = ['name', 'description', 'domain', 'node_type', 'status', 'last_updated', 'tags', 'related_concepts'];
const DOMAINS = new Set(['business', 'ops', 'memory']);
const NODE_TYPES = new Set(['concept', 'process', 'decision', 'reference']);
const STATUSES = new Set(['emergent', 'validated']);
const STALE_DAYS = 180;
const root = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), '..');
const SCAN_DIRS = ['business', 'ops', 'memory'];
const today = new Date().toISOString().slice(0, 10);

function walk(dir) {
  let out = [];
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e);
    const stat = lstatSync(p);
    if (stat.isSymbolicLink()) continue;
    if (stat.isDirectory()) out = out.concat(walk(p));
    else if (stat.isFile() && extname(p) === '.md') out.push(p);
  }
  return out.sort();
}

function stripComment(value) {
  let quote = '';
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if ((char === '"' || char === "'") && (!quote || quote === char)) {
      quote = quote ? '' : char;
    } else if (char === '#' && !quote && i > 0 && /\s/.test(value[i - 1])) {
      return value.slice(0, i).trimEnd();
    }
  }
  return value;
}

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const values = {};
  const issues = [];
  for (const [index, line] of m[1].split(/\r?\n/).entries()) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const km = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!km) {
      issues.push(`malformed frontmatter line ${index + 2}`);
      continue;
    }
    const [, key, rawValue] = km;
    if (key in values) issues.push(`duplicate frontmatter key "${key}"`);
    values[key] = stripComment(rawValue.trim());
  }
  return { values, issues, body: text.slice(m[0].length) };
}

// Extract wikilink targets ([[foo]], [[foo|alias]], [[foo#heading]] -> "foo").
// Intentionally scans the whole note: [[wikilinks]] are real body links in an
// Obsidian vault, and related_concepts links in frontmatter must validate too.
function extractLinks(text) {
  return [...text.matchAll(/\[\[([^\]|#]+)/g)].map((m) => m[1].trim());
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function isArray(value) {
  return /^\[(?:[\s\S]*)\]$/.test(value);
}

function plural(count, singular) {
  return `${count} ${singular}${count === 1 ? '' : 's'}`;
}

const errors = [];
const warnings = [];
for (const directory of SCAN_DIRS) {
  try {
    if (!lstatSync(join(root, directory)).isDirectory()) {
      errors.push(`vault: missing required directory "${directory}"`);
    }
  } catch {
    errors.push(`vault: missing required directory "${directory}"`);
  }
}

const files = SCAN_DIRS.flatMap((d) => walk(join(root, d)));
if (!files.length) errors.push('vault: no Markdown notes found');
const basenameCounts = new Map();
for (const file of files) {
  const name = basename(file, '.md');
  basenameCounts.set(name, (basenameCounts.get(name) || 0) + 1);
}
const names = new Set(basenameCounts.keys());
const contents = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]));
const linksByFile = new Map(files.map((f) => [f, extractLinks(contents.get(f))]));

for (const f of files) {
  const text = contents.get(f);
  const rel = relative(root, f);
  const folder = rel.split(sep)[0];
  const parsed = frontmatter(text);
  const fm = parsed?.values;
  if (!parsed) {
    errors.push(`${rel}: no frontmatter block`);
  } else {
    for (const issue of parsed.issues) errors.push(`${rel}: ${issue}`);
    for (const key of REQUIRED) {
      if (!(key in fm)) errors.push(`${rel}: missing frontmatter key "${key}"`);
      else if (!fm[key]) errors.push(`${rel}: empty frontmatter key "${key}"`);
    }

    const base = basename(f, '.md');
    if (fm.name) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fm.name)) {
        errors.push(`${rel}: invalid name "${fm.name}"`);
      }
      if (fm.name !== base) {
        errors.push(`${rel}: name "${fm.name}" does not match filename "${base}.md"`);
      }
    }
    if (basenameCounts.get(base) > 1) {
      errors.push(`${rel}: duplicate note filename "${base}.md" makes wikilinks ambiguous`);
    }
    if (fm.domain) {
      if (!DOMAINS.has(fm.domain)) errors.push(`${rel}: invalid domain "${fm.domain}"`);
      else if (fm.domain !== folder) {
        errors.push(`${rel}: domain "${fm.domain}" does not match folder "${folder}"`);
      }
    }
    if (fm.node_type && !NODE_TYPES.has(fm.node_type)) {
      errors.push(`${rel}: invalid node_type "${fm.node_type}"`);
    }
    if (fm.status && !STATUSES.has(fm.status)) {
      errors.push(`${rel}: invalid status "${fm.status}"`);
    }
    if (fm.last_updated) {
      if (!validDate(fm.last_updated)) {
        errors.push(`${rel}: invalid last_updated "${fm.last_updated}"`);
      } else if (fm.last_updated > today) {
        errors.push(`${rel}: future last_updated "${fm.last_updated}"`);
      } else {
        const age = (Date.now() - new Date(`${fm.last_updated}T00:00:00Z`).getTime()) / 86400000;
        if (age > STALE_DAYS) warnings.push(`${rel}: stale (last_updated ${fm.last_updated})`);
      }
    }
    for (const key of ['tags', 'related_concepts']) {
      if (fm[key] && !isArray(fm[key])) errors.push(`${rel}: "${key}" must be an array`);
    }
    if (/>\s*Fill this in:/i.test(parsed.body)) {
      warnings.push(`${rel}: unfinished starter prompt`);
    }
  }

  const links = linksByFile.get(f);
  for (const l of links) if (!names.has(l)) errors.push(`${rel}: broken wikilink [[${l}]]`);
  const base = basename(f, '.md');
  const outbound = links.some((link) => link !== base);
  const inbound = files.some((o) => o !== f && linksByFile.get(o).includes(base));
  if (!outbound && !inbound) warnings.push(`${rel}: orphan (no links in or out)`);
}

console.log('ERRORS');
if (errors.length) for (const error of errors) console.log(`- ${error}`);
else console.log('- None');
console.log('\nWARNINGS');
if (warnings.length) for (const warning of warnings) console.log(`- ${warning}`);
else console.log('- None');
console.log(`\n${plural(files.length, 'note')}, ${plural(errors.length, 'error')}, ${plural(warnings.length, 'warning')}`);
process.exit(errors.length ? 1 : 0);
