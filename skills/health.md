---
name: health
description: Check a DT-OS Starter Kit vault for problems - broken [[wikilinks]], orphan notes, missing or malformed frontmatter, and notes that have gone stale. Use when the user says "run health", "check my vault", or "/health".
---

# /health

Scan every markdown note under `business/`, `ops/`, and `memory/` and report issues. You already have file access through the connected vault (Filesystem connector or Claude Code). Do not require any external tool.

## What to check

1. **Frontmatter present and complete.** Every note must have: `name`, `description`, `domain`, `node_type`, `status`, `last_updated`, `tags`, `related_concepts`. Flag any missing key.
2. **Wikilinks resolve.** For every `[[link]]`, confirm a note file named `link.md` exists in the vault (under business/, ops/, or memory/). Flag broken links.
3. **Orphans.** Flag any note with no `[[links]]` out and no other note linking to it.
4. **Stale.** Flag any note whose `last_updated` is more than 180 days ago.

## Output

Report as three grouped lists: ERRORS (missing frontmatter, broken links), WARNINGS (orphans, stale), and a one-line summary `N notes, X errors, Y warnings`. For each error, name the file and the exact problem, then suggest the one-line fix.

## Do not

- Do not invent fixes to note content. Only report structural issues and suggest the mechanical fix (add the missing key, correct or remove the broken link).
- Do not touch files unless the user asks you to fix something.
