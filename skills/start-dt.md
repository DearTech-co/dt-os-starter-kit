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
