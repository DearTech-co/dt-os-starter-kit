# DT-OS Starter Kit: one-shot setup prompt

No git, no download. Connect an empty folder to your AI (Claude Desktop with the Filesystem connector pointed at a new Obsidian vault folder, or open the folder in Claude Code), then copy everything below the line and paste it into the chat. Your AI builds the kit for you.

------------------------------------------------------------------------

You are setting me up with the DT-OS Starter Kit, a local context OS, in the folder you can write to. Create every file listed below at its exact path, making any folders needed (`business/`, `ops/`, `memory/`, and `.claude/skills/...`). Copy each file's contents exactly as given between its FILE markers. Do not edit, shorten, or add anything. When every file exists, do two things:

1. If I am in Claude Code, tell me the three skills in `.claude/skills/` are ready to use. If I am in Claude Desktop, tell me to upload the three SKILL.md files you just created (start-dt, ingest, health) at claude.ai under Skills, because Desktop loads skills from the web, not from the folder.
2. Tell me to run /start-dt to fill in my business.

===== FILE: CLAUDE.md =====
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

===== END FILE: CLAUDE.md =====

===== FILE: node_template.md =====
---
name: kebab-case-name
description: one sentence, what this note is
domain: business        # choose one: business, ops, memory
node_type: concept      # choose one: concept, process, decision, reference
status: emergent
last_updated: YYYY-MM-DD
tags: [domain, other-tag]
related_concepts: ["[[other-note]]"]
---

# Title

2-3 sentences explaining the concept.

## Key points

- point one
- point two

## Related

- [[other-note]] - how it relates

===== END FILE: node_template.md =====

===== FILE: business/what-we-do.md =====
---
name: what-we-do
description: the business in one line, plus the offer and positioning
domain: business
node_type: concept
status: emergent
last_updated: 2026-07-02
tags: [business, positioning]
related_concepts: ["[[who-we-serve]]", "[[offers-pricing]]"]
---

# What we do

One sentence: we help [[who-we-serve]] [outcome] by [how].

Example: "We help boutique recruitment firms fill roles faster by turning every past placement into searchable, reusable context."

## Key points

- The outcome we sell (time, money, or peace of mind).
- Why us and not a generic tool.

> Fill this in: replace the example with your real one-liner and offer. See [[offers-pricing]].

===== END FILE: business/what-we-do.md =====

===== FILE: business/who-we-serve.md =====
---
name: who-we-serve
description: the ideal customer, who they are and what they struggle with
domain: business
node_type: concept
status: emergent
last_updated: 2026-07-02
tags: [business, icp]
related_concepts: ["[[what-we-do]]"]
---

# Who we serve

Who: [role, company size, stage].
Their struggle: [the problem they feel].

Example: "Founders of 10-50 person firms who drown in admin and can't scale without hiring."

## Key points

- The one problem they would pay to remove.
- Words they use for it (use these in your copy).

> Fill this in: describe your real ideal customer in their words.

===== END FILE: business/who-we-serve.md =====

===== FILE: business/offers-pricing.md =====
---
name: offers-pricing
description: what you sell and what it costs
domain: business
node_type: concept
status: emergent
last_updated: 2026-07-02
tags: [business, pricing]
related_concepts: ["[[what-we-do]]"]
---

# Offers and pricing

