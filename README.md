# DT-OS Starter Kit

Give Claude (or any AI) memory of your business, so it stops forgetting who you are.

You use AI every day, and every new chat you are back to square one: re-explaining your business, your clients, your tone, the thing you told it yesterday. This kit fixes that. It is a small, local context layer, plain markdown notes your AI reads instead of asking you again, so it actually remembers how your business runs.

It is deliberately the smallest version that proves the idea: one laptop, one person, you decide what goes in it.

## What you get

- `/start-dt` - a guided setup that interviews you and fills in your business notes.
- `/ingest` - paste a transcript or note and it becomes structured notes in your vault.
- `/health` - checks your vault for broken links, orphans, and notes that have gone stale.
- A note schema (`node_template.md`), a `CLAUDE.md` that tells your AI how to use the vault, and a seed vault (`business/`, `ops/`, `memory/`) ready to fill in.

## Quick start

1. Get the kit. With git: `git clone https://github.com/DearTech-co/dt-os-starter-kit.git`. Without git: click the green **Code** button above and choose **Download ZIP**, then unzip it.
2. Open the folder in Claude Code, or connect it in Claude Desktop with the Filesystem connector.
3. Run `/start-dt` and answer a few questions. Your AI now knows your business.

Not touching GitHub at all? Copy the one-shot prompt in [`BOOTSTRAP-PROMPT.md`](BOOTSTRAP-PROMPT.md), paste it into your connected AI (Claude Desktop with a folder connected, or Claude Code), and it builds the whole vault for you.

Full setup, including Claude Desktop and ChatGPT, is in [`SETUP.md`](SETUP.md).

## Where this stops (and what is next)

This runs on one laptop, for one person, and it only knows what you put in it. Nothing captures automatically in the background, nothing keeps itself current, and it cannot reach your team or your other tools. That is on purpose.

When you outgrow it, DearTech-OS is the context and memory layer your AI plugs into to be reliable: it captures automatically, keeps itself sharp, secures access per person and team, and shares one layer across all your tools. For more details reach out to us on deartech.co.
