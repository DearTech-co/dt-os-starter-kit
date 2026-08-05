---
name: health
description: Use when checking this vault, validating note structure, finding broken wikilinks, or reviewing starter readiness and stale notes.
---

# Health

Run a read-only integrity and readiness check over every Markdown note under `business/`, `ops/`, and `memory/`.

## Workflow

1. If Node.js is available, run `node scripts/validate.mjs` from the vault root and report its output.
2. Otherwise perform the same checks manually:
   - Required frontmatter keys exist and are not empty.
   - `name` is kebab-case, unique, and matches the filename.
   - `domain` matches the containing folder.
   - `node_type` and `status` use values allowed by `node_template.md`.
   - `last_updated` is a real `YYYY-MM-DD` date, is not in the future, and is flagged stale after 180 days.
   - `tags` and `related_concepts` are arrays.
   - Every `[[wikilink]]` resolves to a unique note filename.
   - Every `> Fill this in:` marker is an unfinished starter prompt.
   - A note with no incoming or outgoing link is an orphan.
3. Report grouped `ERRORS`, `WARNINGS`, and `N notes, X errors, Y warnings`.

Errors are malformed, missing, empty, invalid, ambiguous, or broken structure. Warnings are unfinished starter prompts, orphans, and stale notes.

## Safety

- This check is read-only. Never touch files unless the user separately asks for fixes.
- Suggest only the mechanical correction for an error; never invent replacement business content.
