# HeraSpec Memory System

The Memory System provides **persistent project context** for AI agents working across multiple sessions. It records observations, decisions, and session summaries — enabling agents to maintain awareness of what was done, why, and what remains.

## Overview

### Problem Solved
When AI agents work on a project over weeks or months:
- They **lose context** between sessions
- They **re-read entire codebases** to understand what exists (wasting tokens)
- They **duplicate work** — implementing features that already exist
- They **make inconsistent decisions** — contradicting past architectural choices

### Solution: Complementary Memory
HeraSpec Memory uses a **complementary approach** — the agent uses memory **when useful**, not at every step:
- Simple tasks → Skip memory → 0 token overhead
- Complex tasks → Use memory → Save 10-30x tokens

## Architecture

```
┌─────────────────────────────────────────────┐
│              AI Agent (IDE)                  │
│   Antigravity / Cursor / VS Code / etc.     │
├─────────────────────────────────────────────┤
│              HeraSpec CLI                    │
│  heraspec memory log/search/context/...     │
├─────────────────────────────────────────────┤
│            Memory Module                    │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐ │
│  │MemStore │ │MemSearch │ │ContextGen    │ │
│  │ (CRUD)  │ │ (FTS5)   │ │ (Markdown)   │ │
│  └────┬────┘ └────┬─────┘ └──────┬───────┘ │
│       └───────────┴──────────────┘          │
│              SQLite + FTS5                  │
│       heraspec/memory/heraspec-memory.db    │
└─────────────────────────────────────────────┘
```

## Quick Start

### 1. Install the skill
```bash
heraspec skill add project-memory
heraspec skill add smart-explore   # Optional: token-efficient code exploration
```

### 2. Core Commands

#### Architecture Map (Index)
```bash
heraspec memory index           # Scan project and generate architecture map
heraspec memory index --depth 2 # Limit scanning depth
```
*Note: This command runs automatically in the background when you run `heraspec init`.*

#### Record an Observation
```bash
heraspec memory log \
  --type bugfix \
  --title "Fix auth middleware" \
  --discovery-tokens 15000 \
  --narrative "Implemented JWT-based auth with refresh tokens..."

```
> **Auto-Log Note:** You DO NOT NEED to call this command manually if you use the standard workflow. When you run `heraspec archive <change-name>`, the system automatically reads your `proposal.md` and executes this log command under the hood! The `--discovery-tokens` flag will be set automatically to calculate token savings.

#### Search Memory
```bash
heraspec memory search "authentication"
heraspec memory search --type decision --concepts "database"
heraspec memory search --id 42   # Full details of observation #42
```

#### Generate Context
```bash
heraspec memory context                 # Print to stdout
heraspec memory context --output file   # Write to heraspec/memory/context.md
```
*Note: `heraspec memory context` automatically pins the latest Architecture Map observation to the very top of the generated file.*

#### Analytics & Status
```bash
heraspec memory analytics  # View precise Token Economics and savings
heraspec memory status     # Statistics + auto-detect recommendations
heraspec memory timeline   # Chronological view
```

#### Auto-Optimize Config
HeraSpec automatically detects your project scale and recommends optimal config:
```bash
heraspec memory optimize        # Interactive — shows changes, asks for confirmation
heraspec memory optimize --yes  # Auto-apply without confirmation
```

The optimizer analyzes:
- Number of observations → determines project scale (small/medium/large/enterprise)
- Current config vs optimal config for that scale
- Whether context is being truncated due to low `maxTokens`
- Whether old observations should be pruned

#### Maintenance
```bash
heraspec memory prune 90   # Delete observations older than 90 days
```

## Observation Types

| Type | Icon | When to Use |
|------|------|------------|
| `decision` | ⚖️ | Architecture or design decisions with rationale |
| `bugfix` | 🔴 | Bug fixes with root cause analysis |
| `feature` | 🟢 | New feature implementations |
| `refactor` | 🔄 | Code restructuring or optimization |
| `discovery` | 🔵 | Important findings about codebase behavior |
| `change` | ✅ | General code changes |

## Progressive Disclosure (Token Efficiency)

The search system uses a **3-layer workflow** to minimize token usage:

| Layer | What You Get | Token Cost | Use When |
|-------|-------------|-----------|----------|
| **1. Index** | ID, type, title, date | ~50-100/result | Scanning history |
| **2. Timeline** | Chronological context | ~200-500/result | Understanding sequence |
| **3. Full Details** | Complete narrative, files, concepts | ~500-1,000/result | Deep investigation |

```bash
# Layer 1: Index (default)
heraspec memory search "auth"

# Layer 3: Full details for specific observation
heraspec memory search --id 42
```

## Smart Explore (Code Intelligence)

Token-efficient code exploration without reading entire files:

```bash
# View file structure (~1K tokens vs ~12K+ full file)
heraspec explore outline src/auth/middleware.ts

# Find symbols across codebase
heraspec explore search "AuthMiddleware" src/

# Read just one function
heraspec explore unfold src/auth/middleware.ts validateToken
```

