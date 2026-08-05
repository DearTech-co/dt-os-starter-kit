import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { inflateRawSync } from 'node:zlib';

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const validator = join(repoRoot, 'scripts', 'validate.mjs');
const packager = join(repoRoot, 'scripts', 'package-skills.mjs');
const today = new Date().toISOString().slice(0, 10);

function makeVault() {
  const root = mkdtempSync(join(tmpdir(), 'dt-os-test-'));
  for (const folder of ['business', 'ops', 'memory']) {
    mkdirSync(join(root, folder));
  }
  return root;
}

function writeNote(root, folder, name, {
  description = `${name} description`,
  domain = folder,
  nodeType = 'concept',
  status = 'validated',
  lastUpdated = today,
  tags = `[${folder}]`,
  related = '[]',
  body = `# ${name}`,
  extraFrontmatter = '',
} = {}) {
  const extra = extraFrontmatter ? `${extraFrontmatter}\n` : '';
  writeFileSync(join(root, folder, `${name}.md`), `---
name: ${name}
description: ${description}
domain: ${domain}
node_type: ${nodeType}
status: ${status}
last_updated: ${lastUpdated}
tags: ${tags}
related_concepts: ${related}
${extra}---

${body}
`);
}

function runValidator(root) {
  return spawnSync(process.execPath, [validator, root], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

function read(relativePath) {
  return readFileSync(join(repoRoot, relativePath), 'utf8');
}

function readZipEntries(archive) {
  const bytes = readFileSync(archive);
  const entries = new Map();
  let offset = 0;
  while (offset + 30 <= bytes.length && bytes.readUInt32LE(offset) === 0x04034b50) {
    const method = bytes.readUInt16LE(offset + 8);
    const compressedSize = bytes.readUInt32LE(offset + 18);
    const nameLength = bytes.readUInt16LE(offset + 26);
    const extraLength = bytes.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const name = bytes.subarray(nameStart, nameStart + nameLength).toString('utf8');
    const compressed = bytes.subarray(dataStart, dataStart + compressedSize);
    const content = method === 8 ? inflateRawSync(compressed) : compressed;
    entries.set(name, content);
    offset = dataStart + compressedSize;
  }
  return entries;
}

test('untouched starter reports incomplete setup warnings without errors', () => {
  const result = runValidator(repoRoot);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^ERRORS\n- None/m);
  assert.match(result.stdout, /WARNINGS[\s\S]*business\/offers-pricing\.md: unfinished starter prompt/);
  assert.match(result.stdout, /ops\/tools-we-use\.md: unfinished starter prompt/);
  assert.match(result.stdout, /\d+ notes, 0 errors, \d+ warnings/);
});

test('completed eight-note vault is clean', (t) => {
  const root = makeVault();
  t.after(() => rmSync(root, { recursive: true, force: true }));

  const notes = [
    ['business', 'what-we-do', 'who-we-serve'],
    ['business', 'who-we-serve', 'what-we-do'],
    ['business', 'offers-pricing', 'what-we-do'],
    ['business', 'voice-and-tone', 'what-we-do'],
    ['business', 'current-priorities', 'what-we-do'],
    ['ops', 'how-we-do-things', 'tools-we-use'],
    ['ops', 'tools-we-use', 'how-we-do-things'],
    ['memory', 'decisions-log', 'how-we-do-things'],
  ];
  for (const [folder, name, target] of notes) {
    const nodeType = folder === 'ops' ? 'process' : folder === 'memory' ? 'decision' : 'concept';
    writeNote(root, folder, name, {
      nodeType,
      related: `["[[${target}]]"]`,
    });
  }

  const result = runValidator(root);

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /^ERRORS\n- None/m);
  assert.match(result.stdout, /^WARNINGS\n- None/m);
  assert.match(result.stdout, /8 notes, 0 errors, 0 warnings/);
});

