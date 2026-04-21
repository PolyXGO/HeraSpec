---
name: project-memory
description: Complementary project memory system for AI agents. Records observations, decisions, and session summaries to maintain context across development sessions. Prevents duplicate work, tracks architectural decisions, and enables token-efficient context retrieval.
projectType: all
---

# Project Memory Skill

## Purpose

Enable AI agents to maintain **persistent project context** across sessions using a complementary (non-intrusive) approach. The memory system records what was done, what was learned, and what decisions were made — so future sessions start with relevant context instead of re-reading the entire codebase.

## When to Use

- **Before implementing a new feature**: Search memory to check if similar work was done before
- **After completing a significant task**: Log an observation to record what was done
- **At the end of a session**: Summarize the session for future reference
- **When starting a complex session**: Read context to understand project history

## Complementary Approach

> **This skill is COMPLEMENTARY, not mandatory.** The AI agent uses memory WHEN USEFUL, not at every step.
> 
> - Simple tasks (fix typo, format code): Skip memory entirely → 0 token overhead
> - Complex tasks (new feature, architecture change): Use memory → save 10-30x tokens vs re-reading code

## Available Commands

### 1. Log an Observation (Post-Task)
Record what was done after completing a significant task:

```bash
heraspec memory log \
  --type <decision|bugfix|feature|refactor|discovery|change> \
  --title "Short descriptive title" \
  --narrative "Detailed description of what was done and why" \
  --concepts "tag1,tag2,tag3" \
  --files-modified "src/file1.ts,src/file2.ts"
```

**Observation types:**
| Type | Icon | When to Use |
|------|------|------------|
| `decision` | ⚖️ | Architecture or design decisions with rationale |
| `bugfix` | 🔴 | Bug fixes with root cause |
| `feature` | 🟢 | New feature implementations |
| `refactor` | 🔄 | Code restructuring or optimization |
| `discovery` | 🔵 | Important findings about codebase or behavior |
| `change` | ✅ | General code changes |

### 2. Search Memory (Pre-Implementation)
Check if related work exists before implementing something new:

```bash
heraspec memory search "authentication middleware"
heraspec memory search --type feature --concepts "auth,login"
heraspec memory search --id 42   # Get full details of observation #42
```

### 3. Generate Context (Session Start)
Get a summary of recent project activity:

```bash
heraspec memory context           # Print to stdout
heraspec memory context --output file  # Write to heraspec/memory/context.md
```

### 4. Summarize Session (Session End)
Record what was accomplished in this session:

```bash
heraspec memory summarize \
  --request "What the user asked for" \
  --completed "What was done" \
  --learned "Key insights discovered" \
  --next-steps "What remains to be done" \
  --files-edited "src/file1.ts,src/file2.ts"
```

### 5. View Status
Check memory statistics:

```bash
heraspec memory status    # Observation count, top concepts, top files
heraspec memory timeline  # Chronological view of activity
```

### 6. Token Analytics Report
View detailed token usage vs savings comparison per project:

```bash
heraspec memory analytics            # Table + chart of token economics
heraspec memory analytics --history  # Includes 13 latest database size changes
```

Output includes:
- **Table**: Project name, Operations count, Tokens With Memory, Tokens Without Memory, Savings %, **DB Size**
- **Bar Chart**: Visual comparison of tokens avoided per project
- **Totals**: Aggregated savings across all projects
- **History (Optional)**: A chronological delta chart of how the `.db` file size has changed over time.

### 7. Maintenance
```bash
heraspec memory prune 90  # Delete observations older than 90 days
```

## Workflow for AI Agents

### When to Use Memory (Decision Tree)

```
Receive task from user
├── Is it a simple/trivial task? → Skip memory, just do it
├── Is it a new feature or significant change?
│   ├── Search memory: "heraspec memory search <relevant keywords>"
│   ├── Results found? → Read relevant observations, avoid duplicating work
│   └── No results? → Proceed normally
├── After completing the task:
│   ├── Was it significant? → Log observation
│   └── Was it trivial? → Skip logging
└── End of session?
    └── Multiple tasks completed? → Create session summary
```

### Key Principles

1. **Don't force it**: Only use memory when it genuinely saves time or prevents mistakes
2. **Quality over quantity**: One detailed observation is better than ten shallow ones
3. **Concepts are crucial**: Good concept tags (`auth`, `database`, `api`, `ui`) make search effective
4. **Files matter**: Recording which files were modified helps future agents navigate

## Configuration

Memory configuration is stored in `heraspec/memory/config.json`:

```json
{
  "totalObservationCount": 50,
  "fullObservationCount": 5,
  "sessionCount": 5,
  "maxTokens": 6000,
  "showLastSummary": true
}
```

## Token Economics

| Action | Token Cost | Token Savings |
|--------|-----------|---------------|
| Read context | ~2,000-4,000 | vs ~50,000-120,000 re-reading codebase |
| Search memory | ~500-1,000 | vs ~5,000-15,000 duplicate implementation |
| Log observation | ~200-500 | Investment for future sessions |
| Smart explore (outline) | ~1,000-2,000 | vs ~12,000+ full file read |

To view a live analytics dashboard of token savings, run:
```bash
heraspec memory analytics
```

## Bootstrapping Existing Projects

If you are adding the `project-memory` skill to an older project that already has historical specs and changes (in `heraspec/specs/` and `heraspec/archives/`), you can bootstrap the memory system without writing any code.

Simply provide this prompt to the AI agent **once**:

```text
Use the project-memory skill.
Please bootstrap the project memory from all our existing specs and archives.
Open the folders: heraspec/specs/ and heraspec/archives/
For EVERY sub-folder/file inside, read it to understand the context, then run:

heraspec memory log \
  --type feature \
  --title "[Extract spec/change title]" \
  --narrative "[Short summary of what was implemented]" \
  --concepts "[Extract key tags/technologies]" \
  --files-modified "[Extract affected files]"

Repeat this until all old specs are migrated into the memory system.
```

Alternatively, use the built-in **CLI command** (faster, no AI tokens spent):
```bash
heraspec memory bootstrap        # Interactive — prompts for confirmation
heraspec memory bootstrap --yes  # Non-interactive — auto-confirm
```

This command will automatically scan `heraspec/specs/`, `heraspec/archives/`, and `heraspec/changes/`, extract title/narrative/files from each markdown spec, and insert them into the memory database.

> **Note:** Duplicate titles are automatically skipped, so running the command multiple times is safe.

## Agent-Triggered Reporting

When the user asks the AI agent to view memory reports, analytics, or token savings — the agent should run the CLI command and return the output:

```text
User: "Show me the memory analytics report"
User: "How many tokens has the memory system saved?"
User: "Give me a token usage report"
```

**Agent action:** Execute the following command and display the output to the user:
```bash
heraspec memory analytics
```

For a quick status check:
```bash
heraspec memory status
```

For a timeline view:
```bash
heraspec memory timeline
```

## Limitations

- Memory is project-local (stored in `heraspec/memory/`)
- Requires `better-sqlite3` npm package
- FTS5 search is keyword-based, not semantic
- Agent must decide when to use memory (complementary approach)
