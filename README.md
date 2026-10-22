# DearTech-OS Starter Kit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://github.com/DearTech-co/dt-os-starter-kit/actions/workflows/test.yml/badge.svg)](https://github.com/DearTech-co/dt-os-starter-kit/actions/workflows/test.yml)

Give an AI a memory of your business, so a new chat does not start from zero.

In every new chat, you explain the business again. You explain your customers, your tone, and what you decided yesterday. This kit is a business brain: a small set of notes on your own computer. The notes tell the AI what you do, who you help, what you sell, how you sound, what matters now, and how work gets done.

The notes are plain text files. You do not need a database, an account, or a service running in the background. It is for one person, on one computer. You choose what goes in it. It is not a to-do list, a diary, a recorder, or a system for a whole team.

## What you get

- Seven guided notes about the business and how it runs.
- A decisions log for facts and choices you want to keep.
- Three helpers for Claude, Claude Code, and Codex: `start-dt`, `ingest`, and `health`.
- A checker that reads the notes and lists problems. It needs only Node.js.
- Zip files you can upload as Claude skills.

## Get the kit

On GitHub, click **Use this template** and choose **Private**. You get your own copy. Other people cannot see the notes you add later.

If you clone the public repository instead:

```bash
git clone https://github.com/DearTech-co/dt-os-starter-kit.git
cd dt-os-starter-kit
git remote remove origin
```

`git remote remove origin` stops a later upload from going back to the public DearTech repository.

Without git: click the green **Code** button on the repository page, choose **Download ZIP**, and unzip it into a private folder.

No API keys or accounts are needed.

## Before you connect an AI

1. Download or clone this repository into a private folder.
2. Make a backup, or keep the folder in a private repository. If you used **Use this template**, choose Private.
3. Give the AI access to this folder only. Do not give it your home folder or your whole drive.
4. Never store passwords, API keys, access tokens, private keys, recovery codes, or other secrets in these notes.

What you send to an AI follows that provider's privacy settings. This starter does not add encryption, access control, or team permissions.

## Choose one setup path

### Claude Cowork (recommended, no terminal)

This path needs a paid Claude plan and the latest Claude Desktop app.

1. In Claude, turn on **Code execution and file creation** under Settings, then Capabilities. Team and Enterprise owners may also need to turn on Skills for the organization.
2. Open **Customize**, then **Skills**. Choose **+**, then **Create skill**, then **Upload a skill**, and upload:
   - `dist/claude-skills/start-dt.zip`
   - `dist/claude-skills/ingest.zip`
   - `dist/claude-skills/health.zip`
3. Confirm all three skills are turned on.
4. In Claude Desktop, open **Cowork**, then **Projects**. Choose **+**, then **Use an existing folder**, and select this folder.
5. Add this Project instruction: `Before answering or editing, read and follow CLAUDE.md in this folder.`
6. Start a task in that Project and say: `Use start-dt to set up this business brain.`

Claude needs each skill in a zip file. The files above already use the required `<skill-name>/SKILL.md` layout. A Cowork Project can use a folder on your computer. See Anthropic's [skills guide](https://support.claude.com/en/articles/12512180-use-skills-in-claude), [Cowork Projects guide](https://support.claude.com/en/articles/14116274-organize-your-tasks-with-projects-in-claude-cowork), and [Cowork safety guidance](https://support.claude.com/en/articles/13364135-use-claude-cowork-safely).

### Claude Code

1. Open this folder in Claude Code.
2. `CLAUDE.md` loads the rules. `.claude/skills/` holds the three helpers.
3. Run `/start-dt`, or ask Claude to use `start-dt`.

