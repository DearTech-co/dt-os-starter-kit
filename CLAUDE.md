# DT-OS Starter Kit

This folder is your context layer. It holds what your AI needs to know about your business, written once, in plain markdown, so any AI you connect can read it instead of asking you again.

## How to use this vault (for the AI)

Every answer about the business follows: SENSE, then ACT, then DEPOSIT.

1. **SENSE** - before answering anything about the business, read the relevant notes in `business/` first (and `ops/` for process questions). Never answer from assumption when a note exists.
2. **ACT** - answer using those notes, and cite the note you used by name, for example `[[voice-and-tone]]`.
3. **DEPOSIT** - when you learn something new and durable about the business, save it back. For a quick fact, append a dated line to `memory/decisions-log.md`. For anything larger (a transcript, a batch of decisions), run `/ingest` to turn it into structured notes. New notes start `status: emergent`.

## Rules

- Keep notes atomic: one concept per file.
- Always use the frontmatter in `node_template.md`.
- Link related notes with `[[filename]]` (no `.md`).
- If you are unsure whether something is true, say so; do not invent business facts.

## Commands

- `/start-dt` - set this vault up from scratch by interview.
- `/ingest` - turn a transcript or note into structured notes.
- `/health` - check the vault for broken links, orphans, and stale notes.
