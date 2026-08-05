---
name: start-dt
description: Use when setting up this business-brain vault, starting the DT-OS interview, or filling the seed notes for the first time.
---

# Start DT-OS

Turn the starter files into a useful business context layer in one sitting. Ask one question at a time.

## Workflow

1. Confirm you can read the notes under `business/`. If not, stop and point the user to `README.md`.
2. Ask these questions one at a time. After each answer, read the target note, replace only its starter scaffolding with the supported answer, preserve existing real content, and set `last_updated` to today:
   - “In one sentence, what does your business do, and for whom?” → `business/what-we-do.md`
   - “Who is your ideal customer, and what is the one problem they would pay to remove?” → `business/who-we-serve.md`
   - “What do you sell, and what does it cost?” → `business/offers-pricing.md`
   - “What are your three most important outcomes for the next 90 days?” → `business/current-priorities.md`
   - “How do you like to sound, and what words do you never use?” → `business/voice-and-tone.md`
   - “What are your two or three most-repeated processes?” → `ops/how-we-do-things.md`
   - “What tools does the business run on?” → `ops/tools-we-use.md`
3. A completed note contains no bracketed starter slots, `Example:` line, or `> Fill this in:` prompt. Leave a skipped note unchanged.
4. If at least one note changed, add a newest-first dated entry to `memory/decisions-log.md` describing the setup result. Update the decisions log’s `last_updated` to today and remove its starter prompt.
5. Run health. Report any skipped or unfinished notes as warnings; do not describe setup as complete while they remain.
6. Ask one question whose answer exists only in the vault, answer it with a `[[note-name]]` citation, then point the user to `ingest` and `health`.

## Safety

- Write only the seven seed notes above and `memory/decisions-log.md`.
- Never invent an answer, delete a note, or overwrite unrelated content.
- Never store passwords, API keys, access tokens, private keys, or recovery codes.
- Keep new answers `status: emergent`; validation happens only after explicit user confirmation in real use.