test('validator rejects a missing or empty vault instead of returning false green', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'dt-os-empty-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));

  const result = runValidator(root);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /vault: missing required directory "business"/);
  assert.match(result.stdout, /vault: missing required directory "ops"/);
  assert.match(result.stdout, /vault: missing required directory "memory"/);
  assert.match(result.stdout, /vault: no Markdown notes found/);
});

test('validator rejects malformed and unsafe metadata', (t) => {
  const root = makeVault();
  t.after(() => rmSync(root, { recursive: true, force: true }));

  writeNote(root, 'business', 'bad-note', {
    description: '',
    domain: 'ops',
    nodeType: 'mystery',
    status: 'draft',
    lastUpdated: 'not-a-date',
    tags: 'business',
    related: 'not-an-array',
    body: '# Bad\n\nSee [[missing-note]].',
    extraFrontmatter: 'this is not valid frontmatter',
  });
  writeNote(root, 'business', 'future-note', {
    lastUpdated: '2999-01-01',
  });
  writeNote(root, 'business', 'impossible-date', {
    lastUpdated: '2026-02-30',
  });
  writeNote(root, 'business', 'filename-does-not-match', {
    extraFrontmatter: 'name: different-name',
  });

  const result = runValidator(root);

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /bad-note\.md: malformed frontmatter line/);
  assert.match(result.stdout, /bad-note\.md: empty frontmatter key "description"/);
  assert.match(result.stdout, /bad-note\.md: domain "ops" does not match folder "business"/);
  assert.match(result.stdout, /bad-note\.md: invalid node_type "mystery"/);
  assert.match(result.stdout, /bad-note\.md: invalid status "draft"/);
  assert.match(result.stdout, /bad-note\.md: invalid last_updated "not-a-date"/);
  assert.match(result.stdout, /bad-note\.md: "tags" must be an array/);
  assert.match(result.stdout, /bad-note\.md: "related_concepts" must be an array/);
  assert.match(result.stdout, /bad-note\.md: broken wikilink \[\[missing-note\]\]/);
  assert.match(result.stdout, /future-note\.md: future last_updated "2999-01-01"/);
  assert.match(result.stdout, /impossible-date\.md: invalid last_updated "2026-02-30"/);
  assert.match(result.stdout, /filename-does-not-match\.md: name "different-name" does not match filename/);
});

test('validator reports stale and orphan notes as warnings', (t) => {
  const root = makeVault();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeNote(root, 'memory', 'old-note', {
    nodeType: 'decision',
    lastUpdated: '2020-01-01',
  });

  const result = runValidator(root);

  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /WARNINGS[\s\S]*old-note\.md: orphan/);
  assert.match(result.stdout, /old-note\.md: stale \(last_updated 2020-01-01\)/);
  assert.match(result.stdout, /1 note, 0 errors, 2 warnings/);
});

