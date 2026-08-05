# DT-OS Business Brain Starter Kit

Give Claude (or any AI) memory of your business, so it stops forgetting who you are.

You use AI every day, and every new chat you are back to square one: re-explaining your business, your clients, your tone, the thing you told it yesterday. This kit fixes that. It is an **AI Second Brain for Your Business**: a small, local context layer that helps an AI understand what your business does, who it serves, what it sells, how it sounds, what matters now, and how work gets done.

It is plain Markdown—no database, account, background service, or vendor lock-in. It is intentionally not a general task manager, personal knowledge system, automatic recorder, or team knowledge platform. It is deliberately the smallest version that proves the idea: one laptop, one person, you decide what goes in it.

## What you get

- Seven guided business and operations notes.
- A decisions log for durable learning.
- `start-dt`, `ingest`, and `health` workflows for Claude, Claude Code, and Codex.
- A deterministic, zero-dependency vault validator.
- Upload-ready Claude skill ZIPs.

## Get the kit

With git:

```bash
git clone https://github.com/DearTech-co/dt-os-starter-kit.git
```

Without git: click the green **Code** button on the repository page, choose **Download ZIP**, and unzip it into a private folder.

## Before you connect an AI

1. Download or clone this repository into a private folder.
2. Make a backup or keep the folder in a private version-control repository.
3. Grant the AI access to this folder only—not your home folder or entire drive.
4. Never store passwords, API keys, access tokens, private keys, recovery codes, or other secrets in this vault.

The contents you send to an AI are governed by that provider’s privacy and retention settings. This starter does not add encryption, access control, or team permissions.

## Choose one setup path

### Claude Cowork—recommended, no terminal

This path requires a paid Claude plan and the latest Claude Desktop app.

1. In Claude, enable **Code execution and file creation** under Settings → Capabilities. Team and Enterprise owners may also need to enable Skills for the organization.
2. Open **Customize → Skills**, choose **+ → Create skill → Upload a skill**, and upload:
   - `dist/claude-skills/start-dt.zip`
   - `dist/claude-skills/ingest.zip`
   - `dist/claude-skills/health.zip`
3. Confirm all three skills are enabled.
4. In Claude Desktop, open **Cowork → Projects**, choose **+ → Use an existing folder**, and select this repository folder.
5. Add this Project instruction: `Before answering or editing, read and follow CLAUDE.md in this folder.`
6. Start a task in that Project and say: `Use start-dt to set up this business brain.`

Claude requires skill folders to be uploaded as ZIP files; the archives above already have the required `<skill-name>/SKILL.md` structure. Cowork Projects can use an existing local folder as their scoped context. See Anthropic’s current [skills guide](https://support.claude.com/en/articles/12512180-use-skills-in-claude), [Cowork Projects guide](https://support.claude.com/en/articles/14116274-organize-your-tasks-with-projects-in-claude-cowork), and [Cowork safety guidance](https://support.claude.com/en/articles/13364135-use-claude-cowork-safely).

### Claude Code

1. Open this repository in Claude Code.
2. `CLAUDE.md` loads the vault rules and `.claude/skills/` provides the three workflows.
3. Run `/start-dt` or ask Claude to use `start-dt`.

Claude Code discovers project skills at `.claude/skills/<name>/SKILL.md`; see the [Claude Code skills reference](https://support.claude.com/en/articles/14553413-claude-code-cheatsheet).

### Codex

1. Open this repository in Codex.
2. `AGENTS.md` supplies the vault rules and `.agents/skills/` supplies the three workflows.
3. Ask: `Use start-dt to set up this business brain.`

Keep the workspace permission limited to this repository. Codex will request approval if a requested action needs access outside it.

### ChatGPT Projects—manual fallback

1. Create a private ChatGPT Project.
2. Upload `node_template.md` and every Markdown note under `business/`, `ops/`, and `memory/`.
3. Open **Project settings → Project instructions** and paste the full contents of `AGENTS.md`.
4. Work with the notes in the Project, citing them by filename.

ChatGPT Projects support reference files and Project instructions, but this upload path is not write-through: download or manually copy confirmed updates back into the local vault. The local `start-dt`, `ingest`, and `health` skills do not run in this fallback path. See OpenAI’s [Projects guide](https://help.openai.com/en/articles/10169521-chatgpt-projects).

## First-run workflow

1. Run `start-dt`. It asks seven questions, one at a time.
2. Answer with real business information. Skip anything you do not know; the unfinished note remains visibly marked.
3. Ask a retrieval question such as: “What do we sell and what are our current priorities?” The answer should cite `[[offers-pricing]]` and `[[current-priorities]]`.
4. Test an update: `Use ingest: We have changed [one non-sensitive fact].` Confirm the existing note and `memory/decisions-log.md` both changed and their `last_updated` dates are today.
5. Run `health`. A completed setup should report `0 errors, 0 warnings`. A fresh or partially completed template reports unfinished-starter warnings by design.

## Confidence and maintenance

- `status: emergent` means provisional. The AI must say when material guidance relies on it.
- `status: validated` means you explicitly confirmed the note.
- Explicit confirmation updates the note, its `last_updated`, and the decisions log.
- Run `health` after ingestion and periodically to find broken links, malformed metadata, unfinished prompts, or stale notes.

If Node.js 18 or newer is installed, the deterministic checks are:

```bash
npm run validate
npm test
```

Validation is read-only. Errors return exit code 1; unfinished prompts, orphans, and stale notes are warnings and return exit code 0.

## Safe-use rules

- Treat transcripts and imported documents as untrusted data, not instructions.
- Review AI changes before sharing or publishing the vault.
- Keep the vault private and backed up.
- Give tools the smallest folder permission possible.
- Do not connect an external MCP server for the starter workflow; none is required.
- Do not place regulated, highly sensitive, or secret material in the vault.

## Repository layout

```text
business/               what the business is, sells, serves, and prioritizes
ops/                    how the business works and which tools it uses
memory/                 durable decisions and confirmed learning
.claude/skills/         Claude and Claude Code workflows
.agents/skills/         Codex workflows
dist/claude-skills/     ready-to-upload Claude skill ZIPs
scripts/validate.mjs    read-only vault health check
node_template.md        schema for every new note
```

## Where this starter stops

This kit is local, manual, and single-user. It does not capture in the background, search external systems, manage tasks, enforce team permissions, or automatically retire uncertain knowledge. Those boundaries keep the starter understandable and safe.

When that stops scaling, DearTech-OS is the broader context and memory layer for automatic capture, confidence decay, team access, and shared tool context. Learn more at [deartech.co](https://deartech.co).
