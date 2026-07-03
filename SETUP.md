# DT-OS Starter Kit - Setup

This kit turns Claude (or ChatGPT) into an assistant that actually knows your business. It is a local, single-user context layer: plain markdown notes your AI reads instead of asking you again.

**Get the kit:** with git, `git clone https://github.com/DearTech-co/dt-os-starter-kit.git`. Without git, open the repo page, click the green **Code** button, choose **Download ZIP**, and unzip it. Then follow one of the paths below.

## Path A - Claude Desktop (recommended, no code)

1. **Install the skills.** In the Claude web UI (claude.ai), go to Skills and upload the three skill files from the visible `skills/` folder: `skills/start-dt.md`, `skills/ingest.md`, and `skills/health.md`. Use these, not the copies inside the hidden `.claude/` folder, which is awkward to reach. A single .md file whose YAML header has a name and description is a valid skill, so no zip is needed. Custom skills upload on the web only, then they sync to the Desktop app.
2. **Connect the vault.** In Claude Desktop, add the Filesystem connector and point it at this folder. Claude can now read your notes.
3. **Run `/start-dt`.** It interviews you and fills in your business notes. Done.

## Path B - Claude Code (for the technical)

1. Open this folder in Claude Code. `CLAUDE.md` loads automatically and the skills in `.claude/skills/` are available as commands.
2. Run `/start-dt`.

## Path C - ChatGPT (fallback)

Create a Project and upload the notes from `business/` and `ops/`. Chat against them. The skills are Claude-only, so you fill the notes in by hand.

## Optional upgrade - a dedicated Obsidian connector

For safer writes back into your notes, install `administrativetrick/obsidian-mcp` (needs Node; no Obsidian plugin, and Obsidian does not need to be open). Add it to `claude_desktop_config.json` with your vault path and restart Claude Desktop.

## The commands

- `/start-dt` - set the vault up by interview.
- `/ingest` - paste a transcript or note and it becomes structured notes.
- `/health` - check the vault for broken links, orphans, and stale notes.

Optional (Claude Code or anyone with Node): run `node scripts/validate.mjs` for a quick deterministic check of the vault (broken links, missing fields, notes that have gone stale).

## Where this stops (and what is next)

This kit runs on one laptop, for one person, and it only knows what you put in it. Nothing captures automatically in the background (you add context yourself, by hand or with `/ingest`), nothing keeps itself current, and there is no confidence decay to retire notes as they go stale. There is no access control, permissions, or row-level security, and it cannot reach your team or your other tools. That is on purpose, it is the smallest version that proves the idea.

When you outgrow it, DearTech-OS is the context and memory layer your AI plugs into to be reliable: it captures automatically, keeps itself sharp with confidence decay, secures access per person and team, and shares one layer across all your tools. For more details reach out to us on deartech.co.