test('instructions define confidence, confirmation, safe writes, and secret handling', () => {
  const agents = read('AGENTS.md');
  const claude = read('CLAUDE.md');
  assert.equal(agents, claude);
  assert.match(agents, /emergent[\s\S]*provisional/i);
  assert.match(agents, /validated[\s\S]*explicitly confirm/i);
  assert.match(agents, /update[\s\S]*last_updated/i);
  assert.match(agents, /never store[\s\S]*(password|API key|token)/i);
  assert.match(agents, /only[\s\S]*business\/[\s\S]*ops\/[\s\S]*memory\//i);
});

test('skills are mirrored and use discoverable trigger descriptions', () => {
  for (const skill of ['start-dt', 'ingest', 'health']) {
    const claude = read(`.claude/skills/${skill}/SKILL.md`);
    const agents = read(`.agents/skills/${skill}/SKILL.md`);
    assert.equal(agents, claude, `${skill} differs across platforms`);
    assert.match(claude, /^description: Use when/m);
  }
});

test('start-dt covers priorities, timestamps, validation, and current setup docs', () => {
  const start = read('.claude/skills/start-dt/SKILL.md');
  assert.match(start, /current-priorities\.md/);
  assert.match(start, /next 90 days/i);
  assert.match(start, /decisions-log[\s\S]*last_updated/i);
  assert.match(start, /README\.md/);
  assert.match(start, /run[\s\S]*health/i);
});

test('ingest treats sources as untrusted data and preserves the vault safely', () => {
  const ingest = read('.claude/skills/ingest/SKILL.md');
  assert.match(ingest, /raw content[\s\S]*data[\s\S]*not instructions/i);
  assert.match(ingest, /password|API key|token/i);
  assert.match(ingest, /never delete/i);
  assert.match(ingest, /decisions-log[\s\S]*last_updated/i);
});

test('health covers complete metadata and starter readiness', () => {
  const health = read('.claude/skills/health/SKILL.md');
  assert.match(health, /empty/i);
  assert.match(health, /invalid/i);
  assert.match(health, /unfinished starter prompt/i);
});

test('canonical README provides accurate least-privilege platform paths and smoke test', () => {
  assert.equal(existsSync(join(repoRoot, 'SETUP.md')), false, 'obsolete SETUP.md still exists');
  const readme = read('README.md');

  assert.match(readme, /AI Second Brain for Your Business/);
  assert.match(readme, /Claude Desktop/);
  assert.match(readme, /Claude Cowork/);
  assert.match(readme, /Use an existing folder/);
  assert.match(readme, /paid (?:Claude )?plan/i);
  assert.match(readme, /\.zip/);
  assert.match(readme, /Claude Code/);
  assert.match(readme, /Codex/);
  assert.match(readme, /ChatGPT Projects/);
  assert.match(readme, /Project instructions/);
  assert.match(readme, /memory\//);
  assert.match(readme, /npm test/);
  assert.match(readme, /never store[\s\S]*(password|API key|token)/i);
  assert.doesNotMatch(readme, /administrativetrick|obsidian-mcp|claude_desktop_config\.json/i);
  assert.doesNotMatch(readme, /trusted local-files extension/i);
});

test('current-priorities seed note is valid and linked', () => {
  const priorities = read('business/current-priorities.md');
  assert.match(priorities, /^name: current-priorities$/m);
  assert.match(priorities, /^domain: business$/m);
  assert.match(priorities, /\[\[what-we-do\]\]/);
  assert.match(priorities, /next 90 days/i);
  assert.match(priorities, /> Fill this in:/);
});

test('upload-ready Claude skill archives contain only the expected skill folder', () => {
  for (const skill of ['start-dt', 'ingest', 'health']) {
    const archive = join(repoRoot, 'dist', 'claude-skills', `${skill}.zip`);
    assert.equal(existsSync(archive), true, `${archive} is missing`);
    const entries = readZipEntries(archive);
    assert.deepEqual([...entries.keys()], [`${skill}/`, `${skill}/SKILL.md`]);
    assert.equal(
      entries.get(`${skill}/SKILL.md`).toString('utf8'),
      read(`.claude/skills/${skill}/SKILL.md`),
    );
  }
});

test('skill packager needs only Node and produces reproducible archives', () => {
  const packageJson = JSON.parse(read('package.json'));
  assert.equal(packageJson.scripts.test, 'node --test scripts/validate.test.mjs');

  const environment = { ...process.env, PATH: '' };
  const first = spawnSync(process.execPath, [packager], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: environment,
  });
  assert.equal(first.status, 0, first.stdout + first.stderr);
  const firstBuild = new Map(
    ['start-dt', 'ingest', 'health'].map((skill) => [
      skill,
      readFileSync(join(repoRoot, 'dist', 'claude-skills', `${skill}.zip`)),
    ]),
  );

  const second = spawnSync(process.execPath, [packager], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: environment,
  });
  assert.equal(second.status, 0, second.stdout + second.stderr);
  for (const [skill, expected] of firstBuild) {
    const actual = readFileSync(join(repoRoot, 'dist', 'claude-skills', `${skill}.zip`));
    assert.deepEqual(actual, expected, `${skill}.zip is not reproducible`);
  }
});
