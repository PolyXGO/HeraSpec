# HeraSpec Architecture

## Overview

HeraSpec is built with TypeScript and follows a modular architecture:

```
src/
├── cli/              # CLI entry point
├── commands/         # Command implementations
├── core/             # Core logic
│   ├── config.ts     # Configuration constants
│   ├── schemas/      # Zod schemas for validation
│   ├── parsers/      # Markdown parsing
│   ├── validation/   # Validation logic
│   ├── templates/    # File templates
│   ├── init.ts       # Initialization
│   ├── list.ts       # Listing
│   ├── archive.ts    # Archiving
│   └── view.ts       # Dashboard view
└── utils/            # Utility functions
    └── file-system.ts
```

## Core Concepts

### Spec

A structured document defining requirements, scenarios, constraints, and domains. Specs live in `heraspec/specs/` and serve as the source of truth.

### Change

A proposed update stored in `heraspec/changes/<slug>/`. Includes:
- `proposal.md` - Why and what changes
- `tasks.md` - Implementation checklist
- `design.md` (optional) - Technical decisions
- `specs/` - Delta specs showing changes

### Delta Spec

Structured diff of spec changes:
- **ADDED** - New requirements
- **MODIFIED** - Changed requirements (complete updated text)
- **REMOVED** - Deprecated requirements

### Project Type

Defines categories of projects HeraSpec supports:
- wordpress-plugin
- wordpress-theme
- perfex-module
- laravel-package
- node-service
- generic-webapp
- backend-api
- frontend-app
- multi-stack

### Skill

Reusable patterns within a project type:

**WordPress Plugin:**
- admin-settings-page
- custom-post-type
- shortcode
- rest-endpoint
- ux-element (Flatsome)

**Perfex Module:**
- module-registration
- permission-group
- admin-menu-item
- login-hook

See [PROJECT_TYPES_AND_SKILLS.md](PROJECT_TYPES_AND_SKILLS.md) for full list.

## Data Flow

### Change Creation

1. User/AI creates change folder
2. Scaffolds proposal.md, tasks.md, specs/
3. Delta specs created showing changes

### Spec Refinement

1. Edit delta specs in change folder
2. Never modify source specs directly
3. Validate changes

### Implementation

1. Follow tasks.md
2. Mark tasks complete: `- [x]`
3. Implement code per specs

### Archiving

1. Run `heraspec archive <change-name> --yes`
2. Parse delta specs
3. Merge into source specs
4. Move change folder to archives/ with date prefix

## Parsing

### Markdown Parser

Parses HeraSpec format:
- Extracts Meta section (project type, domain, stack)
- Parses Requirements with scenarios
- Handles delta spec format (ADDED/MODIFIED/REMOVED)

### Validation

- Schema validation using Zod
- Format validation
- Structure validation
- Consistency checks

## CLI Architecture

Commands are organized into:

- **Core Commands** (`src/core/`) - Business logic
- **CLI Commands** (`src/commands/`) - Command interfaces
- **CLI Entry** (`src/cli/index.ts`) - Commander.js setup

## Extension Points

### Adding Project Types

1. Add to `PROJECT_TYPES` in `src/core/config.ts`
2. Add skills mapping in `SKILLS`
3. Update templates if needed

### Adding Skills

Add to appropriate project type in `SKILLS` mapping.

### Custom Validation

Extend `Validator` class in `src/core/validation/validator.ts`.

## File System Operations

All file operations use `FileSystemUtils` from `src/utils/file-system.ts` for:
- Consistent path handling
- Error handling
- Async/await patterns

## Error Handling

- Errors bubble up to command level
- User-friendly error messages
- Exit codes: 0 (success), 1 (error)

## Testing Strategy

- Manual testing via CLI
- Integration tests (planned)
- Unit tests for parsers and validators (planned)