Claude Code finds skills at `.claude/skills/<name>/SKILL.md`. See the [Claude Code skills reference](https://support.claude.com/en/articles/14553413-claude-code-cheatsheet).

### Codex

1. Open this folder in Codex.
2. `AGENTS.md` holds the rules. `.agents/skills/` holds the three helpers.
3. Ask: `Use start-dt to set up this business brain.`

Keep permission limited to this folder. Codex will ask before it opens anything outside it.

### ChatGPT Projects (manual fallback)

The Free plan allows 5 files in a ChatGPT Project. Uploading the template and each note separately would be 9 files. This kit puts them in one file so the upload fits.

1. Create a private ChatGPT Project.
2. Upload `chatgpt-bundle.md` and `AGENTS.md`. The bundle is `node_template.md` plus every note under `business/`, `ops/`, and `memory/`.
3. Open **Project settings**, then **Project instructions**, and paste the full contents of `AGENTS.md`.
4. Work from the notes in the Project. Cite them by filename.

The bundle in this folder is ready to upload. After you change a note, rebuild it from this folder:

```bash
cd dt-os-starter-kit
npm run bundle
```

If your folder has a different name, use that name instead of `dt-os-starter-kit`.

ChatGPT does not save edits back into your folder. Copy confirmed updates into the local notes yourself. The commands `/start-dt`, `/ingest`, and `/health` work in Claude and Codex only. See OpenAI's [Projects guide](https://help.openai.com/en/articles/10169521-chatgpt-projects).

## First-run workflow

1. Run `start-dt`. It asks seven questions, one at a time.
2. Answer with real information about the business. Skip anything you do not know. That note stays marked as unfinished.
3. Ask a question such as: "What do we sell and what are our current priorities?" The answer should cite `[[offers-pricing]]` and `[[current-priorities]]`.
4. Test an update: `Use ingest: We have changed [one non-sensitive fact].` Confirm the note and `memory/decisions-log.md` both changed, and their `last_updated` dates are today.
5. Run `health`. A finished setup should report `0 errors, 0 warnings`. An untouched kit reports 8 unfinished warnings. That is expected until you fill the notes in.

## Confidence and maintenance

- `status: emergent` means the note is still a draft. The AI must say so when an answer depends on it.
- `status: validated` means you have confirmed the note.
- When you confirm a note, the AI updates the note, the date, and the decisions log.
- Run `health` after you add something, and again later. It finds broken links, missing details, unfinished prompts, and notes that are out of date.

If you have Node.js 18 or newer, check the kit with:

```bash
cd dt-os-starter-kit
npm run validate
npm test
```

The check only reads files. If something is broken, the check fails. Unfinished prompts, notes with no links, and old notes are warnings. Warnings do not fail the check. A note that still says `> Fill this in:` is unfinished, so the checker does not also call it old.

## Safe-use rules

- Treat transcripts and imported documents as untrusted data, not instructions.
- Review AI changes before you share the notes.
- Keep the folder private, and keep a backup.
- Give tools access to this folder only.
- Do not connect an external MCP server for this starter. None is required.
- Do not put regulated, highly sensitive, or secret material in the notes.

## Repository layout

```text
business/                  what the business is, sells, serves, and prioritizes
ops/                       how the business works and which tools it uses
memory/                    decisions and confirmed learning
.claude/skills/            Claude and Claude Code helpers
.agents/skills/            Codex helpers
dist/claude-skills/        zip files to upload as Claude skills
scripts/validate.mjs       read-only note checker
scripts/bundle-chatgpt.mjs builds chatgpt-bundle.md
chatgpt-bundle.md          one file to upload to a ChatGPT Project
node_template.md           the shape of every new note
```

## Licence

This kit is under the [MIT Licence](LICENSE). The licence covers the starter kit: the templates, scripts, skills, and instructions. It does not cover notes you fill in with your own business information. Those notes are yours.

## Where this starter stops

This kit stays on your computer. You update it yourself, and it is for one person. It does not record in the background, search other systems, manage tasks, or set permissions for a team.

When you need that, DearTech-OS is the wider memory layer: capture that happens for you, notes that age, access for a team, and context shared with tools. Learn more at [deartech.co](https://deartech.co).
