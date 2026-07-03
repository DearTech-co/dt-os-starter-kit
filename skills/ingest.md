---
name: ingest
description: Turn raw content (a transcript, a voice note, meeting notes, a doc) into structured vault notes. Use when the user says "ingest this", "add this to my vault", or "/ingest" and pastes or points at content.
---

# /ingest

Take the raw content the user gives you and turn it into atomic notes in this vault. This is the manual version of a context OS: you do the structuring by hand, once.

## Steps

1. **Read the content** the user pasted or pointed you at.
2. **Find the atomic concepts.** One idea per note. A decision, a process, a fact about the business, a preference.
3. **Pick the folder** for each: `business/`, `ops/`, or `memory/`. (business/ = facts about the business, ops/ = how you work, memory/ = decisions and things you learn over time)
4. **Write each note** using the exact frontmatter in `node_template.md`: `name` (kebab-case), `description`, `domain`, `node_type`, `status: emergent`, `last_updated` (today), `tags`, `related_concepts`.
5. **Link it.** Add `[[wikilinks]]` only to notes that already exist. If you want to link a concept that has no note yet, create a short stub note for it first so nothing dangles. A dangling link will fail /health.
6. **Save** the files into the chosen folders.
7. **Log it.** Append a dated one-line entry to `memory/decisions-log.md` naming what you ingested.
8. **Report** what you created: the file paths and a one-line description each.

## Rules

- Do not summarize the whole thing into one giant note. Split into atomic notes.
- Do not invent business facts. If the content is unclear, write what is supported and flag the gap.
- Everything starts `status: emergent`. It becomes `validated` only when the user confirms it in real use.
- If new information changes or supersedes something already in a note (a price, a policy, a fact), update that note too and log the change, so the vault never holds two conflicting answers.

## Out of scope

This is a starter kit. There is no automatic capture, no search index, and no crystallization, you are doing this by hand each time. When that stops scaling, that is the signal to move to the full system.
