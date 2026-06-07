---
name: smart-explore
description: Token-efficient code exploration — view file structure, search symbols, and read specific implementations without loading full files. Reduces token usage by 4-18x compared to reading entire files.
projectType: all
---

# Smart Explore Skill

## Purpose

Enable AI agents to **explore codebases efficiently** by viewing structural outlines, searching for symbols, and extracting specific implementations — without reading entire files. This dramatically reduces token consumption when navigating large projects.

## When to Use

- **Understanding a new file**: Use `outline` instead of reading the full file
- **Finding where something is defined**: Use `search` to locate symbols across the project
- **Reading a specific function**: Use `unfold` to extract just that function's code

## Token Savings

| Method | Typical Token Cost | Notes |
|--------|-------------------|-------|
| Read full file | ~12,000+ | All content, most irrelevant |
| **Outline** | ~1,000-2,000 | Structural skeleton only |
| **Search** | ~2,000-6,000 | Symbol locations across codebase |
| **Unfold** | ~400-2,100 | Exact function/class source |

**Savings: 4-18x** compared to reading full files.

## Available Commands

### 1. Outline — Structural Skeleton

View all symbols (functions, classes, interfaces, exports) in a file without reading the full source:

```bash
heraspec explore outline src/core/memory/memory-store.ts
```

**Output example:**
```
## 📄 src/core/memory/memory-store.ts
*typescript | 285 lines | ~71250 tokens*

🏛️ export class MemoryStore (L20-285)
  ↳ open() (L32-58)
  ↳ close() (L63-68)
  ↳ addObservation(input) (L88-120)
  ↳ getObservationById(id) (L125-132)
  ↳ getRecentObservations(project, limit) (L140-160)
  ↳ addSummary(input) (L165-195)
  ↳ getStatus(project) (L200-260)
```

### 2. Search — Find Symbols Across Codebase

Search for functions, classes, interfaces by name across the project:

```bash
heraspec explore search "MemoryStore" src/
heraspec explore search "addObservation" src/ --limit 10
```

**Output example:**
```
## Symbol Search: "MemoryStore" (3 results)

| Rel | Type | Name | File | Lines |
|-----|------|------|------|-------|
| 100% | 🏛️ class | MemoryStore | src/core/memory/memory-store.ts | L20-285 |
| 60% | ⚡ function | MemoryStoreFactory | src/core/memory/index.ts | L10-15 |
| 40% | 📌 variable | memoryStore | src/commands/memory.ts | L25-25 |
```

### 3. Unfold — Extract Specific Symbol Source

Read just the implementation of a specific function or class:

```bash
heraspec explore unfold src/core/memory/memory-store.ts addObservation
```

**Output example:**
```
## method: addObservation
*src/core/memory/memory-store.ts:L88-120 | ~800 tokens (vs ~71250 full file)*

  addObservation(input: ObservationInput): Observation {
    this.ensureOpen();
    // ... full implementation
  }
```

## Supported Languages

| Language | Extensions | Symbols Detected |
|----------|-----------|-----------------|
| TypeScript | `.ts`, `.tsx` | class, interface, type, enum, function, method, variable |
| JavaScript | `.js`, `.jsx`, `.mjs` | class, function, method, variable |
| Python | `.py` | class, function, method, variable |
| PHP | `.php` | class, interface, function |
| Go | `.go` | struct, interface, func |
| Rust | `.rs` | struct, trait, enum, fn |
| Java | `.java` | class, interface, method |
| C# | `.cs` | class, interface, method |
| Vue | `.vue` | Same as TypeScript |
| Svelte | `.svelte` | Same as TypeScript |

## Workflow for AI Agents

### Exploration Strategy

```
Need to understand a file?
├── Step 1: heraspec explore outline <file>
│   → See all functions, classes, interfaces (~1K tokens)
├── Step 2: Identify relevant symbols from outline
├── Step 3: heraspec explore unfold <file> <symbol>
│   → Read just the relevant function (~400-2K tokens)
└── Only read full file if you need comprehensive understanding

Need to find where something is?
├── heraspec explore search "<name>" <path>
│   → Find symbol locations across codebase
├── Then use unfold to read specific implementations
└── Avoid grep-like full-text search when possible
```

### Key Principles

1. **Outline first, read later**: Always check the outline before reading full files
2. **Unfold specific symbols**: Don't read entire files when you only need one function
3. **Search before browsing**: Find what you need by name rather than scanning directories
4. **Skip node_modules, dist, .git**: Automatically excluded from search

## Limitations

- Uses regex-based parsing (not AST) — may miss some complex patterns
- Symbol end-line detection is approximate (brace/indent counting)
- Method detection within classes requires proper indentation
- Does not handle dynamically generated code or macros