- Offer 1: [name] - [what's included] - [price].
- Offer 2: [name] - [what's included] - [price].

> Fill this in: list your real offers and prices so your AI stops guessing them.

===== END FILE: business/offers-pricing.md =====

===== FILE: business/voice-and-tone.md =====
---
name: voice-and-tone
description: how you write, and the words you never use
domain: business
node_type: reference
status: emergent
last_updated: 2026-07-02
tags: [business, voice]
related_concepts: ["[[what-we-do]]"]
---

# Voice and tone

How we sound: [e.g. direct, warm, no jargon].
Never use: [banned words or phrases].

Example: "Plain and specific. No hype. Never say 'revolutionary' or 'game-changer'."

> Fill this in: give three real examples of your voice and your banned words.

===== END FILE: business/voice-and-tone.md =====

===== FILE: ops/how-we-do-things.md =====
---
name: how-we-do-things
description: two or three core processes, written down once
domain: ops
node_type: process
status: emergent
last_updated: 2026-07-02
tags: [ops, process]
related_concepts: ["[[tools-we-use]]"]
---

# How we do things

## Process: [e.g. onboarding a new client]
1. Step one.
2. Step two.

> Fill this in: write your two or three most-repeated processes so the AI can run them your way.

===== END FILE: ops/how-we-do-things.md =====

===== FILE: ops/tools-we-use.md =====
---
name: tools-we-use
description: the tools the business runs on and what each is for
domain: ops
node_type: reference
status: emergent
last_updated: 2026-07-02
tags: [ops, tools]
related_concepts: ["[[how-we-do-things]]"]
---

# Tools we use

- [Tool] - [what we use it for].

> Fill this in: list your real stack so the AI stops suggesting tools you don't use.

===== END FILE: ops/tools-we-use.md =====

===== FILE: memory/decisions-log.md =====
---
name: decisions-log
description: append-only log of decisions and things learned about the business
domain: memory
node_type: decision
status: emergent
last_updated: 2026-07-02
tags: [memory, log]
related_concepts: ["[[how-we-do-things]]"]
---

# Decisions log

Newest first. The AI appends here when it learns something durable (see [[how-we-do-things]]).

- 2026-07-02: Set up the DT-OS Starter Kit.

> Fill this in: as you work, add dated one-liners for decisions you want your AI to remember.

===== END FILE: memory/decisions-log.md =====

===== FILE: .claude/skills/start-dt/SKILL.md =====
---
name: start-dt
description: Set up the DT-OS Starter Kit from scratch by interviewing the user, then filling in their business notes. Use when the user says "start-dt", "help me set this up", or "/start-dt".
---

# /start-dt

Get the user from empty vault to a working context layer in one sitting. Interview them, then write their real answers into the seed notes. Ask one question at a time.

## Steps

1. **Confirm the connection.** Check you can read the notes under `business/`. If you cannot, tell the user to connect the vault first (see `SETUP.md`) and stop.
2. **Interview, one question at a time**, and after each answer write it into the matching note using the `node_template.md` schema:
   - "In one sentence, what does your business do, and for whom?" -> `business/what-we-do.md`
   - "Who is your ideal customer, and what is the one problem they would pay to remove?" -> `business/who-we-serve.md`
   - "What do you sell, and what does it cost?" -> `business/offers-pricing.md`
   - "How do you like to sound, and what words do you never use?" -> `business/voice-and-tone.md`
   - "What are your two or three most-repeated processes?" -> `ops/how-we-do-things.md`
   - "What tools does the business run on?" -> `ops/tools-we-use.md`
3. **Replace ALL the template scaffolding with their real answers:** the `> Fill this in:` line, the bracketed slots like `[outcome]`, and any `Example:` line. Keep the frontmatter and set `last_updated` to today. A finished note should read as their real business, with no template text left.
4. **Log it.** Add `- <today>: Completed start-dt setup.` as a new line at the TOP of the entries in `memory/decisions-log.md` (newest first), and remove that file's `> Fill this in:` prompt now that it has real entries.
5. **Test it.** Ask the user a question that only their notes can answer (for example, their pricing) to prove the AI now reads from the vault. Cite the note you used.
6. **Point forward.** Tell them: from now on, use `/ingest` to add new context and `/health` to keep the vault clean.

## Rules

- One question at a time. Do not dump all questions at once.
- Write real answers only. Never leave a `> Fill this in:` placeholder behind once answered.
- Do not invent answers. If they skip a question, leave the seed note as-is and move on.

===== END FILE: .claude/skills/start-dt/SKILL.md =====

===== FILE: .claude/skills/ingest/SKILL.md =====
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

===== END FILE: .claude/skills/ingest/SKILL.md =====

===== FILE: .claude/skills/health/SKILL.md =====
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

===== END FILE: .claude/skills/health/SKILL.md =====

------------------------------------------------------------------------

That is the whole kit. Once the files exist: make sure the three skills are loaded (automatic in Claude Code; in Claude Desktop upload the start-dt, ingest, and health SKILL.md files at claude.ai under Skills), then run /start-dt.