### Supported Languages
TypeScript, JavaScript, Python, PHP, Go, Rust, Java, C#, Vue, Svelte

## Configuration

Edit `heraspec/memory/config.json`:

```json
{
  "totalObservationCount": 50,
  "fullObservationCount": 5,
  "sessionCount": 5,
  "maxTokens": 6000,
  "showLastSummary": true
}
```

| Setting | Default | Description |
|---------|---------|-------------|
| `totalObservationCount` | 50 | Max observations in context |
| `fullObservationCount` | 5 | How many show full narrative |
| `sessionCount` | 5 | Max session summaries |
| `maxTokens` | 6000 | Token budget for context |
| `showLastSummary` | true | Include latest session summary |

### Config Tuning Guide

These defaults are optimized for modern AI agents with large context windows.

#### `totalObservationCount: 50` — Why not 30 or 100?

With progressive disclosure, only the most recent 5 observations show full narrative (~200-500 tokens each). The remaining 45 are shown as a compact index table at ~15 tokens per row.

| Value | Index cost | Result |
|-------|-----------|--------|
| 30 | ~375 tokens | Narrow history — may miss relevant past work |
| **50** | **~675 tokens** | **Good balance — broad history, low cost** |
| 100 | ~1,425 tokens | Diminishing returns — old observations are rarely relevant |

#### `fullObservationCount: 5` — The sweet spot

| Value | Token cost | Result |
|-------|-----------|--------|
| 3 | ~600-1,500 | Too few — misses recent important context |
| **5** | **~1,000-2,500** | **Enough recent context without flooding** |
| 10 | ~2,000-5,000 | Many may be irrelevant, wastes budget |

#### `sessionCount: 5` — Adequate history

- 1 latest session → shown in full (~200-400 tokens)
- 4 older sessions → shown as compact one-liners (~50-100 tokens total)
- Beyond 5 sessions → context is too stale to be useful

#### `maxTokens: 6000` — Balanced for modern context windows

| AI Agent | Context window | 6,000 tokens = | Budget % |
|----------|---------------|----------------|----------|
| Gemini 2.5 Pro | 1,000,000 | 0.6% | Negligible |
| Claude 4 | 200,000 | 3% | Very small |
| GPT-4.1 | 128,000 | 4.7% | Small |
| Cursor (Claude) | 128,000 | 4.7% | Small |

6,000 tokens allows: 50 index rows + 5 full observations + 5 session summaries — a complete project snapshot that costs less than 5% of any modern agent's context window.

> **Rule of thumb:** If your project has > 500 observations, consider increasing `maxTokens` to 8,000. For smaller projects (< 100 observations), 4,000 is sufficient.

#### `showLastSummary: true` — Always keep enabled

The latest session summary tells the agent:
- What the user asked for last time
- What was completed
- What remains (next steps)

Cost: ~200-400 tokens. Value: **prevents the #1 waste** — re-doing work that was already completed.

## Database

Memory uses **SQLite** with FTS5 full-text search via `better-sqlite3`:

- **Location**: `heraspec/memory/heraspec-memory.db`
- **Tables**: `observations`, `session_summaries`, `sessions`
- **FTS5 Indexes**: `observations_fts`, `summaries_fts`
- **Performance**: WAL mode, indexed queries

### .gitignore Recommendation
```
# HeraSpec memory database (project-local, not shared)
heraspec/memory/heraspec-memory.db
heraspec/memory/heraspec-memory.db-wal
heraspec/memory/heraspec-memory.db-shm
# Keep context.md if you want to share context snapshots
# heraspec/memory/context.md
```

## Complementary vs Mandatory Approach

HeraSpec Memory deliberately uses a **complementary** approach:

| Aspect | Mandatory (❌) | Complementary (✅) |
|--------|---------------|-------------------|
| Token overhead | 4,000-8,000/session always | 0 for simple tasks |
| IDE conflict | Conflicts with built-in features | Works alongside them |
| User friction | Approval needed for each command | Agent decides autonomously |
| Token savings | Good for complex tasks | Same savings, zero waste |

The agent reads the `project-memory` skill and **decides when memory is worth using**, rather than being forced to use it at every step.

## When to Adjust Config

| Scenario | Recommended Change |
|----------|-------------------|
| Small project (< 50 observations) | `maxTokens: 4000`, `totalObservationCount: 30` |
| Medium project (50-500 observations) | **Defaults are optimal** |
| Large project (500+ observations) | `maxTokens: 8000`, `totalObservationCount: 80` |
| Low context window agent | `maxTokens: 3000`, `fullObservationCount: 3` |
| Team sharing context file | `maxTokens: 8000` — more context for onboarding |

> **You don't need to remember these rules.** Just run `heraspec memory optimize` and the system will analyze your project and propose the right values. You only need to confirm.
